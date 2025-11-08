<script lang="ts">
  export let title: string = 'Svelte Component';
  export let variant: 'primary' | 'secondary' = 'primary';

  let isActive = false;
  let count = 0;

  $: buttonClasses = [
    'px-4',
    'py-2',
    'rounded',
    'font-semibold',
    'transition-colors',
    variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
  ].join(' ');

  function handleClick() {
    isActive = !isActive;
    count += 1;
  }
</script>

<!-- Test 1: Basic Svelte classes -->
<div class="p-4 bg-red-500 m-2 text-white flex">
  <h1 class="text-2xl font-bold mb-4">{title}</h1>
</div>

<!-- Test 2: Conditional classes -->
<div class:bg-blue-500={isActive} class:bg-gray-500={!isActive} class="p-4 flex items-center">
  Conditional: {isActive ? 'Active' : 'Inactive'}
</div>

<!-- Test 3: Dynamic classes with reactive statement -->
<button class={buttonClasses} on:click={handleClick}>
  Clicked {count} times
</button>

<!-- Test 4: Slot with classes -->
<div class="bg-white rounded-lg shadow-md p-6">
  <slot name="header" class="text-xl font-bold mb-4" />
  <slot class="text-gray-600 leading-relaxed" />
</div>

<!-- Test 5: Each block -->
{#each [1, 2, 3] as item}
  <div class="p-2 hover:bg-gray-50 rounded border border-gray-200 mb-2">
    Item {item}
  </div>
{/each}

<!-- Test 6: If/else blocks -->
{#if isActive}
  <div class="p-6 bg-green-100 border border-green-300 rounded-lg">
    <p class="text-green-800 font-medium">Active state</p>
  </div>
{:else}
  <div class="p-6 bg-gray-100 border border-gray-300 rounded-lg">
    <p class="text-gray-800">Inactive state</p>
  </div>
{/if}

<!-- Test 7: Await block -->
{#await Promise.resolve({ data: 'loaded' })}
  <div class="p-4 bg-yellow-100 text-yellow-800 rounded">
    Loading...
  </div>
{:then result}
  <div class="p-4 bg-green-100 text-green-800 rounded">
    {result.data}
  </div>
{:catch error}
  <div class="p-4 bg-red-100 text-red-800 rounded">
    Error: {error.message}
  </div>
{/await}

<!-- Test 8: Complex responsive layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
  <div class="bg-gray-100 p-4 rounded hover:shadow-lg transition-shadow">
    Card 1
  </div>
  <div class="bg-gray-200 p-4 rounded hover:shadow-lg transition-shadow">
    Card 2
  </div>
  <div class="bg-gray-300 p-4 rounded hover:shadow-lg transition-shadow">
    Card 3
  </div>
</div>

<!-- Test 9: Form elements -->
<form class="space-y-4 max-w-lg mx-auto p-6">
  <input
    type="text"
    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter text"
  />

  <button
    type="submit"
    class="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
  >
    Submit
  </button>
</form>

<!-- Test 10: Arbitrary values -->
<div class="bg-[#1da1f2] w-[100px] h-[50px] m-[10px] p-[2rem] rounded-[12px]">
  Arbitrary values
</div>

<style>
  /* Scoped styles */
</style>
