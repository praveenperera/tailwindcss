# Research Context and Findings

**Session ID:** 011CUvKHNdhS77igNg64EwfD
**Date:** 2025-11-08

## Critical Context for Continuation

### Repository Structure
- Working in the main `tailwindcss` repository
- The prettier plugin is in a **separate repository** (tailwindlabs/prettier-plugin-tailwindcss)
- This research focuses on the core sorting mechanism that the plugin consumes

### Key Insight: Two-Part System

The class ordering system consists of two distinct parts:

1. **Core Library (this repo)**: Provides `getClassOrder()` API that returns class ordering information
2. **Prettier Plugin (separate repo)**: Consumes the ordering data and performs actual sorting

This separation is **intentional** - noted in sort.test.ts:93-99:
```typescript
/**
 * This is a function that the prettier-plugin-tailwindcss would use. It would
 * do the actual sorting based on the classes and order we return from `getClassOrder`.
 *
 * This way the actual sorting logic is done in the plugin which allows you to
 * put unknown classes at the end for example.
 */
```

## Surprising Findings

### 1. Property-Based, Not Class-Based
**Expected:** Classes would be sorted based on predefined categories (layout, typography, etc.)
**Actual:** Classes are sorted based on the **CSS properties** they generate

Example: `py-3` (generates `padding-top` and `padding-bottom`) is sorted based on where those properties appear in property-order.ts

### 2. The --tw-sort Override Mechanism
Found a special CSS custom property `--tw-sort` that can override the default sorting:

From compile.ts:345-351:
```typescript
if (node.property === '--tw-sort') {
  let idx = GLOBAL_PROPERTY_ORDER.indexOf(node.value ?? '')
  if (idx !== -1) {
    order.add(idx)
    seenTwSort = true
    continue
  }
}
```

This allows plugin authors to explicitly control where their custom utilities sort.

### 3. Variant Order Uses Bitwise Operations
Variants are encoded as bit flags for efficient comparison:

From compile.ts:64-67:
```typescript
let variantOrder = 0n
for (let variant of candidate.variants) {
  variantOrder |= 1n << BigInt(variantOrderMap.get(variant)!)
}
```

Each variant has a unique bit position, allowing multiple variants to be represented in a single bigint.

## Important Comments in Code

### property-order.ts Comments

Line 8: "How do we make `inset-x-0` come before `top-0`?"
Line 35: "How do we make `mx-0` come before `mt-0`?"
Line 68: "There's no `border-spacing-x` property, we use variables, how to sort?"

These comments reveal **ongoing challenges** with shorthand properties vs. directional properties.

### Sorting Algorithm Details

From compile.ts:83-114, the sorting algorithm is:

```typescript
astNodes.sort((a, z) => {
  // 1. Sort by variant order first
  if (aSorting.variants - zSorting.variants !== 0n) {
    return Number(aSorting.variants - zSorting.variants)
  }

  // 2. Find first different property
  let offset = 0
  while (/* properties match */) {
    offset += 1
  }

  return (
    // 3. Sort by lowest property index first
    (aSorting.properties.order[offset] ?? Infinity) -
      (zSorting.properties.order[offset] ?? Infinity) ||
    // 4. Sort by most properties first
    zSorting.properties.count - aSorting.properties.count ||
    // 5. Sort alphabetically
    compare(aSorting.candidate, zSorting.candidate)
  )
})
```

## File Location Quick Reference

All in `packages/tailwindcss/src/`:

- `sort.ts:4` - `getClassOrder()` function (main API)
- `property-order.ts:1` - Array of 416+ ordered CSS properties
- `compile.ts:11` - `compileCandidates()` function
- `compile.ts:325` - `getPropertySort()` function
- `design-system.ts:43` - `getClassOrder` type definition
- `design-system.ts:145` - `getClassOrder` implementation

## Questions for Future Investigation

1. **How are arbitrary values sorted?** (e.g., `[--fg:#fff]`)
   - Found test case at sort.test.ts:71-86 showing they maintain order

2. **What determines variant order priority?**
   - Need to investigate `getVariantOrder()` in design-system.ts

3. **How does the prettier plugin handle non-Tailwind classes?**
   - The `getClassOrder()` returns `null` for unknown classes
   - Plugin decides where to place them (typically at the end)

## Blockers Encountered

None - research proceeded smoothly.

## Recommendations for Next Steps

1. Create a comprehensive README documenting the complete algorithm
2. Include visual examples of class sorting
3. Document the property-order.ts structure and rationale
4. Show integration examples for plugin authors
5. Consider creating a flowchart of the sorting process
