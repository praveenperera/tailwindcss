/**
 * Test to verify where variant classes appear in CSS output
 *
 * Question: Are flex and sm:flex next to each other in the CSS?
 * Or do all base classes come first, then all variants?
 */

const { __unstable__loadDesignSystem } = require('./packages/tailwindcss/dist/index.cjs')

async function test() {
  const designSystem = await __unstable__loadDesignSystem(`
    @theme {
      --breakpoint-sm: 640px;
      --breakpoint-md: 768px;
      --breakpoint-lg: 1024px;
      --spacing-0: 0;
      --spacing-4: 1rem;
      --spacing-8: 2rem;
    }
  `)

  // Test 1: Base class vs responsive variant
  console.log('Test 1: Base class vs responsive variant')
  console.log('=========================================')
  const test1 = ['sm:flex', 'flex', 'md:flex']
  const order1 = designSystem.getClassOrder(test1)

  console.log('Input:', test1)
  console.log('Order:')
  order1.forEach(([className, order]) => {
    console.log(`  ${className.padEnd(15)} → ${order}`)
  })

  const sorted1 = [...order1]
    .sort(([, a], [, b]) => {
      if (a === null) return 1
      if (b === null) return -1
      return Number(a - b)
    })
    .map(([c]) => c)

  console.log('Sorted:', sorted1.join(' '))
  console.log()

  // Test 2: Margin classes with responsive variants
  console.log('Test 2: Margin classes with responsive variants')
  console.log('===============================================')
  const test2 = ['md:mx-8', 'mx-0', 'sm:mx-4', 'mx-4']
  const order2 = designSystem.getClassOrder(test2)

  console.log('Input:', test2)
  console.log('Order:')
  order2.forEach(([className, order]) => {
    console.log(`  ${className.padEnd(15)} → ${order}`)
  })

  const sorted2 = [...order2]
    .sort(([, a], [, b]) => {
      if (a === null) return 1
      if (b === null) return -1
      return Number(a - b)
    })
    .map(([c]) => c)

  console.log('Sorted:', sorted2.join(' '))
  console.log()

  // Test 3: Pseudo-class variants (hover, focus)
  console.log('Test 3: Pseudo-class variants')
  console.log('==============================')
  const test3 = ['hover:flex', 'flex', 'focus:flex', 'active:flex']
  const order3 = designSystem.getClassOrder(test3)

  console.log('Input:', test3)
  console.log('Order:')
  order3.forEach(([className, order]) => {
    console.log(`  ${className.padEnd(15)} → ${order}`)
  })

  const sorted3 = [...order3]
    .sort(([, a], [, b]) => {
      if (a === null) return 1
      if (b === null) return -1
      return Number(a - b)
    })
    .map(([c]) => c)

  console.log('Sorted:', sorted3.join(' '))
  console.log()

  // Test 4: Mixed base and variants
  console.log('Test 4: Mixed base classes and variants')
  console.log('========================================')
  const test4 = [
    'grid',
    'sm:grid',
    'flex',
    'md:flex',
    'block',
    'lg:block',
    'hidden',
    'hover:hidden'
  ]
  const order4 = designSystem.getClassOrder(test4)

  console.log('Input:', test4)
  console.log('Order:')
  order4.forEach(([className, order]) => {
    console.log(`  ${className.padEnd(15)} → ${order}`)
  })

  const sorted4 = [...order4]
    .sort(([, a], [, b]) => {
      if (a === null) return 1
      if (b === null) return -1
      return Number(a - b)
    })
    .map(([c]) => c)

  console.log('Sorted:', sorted4.join(' '))
  console.log()

  // Analysis
  console.log('ANALYSIS')
  console.log('========')

  // Check if base classes come before variants
  const hasBaseBefore = sorted4.indexOf('flex') < sorted4.indexOf('sm:grid')
  const hasAllBasesFirst =
    sorted4.indexOf('block') < sorted4.indexOf('sm:grid') &&
    sorted4.indexOf('flex') < sorted4.indexOf('md:flex') &&
    sorted4.indexOf('hidden') < sorted4.indexOf('hover:hidden')

  console.log(`Base classes come before variants: ${hasAllBasesFirst ? '✅ YES' : '❌ NO'}`)

  if (hasAllBasesFirst) {
    console.log()
    console.log('Conclusion: Tailwind CSS outputs in this order:')
    console.log('  1. All base classes (sorted by property)')
    console.log('  2. All variant classes (sorted by variant, then property)')
    console.log()
    console.log('This means:')
    console.log('  - flex and sm:flex are NOT next to each other')
    console.log('  - mx-0 and md:mx-8 are NOT next to each other')
    console.log('  - All non-variant classes come first, then all variants')
  }
}

test().catch(console.error)
