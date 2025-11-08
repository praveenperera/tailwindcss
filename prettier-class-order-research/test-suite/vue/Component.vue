<template>
  <!-- Test 1: Basic Vue component -->
  <div class="p-4 bg-red-500 m-2 text-white flex">
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
    <p class="text-sm leading-relaxed">{{ description }}</p>
  </div>

  <!-- Test 2: Dynamic classes -->
  <div :class="['p-4', isActive ? 'bg-blue-500' : 'bg-gray-500', 'flex', 'items-center']">
    Dynamic classes
  </div>

  <!-- Test 3: Object syntax -->
  <div :class="{
    'p-4': true,
    'bg-blue-500': isActive,
    'bg-gray-500': !isActive,
    'flex': true,
    'items-center': true,
    'md:grid': isLargeScreen,
    'lg:block': isXLargeScreen
  }">
    Object syntax
  </div>

  <!-- Test 4: Computed classes -->
  <button
    :class="buttonClasses"
    @click="handleClick"
  >
    {{ label }}
  </button>

  <!-- Test 5: Scoped slots -->
  <div class="bg-white rounded-lg shadow-md p-6">
    <slot name="header" :classes="headerClasses" />
    <slot :classes="contentClasses" />
  </div>

  <!-- Test 6: v-for with classes -->
  <ul class="space-y-2 p-4">
    <li
      v-for="item in items"
      :key="item.id"
      class="p-2 hover:bg-gray-50 rounded border border-gray-200"
    >
      {{ item.name }}
    </li>
  </ul>

  <!-- Test 7: Conditional rendering -->
  <div v-if="showContent" class="p-6 bg-gray-100 rounded-lg">
    <p class="text-gray-700">Conditional content</p>
  </div>

  <!-- Test 8: Transition -->
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="p-4 bg-green-500 text-white rounded">
      Transition content
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Item {
  id: number;
  name: string;
}

const props = defineProps<{
  title: string;
  description: string;
  variant?: 'primary' | 'secondary';
}>();

const isActive = ref(false);
const isLargeScreen = ref(false);
const isXLargeScreen = ref(false);
const showContent = ref(true);
const visible = ref(true);

const items = ref<Item[]>([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]);

const buttonClasses = computed(() => {
  const base = 'px-4 py-2 rounded font-semibold transition-colors';
  const variant = props.variant === 'primary'
    ? 'bg-blue-500 hover:bg-blue-600 text-white'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-900';
  return `${base} ${variant}`;
});

const headerClasses = computed(() => 'text-xl font-bold mb-4');
const contentClasses = computed(() => 'text-gray-600 leading-relaxed');

const label = computed(() => 'Click me');

function handleClick() {
  isActive.value = !isActive.value;
}
</script>

<style scoped>
/* Scoped styles */
</style>
