<template>
  <div @keyup.enter="close" @keypress.esc="close" v-if="showing">
    <div
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
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
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          >
            <div>
              <div
                class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
              >
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 text-green-600"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">{{ title }}</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-700">{{ description }}</p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <button
                @click="close"
                ref="closeButton"
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-theme-600 text-base font-medium text-white hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:text-sm"
              >{{ closeText }}</button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import i18n from "@/locale/i18n";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { TranslateResult } from "vue-i18n";

export default defineComponent({
  name: "SuccessModal",
  setup(_, context) {
    const $t = i18n.global.t;

    const closeButton = ref<HTMLButtonElement>();

    const title = ref<TranslateResult>();
    const description = ref<TranslateResult>();
    const closeText = ref<TranslateResult>();
    const showing = ref(false);

    onMounted(() => {
      title.value = $t("shared.success");
      closeText.value = $t("shared.close");
    })

    function show(_title?: TranslateResult, _description?: TranslateResult) {
      if (_title) {
        title.value = _title;
      }
      if (_description) {
        description.value = _description;
      }
      showing.value = true;
      nextTick(() => {
        setTimeout(() => {
          if (closeButton.value) {
            closeButton.value.focus();
          }
        }, 500);
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
      title,
      description,
      closeText,
      show,
      close,
    }
  }
})
</script>
