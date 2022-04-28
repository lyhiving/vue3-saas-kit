<template>
  <div>
    <div class="relative text-left w-auto" v-click-outside="closeDropdown">
      <span class="inline-block w-full rounded-sm shadow-sm">
        <button
          class="bg-slate-800 hover:bg-theme-600 hover:text-theme-50 truncate text-slate-300 cursor-pointer w-full pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:leading-5 rounded-sm shadow-sm"
          @click="toggleDropDown"
        >
          <div class="font-bold truncate pr-7 sm:hidden">
            <span v-if="currentWorkspace" class="truncate">{{ currentWorkspace.name }}</span>
            <span v-else class="text-gray-600">- {{ $t("app.workspaces.select") }} -</span>
          </div>
          <div class="font-bold truncate pr-7 hidden sm:block sm:w-full">
            <span v-if="currentWorkspace" class="mt-4 truncate">{{ currentWorkspace.name }}</span>
            <span v-else class="mt-4 text-gray-600">- {{ $t("app.workspaces.select") }} -</span>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>
      </span>

      <!-- Select popover, show/hide based on select state. -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          class="z-40 absolute object-top mt-1 w-full rounded-sm bg-white shadow-lg"
          v-if="dropDown"
        >
          <div
            class="m-1 border border-gray-100 relative flex items-stretch flex-grow focus-within:z-10"
          >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <!-- Heroicon name: solid/users -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              :disabled="loading"
              id="search"
              ref="inputSearch"
              :placeholder="$t('shared.searchDot')"
              v-model="search"
              autocomplete="none"
              @keyup.enter="enter"
              class="focus:ring-theme-500 focus:border-theme-500 block w-full rounded-none rounded-l-sm pl-10 sm:text-sm px-3 py-2 bg-gray-100 text-sm focus:outline-none"
            />
          </div>
          <div
            class="max-h-60 rounded-sm text-sm leading-5 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
          >
            <button
              v-for="(workspace, index) in sortedItems"
              :key="index"
              role="option"
              :title="workspace.name"
              class="text-left w-full text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-5 hover:bg-gray-100 border-gray-100 font-medium truncate focus:outline-none"
              @click="change(workspace)"
            >{{ workspace.name }}</button>
            <button
              @click="add"
              role="option"
              class="text-theme-600 w-full text-sm text-left font-bold cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-theme-700"
            >{{ $t("shared.add") }}</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import services from "@/services";
import store from "@/store";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const $emit = defineEmits(['add', 'selected'])

const inputSearch = ref<HTMLInputElement>();

const loading = ref(false);
const dropDown = ref(false);
const search = ref("");

onMounted(() => {
  if (!currentWorkspace.value && workspaces.value && workspaces.value.length > 0) {
    const defaultWorkspace = workspaces.value.find((f) => f.default);
    if (defaultWorkspace) {
      change(defaultWorkspace);
    } else {
      change(workspaces.value[0]);
    }
  }
  if (!workspaces.value) {
    services.workspaces.getAllWorkspaces(true);
  }
})
function add() {
  $emit("add")
  closeDropdown();
  router.push("/app/settings/workspaces/new");
}
function closeDropdown() {
  dropDown.value = false;
}
function toggleDropDown() {
  dropDown.value = !dropDown.value;
  if (dropDown.value) {
    nextTick(() => {
      inputSearch.value?.focus();
      inputSearch.value?.select();
    });
  }
}
function enter() {
  if (sortedItems.value.length === 1) {
    change(sortedItems.value[0]);
  }
}
function change(workspace: WorkspaceDto) {
  search.value = "";
  $emit("selected")
  closeDropdown();
  store.commit("tenant/setCurrentWorkspace", workspace);
}
const workspaces = computed((): WorkspaceDto[] => {
  return store.state.tenant.workspaces ?? [];
})
const currentWorkspace = computed((): WorkspaceDto | null => {
  return store.state.tenant.currentWorkspace;
})
const sortedItems = computed((): WorkspaceDto[] => {
  return workspaces.value
    .filter((f) => !search.value || f.name.toLowerCase().includes(search.value.toLowerCase()))
    .sort((x, y) => {
      if (x.name && y.name) {
        return (x.name > y.name ? 1 : -1) ?? 1;
      }
      return 1;
    });
})
</script>
