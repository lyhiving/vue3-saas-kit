<template>
  <div class="container mx-auto antialiased">
    <main class="lg:mx-4">
      <div class="flex items-center justify-center mt-10 space-x-4">
        <span class="text-base font-medium">{{ $t("pricing.MONTHLY") }}</span>
        <button
          class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          @click="toggleBillingPeriod"
        >
          <div class="w-16 h-8 transition bg-theme-500 rounded-full shadow-md outline-none"></div>
          <div
            class="absolute inline-flex bg-white items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform rounded-full shadow-sm top-1 left-1"
            :class="{
              'translate-x-0': billingPeriod === 3,
              'translate-x-8': billingPeriod === 4,
            }"
          ></div>
        </button>
        <span class="text-base font-medium">
          {{ $t("pricing.YEARLY") }}
          <span
            v-if="getYearlyDiscount"
            class="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-teal-100 text-teal-800"
          >{{ getYearlyDiscount }}</span>
        </span>
      </div>

      <Loading v-if="loading" />
      <div v-else class="space-y-6">
        <WarningBannner
          v-if="testProducts"
          :title="$t('shared.warning')"
          redirect="/admin/pricing"
          :text="$t('admin.pricing.thesePricesAreFromFiles')"
        />
        <div
          class="mt-16 grid gap-6 lg:gap-3"
          :class="{
            'lg:grid-cols-2': products.length === 2,
            'lg:grid-cols-3': products.length > 2,
          }"
        >
          <div
            v-for="(plan, index) in products.filter((f) => !f.contactUs)"
            :key="index"
            :class="{}"
          >
            <section
              class="relative flex flex-col w-full p-12 rounded-lg shadow-xl border border-theme-100"
              :class="{
                'border border-theme-100 dark:border-theme-800': !plan.badge,
                'border-2 border-theme-400 dark:border-theme-600': plan.badge,
              }"
            >
              <div
                v-if="plan.badge"
                class="absolute top-0 py-1.5 px-4 bg-theme-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2"
              >{{ $t(plan.badge) }}</div>
              <div class="flex-1 space-y-6">
                <!-- Price -->
                <div class="flex-shrink-0">
                  <span
                    class="text-4xl font-medium tracking-tight"
                  >{{ intFormat(getPriceAmount(plan)) }}</span>
                  <span
                    class="text-gray-500"
                    v-if="billingPeriod === 3"
                  >/ {{ $t("pricing.MONTHLYShort") }}</span>
                  <span class="text-gray-500" v-else>/ {{ $t("pricing.YEARLYShort") }}</span>
                </div>

                <!-- Badge -->
                <div class="flex-shrink-0 pb-6 space-y-2 border-b">
                  <h2 class="text-2xl font-normal">{{ $t(plan.title) }}</h2>
                  <p class="text-sm text-gray-500">{{ $t(plan.description) }}</p>
                </div>

                <!-- Features -->
                <ul class="flex-1 space-y-4">
                  <li v-for="(feature, idxFeature) in plan.features" :key="idxFeature">
                    <div class="flex items-center">
                      <svg
                        v-if="feature.included"
                        class="w-5 h-5 text-teal-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-red-300"
                        viewBox="0 0 20 20"
                        stroke="#FFFFF"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="ml-3 text-base font-medium truncate">
                        <span>{{ $t(feature.key, [feature.value]) }}</span>
                      </span>
                    </div>
                  </li>
                </ul>

                <!-- Button -->
                <div class="flex-shrink-0 pt-4">
                  <button
                    type="button"
                    @click="selectProduct(plan)"
                    class="inline-flex items-center justify-center w-full px-4 py-2 transition-colors border dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                    :class="plan.badge ? 'bg-theme-500 text-white hover:bg-theme-700' : 'hover:bg-theme-500 hover:text-white'"
                  >
                    <span v-if="getPriceAmount(plan) === 0">{{ $t("pricing.signUpFree") }}</span>
                    <span v-else-if="billingPeriodOnce(plan)">{{ $t("pricing.payOnce") }}</span>
                    <span
                      v-else-if="getPriceTrialDays(plan) > 0"
                    >{{ $t("pricing.startTrial", [getPriceTrialDays(plan)]) }}</span>
                    <span v-else>{{ $t("pricing.subscribe") }}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div v-if="customPlan" class="relative">
          <div>
            <div
              class="mx-auto rounded-lg shadow-xl border border-transparent overflow-hidden lg:flex"
            >
              <div class="flex-1 bg-slate-800 dark:bg-theme-700 px-6 py-8 lg:p-12">
                <h3
                  class="text-2xl font-extrabold text-white sm:text-3xl"
                >{{ $t(customPlan.title) }}</h3>
                <p class="mt-6 text-base text-white">{{ $t(customPlan.description) }}</p>
                <div class="mt-8">
                  <div class="flex items-center">
                    <h4
                      class="flex-shrink-0 pr-4 text-sm tracking-wider font-semibold uppercase text-white"
                    >{{ $t("pricing.whatsIncluded") }}</h4>
                    <div class="flex-1 border-t dark:border-gray-300 border-gray-700"></div>
                  </div>
                  <ul
                    role="list"
                    class="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5"
                  >
                    <li
                      v-for="(feature, idxFeature) in customPlan.features"
                      :key="idxFeature"
                      class="flex items-start lg:col-span-1"
                    >
                      <div class="flex-shrink-0">
                        <!-- Heroicon name: solid/check-circle -->
                        <svg
                          class="h-5 w-5 text-teal-400"
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
                      </div>
                      <p class="ml-3 text-sm text-gray-50">
                        <span>{{ $t(feature.key, [feature.value]) }}</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                class="py-8 px-6 text-center lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12"
              >
                <div
                  class="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900 dark:text-white"
                >
                  <span>{{ $t("pricing.contactUs") }}</span>
                </div>
                <p class="mt-4 text-sm">
                  <span class="font-medium text-gray-500">{{ $t("pricing.customPlanDescription") }}</span>
                </p>
                <div class="mt-6">
                  <div class="rounded-md shadow max-w-md mx-auto">
                    <router-link
                      to="/contact"
                      class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900"
                    >{{ $t("pricing.contact") }}</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import WarningBannner from "@/components/ui/banners/WarningBanner.vue";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import store from "@/store";
import services from "@/services";
import NumberUtils from "@/utils/shared/NumberUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import { useRouter } from "vue-router";
import plans from "@/application/pricing/plans";
import i18n from "@/locale/i18n";

const $t = i18n.global.t;
const router = useRouter();

const errorModal = ref<InstanceType<typeof ErrorModal>>();

const loading = ref(false);
const items = ref<SubscriptionProductDto[]>([]);

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
      response?.forEach((product) => {
        items.value.push(product);
      });
      if (!testProducts.value && items.value.length === 0) {
        items.value = plans;
      }
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function billingPeriodOnce(product: SubscriptionProductDto): boolean | undefined {
  return getPrice(product)?.billingPeriod === SubscriptionBillingPeriod.ONCE;
}
function productUrl(product: SubscriptionProductDto) {
  if (product.contactUs) {
    return "/contact";
  }
  return "/register";
}
function selectProduct(product: SubscriptionProductDto) {
  store.commit("pricing/setSelected", {
    product,
    billingPeriod: billingPeriod,
  });
  router.push(productUrl(product))
}
function getPrice(product: SubscriptionProductDto): SubscriptionPriceDto | undefined {
  const prices = product.prices.find((f) => (f.billingPeriod === billingPeriod.value || f.billingPeriod === SubscriptionBillingPeriod.ONCE) && f.currency === currency.value && f.active);
  return prices;
}
function getPriceAmount(product): number {
  return getPrice(product)?.price ?? 0;
}
function getPriceTrialDays(product): number {
  return getPrice(product)?.trialDays ?? 0;
}
function toggleBillingPeriod() {
  if (billingPeriod.value === SubscriptionBillingPeriod.MONTHLY) {
    store.commit("pricing/setBillingPeriod", SubscriptionBillingPeriod.YEARLY);
  } else {
    store.commit("pricing/setBillingPeriod", SubscriptionBillingPeriod.MONTHLY);
  }
}
function intFormat(value: number) {
  return NumberUtils.intFormat(value);
}
function getPriceWithInterval(billingPeriod: SubscriptionBillingPeriod): SubscriptionPriceDto | undefined {
  let price: SubscriptionPriceDto | undefined;
  if (products.value && products.value.length > 0) {
    products.value.forEach((product) => {
      const prices = product.prices.find((f) => f.billingPeriod === billingPeriod && f.currency === currency.value && f.price > 0);
      if (prices) {
        price = prices;
      }
    });
  }
  return price;
}
const getYearlyDiscount = computed((): string | undefined => {
  const priceYearly = getPriceWithInterval(SubscriptionBillingPeriod.YEARLY);
  const priceMonthly = getPriceWithInterval(SubscriptionBillingPeriod.MONTHLY);
  if (priceYearly && priceMonthly) {
    const discount = 100 - (priceYearly.price * 100) / (priceMonthly.price * 12);
    if (discount !== 0) {
      return "-" + discount.toFixed(0) + "%";
    }
  }

  return undefined;
})
const currency = computed(() => {
  return store.state.pricing.currency;
})
const billingPeriod = computed(() => {
  return store.state.pricing.billingPeriod;
})
const customPlan = computed((): SubscriptionProductDto | undefined => {
  return products.value.find((f) => f.contactUs);
})
const products = computed((): SubscriptionProductDto[] => {
  return (store.state.pricing.products as SubscriptionProductDto[])
    .filter((f) => getPrice(f) !== undefined && f.active)
    .sort((x, y) => {
      return x.tier > y.tier ? 1 : -1;
    });
})
const testProducts = computed(() => {
  return !products.value || products.value.filter((f) => f.id === undefined || f.id === "").length > 0;
})
</script>