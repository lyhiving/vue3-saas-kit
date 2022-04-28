<template>
  <nav class="flex bg-white border-b border-gray-200 overflow-x-auto" aria-label="Breadcrumb">
    <ol class="max-w-screen-xl w-full px-4 flex space-x-4 sm:px-6 lg:px-8">
      <li class="flex">
        <div class="flex items-center">
          <router-link :to="home" class="text-gray-400 hover:text-gray-500">
            <!-- Heroicon name: solid/home -->
            <svg
              class="flex-shrink-0 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            <span class="sr-only">{{ $t("shared.home") }}</span>
          </router-link>
        </div>
      </li>

      <li v-for="(item, idx) in menu" :key="idx" class="flex">
        <div class="flex items-center">
          <svg
            class="flex-shrink-0 w-5 sm:w-6 h-full text-gray-200"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <div
            v-if="!item.routeName && !item.routePath"
            class="ml-2 sm:ml-4 sm:text-sm font-medium text-gray-500 hover:text-gray-700 select-none truncate"
          >{{ item.title }}</div>
          <router-link
            v-else-if="item.routeName"
            :to="{
              name: item.routeName,
              params: item.params,
              query: item.query,
            }"
            class="ml-2 sm:ml-4 sm:text-sm font-medium text-gray-500 hover:text-gray-700 truncate"
          >{{ item.title }}</router-link>
          <router-link
            v-else
            :to="item.routePath"
            class="ml-2 sm:ml-4 sm:text-sm font-medium text-gray-500 hover:text-gray-700 truncate"
          >{{ item.title }}</router-link>
        </div>
      </li>
    </ol>
  </nav>
</template>


<script setup lang="ts">
import { PropType } from 'vue';

interface MenuItem {
  routeName?: string;
  routePath?: string;
  title: string;
  params?: any;
  query?: any;
}
defineProps({
  home: {
    default: '/app'
  },
  menu: {
    type: Array as PropType<MenuItem[]>
  }
});
</script>