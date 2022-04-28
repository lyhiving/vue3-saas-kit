<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">{{ $t("app.shared.tabs.select") }}</label>
      <select
        id="tabs"
        name="tabs"
        class="block w-full focus:ring-theme-500 focus:border-theme-500 border-gray-300 rounded-sm"
        @change="change"
      >
        <option
          v-for="(tab, idx) in tabs"
          :key="tab.name"
          :selected="isCurrent(idx)"
          :value="Number(idx)"
        >{{ tab.name }}</option>
      </select>
    </div>
    <div class="hidden sm:block">
      <nav class="flex space-x-4" aria-label="Tabs" v-if="asLinks">
        <router-link
          v-for="(tab, idx) in tabs"
          :key="tab.name"
          :to="getRoute(tab)"
          class="truncate border"
          :class="[isCurrent(idx) ? 'bg-theme-100 text-theme-700 border border-theme-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-3 py-2 font-medium text-sm rounded-sm border-transparent']"
          :aria-current="isCurrent(idx) ? 'page' : undefined"
        >{{ tab.name }}</router-link>
      </nav>
      <nav v-else class="flex space-x-4" aria-label="Tabs">
        <button
          type="button"
          v-for="(tab, idx) in tabs"
          :key="idx"
          @click="selectTab(idx)"
          class="truncate border"
          :class="[isCurrent(idx) ? 'bg-theme-100 text-theme-700 border border-theme-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-3 py-2 font-medium text-sm rounded-sm border-transparent']"
        >{{ tab.name }}</button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">import { PropType } from '@vue/runtime-core';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


export interface TabItem {
  name: any;
  routeName?: string;
  routePath?: string;
  routeParams?: any;
}

const props = defineProps({
  tabs: {
    type: Array as PropType<TabItem[]>,
    default: () => []
  },
  asLinks: {
    default: true
  }
})

const router = useRouter();
const route = useRoute();
const $emit = defineEmits(['selected'])

const selected = ref(0);
function change(e) {
  selectTab(e.target.value)
}
function selectTab(idx) {
  const tab = props.tabs[idx];
  if (props.asLinks) {
    if (tab?.routeName) {
      router.push({ name: tab.routeName, params: tab.routeParams });
    } else if (tab?.routePath) {
      router.push(tab.routePath);
    }
  } else {
    selected.value = idx;
    $emit("selected", idx);
  }
}
function isCurrent(idx: number) {
  return currentTab.value === props.tabs[idx];
}
function getRoute(tab: TabItem) {
  return tab.routePath ??
  {
    name: tab.routeName,
    params: tab.routeParams,
  }
}
const currentTab = computed(() => {
  if (props.asLinks) {
    return props.tabs.find((element) =>
      (element.routeName && route.name === element.routeName)
      || (element.routePath && route.path === element.routePath));
  } else {
    return props.tabs[selected.value]
  }
})
</script>
