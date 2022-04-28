<template>
  <div
    class="fixed inset-0 overflow-hidden"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true"
    v-show="showing"
  >
    <div @keypress.esc="close" class="absolute inset-0 overflow-hidden">
      <transition
        enter-active-class="ease-in-out duration-300"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in-out duration-300"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="showing"
          class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
      </transition>

      <div class="fixed inset-y-0 right-0 pl-3 sm:pl-10 max-w-full flex">
        <transition
          enter-active-class="transform transition ease-in-out duration-300 sm:duration-500"
          enter-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-300 sm:duration-500"
          leave-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <div v-show="showing" class="w-screen sm:max-w-md">
            <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div class="py-6 px-4 bg-slate-800 sm:px-6 shadow-md">
                <div class="flex items-center justify-between">
                  <h2
                    class="text-lg font-medium text-white"
                    id="slide-over-title"
                  >{{ $t("app.links.pending.title") }}</h2>
                  <div class="ml-3 h-7 flex items-center">
                    <button
                      @click="close"
                      type="button"
                      class="rounded-md text-white hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <span class="sr-only">{{ $t("shared.close") }}</span>
                      <!-- Heroicon name: outline/x -->
                      <svg
                        class="h-6 w-6"
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
                </div>
                <div class="mt-1">
                  <p class="text-sm text-gray-100">{{ $t("app.links.pending.description") }}</p>
                </div>
              </div>
              <div class="relative flex-1 sm:py-6 sm:px-6">
                <PendingLinksList v-if="showing" @close="close" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PendingLinksList from "./PendingLinksList.vue";

export default defineComponent({
  components: {
    PendingLinksList,
  },
  setup() {
    const showing = ref(false);
    function show() {
      showing.value = true;
    }
    function close() {
      showing.value = false;
    }
    return {
      showing,
      show,
      close
    }
  }
})
</script>
