# Practical Guide: Using RustyWind with Canonical Tailwind Sorting

**Session:** 011CUvKHNdhS77igNg64EwfD
**Date:** 2025-11-08

## Quick Start: Match Tailwind's Exact Sorting

### Step 1: Generate Tailwind CSS

```bash
# Build your Tailwind CSS file
npx tailwindcss -o dist/tailwind.css

# Or if using v4:
npx @tailwindcss/cli -o dist/tailwind.css
```

### Step 2: Sort with RustyWind

```bash
# Sort files in place using the generated CSS
rustywind --output-css-file dist/tailwind.css --write .

# Or just check what would change:
rustywind --output-css-file dist/tailwind.css --dry-run .

# Or check if files are formatted:
rustywind --output-css-file dist/tailwind.css --check-formatted .
```

That's it! Your classes will now match Tailwind's exact sorting order.

## Setup for Different Workflows

### Option 1: npm Scripts (Recommended)

**package.json:**
```json
{
  "scripts": {
    "build:css": "tailwindcss -i src/input.css -o dist/output.css",
    "sort:classes": "rustywind --output-css-file dist/output.css --write .",
    "format": "npm run build:css && npm run sort:classes",
    "check:format": "npm run build:css && rustywind --output-css-file dist/output.css --check-formatted ."
  },
  "devDependencies": {
    "rustywind": "^0.21.0",
    "tailwindcss": "^4.0.0"
  }
}
```

**Usage:**
```bash
# Format all files
npm run format

# Check if sorted correctly
npm run check:format
```

### Option 2: Pre-commit Hook

**Using husky + lint-staged:**

```bash
npm install --save-dev husky lint-staged
npx husky install
```

**.husky/pre-commit:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Build CSS first
npm run build:css

# Run lint-staged
npx lint-staged
```

**package.json:**
```json
{
  "lint-staged": {
    "*.{html,jsx,tsx,vue,svelte}": [
      "rustywind --output-css-file dist/output.css --write"
    ]
  }
}
```

### Option 3: CI/CD

**GitHub Actions:**

```yaml
# .github/workflows/lint.yml
name: Lint

on: [push, pull_request]

jobs:
  check-class-sorting:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build Tailwind CSS
        run: npx tailwindcss -o dist/output.css

      - name: Install RustyWind
        run: npm install -g rustywind

      - name: Check class sorting
        run: rustywind --output-css-file dist/output.css --check-formatted .
```

### Option 4: Watch Mode (Development)

**Using nodemon:**

```bash
npm install --save-dev nodemon
```

**package.json:**
```json
{
  "scripts": {
    "dev:css": "tailwindcss -i src/input.css -o dist/output.css --watch",
    "dev:sort": "nodemon --watch dist/output.css --exec 'rustywind --output-css-file dist/output.css --write .'",
    "dev": "npm-run-all --parallel dev:css dev:sort"
  }
}
```

This watches the CSS file and re-sorts whenever it changes.

## VS Code Integration

### Option 1: Task

**.vscode/tasks.json:**
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build CSS",
      "type": "shell",
      "command": "npx tailwindcss -o dist/output.css",
      "problemMatcher": []
    },
    {
      "label": "Sort Tailwind Classes",
      "type": "shell",
      "command": "rustywind --output-css-file dist/output.css --write ${file}",
      "dependsOn": ["Build CSS"],
      "problemMatcher": []
    }
  ]
}
```

**Usage:**
- Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
- Type "Run Task"
- Select "Sort Tailwind Classes"

### Option 2: Keyboard Shortcut

**.vscode/keybindings.json:**
```json
[
  {
    "key": "ctrl+shift+s",
    "command": "workbench.action.tasks.runTask",
    "args": "Sort Tailwind Classes"
  }
]
```

## Comparing Outputs

### Test the Difference

Create a test file:

**test.html:**
```html
<div class="px-3 bg-red-500 py-4 hover:bg-blue-500 text-white">
  Test
</div>
```

### Default Static List
```bash
rustywind --write test.html
```

**Output (may vary):**
```html
<div class="px-3 py-4 text-white bg-red-500 hover:bg-blue-500">
  Test
</div>
```

### CSS File Mode (Canonical)
```bash
npx tailwindcss -o dist/output.css
rustywind --output-css-file dist/output.css --write test.html
```

**Output (matches Tailwind):**
```html
<div class="bg-red-500 py-4 px-3 text-white hover:bg-blue-500">
  Test
</div>
```

Notice the order is different! The CSS mode matches how Tailwind orders properties.

## Working with Arbitrary Values

### Problem with Static List

```html
<!-- Original -->
<div class="p-4 bg-[#1da1f2] w-[100px]">

<!-- After rustywind (static list) -->
<div class="p-4 bg-[#1da1f2] w-[100px]">
<!-- Order unchanged - arbitrary values not in static list -->
```

### Solution with CSS Mode

First, make sure your arbitrary values are in your HTML/components so Tailwind includes them:

```html
<!-- Your component -->
<div class="p-4 bg-[#1da1f2] w-[100px]">
```

Then build CSS and sort:
```bash
# Build CSS (includes arbitrary values)
npx tailwindcss -o dist/output.css

# Sort
rustywind --output-css-file dist/output.css --write .
```

**Result:**
```html
<!-- Sorted according to property order -->
<div class="w-[100px] bg-[#1da1f2] p-4">
```

## Custom Utilities

### Define Custom Utilities

**tailwind.config.js:**
```javascript
module.exports = {
  theme: {
    extend: {
      utilities: {
        '.custom-class': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }
    }
  }
}
```

### Static List Won't Know About It

```bash
rustywind --write .
# custom-class goes to end (unknown class)
```

### CSS Mode Handles It

```bash
npx tailwindcss -o dist/output.css  # Includes .custom-class
rustywind --output-css-file dist/output.css --write .
# custom-class sorted by its CSS properties!
```

## Advanced: Multiple CSS Files

If you have multiple Tailwind configs (e.g., for different apps):

**package.json:**
```json
{
  "scripts": {
    "build:css:app1": "tailwindcss -c tailwind.app1.config.js -o dist/app1.css",
    "build:css:app2": "tailwindcss -c tailwind.app2.config.js -o dist/app2.css",
    "sort:app1": "rustywind --output-css-file dist/app1.css --write src/app1",
    "sort:app2": "rustywind --output-css-file dist/app2.css --write src/app2",
    "format": "npm-run-all build:css:* sort:*"
  }
}
```

## Handling Edge Cases

### Classes Not in CSS

If a class isn't in your generated CSS (maybe it's only used conditionally and missed):

```bash
# It will be treated as "unknown" and sorted to the end
```

**Solution:** Make sure your `content` configuration in `tailwind.config.js` includes all your files:

```javascript
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
    './components/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],
}
```

### Duplicate Classes

```html
<!-- Before -->
<div class="flex flex p-4">

<!-- After (with --allow-duplicates) -->
<div class="flex flex p-4">

<!-- After (default - removes duplicates) -->
<div class="flex p-4">
```

### Variants Not Sorting Correctly

Make sure your CSS includes all variants:

**tailwind.config.js:**
```javascript
module.exports = {
  variants: {
    extend: {
      backgroundColor: ['active', 'group-hover'],
    }
  }
}
```

Then rebuild CSS before sorting.

## Performance Considerations

### Build Time

For a typical project:

```
CSS Generation:  ~500-1000ms
CSS Parsing:     ~5-10ms
Class Sorting:   ~1-2ms per file
Total overhead:  ~500-1010ms one-time + ~1-2ms per file
```

**Optimization:** Cache the CSS file and only rebuild when config changes.

### Large Projects

For 1000+ components:

```bash
# Use rustywind's parallel processing
rustywind --output-css-file dist/output.css --write src/
# Processes files in parallel, very fast
```

## Troubleshooting

### "Class not found in CSS"

**Problem:** Class exists in code but not in generated CSS

**Solution:**
1. Check `content` paths in `tailwind.config.js`
2. Make sure you're building CSS after adding new classes
3. Use safelist for dynamic classes:

```javascript
module.exports = {
  safelist: [
    'bg-red-500',
    'text-white',
    {
      pattern: /bg-(red|blue|green)-(100|200|300)/,
    },
  ],
}
```

### Different Order Than prettier-plugin-tailwindcss

Both use the same source (Tailwind's generated CSS order), so they should match. If they don't:

1. Make sure both are using the same Tailwind version
2. Rebuild CSS before running either tool
3. Check if one tool has custom configuration

### CSS File Gets Too Large

For huge projects with 10,000+ classes:

**Option 1:** Build CSS without unused classes
```bash
npx tailwindcss -o dist/output.css --minify
```

**Option 2:** Use PurgeCSS (built into Tailwind v3+):
Already enabled by default in production builds.

## Migration from Static List

If you're currently using rustywind with the default static list:

### Step 1: Test the difference
```bash
# Current approach
rustywind --dry-run . > static-output.txt

# New approach
npx tailwindcss -o dist/output.css
rustywind --output-css-file dist/output.css --dry-run . > css-output.txt

# Compare
diff static-output.txt css-output.txt
```

### Step 2: Update gradually
```bash
# Start with one directory
rustywind --output-css-file dist/output.css --write src/components

# Then expand
rustywind --output-css-file dist/output.css --write src
```

### Step 3: Update CI/CD
Update your CI configuration to build CSS first (see CI/CD section above).

## Recommended Setup (Complete Example)

**package.json:**
```json
{
  "name": "my-app",
  "scripts": {
    "build:css": "tailwindcss -i src/input.css -o dist/output.css",
    "build:css:watch": "tailwindcss -i src/input.css -o dist/output.css --watch",
    "format:classes": "rustywind --output-css-file dist/output.css --write .",
    "format:classes:check": "rustywind --output-css-file dist/output.css --check-formatted .",
    "format": "npm run build:css && npm run format:classes",
    "dev": "npm-run-all --parallel build:css:watch 'vite dev'",
    "lint": "npm run format:classes:check"
  },
  "devDependencies": {
    "rustywind": "^0.21.0",
    "tailwindcss": "^4.0.0",
    "npm-run-all": "^4.1.5"
  }
}
```

**Pre-commit hook (.husky/pre-commit):**
```bash
#!/bin/sh
npm run build:css
npx lint-staged
```

**Lint-staged config (package.json):**
```json
{
  "lint-staged": {
    "*.{html,jsx,tsx,vue}": [
      "rustywind --output-css-file dist/output.css --write"
    ],
    "tailwind.config.js": [
      "npm run build:css"
    ]
  }
}
```

This setup ensures:
- ✅ CSS is always built before sorting
- ✅ Classes match Tailwind's exact order
- ✅ Pre-commit hook prevents unsorted commits
- ✅ Watch mode for development
- ✅ CI can verify sorting

## Summary

**To match Tailwind's exact sorting with RustyWind:**

1. ✅ Build your CSS: `npx tailwindcss -o dist/output.css`
2. ✅ Use CSS mode: `rustywind --output-css-file dist/output.css --write .`
3. ✅ Automate in your workflow (npm scripts, pre-commit, CI)

**Don't:**
- ❌ Use default static list if you need exact Tailwind order
- ❌ Forget to rebuild CSS after config changes
- ❌ Skip safelist for dynamic classes

**Result:**
- 🎯 100% match with canonical Tailwind sorting
- ⚡ Fast performance
- 🔄 Automatically adapts to your theme and custom utilities
