<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary @click="alert('Clicked primary button')">Primary</ButtonPrimary>
      <ButtonSecondary @click="alert('Clicked secondary button')">Secondary</ButtonSecondary>
      <ButtonTertiary @click="alert('Clicked tertiary button')">Tertiary</ButtonTertiary>
      <LoadingButton ref="loadingButton" @click="startLoading">Loading</LoadingButton>
    </div>
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary disabled @click="alert('Clicked primary button')">Primary</ButtonPrimary>
      <ButtonSecondary disabled @click="alert('Clicked secondary button')">Secondary</ButtonSecondary>
      <ButtonTertiary disabled @click="alert('Clicked tertiary button')">Tertiary</ButtonTertiary>
      <LoadingButton disabled>Loading</LoadingButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ButtonPrimary from "./ButtonPrimary.vue";
import ButtonSecondary from "./ButtonSecondary.vue";
import ButtonTertiary from "./ButtonTertiary.vue";
import LoadingButton from "./LoadingButton.vue";

const loadingButton = ref<InstanceType<typeof LoadingButton>>();
function startLoading() {
  if (loadingButton.value) {
    loadingButton.value?.start()
    setTimeout(() => {
      loadingButton.value?.stop()
    }, 2000)
  }
}
function alert(message) {
  window.alert(message)
}
</script>