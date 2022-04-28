<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <h1 class="flex-1 font-bold flex items-center truncate">
          {{
          $t("admin.pricing.title")
          }}
          <span
            v-if="!loading"
            class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-300"
          >{{ items.length }}</span>
        </h1>
        <div class="flex items-center space-x-2 h-9">
          <ButtonSecondary to="/pricing" target="_blank">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <div v-if="!fromServer">{{ $t("shared.preview") }}</div>
            <div v-else>{{ $t("shared.view") }}</div>
          </ButtonSecondary>
        </div>
      </div>
    </div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl overflow-auto">
      <Loading v-if="loading" />
      <div v-else>
        <div v-if="!items || items.length === 0"></div>
        <div v-else>
          <div>
            <div
              class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-sm border-b border-gray-200 space-y-2"
            >
              <div
                v-if="!fromServer"
                class="bg-yellow-50 mb-2 rounded-sm border border-yellow-300 min-w-full"
              >
                <div class="rounded-sm bg-yellow-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>

                    <div class="ml-3">
                      <h3
                        class="text-sm leading-5 font-medium text-yellow-800"
                      >{{ $t("shared.warning") }}</h3>
                      <div class="mt-2 text-sm leading-5 text-yellow-700">
                        <p>{{ $t("admin.pricing.thesePricesAreFromFiles") }}</p>
                      </div>
                      <div class="text-sm leading-5 right-0 -ml-3 mt-2">
                        <span class="inline-flex rounded-sm ml-2">
                          <button
                            @click="generateFromFiles"
                            class="ml-1 h-8 inline-flex items-center px-4 py-2 border border-orange-200 text-xs leading-5 font-medium rounded-sm text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:shadow-outline-indigo focus:border-theme-700 active:bg-theme-700 transition duration-150 ease-in-out"
                          >{{ $t("admin.pricing.generateFromFiles") }}</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.tier") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.title") }}</th>

                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.badge") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.status") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.workspaces") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.users") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.links") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.storage") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.monthlyContracts") }}</th>
                    <th
                      class="px-3 py-3 bg-gray-50 text-left text-xs leading-2 font-medium text-gray-500 tracking-wider truncate"
                    >{{ $t("models.subscriptionProduct.serviceId") }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in orderedItems" :key="index" class="text-gray-600">
                    <td class="truncate px-3 py-3 text-sm leading-3">{{ item.tier }}</td>
                    <td class="truncate px-3 py-3 text-sm leading-3">{{ $t(item.title) }}</td>
                    <td class="truncate px-3 py-3 text-sm leading-3">
                      <div v-if="item.badge">{{ $t(item.badge) }}</div>
                    </td>
                    <!-- <td class="truncate px-3 py-3 text-sm leading-3">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium leading-1"
                        :class="item.active ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-rose-50 text-red-800 border border-red-200'"
                      >{{ item.active ? $t("shared.active") : $t("shared.inactive") }}</span>
                    </td>-->
                    <td
                      class="truncate px-3 py-3 text-sm leading-3"
                    >{{ item.active ? $t("shared.active") : $t("shared.inactive") }}</td>
                    <td
                      class="truncate px-3 py-3 text-sm leading-3"
                    >{{ !item.maxWorkspaces || item.maxWorkspaces === 0 ? $t("shared.unlimited") : item.maxWorkspaces }}</td>
                    <td
                      class="truncate px-3 py-3 text-sm leading-3"
                    >{{ !item.maxUsers || item.maxUsers === 0 ? $t("shared.unlimited") : item.maxUsers }}</td>
                    <td
                      class="truncate px-3 py-3 text-sm leading-3"
                    >{{ !item.maxLinks || item.maxLinks === 0 ? $t("shared.unlimited") : item.maxLinks }}</td>
                    <td class="truncate px-3 py-3 text-sm leading-3">
                      {{ !item.maxStorage || item.maxStorage === 0 ? $t("shared.unlimited") : item.maxStorage / 1024 }}
                      <span
                        v-if="item.maxStorage > 0"
                      >{{ $t("shared.storage.gb") }}</span>
                    </td>
                    <td
                      class="truncate px-3 py-3 text-sm leading-3"
                    >{{ !item.monthlyContracts || item.maxLinks === 0 ? $t("shared.unlimited") : item.monthlyContracts }}</td>
                    <td
                      class="truncate px-3 py-3 text-sm leading-3 text-theme-700"
                    >{{ item.serviceId }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ErrorModal ref="errorModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto"
import services from "@/services";
import Loading from "@/components/ui/loaders/Loading.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import i18n from '@/locale/i18n';
import { useMeta } from "@/modules/vue-meta";
import { computed, onMounted, ref } from "vue";
import plans from "@/application/pricing/plans";

const $t = i18n.global.t;
useMeta({
  title: i18n.global.t("admin.pricing.title").toString(),
})

const errorModal = ref<InstanceType<typeof ErrorModal>>();

const loading = ref(false);
const items = ref<SubscriptionProductDto[]>([]);
const fromServer = ref(true);

onMounted(() => {
  reload();
})

function reload() {
  items.value = [];
  loading.value = true;
  services.subscriptionProducts
    .getProducts()
    .then((response: SubscriptionProductDto[]) => {
      items.value = [];
      if (response.length === 0) {
        items.value = plans;
      } else {
        response?.forEach((product) => {
          items.value.push(product);
        });
      }
      const notInDatabase = items.value.filter(f => f.id === undefined || f.id === '');
      if (notInDatabase.length === 0) {
        fromServer.value = true;
      }
      else if (notInDatabase.length === items.value.length) {
        fromServer.value = false;
      }
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function generateFromFiles() {
  loading.value = true;
  createAllPlans().finally(() => {
    reload();
  });
}
async function createAllPlans() {
  const allAsyncResults: any[] = [];

  for (const product of items.value) {
    const asyncResult = await services.subscriptionProducts.createProduct(product).catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
    allAsyncResults.push(asyncResult);
  }

  return allAsyncResults;
}
const orderedItems = computed(() => {
  if (!items.value) {
    return [];
  }
  return items.value.slice().sort((x, y) => {
    return x?.tier > y?.tier ? 1 : -1;
  });
})
</script>
