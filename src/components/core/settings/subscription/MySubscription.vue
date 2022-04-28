<template>
  <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="md:grid lg:grid-cols-3 md:gap-2">
      <div class="md:col-span-1">
        <div class="sm:px-0">
          <h3
            class="text-lg font-medium leading-6 text-gray-900"
          >{{ $t("settings.subscription.title") }}</h3>

          <div class="mt-1 text-xs leading-5 text-gray-600">
            <span v-if="subscription">
              <p class="text-xs text-gray-900 font-bold"></p>
              <p>
                <button
                  @click="cancel"
                  class="text-gray-500 font-medium hover:underline hover:text-gray-600"
                >{{ $t("settings.subscription.clickCancel") }}</button>
              </p>
            </span>
            <span v-else>{{ $t("settings.subscription.description") }}</span>
          </div>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <div v-if="!subscription && (!products || products.length === 0) && false">
          <div class="rounded-sm bg-yellow-50 p-4 mb-4 border border-yellow-200 shadow-sm">
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
                >{{ $t("settings.subscription.notSubscribed") }}</h3>
                <div class="mt-2 text-sm leading-5 text-yellow-700">
                  <p>{{ $t("settings.subscription.notSubscribedDescription") }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MySubscriptionProducts
          :withCurrentPlan="true"
          class="mb-4 bg-white shadow px-4 py-5 sm:p-6 space-y-2 sm:rounded-sm"
        />
        <MySubscriptionPlan />
        <MySubscriptionPaymentDetails class="mt-3" />
      </div>
    </div>

    <ConfirmModal ref="confirmModal" @yes="confirmCancel" />
    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import MySubscriptionPlan from "@/components/core/settings/subscription/MySubscriptionPlan.vue";
import MySubscriptionProducts from "@/components/core/settings/subscription/MySubscriptionProducts.vue";
import MySubscriptionPaymentDetails from "@/components/core/settings/subscription/MySubscriptionPaymentDetails.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import services from '@/services';
import { AppUsageType } from '@/application/enums/app/usages/AppUsageType';
import { SubscriptionPriceDto } from '@/application/dtos/core/subscriptions/SubscriptionPriceDto';
import { TenantProductDto } from '@/application/dtos/core/tenants/TenantProductDto';
import store from '@/store';
import { SubscriptionBillingPeriod } from '@/application/enums/core/subscriptions/SubscriptionBillingPeriod';
import i18n from "@/locale/i18n";
import { computed, onMounted, ref } from "vue";
import { useMeta } from "@/modules/vue-meta";

useMeta({
  title: i18n.global.t("app.navbar.subscription").toString(),
})

const $t = i18n.global.t;

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const confirmModal = ref<InstanceType<typeof ConfirmModal>>();

onMounted(() => {
  services.subscriptionProducts.getProducts();
  services.tenants.getCurrentUsage(AppUsageType.ALL);
})

function cancel() {
  confirmModal.value?.show($t("settings.subscription.confirmCancel"));
}
function confirmCancel() {
  return services.subscriptionManager
    .cancelSubscription()
    .then(() => {
      successModal.value?.show($t("shared.updated"), $t("settings.subscription.canceled"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
const products = computed((): TenantProductDto[] | undefined => {
  return (store.state.tenant?.subscription?.myProducts as TenantProductDto[]) ?? [];
})
const subscription = computed((): SubscriptionPriceDto | undefined => {
  const mySubscriptions = products.value?.filter((f) => f.subscriptionPrice.billingPeriod !== SubscriptionBillingPeriod.ONCE);
  if (mySubscriptions && mySubscriptions.length > 0) {
    return mySubscriptions[0].subscriptionPrice;
  } else {
    return undefined;
  }
})
</script>
