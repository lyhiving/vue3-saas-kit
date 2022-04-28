<template>
  <button
    v-if="!to"
    :type="type"
    :disabled="disabled"
    class="inline-flex space-x-2 items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300"
    :class="{
      'cursor-not-allowed opacity-75': disabled,
      'text-theme-800': !destructive,
      'text-red-700': destructive,
      'hover:bg-theme-50 focus:ring-theme-500': !disabled && !destructive,
      'hover:bg-red-50 focus:ring-red-500': !disabled && destructive
    }"
  >
    <slot />
  </button>
  <router-link
    v-else
    :to="to"
    :disabled="disabled"
    :target="target"
    class="inline-flex space-x-2 items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md bg-white border-gray-300"
    :class="{
      'cursor-not-allowed opacity-75': disabled,
      'focus:outline-none focus:ring-2 focus:ring-offset-2': !disabled,
      'text-theme-800': !destructive,
      'text-red-700': destructive,
      'hover:bg-theme-50 focus:ring-theme-500': !disabled && !destructive,
      'hover:bg-red-50 focus:ring-red-500': !disabled && destructive
    }"
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

type ButtonType = "button" | "submit" | "reset" | undefined;
defineProps({
  type: {
    type: String as PropType<ButtonType>,
    default: "button"
  },
  to: null,
  target: String,
  disabled: Boolean,
  destructive: Boolean
})
</script>