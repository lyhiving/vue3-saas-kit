<template>
  <div @keypress.esc="close">
    <div class="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>

    <div class="fixed inset-0 overflow-hidden z-10">
      <div class="absolute inset-0 overflow-hidden">
        <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <transition
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <div
              class="w-screen max-w-sm"
              :class="{
                'md:max-w-md': size === 'md',
                'md:max-w-lg': size === 'lg',
                'md:max-w-2xl': size === '2xl',
                'md:max-w-3xl': size === '3xl',
                'md:max-w-4xl': size === '4xl',
                'md:max-w-full': size === 'full'
              }"
            >
              <div class="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-2xl">
                <div class="h-0 flex-1 space-y-6 overflow-y-scroll" :class="paddingY">
                  <header v-if="title" class="px-4 sm:px-6">
                    <div class="flex items-start justify-between space-x-3">
                      <h2 class="text-lg leading-7 font-medium text-gray-900">{{ title }}</h2>
                      <div class="h-7 flex items-center">
                        <button
                          @click="close"
                          aria-label="Close panel"
                          class="text-gray-400 hover:text-gray-500 transition ease-in-out duration-150"
                        >
                          <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                  </header>
                  <div class="relative flex-1" :class="paddingContent">
                    <!-- Replace with your content -->
                    <slot name="content"></slot>
                    <slot
                      name="footer"
                      class="flex-shrink-0 px-1 py-4 space-x-4 flex justify-end border-t border-gray-200"
                    ></slot>
                    <!-- /End replace -->
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </section>
      </div>
      <div class="absolute top-4 right-10">
        <button
          @click="close"
          v-if="!title"
          class="flex items-center space-x-1 py-1 px-2 text-xs uppercase hover:bg-gray-200 rounded-md shadow-lg bg-white border border-gray-300 text-gray-800 font-extrabold"
        >
          <div>{{ $t("shared.close") }}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-3.5"
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
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

type size = "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
defineProps({
  title: String,
  size: {
    default: "md",
    type: String as PropType<size>,
  },
  paddingContent: {
    default: "px-4 sm:px-6"
  },
  paddingY: {
    default: "py-6"
  }
})

const $emit = defineEmits(['close'])

document.addEventListener("keyup", evt => {
  if (evt.keyCode === 27) {
    close();
  }
});

function close() {
  $emit("close");
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </script>
