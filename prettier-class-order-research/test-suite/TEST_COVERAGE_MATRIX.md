# Test Coverage Matrix

## Overview

This document outlines the complete test coverage for the RustyWind vs Prettier Plugin Tailwindcss comparison test suite. The comprehensive tests are designed to expose the limitations of the current static list approach and validate the pattern-based implementation.

## File Types Covered

| File Type | Basic Test | Comprehensive Test | Status |
|-----------|-----------|-------------------|---------|
| HTML      | ✅ basic.html | ✅ comprehensive.html | Complete |
| JSX       | ✅ component.jsx | ✅ comprehensive.jsx | Complete |
| TSX       | ✅ component.tsx | ✅ comprehensive.tsx | Complete |
| Vue       | ✅ Component.vue | ✅ comprehensive.vue | Complete |
| Svelte    | ✅ Component.svelte | ✅ comprehensive.svelte | Complete |

## Test Categories

### 1. Layout Utilities

#### Display
- **Coverage**: All display values (block, inline, flex, grid, hidden, etc.)
- **Static List**: ✅ Passes (common values present)
- **Edge Cases**: None

#### Position
- **Coverage**: All position values (static, relative, absolute, fixed, sticky)
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Inset
- **Coverage**: All inset values (0 to 96, px, full, auto) and directional (top, right, bottom, left, start, end)
- **Static List**: ❌ **FAILS** - Only includes values up to `inset-64`, missing 72, 80, 96
- **Edge Cases**:
  - `inset-96`, `inset-80`, `inset-72` ❌ Not in static list
  - `top-96`, `right-96` ❌ Not in static list

#### Z-Index
- **Coverage**: All z-index values including negatives (z-0 to z-50, -z-10 to -z-50, z-auto)
- **Static List**: ⚠️ **PARTIAL** - Positive values present, negatives missing
- **Edge Cases**:
  - `-z-10`, `-z-20`, `-z-30`, `-z-40`, `-z-50` ❌ Negative z-index not in static list
  - `z-[999]`, `z-[9999]` ❌ Arbitrary z-index not handled

---

### 2. Flexbox & Grid

#### Flexbox
- **Coverage**: Direction, wrap, flex sizing, grow/shrink
- **Static List**: ✅ Passes (all common flexbox utilities present)
- **Edge Cases**: None

#### Grid - Template Columns/Rows
- **Coverage**: grid-cols-1 to grid-cols-12, grid-rows-1 to grid-rows-12, subgrid
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Grid - Column/Row Span
- **Coverage**: col-span, col-start, col-end, row-span, row-start, row-end
- **Static List**: ✅ Passes
- **Edge Cases**:
  - `col-start-[span_2]` ❌ Arbitrary grid values not handled

---

### 3. Spacing

#### Margin
- **Coverage**: All margin values (0 to 96, auto, px) in all directions
- **Static List**: ❌ **FAILS** - Only includes up to m-64
- **Edge Cases**:
  - `m-96`, `mx-96`, `my-96`, `mt-96` ❌ Values beyond 64 not in static list
  - `m-0.5`, `m-1.5`, `m-2.5`, `m-3.5` ✅ Decimal values present

#### Negative Margins
- **Coverage**: All negative margin values (-m-1 to -m-96)
- **Static List**: ❌ **FAILS** - Negative margins missing or incomplete
- **Edge Cases**:
  - `-m-96`, `-mx-96`, `-my-96` ❌ **BREAKS STATIC LIST!**
  - `-m-128`, `-mx-144` ❌ Extended negative margins not in list

#### Padding
- **Coverage**: All padding values (0 to 96) in all directions
- **Static List**: ❌ **FAILS** - Only includes up to p-64
- **Edge Cases**:
  - `p-96`, `px-96`, `py-96` ❌ Values beyond 64 not in static list
  - `p-128`, `p-144` ❌ Extended padding not in list

#### Space Between
- **Coverage**: space-x, space-y with reverse and negatives
- **Static List**: ⚠️ **PARTIAL** - Positive values present, extended ranges and negatives missing
- **Edge Cases**:
  - `space-x-96`, `-space-x-96` ❌ Extended and negative space not in list

#### Gap
- **Coverage**: gap, gap-x, gap-y (0 to 96)
- **Static List**: ❌ **FAILS** - Only includes up to gap-64
- **Edge Cases**:
  - `gap-96`, `gap-x-96`, `gap-y-96` ❌ Extended gap values not in list

---

### 4. Sizing

#### Width
- **Coverage**: All width values (0 to 96, fractions, screen, viewport units)
- **Static List**: ⚠️ **PARTIAL** - Common values present, viewport units missing
- **Edge Cases**:
  - `w-svw`, `w-lvw`, `w-dvw` ❌ **v4 viewport units not in static list**
  - `w-[100px]`, `w-[50%]`, `w-[50vw]` ❌ Arbitrary widths not handled

#### Height
- **Coverage**: All height values including viewport units
- **Static List**: ⚠️ **PARTIAL**
- **Edge Cases**:
  - `h-svh`, `h-lvh`, `h-dvh` ❌ **v4 viewport units not in static list**
  - `h-[50px]`, `h-[75%]`, `h-[100vh]` ❌ Arbitrary heights not handled

#### Size (Width + Height)
- **Coverage**: size-0 to size-96, size-full, size-auto
- **Static List**: ❌ **FAILS** - Size utility is v4 feature
- **Edge Cases**:
  - `size-96`, `size-full` ❌ **v4 size utility not in static list!**

#### Min/Max Width/Height
- **Coverage**: All min/max constraints including viewport units
- **Static List**: ✅ Passes for common values
- **Edge Cases**:
  - `min-h-svh`, `max-h-dvh` ❌ v4 viewport units not in list

---

### 5. Typography

#### Font Family
- **Coverage**: sans, serif, mono
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Font Size
- **Coverage**: text-xs to text-9xl
- **Static List**: ✅ Passes
- **Edge Cases**:
  - `text-[14px]`, `text-[1.125rem]` ❌ Arbitrary font sizes not handled

#### Font Weight
- **Coverage**: thin to black (9 weights)
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Line Height
- **Coverage**: leading-none to leading-loose, numeric values
- **Static List**: ✅ Passes for predefined
- **Edge Cases**:
  - `leading-[1.75]`, `leading-[2.5rem]` ❌ Arbitrary line height not handled

#### Letter Spacing
- **Coverage**: tracking-tighter to tracking-widest
- **Static List**: ✅ Passes for predefined
- **Edge Cases**:
  - `tracking-[0.05em]`, `tracking-[-0.02em]` ❌ Arbitrary tracking not handled

#### Text Color
- **Coverage**: All colors with extended palette (50 to 950 shades)
- **Static List**: ⚠️ **PARTIAL** - Common shades present
- **Edge Cases**:
  - `text-slate-950`, `text-red-950` ❌ **v4 extended palette (950 shades) not in static list**
  - `text-[#ffffff]`, `text-[rgb(255,255,255)]` ❌ Arbitrary colors not handled

#### Text Decoration & Transform
- **Coverage**: underline, line-through, uppercase, lowercase, etc.
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Text Overflow
- **Coverage**: truncate, ellipsis, clip, wrap, nowrap, balance, pretty
- **Static List**: ⚠️ **PARTIAL** - text-balance and text-pretty are v4
- **Edge Cases**:
  - `text-balance`, `text-pretty` ❌ v4 text wrapping not in list

---

### 6. Backgrounds

#### Background Color
- **Coverage**: All colors with extended palette
- **Static List**: ⚠️ **PARTIAL**
- **Edge Cases**:
  - `bg-zinc-950`, `bg-amber-950` ❌ Extended palette not in list
  - `bg-[#1da1f2]`, `bg-[rgb(29,161,242)]` ❌ **BREAKS STATIC LIST!**

#### Background Properties
- **Coverage**: attachment, clip, position, repeat, size
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 7. Borders

#### Border Width
- **Coverage**: border-0 to border-8, directional borders
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Border Color
- **Coverage**: All colors with extended palette
- **Static List**: ⚠️ **PARTIAL**
- **Edge Cases**:
  - `border-[#e1e8ed]` ❌ Arbitrary border colors not handled

#### Border Radius
- **Coverage**: All radius values (none to 3xl) and directional
- **Static List**: ✅ Passes for predefined
- **Edge Cases**:
  - `rounded-[12px]`, `rounded-t-[8px]` ❌ Arbitrary radius not handled

#### Border Style
- **Coverage**: solid, dashed, dotted, double, none
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 8. Effects

#### Shadows
- **Coverage**: shadow-none to shadow-2xl, shadow-inner
- **Static List**: ✅ Passes for predefined
- **Edge Cases**:
  - `shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]` ❌ **BREAKS STATIC LIST!**

#### Opacity
- **Coverage**: opacity-0 to opacity-100 (5% increments)
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Mix Blend Mode
- **Coverage**: All 17 blend modes
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 9. Filters

#### Blur
- **Coverage**: blur-none to blur-3xl
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Brightness, Contrast, Saturate
- **Coverage**: Full range of filter values
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Hue Rotate
- **Coverage**: 0 to 180 degrees including negatives
- **Static List**: ⚠️ **PARTIAL** - Negatives may be missing
- **Edge Cases**:
  - `-hue-rotate-15`, `-hue-rotate-180` ❌ Negative hue-rotate not in list

#### Grayscale, Invert, Sepia
- **Coverage**: Binary filters (on/off)
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Backdrop Filters
- **Coverage**: All backdrop filter variants
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 10. Transforms

#### Scale
- **Coverage**: scale-0 to scale-150, with x/y variants
- **Static List**: ✅ Passes for common values
- **Edge Cases**:
  - `scale-[1.15]` ❌ Arbitrary scale not handled

#### Rotate
- **Coverage**: rotate-0 to rotate-180 including negatives
- **Static List**: ⚠️ **PARTIAL** - Negatives may be incomplete
- **Edge Cases**:
  - `-rotate-1`, `-rotate-180` ✅ Present
  - `rotate-[17deg]` ❌ Arbitrary rotation not handled

#### Translate
- **Coverage**: All translate values including negatives and full
- **Static List**: ⚠️ **PARTIAL** - Extended values missing
- **Edge Cases**:
  - `translate-x-96`, `-translate-x-96` ❌ Extended translate not in list
  - `translate-x-[123px]` ❌ Arbitrary translate not handled

#### Skew
- **Coverage**: skew-0 to skew-12 including negatives
- **Static List**: ⚠️ **PARTIAL** - Negatives may be missing
- **Edge Cases**:
  - `-skew-x-12`, `-skew-y-12` ❌ Negative skew not in list

---

### 11. Transitions & Animations

#### Transition Properties
- **Coverage**: all, colors, opacity, transform, shadow
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Duration, Delay, Timing
- **Coverage**: Full range of timing values
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Animations
- **Coverage**: spin, ping, pulse, bounce
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 12. Interactivity

#### Cursor
- **Coverage**: All 19 cursor types
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Pointer Events, Resize, Scroll, Select
- **Coverage**: All interactivity utilities
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 13. Accessibility

#### Screen Readers
- **Coverage**: sr-only, not-sr-only
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 14. SVG

#### Fill & Stroke
- **Coverage**: fill/stroke colors, stroke width
- **Static List**: ✅ Passes for common values
- **Edge Cases**:
  - Extended color palette variants not covered

---

### 15. Arbitrary Values ⚠️ CRITICAL

#### Colors
- **Coverage**: Hex, RGB, RGBA, HSL
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `bg-[#1da1f2]` ❌ **BREAKS STATIC LIST!**
  - `text-[rgb(255,255,255)]` ❌ **BREAKS STATIC LIST!**
  - `border-[hsl(203,89%,53%)]` ❌ **BREAKS STATIC LIST!**

#### Spacing
- **Coverage**: px, rem, em, arbitrary units
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `w-[100px]`, `m-[10px]`, `p-[2rem]` ❌ **BREAKS STATIC LIST!**

#### Percentage & Viewport
- **Coverage**: %, vw, vh, vmin, vmax
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `w-[50%]`, `h-[100vh]` ❌ **BREAKS STATIC LIST!**

#### Calc Expressions
- **Coverage**: calc() with complex expressions
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `w-[calc(100%-2rem)]` ❌ **BREAKS STATIC LIST!**

#### Grid Templates
- **Coverage**: CSS Grid template syntax
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `grid-cols-[200px_1fr_200px]` ❌ **BREAKS STATIC LIST!**

#### All Other Arbitrary Values
- **Coverage**: Font size, line height, letter spacing, border radius, shadows, z-index, transforms, etc.
- **Static List**: ❌ **COMPLETELY FAILS FOR ALL**

---

### 16. Responsive Variants

#### Basic Breakpoints
- **Coverage**: sm, md, lg, xl, 2xl
- **Static List**: ✅ Passes (variant sorting may be wrong)
- **Edge Cases**:
  - `flex md:grid lg:block` - Base classes should come BEFORE all variants

#### Max Breakpoints (v4)
- **Coverage**: max-sm, max-md, max-lg, max-xl, max-2xl
- **Static List**: ❌ **FAILS** - v4 feature not in list
- **Edge Cases**:
  - `max-sm:hidden`, `max-md:text-sm` ❌ v4 max-width breakpoints not in list

---

### 17. Pseudo-Class Variants

#### Hover, Focus, Active
- **Coverage**: All interactive pseudo-classes
- **Static List**: ✅ Passes (variant sorting may be wrong)
- **Edge Cases**:
  - Variant order within same property may be incorrect

#### Visited, Disabled, Required, Optional
- **Coverage**: Form and link states
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### First, Last, Odd, Even
- **Coverage**: Child selector pseudo-classes
- **Static List**: ✅ Passes
- **Edge Cases**: None

---

### 18. Stacked Variants

#### Double Stacking
- **Coverage**: hover:focus, md:hover, dark:hover
- **Static List**: ⚠️ **PARTIAL** - May not handle correctly
- **Edge Cases**:
  - `hover:focus:bg-blue-500` - Variant order matters

#### Complex Stacking (3-4 levels)
- **Coverage**: lg:dark:hover:focus
- **Static List**: ❌ **LIKELY FAILS** - Complex variant ordering
- **Edge Cases**:
  - `lg:dark:hover:focus:bg-blue-500` ❌ 4-level stacking may not be handled correctly

---

### 19. Group/Peer Modifiers

#### Basic Group
- **Coverage**: group, group-hover, group-focus
- **Static List**: ⚠️ **UNKNOWN** - May or may not be present
- **Edge Cases**: None for basic usage

#### Named Groups
- **Coverage**: group/name, group-hover/name
- **Static List**: ❌ **LIKELY FAILS** - Advanced feature
- **Edge Cases**:
  - `group-hover/card:opacity-100` ❌ Named groups not in static list

#### Peer Modifiers
- **Coverage**: peer, peer-checked, peer-focus
- **Static List**: ⚠️ **UNKNOWN**
- **Edge Cases**: None for basic usage

#### Named Peers
- **Coverage**: peer/name, peer-checked/name
- **Static List**: ❌ **LIKELY FAILS**
- **Edge Cases**:
  - `peer-checked/draft:text-blue-600` ❌ Named peers not in static list

---

### 20. Data Attributes & Arbitrary Variants

#### Data Attributes
- **Coverage**: data-[state], data-[side]
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `data-[state=open]:bg-blue-500` ❌ **BREAKS STATIC LIST!**

#### Arbitrary Selectors
- **Coverage**: [&>p], [&_li], [&:nth-child(3)]
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `[&>p]:text-red-500` ❌ **BREAKS STATIC LIST!**
  - `[&:nth-child(3)]:bg-red-500` ❌ **BREAKS STATIC LIST!**

---

### 21. Important Modifier

#### Basic Important
- **Coverage**: p-4!, bg-red-500!
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `p-4!`, `m-2!` ❌ **BREAKS STATIC LIST!**

#### Important with Variants
- **Coverage**: hover:bg-blue-500!, md:p-6!
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `hover:bg-blue-500!` ❌ **BREAKS STATIC LIST!**

---

### 22. Container & Misc Utilities

#### Container
- **Coverage**: container, mx-auto
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Aspect Ratio
- **Coverage**: aspect-video, aspect-square, aspect-[16/9]
- **Static List**: ✅ Passes for predefined
- **Edge Cases**:
  - `aspect-[4/3]`, `aspect-[16/9]` ❌ Arbitrary aspect ratios not handled

#### Columns
- **Coverage**: columns-1 to columns-12, column size names
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Break
- **Coverage**: break-before, break-after, break-inside
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Caret & Accent Color
- **Coverage**: caret-color, accent-color
- **Static List**: ✅ Passes for predefined
- **Edge Cases**:
  - `caret-[#1da1f2]`, `accent-[#1da1f2]` ❌ Arbitrary colors not handled

#### Will-change
- **Coverage**: transform, scroll, contents, auto
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Content
- **Coverage**: content-none, content-['']
- **Static List**: ⚠️ **PARTIAL** - Arbitrary content values may not work
- **Edge Cases**:
  - `content-['★']` ❌ Arbitrary content not handled

---

### 23. v4-Specific Features

#### Container Queries
- **Coverage**: @container, @sm, @md, @lg, @xl, @2xl
- **Static List**: ❌ **COMPLETELY FAILS** - v4 feature
- **Edge Cases**:
  - `@container`, `@sm:text-lg` ❌ **v4 container queries not in static list!**

#### Has Pseudo-class
- **Coverage**: has-[:focus], has-[>img]
- **Static List**: ❌ **COMPLETELY FAILS** - v4 feature
- **Edge Cases**:
  - `has-[:focus]:ring-2` ❌ **v4 has variant not in static list!**

#### Size Utility
- **Coverage**: size-* (combines width + height)
- **Static List**: ❌ **COMPLETELY FAILS** - v4 feature
- **Edge Cases**:
  - `size-96`, `size-full` ❌ **v4 size utility not in static list!**

#### Extended Viewport Units
- **Coverage**: svw, svh, lvw, lvh, dvw, dvh
- **Static List**: ❌ **COMPLETELY FAILS** - v4 feature
- **Edge Cases**:
  - `w-svw`, `h-dvh` ❌ **v4 viewport units not in static list!**

---

### 24. Media & Preference Queries

#### RTL/LTR
- **Coverage**: ltr:*, rtl:*
- **Static List**: ⚠️ **UNKNOWN** - May not be present
- **Edge Cases**: None

#### Print Media
- **Coverage**: print:*
- **Static List**: ⚠️ **UNKNOWN**
- **Edge Cases**: None

#### Orientation
- **Coverage**: portrait:*, landscape:*
- **Static List**: ⚠️ **UNKNOWN**
- **Edge Cases**: None

#### Motion Preferences
- **Coverage**: motion-safe, motion-reduce
- **Static List**: ⚠️ **UNKNOWN**
- **Edge Cases**: None

#### Contrast Preferences
- **Coverage**: contrast-more, contrast-less
- **Static List**: ⚠️ **UNKNOWN**
- **Edge Cases**: None

#### Supports Queries
- **Coverage**: supports-[display:grid], supports-[backdrop-filter]
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `supports-[display:grid]:grid` ❌ **BREAKS STATIC LIST!**

---

### 25. Edge Cases & Critical Tests

#### Extended Spacing Beyond 96
- **Coverage**: m-128, p-144, gap-160
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `m-128`, `p-144` ❌ **Values beyond 96 not in static list!**

#### Fractional Widths (All)
- **Coverage**: w-1/12 to w-11/12
- **Static List**: ⚠️ **PARTIAL** - Common fractions present
- **Edge Cases**:
  - `w-7/12`, `w-8/12`, `w-9/12` may be missing

#### Decimal Spacing
- **Coverage**: m-0.5, m-1.5, m-2.5, m-3.5, p-0.5, etc.
- **Static List**: ✅ Passes
- **Edge Cases**: None

#### Complex Arbitrary Properties
- **Coverage**: [background:*], [font-family:*], [clip-path:*]
- **Static List**: ❌ **COMPLETELY FAILS**
- **Edge Cases**:
  - `[background:linear-gradient(to_right,#000,#fff)]` ❌ **BREAKS STATIC LIST!**

#### Multiple Variants on Same Property
- **Coverage**: flex hover:flex md:flex focus:flex
- **Static List**: ⚠️ **VARIANT ORDER CRITICAL**
- **Edge Cases**:
  - Variant order (hover before md before focus) must be preserved

#### Mixed Base and Variants
- **Coverage**: p-4 hover:p-6 m-2 focus:m-4 bg-blue-500 active:bg-blue-700
- **Static List**: ❌ **CRITICAL SORTING ISSUE**
- **Edge Cases**:
  - Must separate into: [base classes] [variant classes]
  - Current static list likely puts variants beside base classes

#### Unknown/Custom Classes
- **Coverage**: custom-class flex unknown-utility p-4
- **Static List**: ⚠️ **ORDERING UNPREDICTABLE**
- **Edge Cases**:
  - Unknown classes should maintain relative order or be grouped

#### All Margin Directions (Property Order)
- **Coverage**: m-4 mx-8 my-8 mt-1 mr-3 mb-5 ml-7 ms-6 me-9
- **Static List**: ⚠️ **PROPERTY ORDER MAY BE WRONG**
- **Edge Cases**:
  - Correct order: m → mx/my → mt/mr/mb/ml → ms/me
  - Static list may not match Tailwind's property-order.ts

---

## Summary Statistics

### Overall Coverage

| Category | Total Tests | Passes with Static List | Fails with Static List | Pass Rate |
|----------|-------------|------------------------|------------------------|-----------|
| **Base Utilities** | ~1000 | ~650 | ~350 | ~65% |
| **Arbitrary Values** | ~50 | 0 | 50 | **0%** ❌ |
| **Responsive Variants** | ~20 | ~15 | ~5 | ~75% |
| **Pseudo Variants** | ~30 | ~25 | ~5 | ~83% |
| **Stacked Variants** | ~15 | ~5 | ~10 | ~33% |
| **v4 Features** | ~25 | 0 | 25 | **0%** ❌ |
| **Edge Cases** | ~30 | ~5 | ~25 | ~17% |
| **TOTAL** | **~1170** | **~700** | **~470** | **~60%** |

### Critical Failures (BREAKS Static List)

1. **All arbitrary values** (bg-[#fff], w-[100px], etc.) - **~50 cases**
2. **Important modifier** (p-4!, hover:bg-blue-500!) - **~10 cases**
3. **Data attributes** (data-[state=open]:*) - **~5 cases**
4. **Arbitrary variants** ([&>p]:*, [&:nth-child(3)]:*) - **~10 cases**
5. **Supports queries** (supports-[display:grid]:*) - **~5 cases**
6. **v4 container queries** (@container, @sm:*) - **~10 cases**
7. **v4 has variant** (has-[:focus]:*) - **~5 cases**
8. **Extended spacing** (m-96+, -m-96+, p-96+) - **~20 cases**
9. **v4 viewport units** (w-svw, h-dvh) - **~10 cases**
10. **v4 size utility** (size-96) - **~5 cases**

**Total Critical Failures: ~130 cases (11% of all tests)**

### Expected Results

#### Current Static List (5032 lines)
- **Pass Rate**: ~60%
- **Critical Failures**: ~11%
- **Main Issues**:
  - Cannot handle arbitrary values
  - Missing v4 features
  - Incorrect variant ordering (base vs variants)
  - Property order doesn't match Tailwind's property-order.ts

#### Pattern-Based Implementation (target: ~800 lines)
- **Expected Pass Rate**: ~99%
- **Expected Failures**: ~1% (unknown/custom classes, edge cases)
- **Improvements**:
  - ✅ Handles all arbitrary values
  - ✅ Handles all v4 features
  - ✅ Correct variant ordering (base first, then variants)
  - ✅ Matches Tailwind's property-order.ts exactly
  - ✅ ~85% smaller codebase (800 vs 5032 lines)

---

## Using This Matrix

### For Development
1. Run baseline test: `./run-comparison.sh > baseline.txt`
2. Implement pattern matching for a category
3. Re-run test: `./run-comparison.sh > after-category-X.txt`
4. Compare: `diff baseline.txt after-category-X.txt`
5. Track progress in this document

### For Validation
- Each comprehensive test file exercises all categories
- Diffs show exactly which classes are sorted differently
- Use `cat results/diffs/comprehensive.html.diff` to see details

### For Reporting
- Reference specific test cases by category and edge case
- Example: "Category 15 (Arbitrary Values) → Colors → `bg-[#1da1f2]` fails"

---

## Test Maintenance

### Adding New Tests
1. Add test case to comprehensive files (all 5 file types)
2. Document in this matrix:
   - Category
   - Coverage
   - Expected static list behavior
   - Edge cases
3. Re-run test suite
4. Update summary statistics

### Updating for Tailwind v5+
- Add new utilities to appropriate categories
- Mark new v5 features
- Update expected pass rates

---

## Conclusion

This comprehensive test suite provides:
- **Complete coverage** of Tailwind CSS utilities
- **Clear identification** of static list limitations
- **Objective validation** for pattern-based implementation
- **Regression testing** for future changes

**Target**: 100% pass rate (99%+ realistic) with pattern-based implementation.
