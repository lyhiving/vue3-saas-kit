<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary :to="currentRoute">Primary</ButtonPrimary>
      <ButtonSecondary :to="currentRoute">Secondary</ButtonSecondary>
      <ButtonTertiary :to="currentRoute">Tertiary</ButtonTertiary>
    </div>
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary disabled :to="currentRoute">Primary</ButtonPrimary>
      <ButtonSecondary disabled :to="currentRoute">Secondary</ButtonSecondary>
      <ButtonTertiary disabled :to="currentRoute">Tertiary</ButtonTertiary>
    </div>
  </div>
</template>

<script setup lang="ts">import { useRoute } from 'vue-router';
import ButtonPrimary from './ButtonPrimary.vue';
import ButtonSecondary from './ButtonSecondary.vue';
import ButtonTertiary from './ButtonTertiary.vue';

const route = useRoute();
const currentRoute = route.path;
</script>