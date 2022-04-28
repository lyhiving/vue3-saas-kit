<template>
  <div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else-if="item && item.id">
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
                    <tr v-for="(item, idx) in products" :key="idx">
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span
                          v-if="item.subscriptionPrice && item.subscriptionPrice.subscriptionProduct"
                        >{{ $t(item.subscriptionPrice.subscriptionProduct.title) }}</span>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span
                          v-if="item.subscriptionPrice"
                        >{{ item.subscriptionPrice.price }}{{ priceBillingPeriod(item.subscriptionPrice) }}</span>
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ dateYMD(item.startDate) }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ dateYMD(item.endDate) }}</td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span
                          v-if="item.trialEnds"
                        >{{ $t("settings.subscription.trial.ends") }} {{ dateAgo(item.trialEnds) }}</span>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span v-if="item.active">{{ $t("shared.active") }}</span>
                        <span v-else>{{ $t("shared.inactive") }}</span>
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxWorkspaces }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxUsers }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxLinks }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.monthlyContracts }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxStorage / 1024 }}</td>
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
import services from "@/services";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import i18n from '@/locale/i18n';
import { onMounted, ref } from "vue";

const props = defineProps({
  id: {
    default: ""
  }
})

const $t = i18n.global.t;

const loading = ref(false);
const openOptions = ref(false);

const item = ref<TenantDto>({} as TenantDto);
const products = ref<TenantProductDto[]>([]);

const headers = [
  {
    title: i18n.global.t("app.tenants.subscription.plan"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.price"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.starts"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.ends"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.isTrial"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.status"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.workspaces"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.members"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.links"),
  },
  {
    title: i18n.global.t("models.contract.plural"),
  },
  {
    title: i18n.global.t("app.tenants.subscription.storage"),
  },
];

onMounted(() => {
  reload();
})

function reload() {
  closeOptions();
  const promises: any[] = [
    services.tenants.get(props.id).then((response) => {
      item.value = response;
    }),
    services.tenants.adminGetProducts(props.id).then((response) => {
      products.value = response;
    }),
  ];

  loading.value = true;
  Promise.all(promises).finally(() => {
    loading.value = false;
  });
}
function closeOptions() {
  openOptions.value = false;
}
function priceBillingPeriod(price: SubscriptionPriceDto): string {
  if (price.billingPeriod === SubscriptionBillingPeriod.ONCE) {
    return $t("pricing.once").toString();
  } else {
    return "/" + $t("pricing." + SubscriptionBillingPeriod[price.billingPeriod] + "Short");
  }
}
function dateAgo(value: Date) {
  return DateUtils.dateAgo(value);
}
function dateYMD(value: Date | undefined) {
  return DateUtils.dateYMD(value);
}
</script>
