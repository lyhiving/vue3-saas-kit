<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <h1 class="flex-1 font-bold flex items-center truncate">
          {{ $t("models.tenant.plural") }}
          <span
            v-if="!loading"
            class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-300"
          >{{ orderedItems.length }}</span>
        </h1>
        <div class="flex items-center space-x-2 h-9">
          <ButtonSecondary @click="reload" type="button">{{ $t("shared.reload") }}</ButtonSecondary>
        </div>
      </div>
    </div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
      <Loading v-if="loading" />
      <div v-else class="space-y-2">
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
        <div v-if="orderedItems.length === 0">
          <EmptyState
            class="bg-white"
            :captions="{
              thereAreNo: $t('app.tenants.empty'),
            }"
          />
        </div>
        <div v-else>
          <div>
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
                            scope="col"
                            class="text-xs px-3 py-2 text-left font-medium text-gray-500 tracking-wider select-none truncate"
                          >
                            <div class="flex items-center space-x-1 text-gray-500">
                              <div>{{ header.title }}</div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, idx) in orderedItems" :key="idx">
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            <div class="flex flex-col max-w-sm truncate">
                              <router-link
                                :to="'/admin/tenant/' + item.id"
                                class="text-sm font-medium text-gray-900 hover:underline"
                              >{{ item.name }}</router-link>
                              <div>{{ getUsers(item) }}</div>
                            </div>
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            <div class="max-w-sm truncate">{{ getWorkspaces(item) }}</div>
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            <div>{{ getProducts(item) }}</div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import EmptyState from "@/components/ui/emptyState/EmptyState.vue";
import i18n from "@/locale/i18n";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import NumberUtils from "@/utils/shared/NumberUtils";
import services from "@/services";
import Loading from "@/components/ui/loaders/Loading.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import { useMeta } from "@/modules/vue-meta";
import { computed, onMounted, ref } from "vue";

const $t = i18n.global.t;

useMeta({
  title: i18n.global.t("admin.tenants.title").toString(),
})

const loading = ref(false);
const items = ref<TenantDto[]>([]);
const searchInput = ref("");
const headers = ref([
  {
    title: i18n.global.t("models.tenant.object"),
  },
  {
    title: i18n.global.t("models.workspace.plural"),
  },
  {
    title: i18n.global.t("models.tenant.subscription"),
  },
]);
onMounted(() => {
  reload();
})
async function reload() {
  loading.value = true;
  items.value = [];
  services.tenants
    .adminGetAll()
    .then((response: TenantDto[]) => {
      items.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
function getWorkspaces(item: TenantDto) {
  return item.workspaces?.map((f) => `${f.name}`).join(", ");
}
function getUsers(item: TenantDto) {
  return item.users?.map((f) => `${f.firstName} ${f.lastName} (${f.email})`).join(", ");
}
function getProducts(item: TenantDto) {
  return item.products
    ?.map(
      (f) =>
        `${f.subscriptionProduct.tier} - ${$t(f.subscriptionProduct.title)} (${NumberUtils.decimalFormat(f.subscriptionPrice.price)} ${f.subscriptionPrice.currency
        }${priceBillingPeriod(f.subscriptionPrice)})`
    )
    .join(", ");
}
function priceBillingPeriod(price: SubscriptionPriceDto): string {
  if (price.billingPeriod === SubscriptionBillingPeriod.ONCE) {
    return $t("pricing.once").toString();
  } else {
    return "/" + $t("pricing." + SubscriptionBillingPeriod[price.billingPeriod] + "Short");
  }
}
const filteredItems = computed((): TenantDto[] => {
  if (!items.value) {
    return [];
  }
  return items.value.filter(
    (f) =>
      f.subdomain !== "admin" &&
      (f.id?.toUpperCase().includes(searchInput.value.toUpperCase()) || f.name?.toString().toUpperCase().includes(searchInput.value.toUpperCase()))
  );
})
const orderedItems = computed((): TenantDto[] => {
  if (!filteredItems.value) {
    return [];
  }
  return filteredItems.value.slice().sort((x, y) => {
    if (x.createdAt && y.createdAt) {
      return (x.createdAt > y.createdAt ? -1 : 1) ?? -1;
    }
    return -1;
  });
})
</script>

