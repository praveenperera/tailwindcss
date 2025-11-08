/**
 * Test to verify that Tailwind outputs CSS in the same order as getClassOrder()
 *
 * Run with: node prettier-class-order-research/test-css-order.js
 */

const { __unstable__loadDesignSystem } = require('./packages/tailwindcss/dist/index.cjs')
const { compileCandidates } = require('./packages/tailwindcss/dist/compile.cjs')

async function test() {
  // Create a simple design system
  const designSystem = await __unstable__loadDesignSystem(`
    @theme {
      --spacing-1: 0.25rem;
      --spacing-2: 0.5rem;
      --spacing-3: 0.75rem;
      --spacing-4: 1rem;
      --color-red-500: #ef4444;
      --color-blue-500: #3b82f6;
    }
  `)

  // Test classes in random order
  const testClasses = [
    'px-3',
    'bg-red-500',
    'py-4',
    'hover:bg-blue-500',
    'text-white',
    'm-2'
  ]

  console.log('Input classes (random order):')
  console.log(testClasses.join(' '))
  console.log()

  // Method 1: Get sorting order via getClassOrder()
  const classOrder = designSystem.getClassOrder(testClasses)
  console.log('getClassOrder() results:')
  classOrder.forEach(([className, order]) => {
    console.log(`  ${className.padEnd(20)} → ${order}`)
  })
  console.log()

  // Sort by the order
  const sortedByAPI = [...classOrder]
    .sort(([, a], [, b]) => {
      if (a === b) return 0
      if (a === null) return 1
      if (b === null) return -1
      return Number(a - b)
    })
    .map(([className]) => className)

  console.log('Classes sorted by getClassOrder():')
  console.log(sortedByAPI.join(' '))
  console.log()

  // Method 2: Compile to AST (what CSS generation does)
  const { astNodes, nodeSorting } = compileCandidates(testClasses, designSystem)

  console.log('compileCandidates() AST order:')
  astNodes.forEach((node, idx) => {
    const info = nodeSorting.get(node)
    if (info) {
      console.log(`  [${idx}] ${info.candidate.padEnd(20)} (properties: [${info.properties.order.join(',')}])`)
    }
  })
  console.log()

  // Extract classes in AST order (this is what CSS file order would be)
  const sortedByAST = []
  for (const node of astNodes) {
    const info = nodeSorting.get(node)
    if (info && !sortedByAST.includes(info.candidate)) {
      sortedByAST.push(info.candidate)
    }
  }

  console.log('Classes in AST order (= CSS file order):')
  console.log(sortedByAST.join(' '))
  console.log()

  // Verify they match
  const apiOrder = sortedByAPI.join(' ')
  const astOrder = sortedByAST.join(' ')

  console.log('VERIFICATION:')
  console.log(`  API order: ${apiOrder}`)
  console.log(`  AST order: ${astOrder}`)
  console.log(`  Match: ${apiOrder === astOrder ? '✅ YES' : '❌ NO'}`)

  if (apiOrder === astOrder) {
    console.log()
    console.log('✅ CONFIRMED: Tailwind outputs CSS in the same order as getClassOrder()')
  } else {
    console.log()
    console.log('❌ ERROR: Orders do not match!')
    process.exit(1)
  }
}

test().catch(console.error)
