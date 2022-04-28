<template>
  <div class="pt-4 space-y-2 pb-4 text-center">
    <div class="h-auto w-full flex justify-center py-12 flex-col text-center space-y-4">
      <div v-if="sandbox" class="font-medium italic text-sm">{{ $t("shared.fakeLoading") }}...</div>
      <div
        class="loader ease-linear rounded-full border-8 border-t-8 border-slate-200 h-20 w-20 mx-auto"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sandbox = import.meta.env.VITE_VUE_APP_SERVICE === "sandbox";
</script>

<style scoped>
.loader {
  border-top-color: #5a67d8;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>