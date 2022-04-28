<template>
  <ButtonPrimary
    class="relative justify-center"
    type="button"
    :disabled="loading"
    :class="{
      'base-spinner cursor-not-allowed': loading,
    }"
  >
    <slot />
  </ButtonPrimary>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ButtonPrimary from "./ButtonPrimary.vue";

export default defineComponent({
  name: 'LoadingButton',
  components: {
    ButtonPrimary
  },
  setup() {
    const loading = ref(false);
    function start() {
      loading.value = true;
    }
    function stop() {
      loading.value = false;
    }

    return {
      loading,
      start,
      stop
    }
  }
})
</script>

<style>
.base-button + .base-button {
  margin-left: 1em;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.base-spinner {
  position: relative;
  overflow: hidden;
}

.base-spinner:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  background-color: inherit;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
  top: 0;
  left: 0;
}

.base-spinner:after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: inherit;
  animation: spinner 0.6s linear infinite;
  z-index: 2;
}
</style>
