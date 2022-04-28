<template>
  <div class="relative" v-click-outside="closedropDown">
    <button
      type="button"
      @click="dropDown = !dropDown"
      class="cursor-pointer select-none leading-6 font-medium focus:outline-none transition ease-in-out duration-150 px-3 py-1 rounded-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:text-gray-900 dark:focus:text-white"
    >
      <span>{{ $t("settings.preferences.language") }}</span>
    </button>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-class="transition ease-in duration-75"
      leaveFrleave-to-classom="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="dropDown || open"
        :class="
          !open
            ? 'z-40 origin-top-right absolute right-0 mt-2 w-44 rounded-sm '
            : 'z-40 mt-2 w-44 rounded-sm '
        "
      >
        <div
          class="rounded-sm bg-white dark:bg-slate-900 border border-primary shadow-xl"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <button
            type="button"
            v-for="(language, index) in supportedLocales"
            @click="select(language.lang)"
            :key="index"
            class="w-full h-10 space-x-2 cursor-pointer truncate group flex items-center px-2 text-sm text-gray-900 dark:text-slate-300 hover:bg-slate-100 dark:bg-gray-900 transition ease-in-out duration-150 border-b border-primary"
            role="menuitem"
          >
            <div class="pl-1">{{ language.name }}</div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import _supportedLocales from "../../../locale/supportedLocales";
import i18n from "@/locale/i18n";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const open = ref(false)
const dropDown = ref(false)
const supportedLocales = ref(_supportedLocales)
onMounted(() => {
  dropDown.value = open.value;
})
function closedropDown() {
  dropDown.value = false;
}
function select(value) {
  console.log("value", value)
  closedropDown();
  localStorage.setItem("locale", value)
  i18n.global.locale = value;
  router.go(0)
}
</script>


