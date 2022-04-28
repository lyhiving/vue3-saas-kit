<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <div class="space-y-2">
        <div class="flex justify-between">
          <div class="flex items-center justify-start w-full">
            <div class="relative flex items-center w-full">
              <div
                class="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
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
                ref="inputSearch"
                type="text"
                name="buscador"
                id="buscador"
                class="w-full focus:ring-theme-500 focus:border-theme-500 block rounded-md pl-10 sm:text-sm border-gray-300"
                :placeholder="$t('shared.searchDot')"
                v-model="searchInput"
              />
            </div>
          </div>
        </div>
        <ClientsListAndTable :items="filteredItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import services from "@/services";
import ClientsListAndTable from "./ClientsListAndTable.vue";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import Loading from "@/components/ui/loaders/Loading.vue";
import { computed, onMounted, ref } from "vue";

const loading = ref(false);
const searchInput = ref("");
const items = ref<LinkDto[]>([]);

onMounted(() => {
  reload();
})

function reload() {
  loading.value = true;
  services.links
    .getAllClients()
    .then(response => {
      items.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
const filteredItems = computed((): LinkDto[] => {
  if (!items.value) {
    return [];
  }
  return items.value.filter(
    f =>
      f.id?.toUpperCase().includes(searchInput.value.toUpperCase()) ||
      f.clientWorkspace.name
        ?.toString()
        .toUpperCase()
        .includes(searchInput.value.toUpperCase())
  );
})
</script>
