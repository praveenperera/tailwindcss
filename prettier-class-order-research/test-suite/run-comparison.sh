#!/bin/bash
set -e

# Test Suite: RustyWind vs Prettier Plugin Tailwindcss
# Compares sorting results to verify RustyWind matches canonical Tailwind sorting

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESULTS_DIR="$SCRIPT_DIR/results"
TEMP_DIR="$SCRIPT_DIR/temp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  RustyWind vs Prettier Plugin Tailwindcss Test Suite      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Clean and create directories
rm -rf "$RESULTS_DIR" "$TEMP_DIR"
mkdir -p "$RESULTS_DIR"/{prettier,rustywind,diffs}
mkdir -p "$TEMP_DIR"

# Step 1: Build Tailwind CSS
echo -e "${BLUE}Step 1: Building Tailwind CSS...${NC}"
if [ ! -f "$SCRIPT_DIR/dist/output.css" ]; then
    echo "  Creating minimal Tailwind config..."
    cat > "$TEMP_DIR/tailwind.config.js" << 'EOF'
module.exports = {
  content: ['./test-suite/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

    cat > "$TEMP_DIR/input.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

    cd "$SCRIPT_DIR/.."
    npx tailwindcss -i "$TEMP_DIR/input.css" -o "$SCRIPT_DIR/dist/output.css" --config "$TEMP_DIR/tailwind.config.js"
    echo -e "  ${GREEN}✓ Tailwind CSS built${NC}"
else
    echo -e "  ${GREEN}✓ Using existing Tailwind CSS${NC}"
fi

# Step 2: Run Prettier Plugin
echo -e "\n${BLUE}Step 2: Running prettier-plugin-tailwindcss...${NC}"

# Check if prettier-plugin-tailwindcss is installed
if ! npm list prettier-plugin-tailwindcss &> /dev/null; then
    echo "  Installing prettier-plugin-tailwindcss..."
    npm install -D prettier-plugin-tailwindcss
fi

# Create Prettier config
cat > "$TEMP_DIR/.prettierrc" << EOF
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "$SCRIPT_DIR/dist/output.css"
}
EOF

# Format each test file type
for dir in html jsx tsx vue svelte; do
    if [ -d "$SCRIPT_DIR/$dir" ]; then
        echo "  Formatting $dir files..."
        for file in "$SCRIPT_DIR/$dir"/*; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                npx prettier --config "$TEMP_DIR/.prettierrc" "$file" > "$RESULTS_DIR/prettier/${dir}_${filename}"
            fi
        done
    fi
done
echo -e "  ${GREEN}✓ Prettier formatting complete${NC}"

# Step 3: Run RustyWind
echo -e "\n${BLUE}Step 3: Running rustywind...${NC}"

# Check if rustywind is installed
if ! command -v rustywind &> /dev/null; then
    echo -e "  ${YELLOW}⚠ rustywind not found. Install with: cargo install rustywind${NC}"
    echo "  Skipping RustyWind comparison..."
else
    # Run rustywind with CSS file mode
    for dir in html jsx tsx vue svelte; do
        if [ -d "$SCRIPT_DIR/$dir" ]; then
            echo "  Processing $dir files..."
            for file in "$SCRIPT_DIR/$dir"/*; do
                if [ -f "$file" ]; then
                    filename=$(basename "$file")
                    # Copy original file to temp
                    cp "$file" "$TEMP_DIR/temp_$filename"
                    # Sort with rustywind
                    rustywind --output-css-file "$SCRIPT_DIR/dist/output.css" --write "$TEMP_DIR/temp_$filename"
                    # Save result
                    cp "$TEMP_DIR/temp_$filename" "$RESULTS_DIR/rustywind/${dir}_${filename}"
                fi
            done
        fi
    done
    echo -e "  ${GREEN}✓ RustyWind sorting complete${NC}"
fi

# Step 4: Compare results
echo -e "\n${BLUE}Step 4: Comparing results...${NC}"
echo ""

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

for prettier_file in "$RESULTS_DIR/prettier"/*; do
    if [ -f "$prettier_file" ]; then
        filename=$(basename "$prettier_file")
        rustywind_file="$RESULTS_DIR/rustywind/$filename"

        TOTAL_TESTS=$((TOTAL_TESTS + 1))

        if [ -f "$rustywind_file" ]; then
            if diff -q "$prettier_file" "$rustywind_file" > /dev/null; then
                echo -e "  ${GREEN}✓ PASS${NC} $filename"
                PASSED_TESTS=$((PASSED_TESTS + 1))
            else
                echo -e "  ${RED}✗ FAIL${NC} $filename"
                FAILED_TESTS=$((FAILED_TESTS + 1))

                # Generate diff
                diff -u "$prettier_file" "$rustywind_file" > "$RESULTS_DIR/diffs/$filename.diff" || true
                echo "    Diff saved to: results/diffs/$filename.diff"
            fi
        else
            echo -e "  ${YELLOW}⚠ SKIP${NC} $filename (RustyWind result not found)"
        fi
    fi
done

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                      Test Summary                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "  Total Tests:  $TOTAL_TESTS"
echo -e "  ${GREEN}Passed:       $PASSED_TESTS${NC}"
if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "  ${RED}Failed:       $FAILED_TESTS${NC}"
else
    echo -e "  Failed:       $FAILED_TESTS"
fi

if [ $FAILED_TESTS -eq 0 ] && [ $TOTAL_TESTS -gt 0 ]; then
    echo ""
    echo -e "  ${GREEN}★ All tests passed! RustyWind matches Prettier Plugin perfectly. ★${NC}"
    exit 0
else
    echo ""
    echo -e "  ${YELLOW}⚠ Some tests failed. Check diffs in results/diffs/${NC}"
    exit 1
fi
