<template>
  <button
    v-if="!to"
    :type="type"
    :disabled="disabled"
    class="underline inline-flex space-x-2 items-center px-1 py-2 text-sm font-medium focus:outline-none"
    :class="{
      'cursor-not-allowed opacity-75': disabled,
      'text-theme-600': !destructive,
      'text-gray-600': destructive,
      'hover:text-theme-800 focus:text-theme-900': !disabled && !destructive,
      'hover:text-gray-800 focus:text-gray-900': !disabled && destructive
    }"
  >
    <slot />
  </button>
  <router-link
    v-else
    :to="to"
    :disabled="disabled"
    :target="target"
    class="underline inline-flex space-x-2 items-center px-1 py-2 text-sm font-medium focus:outline-none"
    :class="{
      'cursor-not-allowed opacity-75': disabled,
      'text-theme-600': !destructive,
      'text-gray-600': destructive,
      'hover:text-theme-800 focus:text-theme-900': !disabled && !destructive,
      'hover:text-gray-800 focus:text-gray-900': !disabled && destructive
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