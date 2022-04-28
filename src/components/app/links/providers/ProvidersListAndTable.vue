<template>
  <div>
    <div v-if="sortedItems.length === 0">
      <EmptyState
        class="bg-white"
        :captions="{
          thereAreNo: $t('app.providers.empty'),
        }"
      />
    </div>
    <div v-else>
      <div class="sm:hidden">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="(item, idx) in sortedItems" :key="idx">
              <router-link :to="'/app/link/' + item.id" class="block hover:bg-gray-50">
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="min-w-0 flex-1 flex items-center">
                    <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <div class="flex items-end justify-between">
                          <div
                            class="text-sm truncate font-bold text-gray-900 flex-grow"
                          >{{ item.providerWorkspace.name }}</div>
                        </div>
                      </div>
                      <div class="hidden md:block">
                        <div>
                          <p class="text-sm text-gray-900">
                            <time v-if="item.createdAt">{{ dateMonthName(item.createdAt) }}</time>
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
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none"
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
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, idx) in sortedItems" :key="idx">
                      <td class="px-3 py-2 whitespace-nowrap">
                        <div
                          class="text-sm font-extrabold text-gray-900"
                        >{{ item.providerWorkspace.name }}</div>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span
                          v-if="item.contracts && item.contracts.length === 0"
                          class="italic text-gray-400"
                        >{{ $t("shared.notApplicable") }}</span>
                        <router-link
                          v-else
                          :to="'/app/contracts/all?l=' + item.id"
                          class="text-theme-600 hover:text-theme-800 lowercase underline font-medium"
                        >
                          <span v-if="item.contracts">
                            {{ item.contracts.length }}
                            <span
                              v-if="item.contracts.length === 1"
                            >{{ $t("models.contract.object") }}</span>
                            <span v-else>{{ $t("models.contract.plural") }}</span>
                          </span>
                        </router-link>
                      </td>

                      <td class="w-20 px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <div class="flex items-center space-x-2">
                          <ButtonTertiary :to="'/app/contract/new?l=' + item.id">
                            <div>{{ $t("app.contracts.new.title") }}</div>
                          </ButtonTertiary>
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
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import EmptyState from "@/components/ui/emptyState/EmptyState.vue";
import DateUtils from "@/utils/shared/DateUtils";
import i18n from '@/locale/i18n';
import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.vue";
import { PropType } from "@vue/runtime-core";
import { computed, ref } from "vue";

const props = defineProps({
  items: Array as PropType<LinkDto[]>
})

const sortByColumn = ref("status");
const sortDirection = ref(-1);
const headers = ref([
  {
    name: "name",
    title: i18n.global.t("models.provider.object"),
  },
  {
    title: i18n.global.t("models.contract.plural"),
  },
  {
    title: i18n.global.t("shared.actions"),
  }
]);

function sortBy(column) {
  if (column) {
    sortDirection.value = sortDirection.value === -1 ? 1 : -1;
    sortByColumn.value = column;
  }
}
function dateMonthName(value: Date | undefined) {
  return DateUtils.dateMonthName(value);
}
const sortedItems = computed((): LinkDto[] => {
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
