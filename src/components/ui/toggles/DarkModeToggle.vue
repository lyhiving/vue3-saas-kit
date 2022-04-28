<template>
  <button
    type="button"
    @click="toggle"
    class="flex items-center justify-center space-x-2 w-full focus:outline-none group"
  >
    <span class="text-base font-medium">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </span>
    <div
      class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
    >
      <div class="w-6 h-3.5 transition bg-gray-500 rounded-full shadow-md outline-none"></div>
      <div
        class="absolute inline-flex bg-white items-center justify-center w-1.5 h-1.5 transition-all duration-200 ease-in-out transform rounded-full shadow-sm top-1 left-1"
        :class="{
          'translate-x-3': currentTheme == 1
        }"
      ></div>
    </div>
    <span class="text-base font-medium">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import store from "@/store";
import { Theme } from "@/application/enums/shared/Theme";
import { computed } from "vue";

function toggle() {
  if (currentTheme.value === 1) {
    store.commit("theme/setTheme", Theme.LIGHT);
  } else {
    store.commit("theme/setTheme", Theme.DARK);
  }
  const htmlClasses = document.querySelector("html")?.classList;
  if (currentTheme.value === 0) {
    htmlClasses?.remove("dark");
  } else {
    htmlClasses?.add("dark");
  }
}
const currentTheme = computed(() => {
  return store.state.theme.theme;
})
</script>