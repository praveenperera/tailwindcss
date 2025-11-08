# Research Plan: Prettier Plugin Class Ordering for Tailwind CSS

**Session ID:** 011CUvKHNdhS77igNg64EwfD
**Date:** 2025-11-08
**Research Question:** How is the order of classes determined for the prettier plugin that sorts classes?

## Objectives

1. **Understand the core sorting mechanism** used by Tailwind CSS to determine class order
2. **Identify the key files and functions** responsible for class ordering
3. **Document the relationship** between the prettier plugin and Tailwind's core sorting logic
4. **Explain the role of property-order.ts** in determining sort priority
5. **Provide examples** demonstrating how different classes are sorted

## Research Methodology

### Phase 1: Repository Exploration
- Search for prettier-related files and sorting functionality
- Identify key source files in the Tailwind CSS codebase
- Locate test files that demonstrate sorting behavior

### Phase 2: Code Analysis
- Read and analyze `sort.ts` - the main sorting API
- Study `property-order.ts` - the ordered list of CSS properties
- Examine `compile.ts` - the compilation and property sorting logic
- Review `design-system.ts` - the public API for class ordering
- Analyze test cases in `sort.test.ts`

### Phase 3: External Research
- Research the prettier-plugin-tailwindcss repository
- Understand how the plugin integrates with Tailwind's sorting API
- Document the relationship between the plugin and core library

### Phase 4: Documentation
- Create comprehensive documentation of findings
- Include code examples and file references
- Explain the complete sorting algorithm
- Document special cases and edge behaviors

## Deliverables

1. **Technical Analysis Document** (`README.md` in research directory)
   - Complete explanation of the sorting mechanism
   - Key file locations and their purposes
   - Code examples demonstrating sorting behavior
   - Algorithm breakdown

2. **Property Order Documentation**
   - Detailed explanation of property-order.ts
   - How CSS properties map to class ordering
   - Examples of property precedence

3. **Integration Guide**
   - How prettier-plugin-tailwindcss uses the sorting API
   - The relationship between getClassOrder and the plugin
   - Configuration and customization options

## Key Files Identified

- `packages/tailwindcss/src/sort.ts` - Main sorting API
- `packages/tailwindcss/src/property-order.ts` - CSS property ordering
- `packages/tailwindcss/src/compile.ts` - Compilation and property sorting
- `packages/tailwindcss/src/design-system.ts` - Design system API
- `packages/tailwindcss/src/sort.test.ts` - Test cases

## Research Constraints

- The prettier plugin itself is in a separate repository (tailwindlabs/prettier-plugin-tailwindcss)
- Focus on the core Tailwind CSS sorting mechanism in this repository
- Document how the plugin would integrate with this core functionality
