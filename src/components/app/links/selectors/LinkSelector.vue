<template>
  <div>
    <div>
      <div class="relative" v-click-outside="close">
        <button
          type="button"
          class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          @click="toggle"
        >
          <span v-if="selected" class="w-full inline-flex truncate">
            <div
              v-if="selected.providerWorkspaceId === currentWorkspaceId"
              class="flex justify-between space-x-2 w-full"
            >
              <div class="font-normal truncate">{{ selected.clientWorkspace.name }}</div>
              <div class="text-gray-500">
                <span
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-sm border-indigo-300"
                >{{ $t("models.client.object") }}</span>
              </div>
            </div>
            <div v-else class="flex justify-between space-x-2 w-full">
              <div class="font-normal truncate">{{ selected.providerWorkspace.name }}</div>
              <div class="text-gray-500">
                <span
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-theme-800 text-xs font-medium bg-theme-100 rounded-sm border-theme-300"
                >{{ $t("models.provider.object") }}</span>
              </div>
            </div>
          </span>
          <span v-else class="w-full inline-flex truncate">
            <span class="truncate">{{ $t("app.links.actions.selectOne") }}...</span>
          </span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <!-- Heroicon name: solid/selector -->
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>

        <transition
          leave-active-class="transition ease-in duration-100"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="opened"
            class="absolute z-10 mt-1 w-full bg-white shadow-xl max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          >
            <div class="p-2 flex rounded-md">
              <div class="relative flex items-stretch flex-grow focus-within:z-10">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  :disabled="loading"
                  id="search"
                  autocomplete="off"
                  ref="inputSearch"
                  :placeholder="$t('shared.searchDot')"
                  v-model="searchInput"
                  @keydown.enter.prevent="trySelect"
                  class="focus:ring-gray-300 focus:border-theme-300 block w-full rounded-none rounded-l-sm pl-10 sm:text-sm border-gray-300 px-3 py-2 bg-white text-sm border focus:outline-none"
                />
              </div>
              <button
                :disabled="loading"
                type="button"
                @click="add"
                class="-ml-px relative inline-flex items-center space-x-2 px-2 py-2 border border-gray-300 text-sm font-medium rounded-r-sm text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
            <div
              v-if="loading"
              class="py-2 px-3 text-gray-400 text-sm"
            >{{ $t("shared.loading") }}...</div>
            <div v-else-if="items.length > 0">
              <ul
                tabindex="-1"
                role="listbox"
                aria-labelledby="listbox-label"
                aria-activedescendant="listbox-option-0"
              >
                <li
                  class="cursor-pointer text-gray-900 select-none relative py-2 pl-3 pr-12 hover:bg-slate-100 hover:text-theme-900"
                  :id="'listbox-option-' + idx"
                  role="option"
                  v-for="(link, idx) in filteredItems"
                  :key="idx"
                  @click="select(link)"
                >
                  <div
                    v-if="link.providerWorkspaceId === currentWorkspaceId"
                    class="mr-3 flex justify-between space-x-2 w-full"
                  >
                    <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                    <div class="font-normal truncate">{{ link.clientWorkspace.name }}</div>
                    <!-- Highlighted: "text-theme-200", Not Highlighted: "text-gray-500" -->
                    <div class="text-gray-500">
                      <span
                        class="flex-shrink-0 inline-block px-2 py-0.5 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-sm border-indigo-300"
                      >{{ $t("models.client.object") }}</span>
                    </div>
                  </div>
                  <div v-else class="mr-3 flex justify-between space-x-2 w-full">
                    <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                    <div class="font-normal truncate">{{ link.providerWorkspace.name }}</div>
                    <!-- Highlighted: "text-theme-200", Not Highlighted: "text-gray-500" -->
                    <div class="text-gray-500">
                      <span
                        class="flex-shrink-0 inline-block px-2 py-0.5 text-theme-800 text-xs font-medium bg-theme-100 rounded-sm border-theme-300"
                      >{{ $t("models.provider.object") }}</span>
                    </div>
                  </div>
                  <span
                    v-if="selected && selected.id === link.id"
                    class="text-theme-600 absolute inset-y-0 right-0 flex items-center pr-4"
                  >
                    <!-- Heroicon name: solid/check -->
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </li>
              </ul>
            </div>
            <div
              v-else-if="items.length === 0"
              class="py-2 px-3 text-gray-400 text-sm"
            >{{ $t("app.links.thereAreNo") }}</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import services from "@/services";
import store from "@/store";
import tinyEventBus from "@/plugins/tinyEventBus";
import { onBeforeUnmount } from "@vue/runtime-core";
import { defineComponent, computed, nextTick, onMounted, ref } from "vue";

export default defineComponent({
  setup(_, context) {
    const inputSearch = ref<HTMLInputElement>();

    const opened = ref(false);
    const loading = ref(false);
    const searchInput = ref("");
    const items = ref<LinkDto[]>([]);
    const selected = ref<LinkDto | null>(null);

    onMounted(() => {
      reload();
      tinyEventBus().emitter.on("reload-links", () => {
        reload();
      });
    })

    onBeforeUnmount(() => {
      tinyEventBus().emitter.off("reload-links");
    })

    function reload() {
      selected.value = null;
      loading.value = true;
      services.links
        .getAllLinked()
        .then(response => {
          items.value = response;
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function select(link: LinkDto) {
      close();
      selected.value = link;
      context.emit("selected", selected.value.id, link);
      searchInput.value = "";
    }
    function toggle() {
      if (!opened.value) {
        open();
        nextTick(() => {
          inputSearch.value?.focus();
          inputSearch.value?.select();
        });
      } else {
        close();
      }
    }
    function open() {
      opened.value = true;
    }
    function close() {
      opened.value = false;
    }
    function trySelect() {
      if (filteredItems.value.length > 0) {
        select(filteredItems.value[0]);
      }
    }
    function add() {
      tinyEventBus().emitter.emit("new-link");
    }
    const currentWorkspaceId = computed(() => {
      return store.state.tenant.currentWorkspace?.id ?? "";
    })
    const filteredItems = computed((): LinkDto[] => {
      if (!items.value) {
        return [];
      }
      return items.value.filter(
        f =>
          f.id?.toUpperCase().includes(searchInput.value.toUpperCase()) ||
          f.providerWorkspace?.name
            ?.toString()
            .toUpperCase()
            .includes(searchInput.value.toUpperCase()) ||
          f.clientWorkspace?.name
            ?.toString()
            .toUpperCase()
            .includes(searchInput.value.toUpperCase())
      );
    })

    return {
      selected,
      opened,
      currentWorkspaceId,
      loading,
      searchInput,
      items,
      filteredItems,
      toggle,
      trySelect,
      add,
      select,
      close
    }
  }
})
</script>
