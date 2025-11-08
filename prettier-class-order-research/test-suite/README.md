# RustyWind Test Suite

**Purpose:** Verify that RustyWind's sorting matches prettier-plugin-tailwindcss (canonical Tailwind sorting)

## Test Coverage

### File Types
- ✅ HTML (`.html`)
- ✅ JSX (`.jsx`)
- ✅ TSX (`.tsx`)
- ✅ Vue (`.vue`)
- ✅ Svelte (`.svelte`)

### Test Cases

#### 1. **Basic Utilities**
```html
<div class="p-4 bg-red-500 m-2 text-white flex">
```
**Tests:** Mixed order utilities, property-based sorting

#### 2. **Responsive Variants**
```html
<div class="md:grid grid sm:flex flex lg:block block">
```
**Tests:** Base classes before variants, responsive breakpoint order

#### 3. **Pseudo-class Variants**
```html
<div class="hover:bg-blue-500 bg-red-500 focus:text-white text-black">
```
**Tests:** Pseudo-class ordering (hover, focus, active, etc.)

#### 4. **Mixed Base and Variants**
```html
<div class="mx-0 md:mx-8 px-4 sm:px-6 lg:px-8">
```
**Tests:** Interleaved base and variant classes

#### 5. **Complex Layout**
```html
<div class="grid-cols-3 gap-4 grid items-center justify-between">
```
**Tests:** Flexbox and Grid utilities, property order

#### 6. **Sizing Utilities**
```html
<div class="h-screen w-full max-w-7xl min-h-0">
```
**Tests:** Width, height, min/max sizing

#### 7. **Typography**
```html
<p class="font-bold text-lg leading-relaxed text-center tracking-wide">
```
**Tests:** Font, text alignment, line height

#### 8. **Borders and Shadows**
```html
<div class="border-gray-300 border-2 border rounded-lg shadow-md">
```
**Tests:** Border properties, border-radius, shadows

#### 9. **Positioning**
```html
<div class="absolute top-0 right-0 z-10 inset-0">
```
**Tests:** Position values, inset, z-index

#### 10. **Important Modifier**
```html
<div class="p-4! bg-red-500 m-2!">
```
**Tests:** Classes with `!important` modifier

#### 11. **Arbitrary Values**
```html
<div class="bg-[#1da1f2] w-[100px] m-[10px] p-[2rem]">
```
**Tests:** Custom values with bracket notation

#### 12. **Multiple Stacked Variants**
```html
<div class="hover:focus:bg-blue-500 md:hover:flex lg:focus:grid">
```
**Tests:** Multiple variants on single utility

#### 13. **Unknown Classes**
```html
<div class="custom-class flex unknown-utility p-4">
```
**Tests:** Handling of non-Tailwind classes

#### 14. **All Margin Directions**
```html
<div class="m-4 mx-8 my-2 mt-1 mr-3 mb-5 ml-7">
```
**Tests:** Margin property order (m → mx/my → mt/mr/mb/ml)

#### 15. **Color Utilities**
```html
<div class="bg-red-500 text-white border-blue-300">
```
**Tests:** Color value handling

## Running the Tests

### Prerequisites

```bash
# Install dependencies
npm install -D prettier prettier-plugin-tailwindcss

# Install RustyWind (if testing RustyWind)
cargo install rustywind
```

### Run Comparison

```bash
cd prettier-class-order-research/test-suite
./run-comparison.sh
```

### Output

```
╔════════════════════════════════════════════════════════════╗
║  RustyWind vs Prettier Plugin Tailwindcss Test Suite      ║
╚════════════════════════════════════════════════════════════╝

Step 1: Building Tailwind CSS...
  ✓ Tailwind CSS built

Step 2: Running prettier-plugin-tailwindcss...
  Formatting html files...
  Formatting jsx files...
  Formatting tsx files...
  Formatting vue files...
  Formatting svelte files...
  ✓ Prettier formatting complete

Step 3: Running rustywind...
  Processing html files...
  Processing jsx files...
  Processing tsx files...
  Processing vue files...
  Processing svelte files...
  ✓ RustyWind sorting complete

Step 4: Comparing results...

  ✓ PASS html_basic.html
  ✓ PASS jsx_component.jsx
  ✓ PASS tsx_component.tsx
  ✓ PASS vue_Component.vue
  ✓ PASS svelte_Component.svelte

╔════════════════════════════════════════════════════════════╗
║                      Test Summary                          ║
╚════════════════════════════════════════════════════════════╝

  Total Tests:  5
  Passed:       5
  Failed:       0

  ★ All tests passed! RustyWind matches Prettier Plugin perfectly. ★
```

## Test Results Location

```
test-suite/
├── results/
│   ├── prettier/        # Output from prettier-plugin-tailwindcss
│   ├── rustywind/       # Output from RustyWind
│   └── diffs/           # Diff files for failed tests
├── temp/                # Temporary files
└── dist/                # Generated Tailwind CSS
```

## Interpreting Results

### ✓ PASS
Classes sorted identically by both tools.

### ✗ FAIL
Sorting differs. Check the diff file:
```bash
cat results/diffs/filename.diff
```

### ⚠ SKIP
RustyWind result not available (not installed or error).

## Using as Success Criteria

### For Pattern-Based Implementation

1. **Baseline:** Run tests with current static list
   ```bash
   ./run-comparison.sh > baseline-results.txt
   ```

2. **Track Progress:** Run after each implementation phase
   ```bash
   # After Phase 1: Foundation
   ./run-comparison.sh > phase1-results.txt

   # After Phase 2: Pattern Sorter
   ./run-comparison.sh > phase2-results.txt

   # After Phase 3: Hybrid
   ./run-comparison.sh > phase3-results.txt
   ```

3. **Success Metric:** 100% pass rate
   ```
   Goal: All tests passing (matching prettier-plugin-tailwindcss)
   ```

### Test Categories by Implementation Phase

**Phase 1 - Basic Patterns (Target: 60% pass)**
- Basic utilities
- Simple responsive
- Typography
- Colors

**Phase 2 - Advanced Patterns (Target: 85% pass)**
- Arbitrary values
- Multiple variants
- Complex layouts
- Positioning

**Phase 3 - Edge Cases (Target: 100% pass)**
- Important modifiers
- Unknown classes
- Stacked variants
- All margin directions

## Adding New Tests

### 1. Create Test File

Add to appropriate directory:
```
test-suite/
├── html/
│   └── your-test.html      # Add HTML test
├── jsx/
│   └── your-test.jsx       # Add JSX test
└── ...
```

### 2. Document Test Case

Add to this README under "Test Cases"

### 3. Run Tests

```bash
./run-comparison.sh
```

## Continuous Testing

### Git Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash
cd prettier-class-order-research/test-suite
./run-comparison.sh
```

### CI/CD Integration

```yaml
# .github/workflows/test-sorting.yml
name: Test RustyWind Sorting

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable

      - name: Install dependencies
        run: |
          npm install -D prettier prettier-plugin-tailwindcss
          cargo install rustywind

      - name: Run comparison tests
        run: |
          cd prettier-class-order-research/test-suite
          ./run-comparison.sh
```

## Known Limitations

### Current Static List Limitations

Based on baseline tests, current RustyWind static list fails:

- ❌ Arbitrary values (`bg-[#fff]`)
- ❌ Some property orderings (doesn't match Tailwind's property-order.ts)
- ❌ Variant placement (puts variants beside base classes)
- ❌ Custom spacing values

### Expected After Pattern-Based Implementation

- ✅ All arbitrary values
- ✅ Correct property ordering
- ✅ Correct variant placement (base first, then variants)
- ✅ Dynamic spacing values
- ✅ ~99% accuracy

## Debugging Failed Tests

### 1. View the Diff

```bash
cat results/diffs/html_basic.html.diff
```

### 2. Compare Line by Line

```bash
diff -y results/prettier/html_basic.html results/rustywind/html_basic.html
```

### 3. Extract Just the Classes

```bash
# From prettier output
grep -o 'class="[^"]*"' results/prettier/html_basic.html

# From rustywind output
grep -o 'class="[^"]*"' results/rustywind/html_basic.html
```

### 4. Identify Pattern

Look for:
- Wrong property order
- Variants in wrong section
- Arbitrary values not handled
- Unknown classes in wrong position

## Reporting Issues

When reporting sorting discrepancies:

1. Include test file that fails
2. Include diff output
3. Specify expected vs actual order
4. Note Tailwind/RustyWind versions

## Future Enhancements

- [ ] Add template literal tests (```className={`...`}```)
- [ ] Add clsx/classnames tests
- [ ] Add negative value tests (`-mt-4`)
- [ ] Add group/peer modifier tests
- [ ] Add dark mode variant tests
- [ ] Performance benchmarks
- [ ] Visual diff viewer (HTML report)
