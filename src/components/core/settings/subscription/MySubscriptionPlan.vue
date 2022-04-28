<template>
  <div>
    <form @submit.prevent method="POST">
      <div class="shadow sm:rounded-sm">
        <div class="px-4 py-5 bg-white sm:p-6 space-y-2">
          <div class="flex items-center space-x-2 justify-between">
            <h3 class="leading-5 font-medium text-gray-900">{{ $t("shared.upgrade") }}</h3>
          </div>
          <div class="grid grid-cols-6 gap-2">
            <PlansRadioButtons
              :plansLabel="false"
              :showCurrent="true"
              ref="plans"
              class="-mt-6 col-span-6"
            />
          </div>
        </div>
        <div class="px-4 py-3 sm:px-6 flex items-center space-x-2 justify-end">
          <ButtonSecondary @click="openDropdown">
            <span>{{ !editing ? $t("shared.change") : $t("shared.cancel") }}</span>
          </ButtonSecondary>
          <LoadingButton
            v-if="editing"
            @click="updateSubscription"
            :disabled="selectingCurrentTenantProduct"
            :class="{
              ' opacity-50 cursor-not-allowed': selectingCurrentTenantProduct
            }"
            ref="loadingButton"
          >{{ $t("shared.upgrade") }}</LoadingButton>
        </div>
      </div>
    </form>

    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmModal" @yes="yesUpdate" />
  </div>
</template>

<script setup lang="ts">
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons.vue"
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { SubscriptionCardDto } from "@/application/dtos/core/subscriptions/SubscriptionCardDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import store from "@/store";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import TenantUtils from "@/utils/store/TenantUtils";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import i18n from "@/locale/i18n";
import { computed, ref } from "vue";

const $t = i18n.global.t;

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const confirmModal = ref<InstanceType<typeof ConfirmModal>>();
const loadingButton = ref<InstanceType<typeof LoadingButton>>();
const plans = ref<InstanceType<typeof PlansRadioButtons>>();

const editing = ref(false);
const subscriptionCard = ref<SubscriptionCardDto | null>(null);

function updateSubscription() {
  if (
    !selectedPrice.value ||
    !selectedProduct.value
  ) {
    errorModal.value?.show(
      $t("shared.error"),
      $t("settings.subscription.errors.selectPlan")
    );
    return;
  }
  if (
    selectedPrice.value.trialDays === 0 &&
    selectedPrice.value.price > 0 &&
    !subscriptionCard.value
  ) {
    errorModal.value?.show($t("settings.tenant.payment.notSet"));
    return;
  }
  if (selectingCurrentTenantProduct.value) {
    errorModal.value?.show(
      $t("settings.subscription.alreadySubscribed")
    );
    return;
  }

  confirmModal.value?.show(
    $t("shared.updateSubscriptionTo", [
      $t(selectedProduct.value.title)
    ]).toString(),
    $t("shared.confirm").toString(),
    $t("shared.back").toString(),
    priceDescription.value
  );
}
function yesUpdate() {
  if (!selectedPrice.value) {
    return;
  }
  loadingButton.value?.start();
  services.subscriptionManager
    .updateSubscription({
      subscriptionPriceId: selectedPrice.value.id
    })
    .then(() => {
      services.subscriptionManager.getCurrentSubscription();
      services.tenants.getFeatures();
      successModal.value?.show(
        $t("shared.updated"),
        $t("settings.subscription.updated")
      );
      tinyEventBus().emitter.emit("updated-plan");
      editing.value = false;
    })
    .catch(error => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      if (loadingButton.value) {
        loadingButton.value?.stop();
      }
    });
}
function openDropdown() {
  editing.value = !editing.value;
}
const selectedProduct = computed(() => {
  return store.state.pricing.selectedProduct;
})
const selectedPrice = computed(() => {
  return selectedProduct.value?.prices.find(
    f => f.billingPeriod === store.state.pricing.billingPeriod
  );
})
const activeTenantProducts = computed(() => {
  return TenantUtils.activeProducts();
})
const selectingCurrentTenantProduct = computed(() => {
  if (selectedPrice.value && activeTenantProducts.value.length > 0) {
    return selectedPrice.value.id === activeTenantProducts.value[0].id;
  }
  return false;
})
const priceDescription = computed((): string => {
  if (!selectedPrice.value) {
    return "";
  }
  const price = selectedPrice.value.price;
  const currency = selectedPrice.value.currency;
  const period =
    "/" +
    $t(
      "pricing." +
      SubscriptionBillingPeriod[selectedPrice.value.billingPeriod] +
      "Short"
    );
  // const feature = selectedProduct.value?.features[0].value;
  return `${price} ${currency}${period}.`;
})
</script>
