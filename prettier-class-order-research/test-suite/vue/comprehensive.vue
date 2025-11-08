<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>

    <!-- LAYOUT - Display -->
    <div class="contents inline-grid grid inline-flex flex inline-block block inline hidden">
      All display values
    </div>

    <!-- LAYOUT - Position & Inset with negatives -->
    <div class="sticky relative absolute fixed static inset-96 inset-80 inset-72 inset-64 inset-56 inset-48 inset-40 inset-32 inset-24 inset-20 inset-16 inset-14 inset-12 inset-11 inset-10 inset-9 inset-8 inset-7 inset-6 inset-5 inset-4 inset-3.5 inset-3 inset-2.5 inset-2 inset-1.5 inset-1 inset-0.5 inset-0 inset-px inset-full inset-auto z-50 z-40 z-30 z-20 z-10 z-0 -z-10 -z-20 -z-30 -z-40 -z-50 z-auto">
      Position, inset, and z-index with negatives
    </div>

    <!-- FLEXBOX & GRID Combined -->
    <div class="flex-row-reverse flex-col-reverse flex-row flex-col flex-wrap-reverse flex-nowrap flex-wrap flex-none flex-auto flex-1 grow-0 grow shrink-0 shrink grid-cols-12 grid-cols-11 grid-cols-10 grid-cols-9 grid-cols-8 grid-cols-7 grid-cols-6 grid-cols-5 grid-cols-4 grid-cols-3 grid-cols-2 grid-cols-1 grid-cols-none grid-cols-subgrid grid-rows-12 grid-rows-6 grid-rows-5 grid-rows-4 grid-rows-3 grid-rows-2 grid-rows-1 grid-rows-none grid-rows-subgrid col-span-12 col-span-full col-span-auto col-start-13 col-start-auto col-end-13 col-end-auto row-span-6 row-span-full row-span-auto row-start-7 row-start-auto row-end-7 row-end-auto gap-96 gap-x-96 gap-y-96 gap-80 gap-72 gap-64">
      Flexbox and grid utilities
    </div>

    <!-- SPACING - All Margin & Padding with Negatives -->
    <div class="m-96 m-80 m-72 m-64 m-56 m-52 m-48 m-44 m-40 m-36 m-32 m-28 m-24 m-20 m-16 m-14 m-12 m-11 m-10 m-9 m-8 m-7 m-6 m-5 m-4 m-3.5 m-3 m-2.5 m-2 m-1.5 m-1 m-0.5 m-0 m-px m-auto mx-96 my-96 ms-96 me-96 mt-96 mr-96 mb-96 ml-96 -m-96 -m-80 -m-72 -mx-96 -my-96 -mt-96 -mr-96 -mb-96 -ml-96 p-96 p-80 p-72 px-96 py-96 ps-96 pe-96 pt-96 pr-96 pb-96 pl-96 space-x-96 space-y-96 space-x-reverse space-y-reverse -space-x-96 -space-y-96">
      All spacing utilities with negatives
    </div>

    <!-- SIZING - Width, Height, Size -->
    <div class="w-96 w-80 w-72 w-64 w-56 w-52 w-48 w-44 w-40 w-36 w-32 w-auto w-px w-0.5 w-full w-screen w-svw w-lvw w-dvw w-min w-max w-fit min-w-full min-w-min min-w-max min-w-fit min-w-0 max-w-none max-w-xs max-w-sm max-w-md max-w-lg max-w-xl max-w-2xl max-w-3xl max-w-4xl max-w-5xl max-w-6xl max-w-7xl max-w-full max-w-min max-w-max max-w-fit max-w-prose max-w-screen-sm max-w-screen-md max-w-screen-lg max-w-screen-xl max-w-screen-2xl h-96 h-80 h-72 h-svh h-lvh h-dvh h-auto h-full h-screen h-min h-max h-fit min-h-screen min-h-svh min-h-lvh min-h-dvh min-h-full min-h-min min-h-max min-h-fit min-h-0 max-h-none max-h-full max-h-screen max-h-svh max-h-lvh max-h-dvh max-h-min max-h-max max-h-fit size-96 size-80 size-72 size-full size-auto size-min size-max size-fit">
      All sizing utilities including v4 viewport units and size utility
    </div>

    <!-- TYPOGRAPHY - Complete -->
    <div class="font-sans font-serif font-mono text-9xl text-8xl text-7xl text-6xl text-5xl text-4xl text-3xl text-2xl text-xl text-lg text-base text-sm text-xs font-black font-extrabold font-bold font-semibold font-medium font-normal font-light font-extralight font-thin leading-none leading-tight leading-snug leading-normal leading-relaxed leading-loose leading-3 leading-10 tracking-tighter tracking-tight tracking-normal tracking-wide tracking-wider tracking-widest text-start text-end text-left text-center text-right text-justify text-slate-950 text-slate-900 text-slate-800 text-slate-700 text-slate-600 text-slate-500 text-slate-400 text-slate-300 text-slate-200 text-slate-100 text-slate-50 text-red-950 text-red-900 text-red-800 text-red-700 text-red-600 text-red-500 text-red-400 text-red-300 text-red-200 text-red-100 text-red-50 underline-offset-8 underline-offset-4 underline-offset-2 underline-offset-1 underline-offset-0 underline-offset-auto line-through underline overline no-underline uppercase lowercase capitalize normal-case text-ellipsis text-clip truncate text-wrap text-nowrap text-balance text-pretty">
      Complete typography utilities
    </div>

    <!-- BACKGROUNDS - Complete -->
    <div class="bg-zinc-950 bg-zinc-900 bg-neutral-950 bg-stone-950 bg-amber-950 bg-lime-950 bg-emerald-950 bg-teal-950 bg-cyan-950 bg-sky-950 bg-indigo-950 bg-violet-950 bg-purple-950 bg-fuchsia-950 bg-pink-950 bg-rose-950 bg-scroll bg-fixed bg-local bg-clip-text bg-clip-padding bg-clip-content bg-clip-border bg-top bg-bottom bg-center bg-left bg-left-bottom bg-left-top bg-right bg-right-bottom bg-right-top bg-repeat-round bg-repeat-space bg-no-repeat bg-repeat-y bg-repeat-x bg-repeat bg-contain bg-cover bg-auto">
      All background utilities
    </div>

    <!-- BORDERS - Complete -->
    <div class="border-8 border-7 border-6 border-5 border-4 border-3 border-2 border border-0 border-x-8 border-y-8 border-s-8 border-e-8 border-t-8 border-r-8 border-b-8 border-l-8 border-slate-950 border-gray-950 border-zinc-950 border-neutral-950 border-stone-950 border-double border-dashed border-dotted border-solid border-none rounded-3xl rounded-2xl rounded-xl rounded-lg rounded-md rounded rounded-sm rounded-none rounded-full rounded-s-3xl rounded-e-3xl rounded-t-3xl rounded-r-3xl rounded-b-3xl rounded-l-3xl rounded-ss-3xl rounded-se-3xl rounded-ee-3xl rounded-es-3xl rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-3xl">
      All border utilities including radius
    </div>

    <!-- EFFECTS - Shadows, Opacity, Mix Blend -->
    <div class="shadow-2xl shadow-xl shadow-lg shadow-md shadow-sm shadow shadow-inner shadow-none opacity-100 opacity-95 opacity-90 opacity-85 opacity-80 opacity-75 opacity-70 opacity-65 opacity-60 opacity-55 opacity-50 opacity-45 opacity-40 opacity-35 opacity-30 opacity-25 opacity-20 opacity-15 opacity-10 opacity-5 opacity-0 mix-blend-plus-lighter mix-blend-plus-darker mix-blend-lighten mix-blend-darken mix-blend-difference mix-blend-exclusion mix-blend-multiply mix-blend-screen mix-blend-overlay mix-blend-hard-light mix-blend-soft-light mix-blend-color-dodge mix-blend-color-burn mix-blend-hue mix-blend-saturation mix-blend-color mix-blend-luminosity mix-blend-normal">
      Effects: shadow, opacity, mix-blend
    </div>

    <!-- FILTERS - Complete with Negatives -->
    <div class="blur-3xl blur-2xl blur-xl blur-lg blur-md blur-sm blur blur-none brightness-200 brightness-150 brightness-125 brightness-110 brightness-105 brightness-100 brightness-95 brightness-90 brightness-75 brightness-50 brightness-0 contrast-200 contrast-150 contrast-125 contrast-100 contrast-75 contrast-50 contrast-0 grayscale-0 grayscale hue-rotate-180 hue-rotate-90 hue-rotate-60 hue-rotate-30 hue-rotate-15 hue-rotate-0 -hue-rotate-15 -hue-rotate-30 -hue-rotate-60 -hue-rotate-90 -hue-rotate-180 invert-0 invert saturate-200 saturate-150 saturate-100 saturate-50 saturate-0 sepia-0 sepia">
      All filter utilities with negatives
    </div>

    <!-- TRANSFORMS - Complete with Negatives -->
    <div class="scale-150 scale-125 scale-110 scale-105 scale-100 scale-95 scale-90 scale-75 scale-50 scale-0 scale-x-150 scale-y-150 rotate-180 rotate-90 rotate-45 rotate-12 rotate-6 rotate-3 rotate-2 rotate-1 rotate-0 -rotate-1 -rotate-2 -rotate-3 -rotate-6 -rotate-12 -rotate-45 -rotate-90 -rotate-180 translate-x-96 translate-y-96 translate-x-full translate-y-full -translate-x-96 -translate-y-96 -translate-x-full -translate-y-full skew-x-12 skew-y-12 skew-x-6 skew-y-6 skew-x-3 skew-y-3 skew-x-2 skew-y-2 skew-x-1 skew-y-1 skew-x-0 skew-y-0 -skew-x-12 -skew-y-12">
      All transform utilities with negatives
    </div>

    <!-- TRANSITIONS & ANIMATIONS -->
    <div class="transition-shadow transition-transform transition-opacity transition-colors transition-all transition-none transition duration-1000 duration-700 duration-500 duration-300 duration-200 duration-150 duration-100 duration-75 duration-0 ease-in-out ease-out ease-in ease-linear delay-1000 delay-700 delay-500 delay-300 delay-200 delay-150 delay-100 delay-75 delay-0 animate-ping animate-pulse animate-bounce animate-spin animate-none">
      Transitions and animations
    </div>

    <!-- INTERACTIVITY -->
    <div class="cursor-zoom-out cursor-zoom-in cursor-wait cursor-text cursor-progress cursor-pointer cursor-not-allowed cursor-none cursor-no-drop cursor-move cursor-help cursor-grab cursor-grabbing cursor-default cursor-crosshair cursor-context-menu cursor-copy cursor-cell cursor-auto cursor-alias pointer-events-auto pointer-events-none resize-y resize-x resize resize-none scroll-smooth scroll-auto select-text select-none select-all select-auto">
      Interactivity utilities
    </div>

    <!-- ========================================== -->
    <!-- ARBITRARY VALUES - Critical for Testing! -->
    <!-- ========================================== -->

    <div class="bg-[#1da1f2] text-[#ffffff] border-[#e1e8ed] bg-[rgb(29,161,242)] text-[rgba(255,255,255,0.9)] bg-[hsl(203,89%,53%)] w-[100px] h-[50px] m-[10px] p-[2rem] gap-[15px] w-[50%] h-[75%] max-w-[90%] w-[50vw] h-[100vh] max-w-[80vmin] min-h-[50vmax] w-[calc(100%-2rem)] h-[calc(100vh-4rem)] p-[calc(1rem+2px)] text-[14px] text-[1.125rem] text-[clamp(1rem,2vw,2rem)] leading-[1.75] leading-[2.5rem] tracking-[0.05em] tracking-[-0.02em] rounded-[12px] rounded-t-[8px] rounded-br-[20px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] z-[999] z-[-1] z-[9999] grid-cols-[200px_1fr_200px] grid-rows-[auto_1fr_auto] translate-x-[123px] rotate-[17deg] scale-[1.15]">
      Comprehensive arbitrary values (breaks static list!)
    </div>

    <!-- ========================================== -->
    <!-- RESPONSIVE VARIANTS -->
    <!-- ========================================== -->

    <div class="flex md:grid lg:block sm:flex md:grid lg:block xl:inline-flex 2xl:inline-block p-4 md:p-6 lg:p-8 m-2 sm:m-4 md:m-6 bg-red-500 text-white p-4 sm:bg-blue-500 sm:text-black sm:p-6">
      Responsive variants mixed with base classes
    </div>

    <!-- ========================================== -->
    <!-- PSEUDO-CLASS VARIANTS -->
    <!-- ========================================== -->

    <button
      class="bg-blue-500 hover:bg-blue-600 text-white hover:text-gray-100 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 active:bg-blue-700 scale-100 active:scale-95"
      type="button"
      @click="handleClick"
    >
      Multiple pseudo-class variants
    </button>

    <a href="#" class="text-blue-600 visited:text-purple-600">
      Visited variant
    </a>

    <div class="first:mt-0 last:mb-0 odd:bg-gray-100 even:bg-white">
      Child selector variants
    </div>

    <button class="bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed" :disabled="isDisabled">
      Disabled variant
    </button>

    <input class="border-gray-300 required:border-red-500 optional:border-gray-300" type="text" required />

    <!-- ========================================== -->
    <!-- STACKED VARIANTS -->
    <!-- ========================================== -->

    <button class="hover:focus:bg-blue-500 hover:focus:scale-105 md:hover:bg-blue-600 lg:hover:text-white md:hover:scale-105 dark:hover:bg-gray-800 dark:hover:text-white lg:dark:hover:focus:bg-blue-500 md:dark:hover:text-white" type="button">
      Complex stacked variants (up to 4 levels!)
    </button>

    <!-- ========================================== -->
    <!-- GROUP/PEER MODIFIERS -->
    <!-- ========================================== -->

    <div class="group">
      <div class="group-hover:bg-blue-500 group-hover:text-white">
        Group hover variants
      </div>
    </div>

    <div class="group/card">
      <div class="group-hover/card:opacity-100 group-hover/card:scale-105">
        Named group variants
      </div>
    </div>

    <div>
      <input class="peer" type="checkbox" />
      <div class="peer-checked:bg-blue-500 peer-focus:ring-2">
        Peer variants
      </div>
    </div>

    <div>
      <input class="peer/draft" type="radio" />
      <div class="peer-checked/draft:text-blue-600">
        Named peer variant
      </div>
    </div>

    <!-- ========================================== -->
    <!-- DATA ATTRIBUTES & ARBITRARY VARIANTS -->
    <!-- ========================================== -->

    <div class="data-[state=open]:bg-blue-500 data-[state=closed]:bg-gray-500 data-[side=top]:rounded-t-lg data-[side=bottom]:rounded-b-lg [&>p]:text-red-500 [&>div]:bg-blue-100 [&_li]:text-blue-500 [&_a]:underline [&:nth-child(3)]:bg-red-500">
      Data attributes and arbitrary selector variants
    </div>

    <!-- ========================================== -->
    <!-- IMPORTANT MODIFIER -->
    <!-- ========================================== -->

    <div class="p-4! bg-red-500 m-2! text-white! hover:bg-blue-500! md:p-6!">
      Important modifier (breaks static list!)
    </div>

    <!-- ========================================== -->
    <!-- CONTAINER & MISC UTILITIES -->
    <!-- ========================================== -->

    <div class="container mx-auto px-4 aspect-video aspect-square aspect-[4/3] aspect-[16/9] columns-4 columns-3xs columns-2xl gap-8 break-before-all break-after-avoid break-inside-avoid caret-red-500 caret-blue-600 caret-[#1da1f2] will-change-transform will-change-scroll will-change-contents will-change-auto">
      Container, aspect ratio, columns, break, caret, will-change
    </div>

    <input class="accent-blue-500 accent-pink-500 accent-[#1da1f2]" type="checkbox" />

    <!-- ========================================== -->
    <!-- EDGE CASES THAT BREAK CURRENT STATIC LIST -->
    <!-- ========================================== -->

    <div class="m-128 p-144 gap-160 -m-128 -mx-144 -my-160">
      Extended spacing beyond 96 (breaks static!)
    </div>

    <div class="w-1/12 w-2/12 w-3/12 w-4/12 w-5/12 w-7/12 w-8/12 w-9/12 w-10/12 w-11/12 m-0.5 m-1.5 m-2.5 m-3.5 p-0.5 p-1.5 p-2.5 p-3.5">
      Fractional widths and decimal spacing
    </div>

    <div class="[background:linear-gradient(to_right,#000,#fff)] [font-family:'Comic_Sans_MS',cursive] [clip-path:circle(50%)]">
      Complex arbitrary properties
    </div>

    <div class="flex hover:flex md:flex focus:flex active:flex lg:flex xl:flex">
      Multiple variants on same property (variant order matters!)
    </div>

    <div class="p-4 hover:p-6 m-2 focus:m-4 bg-blue-500 active:bg-blue-700 text-white hover:text-gray-100">
      Base and variants mixed (must separate!)
    </div>

    <div class="custom-class flex unknown-utility p-4 another-custom bg-red-500">
      Unknown classes mixed with known Tailwind
    </div>

    <div class="m-4 mx-8 my-2 mt-1 mr-3 mb-5 ml-7 ms-6 me-9">
      All margin directions (property order test)
    </div>

    <div class="-z-50 -top-40 -left-40 -translate-x-full -translate-y-full -rotate-180 -skew-x-12 -space-x-4">
      Negative values across multiple utilities
    </div>

    <div class="hover:bg-[#1da1f2] md:w-[calc(100%-2rem)] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.5)]">
      Arbitrary values with variants (critical test!)
    </div>

    <!-- v4 Features -->
    <div class="@container">
      <div class="@sm:text-lg @md:text-xl @lg:text-2xl">
        Container query variants
      </div>
    </div>

    <div class="has-[:focus]:ring-2 has-[>img]:p-4 max-sm:hidden max-md:text-sm max-lg:p-2 ltr:text-left rtl:text-right ltr:ml-4 rtl:mr-4 print:hidden print:text-black print:bg-white portrait:flex-col landscape:flex-row motion-safe:animate-spin motion-reduce:animate-none contrast-more:border-2 contrast-less:border supports-[display:grid]:grid supports-[backdrop-filter]:backdrop-blur-sm">
      v4 features and preference variants
    </div>

    <!-- Vue-specific: Dynamic classes -->
    <div :class="dynamicClasses">
      Dynamic classes in Vue
    </div>

    <div :class="[isActive ? 'bg-blue-500' : 'bg-gray-500', 'p-4', 'rounded']">
      Conditional classes array
    </div>

    <div :class="{ 'bg-blue-500': isActive, 'bg-gray-500': !isActive, 'p-4': true }">
      Conditional classes object
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const title = ref('Comprehensive Tailwind Test - Vue');
const isActive = ref(false);
const isDisabled = ref(false);

const dynamicClasses = computed(() => {
  return [
    'p-4',
    'rounded-lg',
    'shadow-md',
    isActive.value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800',
    'hover:scale-105',
    'transition-transform'
  ].join(' ');
});

const handleClick = () => {
  isActive.value = !isActive.value;
};
</script>

<style scoped>
/* Scoped styles */
</style>
