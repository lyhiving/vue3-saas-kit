<template>
  <div>
    <div v-show="showing" @keypress.esc="close" class="fixed z-50 inset-0 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
          </div>
        </transition>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-show="showing"
            class="inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
            :class="maxSize"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="just absolute top-0 right-0 -mt-4 pr-4">
              <button
                @click="close"
                type="button"
                class="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">{{ $t("shared.close") }}</span>
                <svg
                  class="h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="mt-3">
              <slot></slot>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    maxSize: {
      default: "sm:max-w-lg"
    }
  },
  setup(_, context) {
    const showing = ref(false);
    function show() {
      showing.value = true;

      nextTick(() => {
        window.addEventListener("keyup", keyup);
      });
    }
    function keyup(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }
    function close() {
      window.removeEventListener("keyup", keyup);
      context.emit("closed");
      showing.value = false;
    }

    return {
      showing,
      show,
      close,
    }
  }
})
</script>
