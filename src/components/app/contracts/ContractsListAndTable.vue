<template>
  <div>
    <div v-if="sortedItems.length === 0">
      <EmptyState
        class="bg-white"
        to="/app/contract/new"
        :captions="{
          new: $t('shared.add'),
          thereAreNo: $t('app.contracts.errors.noContracts')
        }"
        icon="plus"
      />
    </div>
    <div v-else>
      <div class="sm:hidden">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="(contract, idxContract) in sortedItems" :key="idxContract">
              <router-link :to="'/app/contract/' + contract.id" class="block hover:bg-gray-50">
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="min-w-0 flex-1 flex items-center">
                    <div class="flex-shrink-0">
                      <IconContractClock
                        v-if="contract.status === 0"
                        class="h-10 w-10 text-yellow-500"
                      />
                      <IconContractCheck
                        v-if="contract.status === 1"
                        class="h-10 w-10 text-teal-500"
                      />
                      <IconContractArchived
                        v-if="contract.status === 2"
                        class="h-10 w-10 text-gray-500"
                      />
                    </div>
                    <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <div class="flex items-end justify-between">
                          <div
                            class="text-sm truncate font-bold text-gray-900 flex-grow"
                          >{{ contract.name }}</div>
                          <div>
                            <span
                              v-if="contract.createdAt"
                              class="text-xs text-gray-600 truncate"
                            >{{ dateDM(contract.createdAt) }}</span>
                          </div>
                        </div>
                        <div class="mt-2 flex items-center text-sm text-gray-500 space-x-1">
                          <div class="truncate">
                            {{ contract.link.providerWorkspace.name }}
                            <span
                              class="text-theme-600 font-normal lowercase"
                              v-if="currentWorkspaceNameIs(contract.link.providerWorkspace.name)"
                            >({{ $t("shared.you") }})</span>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-theme-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <div class="truncate">
                            {{ contract.link.clientWorkspace.name }}
                            <span
                              class="text-theme-600 font-normal lowercase"
                              v-if="currentWorkspaceNameIs(contract.link.clientWorkspace.name)"
                            >({{ $t("shared.you") }})</span>
                          </div>
                        </div>
                      </div>
                      <div class="hidden md:block">
                        <div>
                          <p class="text-sm text-gray-900">
                            <time v-if="contract.createdAt">{{ dateMonthName(contract.createdAt) }}</time>
                          </p>
                          <p class="mt-2 flex items-center text-sm text-gray-500">
                            <!-- Heroicon name: solid/check-circle -->
                            <svg
                              class="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg
                      class="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="hidden sm:block">
        <div class="flex flex-col">
          <div class="overflow-x-auto">
            <div class="py-2 align-middle inline-block min-w-full">
              <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        v-for="(header, idx) in headers"
                        :key="idx"
                        @click="sortBy(header.name)"
                        scope="col"
                        class="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none"
                        :class="{
                          'cursor-pointer hover:text-gray-700': header.name,
                        }"
                      >
                        <div class="flex items-center space-x-1 text-gray-500">
                          <div>{{ header.title }}</div>
                          <div
                            :class="{
                              invisible: !header.name || sortByColumn !== header.name,
                            }"
                          >
                            <svg
                              v-if="sortDirection === -1"
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            <svg
                              v-else
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    v-for="(contract, idxContract) in sortedItems"
                    :key="idxContract"
                    class="bg-white divide-y divide-gray-200"
                    @click="click(contract)"
                  >
                    <tr class="hover:bg-gray-50 cursor-pointer">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center max-w-xs truncate space-x-4">
                          <div class="flex-shrink-0 h-10 w-10">
                            <IconContractClock
                              v-if="contract.status === 0"
                              class="h-10 w-10 text-yellow-500"
                            />
                            <IconContractCheck
                              v-if="contract.status === 1"
                              class="h-10 w-10 text-teal-500"
                            />
                            <IconContractArchived
                              v-if="contract.status === 2"
                              class="h-10 w-10 text-gray-500"
                            />
                          </div>
                          <div class="truncate">
                            <div
                              class="text-sm font-extrabold text-gray-900 truncate"
                            >{{ contract.name }}</div>
                            <div
                              class="text-sm text-gray-500 flex items-center space-x-1 truncate"
                            >{{ contract.description }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-700">
                          {{ contract.link.providerWorkspace.name }}
                          <span
                            class="text-theme-600 font-normal lowercase"
                            v-if="currentWorkspaceNameIs(contract.link.providerWorkspace.name)"
                          >({{ $t("shared.you") }})</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-700">
                          {{ contract.link.clientWorkspace.name }}
                          <span
                            class="text-theme-600 font-normal lowercase"
                            v-if="currentWorkspaceNameIs(contract.link.clientWorkspace.name)"
                          >({{ $t("shared.you") }})</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          v-if="contract.status === 0"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 space-x-2 items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 text-yellow-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <div>{{ $t("app.contracts.status.PENDING") }}</div>
                        </span>
                        <span
                          v-if="contract.status === 1"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800 space-x-2 items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 text-teal-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                            />
                          </svg>
                          <div>{{ $t("app.contracts.status.SIGNED") }}</div>
                        </span>
                        <span
                          v-if="contract.status === 2"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 space-x-2 items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <div>{{ $t("app.contracts.status.ARCHIVED") }}</div>
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-xs text-gray-600">
                          <span v-if="contract.createdAt">{{ dateDM(contract.createdAt) }}</span>
                        </div>
                        <div class="text-xs text-gray-700">
                          <span v-if="contract.createdByUser">{{ contract.createdByUser.email }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import IconContractClock from "@/assets/icons/IconContractClock.vue";
import IconContractCheck from "@/assets/icons/IconContractCheck.vue";
import IconContractArchived from "@/assets/icons/IconContractArchived.vue";
import i18n from "@/locale/i18n";
import store from "@/store";
import EmptyState from "@/components/ui/emptyState/EmptyState.vue";
import DateUtils from "@/utils/shared/DateUtils";
import { PropType } from "@vue/runtime-core";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  items: Array as PropType<ContractDto[]>
})

const router = useRouter();

const sortByColumn = ref("createdAt");
const sortDirection = ref(1);
const headers = ref([
  {
    name: "name",
    title: i18n.global.t("models.contract.name"),
  },
  {
    title: i18n.global.t("models.provider.object"),
  },
  {
    title: i18n.global.t("models.client.object"),
    sortable: true,
  },
  {
    name: "status",
    title: i18n.global.t("models.contract.status"),
  },
  {
    name: "createdAt",
    title: i18n.global.t("shared.created"),
  }
]);

function sortBy(column) {
  if (column) {
    sortDirection.value = sortDirection.value === -1 ? 1 : -1;
    sortByColumn.value = column;
  }
}
function currentWorkspaceNameIs(name) {
  return store.state.tenant.currentWorkspace?.name === name;
}
function dateMonthName(value: Date | undefined) {
  return DateUtils.dateMonthName(value);
}
function dateDM(value: Date | undefined) {
  return DateUtils.dateDM(value);
}
function click(item) {
  router.push('/app/contract/' + item.id)
}
const sortedItems = computed((): ContractDto[] => {
  if (!props.items) {
    return []
  }
  const column = sortByColumn.value;
  if (!column || column === "") {
    return props.items;
  }
  return props.items.slice().sort((x, y) => {
    if (x[column] && y[column]) {
      if (sortDirection.value === -1) {
        return (x[column] > y[column] ? 1 : -1) ?? 1;
      } else {
        return (x[column] < y[column] ? 1 : -1) ?? 1;
      }
    }
    return 1;
  });
})
</script>
