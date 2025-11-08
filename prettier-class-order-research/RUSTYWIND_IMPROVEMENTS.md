# Recommendations for RustyWind Improvements

**Research Session:** 011CUvKHNdhS77igNg64EwfD
**Date:** 2025-11-08

## Part 1: Auto-Discovery of CSS Files

### The Problem

Currently users must explicitly specify `--output-css-file`:
```bash
rustywind --output-css-file dist/output.css --write .
```

This is cumbersome. RustyWind should be able to find the CSS file automatically.

### Proposed Solution: Smart Auto-Discovery

```rust
// Proposed workflow
fn find_tailwind_css() -> Option<PathBuf> {
    // Try multiple strategies in order of confidence

    1. Check for explicit config
    2. Look for common output paths
    3. Parse tailwind.config.js
    4. Parse package.json scripts
    5. Check bundler output directories
    6. Verify found file is valid Tailwind CSS
    7. Fall back to static list
}
```

### Strategy 1: Common Output Paths (Fast)

Check these locations in order:

```rust
const COMMON_PATHS: &[&str] = &[
    // Production builds
    "dist/output.css",
    "dist/tailwind.css",
    "build/output.css",
    "build/tailwind.css",
    "public/build/tailwind.css",

    // Development
    "src/output.css",
    "src/styles/output.css",
    "styles/output.css",

    // Framework-specific
    ".next/static/css/*.css",           // Next.js
    "dist/assets/*.css",                // Vite
    "public/assets/*.css",              // Rails/Laravel

    // Node modules (watch mode)
    "node_modules/.cache/tailwindcss/*.css",
];

fn check_common_paths() -> Option<PathBuf> {
    for pattern in COMMON_PATHS {
        if let Some(path) = glob(pattern).next() {
            if is_valid_tailwind_css(&path) {
                return Some(path);
            }
        }
    }
    None
}
```

### Strategy 2: Parse tailwind.config.js

Many configs don't specify output, but some do:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js}'],
  // Some users might have custom build config
  build: {
    output: './dist/tailwind.css'
  }
}
```

**Implementation:**
```rust
fn parse_tailwind_config() -> Option<PathBuf> {
    let config_paths = vec![
        "tailwind.config.js",
        "tailwind.config.ts",
        "tailwind.config.mjs",
        "tailwind.config.cjs",
    ];

    for config_path in config_paths {
        if let Ok(content) = fs::read_to_string(config_path) {
            // Simple regex parsing (don't need full JS parser)
            // Look for common patterns:
            // - output: './path/to/css'
            // - outfile: './path/to/css'
            if let Some(output) = extract_output_path(&content) {
                return Some(output);
            }
        }
    }
    None
}
```

### Strategy 3: Parse package.json Scripts

Most projects have a build script that includes the output path:

```json
{
  "scripts": {
    "build:css": "tailwindcss -i src/input.css -o dist/output.css",
    "build": "npm run build:css && vite build"
  }
}
```

**Implementation:**
```rust
fn parse_package_json_scripts() -> Option<PathBuf> {
    let package_json = fs::read_to_string("package.json").ok()?;
    let json: serde_json::Value = serde_json::from_str(&package_json).ok()?;

    let scripts = json.get("scripts")?.as_object()?;

    // Look for scripts that run tailwindcss CLI
    for (_name, command) in scripts {
        let cmd = command.as_str()?;

        // Match patterns like:
        // - "tailwindcss -o dist/output.css"
        // - "tailwindcss --output dist/output.css"
        // - "@tailwindcss/cli -o dist/output.css"
        if let Some(output) = extract_tailwind_output_from_command(cmd) {
            if Path::new(&output).exists() {
                return Some(PathBuf::from(output));
            }
        }
    }
    None
}

fn extract_tailwind_output_from_command(cmd: &str) -> Option<String> {
    // Regex: tailwindcss.*(?:-o|--output)\s+([^\s]+)
    let re = Regex::new(r"tailwindcss.*(?:-o|--output)\s+([^\s]+)").ok()?;
    let captures = re.captures(cmd)?;
    Some(captures[1].to_string())
}
```

### Strategy 4: Check Bundler Output

Different bundlers have different output patterns:

```rust
fn check_bundler_outputs() -> Option<PathBuf> {
    // Vite: Usually dist/assets/*.css
    if Path::new("vite.config.js").exists() || Path::new("vite.config.ts").exists() {
        if let Some(css) = find_latest_css_in_dir("dist/assets") {
            if is_valid_tailwind_css(&css) {
                return Some(css);
            }
        }
    }

    // Next.js: .next/static/css/*.css
    if Path::new("next.config.js").exists() || Path::new("next.config.mjs").exists() {
        if let Some(css) = find_latest_css_in_dir(".next/static/css") {
            if is_valid_tailwind_css(&css) {
                return Some(css);
            }
        }
    }

    // Webpack: Usually dist/ or build/
    if Path::new("webpack.config.js").exists() {
        for dir in &["dist", "build", "public"] {
            if let Some(css) = find_latest_css_in_dir(dir) {
                if is_valid_tailwind_css(&css) {
                    return Some(css);
                }
            }
        }
    }

    None
}

fn find_latest_css_in_dir(dir: &str) -> Option<PathBuf> {
    // Find the most recently modified CSS file
    let entries = glob(&format!("{}/**/*.css", dir)).ok()?;

    entries
        .filter_map(Result::ok)
        .max_by_key(|path| {
            fs::metadata(path)
                .and_then(|m| m.modified())
                .unwrap_or(SystemTime::UNIX_EPOCH)
        })
}
```

### Strategy 5: Verify It's Valid Tailwind CSS

Before using a file, verify it actually contains Tailwind classes:

```rust
fn is_valid_tailwind_css(path: &Path) -> bool {
    let content = fs::read_to_string(path).ok()?;

    // Check for Tailwind-specific markers
    let markers = [
        // Utility classes
        r"\.container\s*\{",
        r"\.flex\s*\{",
        r"\.grid\s*\{",

        // Tailwind CSS variables
        r"--tw-",

        // Common Tailwind patterns
        r"\.[a-z]+-\[",  // Arbitrary values like .bg-[#fff]
        r"\.hover\\:",   // Pseudo-class variants

        // v4 specific
        r"@theme",
    ];

    // Must match at least 3 markers to be confident
    let matches = markers.iter()
        .filter(|&pattern| Regex::new(pattern).unwrap().is_match(&content))
        .count();

    matches >= 3
}
```

### Complete Auto-Discovery Implementation

```rust
pub struct CssDiscovery {
    pub path: Option<PathBuf>,
    pub strategy: DiscoveryStrategy,
    pub confidence: Confidence,
}

pub enum DiscoveryStrategy {
    ExplicitFlag,      // User provided --output-css-file
    CommonPath,        // Found in common location
    TailwindConfig,    // Parsed from tailwind.config.js
    PackageJson,       // Parsed from package.json scripts
    Bundler,           // Found in bundler output
    StaticFallback,    // Using static list as fallback
}

pub enum Confidence {
    High,    // Very confident this is the right file
    Medium,  // Probably right, but warn user
    Low,     // Fallback, warn user
}

pub fn discover_tailwind_css() -> CssDiscovery {
    // 1. Common paths (fast check)
    if let Some(path) = check_common_paths() {
        return CssDiscovery {
            path: Some(path),
            strategy: DiscoveryStrategy::CommonPath,
            confidence: Confidence::High,
        };
    }

    // 2. package.json (most reliable if present)
    if let Some(path) = parse_package_json_scripts() {
        return CssDiscovery {
            path: Some(path),
            strategy: DiscoveryStrategy::PackageJson,
            confidence: Confidence::High,
        };
    }

    // 3. Bundler detection
    if let Some(path) = check_bundler_outputs() {
        return CssDiscovery {
            path: Some(path),
            strategy: DiscoveryStrategy::Bundler,
            confidence: Confidence::Medium,
        };
    }

    // 4. Tailwind config
    if let Some(path) = parse_tailwind_config() {
        return CssDiscovery {
            path: Some(path),
            strategy: DiscoveryStrategy::TailwindConfig,
            confidence: Confidence::Medium,
        };
    }

    // 5. Fallback to static list
    CssDiscovery {
        path: None,
        strategy: DiscoveryStrategy::StaticFallback,
        confidence: Confidence::Low,
    }
}
```

### User Experience

```bash
# Without any flags (auto-discovery)
$ rustywind --write .
✓ Found Tailwind CSS at dist/output.css (from package.json)
✓ Sorted 42 files

# If uncertain
$ rustywind --write .
⚠ Found possible Tailwind CSS at dist/assets/index-abc123.css
⚠ Confidence: Medium (from bundler output)
⚠ Use --output-css-file to specify manually
✓ Sorted 42 files

# If nothing found
$ rustywind --write .
⚠ No Tailwind CSS file found
⚠ Using static class list (may not match your exact Tailwind version)
⚠ For accurate sorting, specify CSS file: --output-css-file <path>
✓ Sorted 42 files

# Verbose mode shows the search
$ rustywind --write . --verbose
Searching for Tailwind CSS...
  ✗ Common paths: Not found
  ✓ package.json: Found output path in build:css script
  → Using: dist/output.css
  ✓ Verified: Valid Tailwind CSS (12 markers)
✓ Sorted 42 files
```

### Caching

Cache the discovered path to avoid re-scanning:

```rust
// .rustywind-cache.json
{
  "css_path": "dist/output.css",
  "strategy": "PackageJson",
  "last_check": "2025-11-08T12:00:00Z",
  "file_mtime": "2025-11-08T11:45:00Z"
}

// Re-check if:
// - Cache is older than 1 hour
// - CSS file was modified
// - package.json was modified
```

---

## Part 2: Improving the Static List

### Current Problems

The current static list (`defaults.rs`, 5032 lines):
1. **Arbitrary order** - Not based on property order
2. **Exploded values** - Lists `inset-0`, `inset-1`, `inset-2`, ... individually
3. **Gets outdated** - Tailwind adds utilities, list doesn't update
4. **No arbitrary values** - Can't handle `bg-[#fff]` or `w-[100px]`
5. **No theme awareness** - Can't handle custom values

### Solution 1: Generate from Tailwind Source

**Goal:** Create a tool that generates the static list from Tailwind's `property-order.ts`

```typescript
// generate-static-list.ts
import PROPERTY_ORDER from './packages/tailwindcss/src/property-order.ts'

// Map utility patterns to CSS properties
const UTILITY_TO_PROPERTIES = {
  // Layout
  'container': ['container-type'],
  'block': ['display'],
  'inline-block': ['display'],
  'flex': ['display'],
  'grid': ['display'],
  'hidden': ['display'],

  // Positioning
  'static': ['position'],
  'fixed': ['position'],
  'absolute': ['position'],
  'relative': ['position'],
  'sticky': ['position'],

  // Inset (all use same properties)
  'inset-*': ['inset'],
  'inset-x-*': ['inset-inline'],
  'inset-y-*': ['inset-block'],
  'top-*': ['top'],
  'right-*': ['right'],
  'bottom-*': ['bottom'],
  'left-*': ['left'],

  // Margins
  'm-*': ['margin'],
  'mx-*': ['margin-inline'],
  'my-*': ['margin-block'],
  'mt-*': ['margin-top'],
  'mr-*': ['margin-right'],
  'mb-*': ['margin-bottom'],
  'ml-*': ['margin-left'],

  // ... continue for all utilities
}

function generateStaticList() {
  const classOrder = []

  for (const [pattern, properties] of Object.entries(UTILITY_TO_PROPERTIES)) {
    const propertyIndex = PROPERTY_ORDER.indexOf(properties[0])

    if (pattern.includes('*')) {
      // Generate common values for pattern utilities
      const base = pattern.replace('-*', '')
      const values = getCommonValues(base)

      for (const value of values) {
        classOrder.push({
          class: `${base}-${value}`,
          propertyIndex,
        })
      }
    } else {
      // Static utility
      classOrder.push({
        class: pattern,
        propertyIndex,
      })
    }
  }

  // Sort by property index
  classOrder.sort((a, b) => a.propertyIndex - b.propertyIndex)

  // Output Rust code
  return classOrder.map((item, idx) => `"${item.class}"`).join(',\n        ')
}

function getCommonValues(utility) {
  // Common spacing values
  if (['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'].includes(utility)) {
    return ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96', 'auto']
  }

  // Common sizing values
  if (['w', 'h', 'min-w', 'max-w', 'min-h', 'max-h'].includes(utility)) {
    return ['0', 'px', '0.5', '1', /* ... */, 'full', 'screen', 'min', 'max', 'fit']
  }

  // Color utilities
  if (['bg', 'text', 'border'].includes(utility)) {
    // Generate for common colors: red-500, blue-500, etc.
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray']
    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
    return colors.flatMap(color => shades.map(shade => `${color}-${shade}`))
  }

  return []
}
```

**Output (generated defaults.rs):**
```rust
// GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from Tailwind CSS property-order.ts
// Generator: generate-static-list.ts
// Date: 2025-11-08

pub static SORTER: Lazy<HashMap<String, usize>> = Lazy::new(|| {
    vec![
        // Container (property: container-type, index: 0)
        "container",

        // Display (property: display, index: 47)
        "block",
        "inline-block",
        "inline",
        "flex",
        "inline-flex",
        "grid",
        // ...

        // Margins (property: margin, index: 37)
        "m-0",
        "m-0.5",
        // ...

        // Background (property: background-color, index: 224)
        "bg-red-500",
        "bg-blue-500",
        // ...
    ]
    .into_iter()
    .enumerate()
    .map(|(i, class)| (class.to_string(), i))
    .collect()
});
```

### Solution 2: Pattern-Based Sorting (Better!)

Instead of listing every class, use pattern matching:

```rust
// Much smaller, more maintainable
pub struct PropertyBasedSorter {
    // Map property names to their order
    property_order: Vec<&'static str>,
}

impl PropertyBasedSorter {
    pub fn get_sort_index(&self, class: &str) -> Option<usize> {
        // Extract base utility and value
        let (utility, _value) = parse_utility(class)?;

        // Map utility to property
        let property = match utility {
            "container" => "container-type",
            "block" | "inline-block" | "flex" | "grid" | "hidden" => "display",
            "static" | "fixed" | "absolute" | "relative" | "sticky" => "position",

            // Inset properties
            "inset" => "inset",
            "inset-x" => "inset-inline",
            "inset-y" => "inset-block",
            "top" => "top",
            "right" => "right",
            "bottom" => "bottom",
            "left" => "left",

            // Margins (map to property based on direction)
            "m" => "margin",
            "mx" => "margin-inline",
            "my" => "margin-block",
            "mt" => "margin-top",
            "mr" => "margin-right",
            "mb" => "margin-bottom",
            "ml" => "margin-left",

            // Padding
            "p" => "padding",
            "px" => "padding-left",  // Use first property
            "py" => "padding-top",
            "pt" => "padding-top",
            "pr" => "padding-right",
            "pb" => "padding-bottom",
            "pl" => "padding-left",

            // Background
            "bg" => "background-color",

            // Text
            "text" if _value.contains("center") || _value.contains("left") => "text-align",
            "text" => "color",  // text-red-500

            _ => return None,
        };

        // Look up property in order list
        self.property_order.iter().position(|&p| p == property)
    }
}

fn parse_utility(class: &str) -> Option<(&str, &str)> {
    // Handle variants: "hover:bg-red-500" -> "bg-red-500"
    let class = class.rsplit(':').next()?;

    // Handle important: "bg-red-500!" -> "bg-red-500"
    let class = class.trim_end_matches('!');

    // Split into utility and value
    // "bg-red-500" -> ("bg", "red-500")
    // "m-4" -> ("m", "4")
    // "inset-x-0" -> ("inset-x", "0")

    let parts: Vec<&str> = class.split('-').collect();

    // Try multi-part utilities first
    if parts.len() >= 3 {
        let two_part = format!("{}-{}", parts[0], parts[1]);
        if MULTI_PART_UTILITIES.contains(&two_part.as_str()) {
            let value = parts[2..].join("-");
            return Some((two_part, value));
        }
    }

    // Single-part utility
    if parts.len() >= 2 {
        let value = parts[1..].join("-");
        return Some((parts[0], value));
    }

    // No value (e.g., "container", "flex")
    Some((class, ""))
}

const MULTI_PART_UTILITIES: &[&str] = &[
    "inset-x", "inset-y",
    "space-x", "space-y",
    // ...
];
```

**Advantages:**
- ✅ Much smaller (~500 lines vs 5000 lines)
- ✅ Handles arbitrary values: `m-[10px]` -> maps to `margin`
- ✅ Property-based (matches Tailwind)
- ✅ Easier to maintain
- ✅ Handles custom theme values automatically

**Trade-offs:**
- ⚠️ Slightly slower (pattern matching vs HashMap lookup)
- ⚠️ More complex implementation
- ⚠️ May not handle very custom/weird utilities

### Solution 3: Hybrid Approach (Recommended!)

Combine both: small static list + pattern matching:

```rust
pub struct HybridSorter {
    // Fast path: HashMap for common classes
    static_map: HashMap<&'static str, usize>,

    // Slow path: Pattern matching for everything else
    pattern_sorter: PropertyBasedSorter,
}

impl HybridSorter {
    pub fn get_sort_index(&self, class: &str) -> Option<usize> {
        // Try fast path first
        if let Some(&index) = self.static_map.get(class) {
            return Some(index);
        }

        // Fall back to pattern matching
        self.pattern_sorter.get_sort_index(class)
    }
}

// Static map has only ~300 most common classes
const COMMON_CLASSES: &[&str] = &[
    "container", "flex", "grid", "block", "hidden",
    "static", "fixed", "absolute", "relative",
    "m-0", "m-1", "m-2", "m-3", "m-4", "m-5", "m-6", "m-8",
    "p-0", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8",
    "bg-white", "bg-black", "bg-gray-100", "bg-red-500",
    // ... ~300 total
];
```

**Advantages:**
- ✅ Fast for common classes (HashMap)
- ✅ Works for arbitrary values (pattern matching)
- ✅ Much smaller than current list
- ✅ Best of both worlds

### Comparison

| Approach | Size (lines) | Handles Arbitrary | Accuracy | Speed | Maintenance |
|----------|-------------|-------------------|----------|-------|-------------|
| **Current Static List** | 5032 | ❌ No | ~80% | Very Fast | Manual |
| **Generated Static List** | 3000-4000 | ❌ No | ~95% | Very Fast | Auto-generate |
| **Pattern-Based** | ~500 | ✅ Yes | ~98% | Fast | Easy |
| **Hybrid** | ~800 | ✅ Yes | ~99% | Very Fast | Easy |

### Recommendation

**Implement Hybrid Approach:**

1. **Phase 1:** Create pattern-based sorter
   - Maps utilities to properties
   - Uses Tailwind's property-order
   - Handles arbitrary values

2. **Phase 2:** Add static cache for top 300 classes
   - Profile real-world usage
   - Cache the most common
   - Fast path for 90% of use cases

3. **Phase 3:** Auto-generate the static cache
   - Tool that generates from Tailwind source
   - Runs as build step
   - Always up-to-date

---

## Implementation Roadmap

### Auto-Discovery
```
✅ Phase 1: Common paths (1 day)
✅ Phase 2: package.json parsing (1 day)
✅ Phase 3: Bundler detection (2 days)
✅ Phase 4: Verification logic (1 day)
✅ Phase 5: Caching (1 day)
Total: ~1 week
```

### Better Static List
```
✅ Phase 1: Pattern-based sorter (3 days)
✅ Phase 2: Hybrid with cache (2 days)
✅ Phase 3: Generator tool (2 days)
✅ Phase 4: Testing & benchmarks (2 days)
Total: ~1.5 weeks
```

### Combined Timeline
```
Week 1: Auto-discovery + pattern sorter
Week 2: Hybrid sorter + generator
Week 3: Testing, docs, release
```

---

## Example Usage After Improvements

```bash
# Just works - auto-discovers CSS
$ rustywind --write .
✓ Found Tailwind CSS at dist/output.css
✓ Using CSS-based sorting (100% accurate)
✓ Sorted 42 files

# No CSS file? Pattern-based fallback
$ rustywind --write .
⚠ No CSS file found, using pattern-based sorting
✓ Accuracy: ~98% (handles arbitrary values)
✓ For 100% accuracy: build CSS and re-run
✓ Sorted 42 files

# Show what's happening
$ rustywind --write . --verbose
Discovering Tailwind CSS...
  ✓ package.json: npm run build:css outputs to dist/output.css
  ✓ Verified: dist/output.css (modified 2min ago)
  ✓ Loaded 1,234 class definitions
Sorting...
  ✓ 42 files scanned
  ✓ 327 classes sorted
  ✓ 3 unknown classes (moved to end)
Done!
```

---

**Files to Create:**
1. Auto-discovery module: `rustywind-core/src/discovery.rs`
2. Pattern sorter: `rustywind-core/src/pattern_sorter.rs`
3. Generator tool: `rustywind-tools/generate-static-list`
4. Tests: `rustywind-core/tests/discovery_tests.rs`

**Pull Requests:**
1. PR #1: Auto-discovery of CSS files
2. PR #2: Pattern-based sorting
3. PR #3: Hybrid sorter with generator
