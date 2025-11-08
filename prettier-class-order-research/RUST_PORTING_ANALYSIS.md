# Can the Sorting Logic Be Used from Rust?

**Research Session:** 011CUvKHNdhS77igNg64EwfD
**Date:** 2025-11-08

## Current State: Hybrid TypeScript/Rust Architecture

The Tailwind CSS v4 codebase uses a **hybrid architecture**:

### Rust Components (Oxide Crate)
- **Purpose:** Fast file scanning and candidate extraction
- **Location:** `crates/oxide/`
- **Exposed via:** Node.js native addon using NAPI (`crates/node/`)
- **Responsibilities:**
  - Scanning source files
  - Extracting class candidates
  - Glob pattern matching
  - File watching

### TypeScript Components
- **Purpose:** CSS compilation, utility generation, and **sorting**
- **Location:** `packages/tailwindcss/src/`
- **Responsibilities:**
  - Design system
  - Utility compilation
  - **Class ordering (sort.ts)**
  - CSS generation
  - Theme management

## Current Sorting Implementation: TypeScript Only

The sorting logic is currently **100% implemented in TypeScript**:

```
┌───────────────────────────────────────┐
│  Rust (Oxide)                         │
│  - Extract candidates: ["px-3", ...]  │
└───────────┬───────────────────────────┘
            │ Returns to
            ▼
┌───────────────────────────────────────┐
│  TypeScript (Core)                    │
│  - Compile to CSS                     │
│  - Sort by property order             │
│  - Generate output                    │
└───────────────────────────────────────┘
```

### Why Sorting is in TypeScript

1. **Requires Design System:** Sorting needs access to the full design system to compile classes to CSS
2. **Property Mapping:** Must know which CSS properties each class generates
3. **Theme-Dependent:** Sorting can vary based on theme configuration
4. **Complex Logic:** Involves AST compilation, variant resolution, and property lookup

## Can It Be Used from Rust? Current Options

### Option 1: Call TypeScript from Rust (Possible but Complex)

You could use Node.js bindings in reverse:

```rust
// Hypothetical - not currently implemented
use node_bridge::DesignSystem;

let design = DesignSystem::load("./src/app.css")?;
let sorted = design.get_class_order(&["px-3", "bg-red-500", "py-4"])?;
```

**Challenges:**
- Requires embedding Node.js/V8 in Rust
- Performance overhead of crossing language boundary
- Complex build setup
- Not currently implemented in the codebase

### Option 2: NAPI Bridge (Most Practical Today)

The existing NAPI bridge goes Rust→JS, you'd use it from JavaScript:

```rust
// In Rust: Extract candidates
#[napi]
pub fn scan(&mut self) -> Vec<String> {
    self.scanner.scan()  // Returns ["px-3", "bg-red-500", ...]
}
```

```typescript
// In TypeScript: Sort them
import { Scanner } from '@tailwindcss/oxide'

const scanner = new Scanner({ sources: [...] })
const candidates = scanner.scan()  // From Rust
const sorted = design.getClassOrder(candidates)  // In TypeScript
```

This is **the current architecture** and works well.

## Could It Be Ported to Rust?

### Feasibility: YES, but SIGNIFICANT EFFORT

The sorting logic **could** be ported to Rust, but it would require porting:

#### 1. Property Order List (Easy)
```rust
// Equivalent of property-order.ts
const PROPERTY_ORDER: &[&str] = &[
    "container-type",
    "pointer-events",
    "visibility",
    "position",
    // ... 416 more properties
];
```

**Effort:** Low - straightforward data structure

#### 2. CSS Parsing and Compilation (Hard)
The sorting requires compiling classes to CSS to determine their properties:

```rust
// Would need to implement:
struct Candidate {
    base: String,
    variants: Vec<Variant>,
    modifiers: Vec<Modifier>,
    important: bool,
}

// And full CSS generation:
fn compile_to_css(&self, candidate: &Candidate) -> Vec<Declaration> {
    // Generate CSS declarations
    // This is complex - requires full utility logic
}
```

**Effort:** High - this is the entire Tailwind utility system

#### 3. Design System (Very Hard)
```rust
struct DesignSystem {
    theme: Theme,
    utilities: UtilityRegistry,
    variants: VariantRegistry,
    // ... and all the compilation logic
}
```

**Effort:** Very High - essentially reimplementing the core of Tailwind v4 in Rust

### What Would Need to Be Ported

| Component | Lines of Code | Complexity | Dependencies |
|-----------|---------------|------------|--------------|
| `property-order.ts` | ~420 | Low | None |
| `sort.ts` | ~30 | Low | compile.ts, design-system.ts |
| `compile.ts` | ~800+ | High | All utility generation |
| `design-system.ts` | ~500+ | Very High | Theme, utilities, variants |
| `utilities.ts` | ~1000+ | Very High | CSS generation |
| `variants.ts` | ~500+ | High | Variant system |
| **Total** | **~3500+** | **Very High** | **Entire system** |

### Architectural Challenge

The sorting logic is **deeply integrated** with the rest of the system:

```
getClassOrder()
  ↓ calls
compileCandidates()
  ↓ calls
compileAstNodes()
  ↓ calls
designSystem.compileAstNodes()
  ↓ needs
utilities.compile(), variants.apply(), theme.resolve()
```

You can't port just the sorting - you'd need to port **the entire compilation pipeline**.

## Recommendation: Hybrid Approach

### For Most Use Cases: Keep Current Architecture

The current hybrid architecture is **optimal** for most use cases:

```
Rust (Fast)          TypeScript (Flexible)
    ↓                       ↓
Extract Classes  →  Compile & Sort  →  Output
```

**Advantages:**
- Rust handles I/O-bound work (file scanning) - very fast
- TypeScript handles CPU-bound work (compilation) - flexible and maintainable
- Clean separation of concerns
- Easy to extend with plugins

### When Pure Rust Might Be Worth It

Consider porting to Rust only if:

1. **Performance Critical:** Sorting is a bottleneck (unlikely - scanning is the bottleneck)
2. **Rust-Native Tool:** Building a tool that can't run Node.js (embedded, WASM for non-browser, etc.)
3. **Standalone Library:** Want a library that doesn't require Node.js

### Minimal Rust Sorting (Compromise Approach)

You could implement a **lightweight** Rust sorter that doesn't compile CSS:

```rust
// Simple lexical/heuristic sorting without CSS compilation
pub fn sort_classes_heuristic(classes: &[&str]) -> Vec<&str> {
    // Use naming patterns instead of CSS properties
    // e.g., "p-*" before "px-*", "bg-*" after positioning
    // Won't be perfect but might be "good enough"
}
```

**Pros:**
- Pure Rust, no Node.js dependency
- Fast
- Simple to implement

**Cons:**
- Not canonical Tailwind order
- Breaks with custom utilities
- Needs manual updates for new utilities

## Practical Porting Guide

If you **must** port to Rust, here's the recommended approach:

### Phase 1: Data Structures (1-2 weeks)
```rust
// Port the property order
const PROPERTY_ORDER: &[&str] = include!("property_order.rs");

// Basic types
struct PropertySort {
    order: Vec<usize>,
    count: usize,
}
```

### Phase 2: CSS Property Mapping (2-4 weeks)
```rust
// Map utility patterns to properties
fn get_properties(class: &str) -> Option<Vec<&'static str>> {
    match class {
        c if c.starts_with("p-") => Some(vec!["padding"]),
        c if c.starts_with("px-") => Some(vec!["padding-left", "padding-right"]),
        // ... hundreds more patterns
    }
}
```

This is **fragile** - breaks with arbitrary values and custom utilities.

### Phase 3: Full Compilation (3-6 months)
Port the entire design system to Rust. This is essentially **rewriting Tailwind v4 in Rust**.

## Code Example: Minimal Rust Sorter

Here's a minimal example that could work for **standard utilities only**:

```rust
use std::cmp::Ordering;

// From property-order.ts
const PROPERTY_ORDER: &[&str] = &[
    "container-type",
    "pointer-events",
    "visibility",
    // ... all 416 properties
];

// Simple pattern-based property lookup
fn class_to_properties(class: &str) -> Vec<&'static str> {
    // Remove variants
    let base = class.split(':').last().unwrap();

    // Pattern matching (incomplete - just examples)
    match base {
        c if c.starts_with("p-") => vec!["padding"],
        c if c.starts_with("px-") => vec!["padding-left", "padding-right"],
        c if c.starts_with("py-") => vec!["padding-top", "padding-bottom"],
        c if c.starts_with("bg-") => vec!["background-color"],
        c if c.starts_with("text-") => vec!["color"],
        // ... would need hundreds of patterns
        _ => vec![], // Unknown
    }
}

fn get_property_index(property: &str) -> Option<usize> {
    PROPERTY_ORDER.iter().position(|&p| p == property)
}

pub fn sort_classes(classes: &mut [&str]) {
    classes.sort_by(|a, b| {
        let a_props = class_to_properties(a);
        let b_props = class_to_properties(b);

        if a_props.is_empty() && b_props.is_empty() {
            return Ordering::Equal;
        }
        if a_props.is_empty() {
            return Ordering::Less; // Unknown first
        }
        if b_props.is_empty() {
            return Ordering::Greater;
        }

        let a_idx = get_property_index(a_props[0]).unwrap_or(usize::MAX);
        let b_idx = get_property_index(b_props[0]).unwrap_or(usize::MAX);

        a_idx.cmp(&b_idx)
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_sorting() {
        let mut classes = vec!["px-3", "bg-red-500", "py-4"];
        sort_classes(&mut classes);
        assert_eq!(classes, vec!["bg-red-500", "py-4", "px-3"]);
    }
}
```

**Limitations of this approach:**
- Doesn't handle arbitrary values: `bg-[#fff]`
- Doesn't handle custom utilities
- Doesn't handle all property patterns
- Hardcoded pattern matching is fragile
- No theme awareness

## Summary

### Current State
- **Sorting is in TypeScript** and deeply integrated with the design system
- **Rust handles file I/O** which is the performance bottleneck
- This architecture is optimal for the current use case

### Can you use it from Rust?
- **Directly:** No - it's TypeScript code
- **Via NAPI:** Yes - call JS from Rust (complex, overhead)
- **Current pattern:** Rust→JS is already set up and works well

### Can it be ported to Rust?
- **Simple version:** Yes, with pattern matching (fragile, incomplete)
- **Full version:** Yes, but requires porting 3500+ lines of tightly coupled code
- **Effort:** 3-6 months for full port
- **Value:** Questionable - sorting is not the bottleneck

### Recommendation
**Keep the hybrid architecture** unless you have a specific requirement for pure Rust (embedded systems, WASM without Node, etc.). The current design leverages the strengths of both languages optimally.

If you need pure Rust for a specific use case, consider:
1. Pattern-based heuristic sorting (good enough for standard utilities)
2. Lazy loading TypeScript for accurate sorting when needed
3. Pre-computing sort order and embedding it as data

---

## Related Files

- Current sorting: `packages/tailwindcss/src/sort.ts`
- Property order: `packages/tailwindcss/src/property-order.ts`
- Rust scanner: `crates/oxide/src/scanner/mod.rs`
- NAPI bridge: `crates/node/src/lib.rs`
- Main README: `./README.md`
