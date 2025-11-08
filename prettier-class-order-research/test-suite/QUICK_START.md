# Quick Start: RustyWind Test Suite

## One-Line Setup and Run

```bash
cd prettier-class-order-research/test-suite
npm install -D prettier prettier-plugin-tailwindcss && ./run-comparison.sh
```

## What This Does

1. **Installs** prettier and prettier-plugin-tailwindcss
2. **Builds** Tailwind CSS from test files
3. **Runs** prettier-plugin-tailwindcss on all test files
4. **Runs** RustyWind on all test files (if installed)
5. **Compares** results and shows pass/fail

## Expected Output (Before Pattern Implementation)

```
╔════════════════════════════════════════════════════════════╗
║  RustyWind vs Prettier Plugin Tailwindcss Test Suite      ║
╚════════════════════════════════════════════════════════════╝

Step 1: Building Tailwind CSS...
  ✓ Tailwind CSS built

Step 2: Running prettier-plugin-tailwindcss...
  ✓ Prettier formatting complete

Step 3: Running rustywind...
  ✓ RustyWind sorting complete

Step 4: Comparing results...

  ✗ FAIL html_basic.html
  ✗ FAIL jsx_component.jsx
  ✗ FAIL tsx_component.tsx
  ✗ FAIL vue_Component.vue
  ✗ FAIL svelte_Component.svelte

╔════════════════════════════════════════════════════════════╗
║                      Test Summary                          ║
╚════════════════════════════════════════════════════════════╝

  Total Tests:  5
  Passed:       0
  Failed:       5

  ⚠ Some tests failed. Check diffs in results/diffs/
```

## Why Tests Fail Currently

The current RustyWind static list:
- ❌ Doesn't match Tailwind's property order
- ❌ Can't handle arbitrary values (`bg-[#fff]`)
- ❌ Puts variants beside base classes (wrong!)
- ❌ Missing many utility patterns

## Expected After Pattern Implementation

```
╔════════════════════════════════════════════════════════════╗
║                      Test Summary                          ║
╚════════════════════════════════════════════════════════════╝

  Total Tests:  5
  Passed:       5  ← Goal!
  Failed:       0

  ★ All tests passed! RustyWind matches Prettier Plugin perfectly. ★
```

## Checking a Specific Diff

```bash
# See what's different
cat results/diffs/html_basic.html.diff

# Example output:
# --- results/prettier/html_basic.html
# +++ results/rustywind/html_basic.html
# @@ -1,3 +1,3 @@
# -<div class="flex m-2 p-4 bg-red-500 text-white">
# +<div class="p-4 bg-red-500 m-2 text-white flex">
#            ↑ Prettier (correct)
#                                   ↑ RustyWind (wrong order)
```

## Using for Development

### Track Progress

```bash
# Before starting
./run-comparison.sh > baseline.txt

# After Phase 1
./run-comparison.sh > phase1.txt

# Compare improvement
diff baseline.txt phase1.txt
```

### Focus on One Test

```bash
# Test just HTML files
./run-comparison.sh | grep "html_"

# View specific diff
cat results/diffs/html_basic.html.diff
```

## Without RustyWind Installed

If you just want to see what Prettier outputs:

```bash
# Build CSS and run Prettier only
npm install -D prettier prettier-plugin-tailwindcss
npx tailwindcss -i temp/input.css -o dist/output.css

# Format a test file
npx prettier --plugin prettier-plugin-tailwindcss html/basic.html
```

## Install RustyWind

```bash
# From crates.io
cargo install rustywind

# Or from source
git clone https://github.com/avencera/rustywind
cd rustywind
cargo build --release
```

## Next Steps

1. ✅ Run baseline tests (see current failure rate)
2. ✅ Implement pattern-based sorting
3. ✅ Re-run tests (track improvement)
4. ✅ Aim for 100% pass rate
5. ✅ Celebrate! 🎉
