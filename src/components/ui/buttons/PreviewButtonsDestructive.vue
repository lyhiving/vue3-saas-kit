<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary @click="alert('Clicked primary destructive button')" destructive>Primary</ButtonPrimary>
      <ButtonSecondary @click="alert('Clicked secondary destructive button')" destructive>Secondary</ButtonSecondary>
      <ButtonTertiary @click="alert('Clicked tertiary destructive button')" destructive>Tertiary</ButtonTertiary>
    </div>
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary disabled destructive>Primary</ButtonPrimary>
      <ButtonSecondary disabled destructive>Secondary</ButtonSecondary>
      <ButtonTertiary disabled destructive>Tertiary</ButtonTertiary>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonPrimary from './ButtonPrimary.vue';
import ButtonSecondary from './ButtonSecondary.vue';
import ButtonTertiary from './ButtonTertiary.vue';

function alert(message) {
  window.alert(message)
}
</script>