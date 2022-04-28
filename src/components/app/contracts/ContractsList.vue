<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <div class="space-y-2">
        <div class="flex justify-between items-center space-x-0">
          <div
            class="space-y-2 sm:space-y-0 flex-col text-right sm:flex-row flex sm:items-center sm:space-x-3"
          ></div>
        </div>
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
        <ContractsListAndTable :items="filteredItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import services from "@/services";
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import ContractsListAndTable from "./ContractsListAndTable.vue";
import { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";
import Loading from "@/components/ui/loaders/Loading.vue";
import { computed, onMounted, PropType, ref } from "vue";

const props = defineProps({
  filter: {
    default: ContractStatusFilter.ALL,
    type: Number as PropType<ContractStatusFilter>
  }
})

const loading = ref(false);
const searchInput = ref("");

const items = ref<ContractDto[]>([]);

onMounted(() => {
  reload();
})

function reload() {
  loading.value = true;
  services.contracts
    .getAllByStatusFilter(props.filter)
    .then((response) => {
      items.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
const filteredItems = computed((): ContractDto[] => {
  if (!items.value) {
    return [];
  }
  return items.value.filter((f) => f.id?.toUpperCase().includes(searchInput.value.toUpperCase()) || f.name?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.description?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.link?.providerWorkspace.name?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.link?.clientWorkspace.name?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.createdByUser?.email?.toString().toUpperCase().includes(searchInput.value.toUpperCase()));
})

</script>
