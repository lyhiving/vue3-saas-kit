<template>
  <div>
    <div class="w-full flex justify-center mb-0">
      <div class="flex justify-center" v-if="billingPeriods.length > 0">
        <a
          v-for="(period, idx) in billingPeriods"
          :key="idx"
          @click.prevent="changeInterval(period)"
          class="border border-slate-200 dark:border-gray-700 uppercase py-1 flex justify-center w-36 sm:w-32 items-center space-x-2"
          :class="[
            billingPeriod !== period
              ? 'text-xs p-4 cursor-pointer bg-gray-50 dark:bg-gray-700'
              : 'text-xs p-4 cursor-pointer bg-white dark:bg-gray-900 border shadow-md border-slate-300 dark:border-gray-600',
            idx === 0
              ? 'rounded-l-md border-r-none'
              : 'rounded-r-md border-l-none'
          ]"
        >
          <div>{{ billingPeriodName(period) }}</div>
          <div
            v-if="isYearly(period) && yearlyDiscount()"
            class="text-right bg-green-200 text-green-600 ml-1 flex content-center items-center justify-center rounded-sm p-1 text-xs px-2 cursor-pointer font-semibold"
          >{{ yearlyDiscount() }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import i18n from "@/locale/i18n";
import store from "@/store";
import { computed } from "vue";

const $t = i18n.global.t;
const $emit = defineEmits(['selected'])

function changeInterval(billingPeriod: SubscriptionBillingPeriod) {
  store.commit("pricing/setBillingPeriod", billingPeriod);
  $emit("selected");
}
function billingPeriodName(billingPeriod: SubscriptionBillingPeriod): string {
  return $t(
    "pricing." + SubscriptionBillingPeriod[billingPeriod].toString()
  ).toString();
}
function isYearly(billingPeriod: SubscriptionBillingPeriod): boolean {
  return billingPeriod === SubscriptionBillingPeriod.YEARLY;
}
function yearlyDiscount(): string | undefined {
  const priceYearly = getPriceWithInterval(
    SubscriptionBillingPeriod.YEARLY
  );
  const priceMonthly = getPriceWithInterval(
    SubscriptionBillingPeriod.MONTHLY
  );
  if (priceYearly && priceMonthly) {
    const discount =
      100 - (priceYearly.price * 100) / (priceMonthly.price * 12);
    if (discount !== 0) {
      return "-" + discount.toFixed(0) + "%";
    }
  }

  return undefined;
}
function getPriceWithInterval(
  billingPeriod: SubscriptionBillingPeriod
): SubscriptionPriceDto | undefined {
  let price: SubscriptionPriceDto | undefined;
  if (products.value && products.value.length > 0) {
    products.value.forEach(product => {
      const prices = product.prices.find(
        f =>
          f.billingPeriod === billingPeriod &&
          f.currency === store.state.pricing.currency &&
          f.price > 0
      );
      if (prices) {
        price = prices;
      }
    });
  }
  return price;
}
function billingPeriods() {
  const allBillingPeriods: SubscriptionBillingPeriod[] = [];
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  products.value.forEach(element => {
    element.prices.forEach(price => {
      if (
        store.state.pricing.currency === price.currency &&
        price.billingPeriod !== SubscriptionBillingPeriod.ONCE
      ) {
        allBillingPeriods.push(price.billingPeriod);
      }
    });
  });
  return allBillingPeriods.filter(onlyUnique);
}
function billingPeriod() {
  return store.state.pricing.billingPeriod as SubscriptionBillingPeriod;
}
const products = computed((): SubscriptionProductDto[] => {
  return store.state.pricing.products as SubscriptionProductDto[];
})
</script>
