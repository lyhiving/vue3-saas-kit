<template>
  <div>
    <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <section class="absolute inset-y-0 pl-16 max-w-full right-0 flex">
          <div class="w-screen max-w-md">
            <div class="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-2xl">
              <div class="flex-1 h-0 overflow-y-auto bg-white text-gray-600">
                <header
                  class="space-y-1 py-6 px-4 bg-gray-100 sm:px-6 shadow-inner border-b border-gray-200"
                >
                  <div class="flex items-center justify-between space-x-3">
                    <h2
                      class="text-lg leading-7 font-medium text-gray-800"
                    >{{ $t("settings.tenant.create") }}</h2>
                    <div class="h-7 flex items-center">
                      <button
                        @click="close"
                        aria-label="Close panel"
                        class="text-gray-500 hover:text-gray-800 transition ease-in-out duration-150"
                      >
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-sm leading-5 text-gray-500"
                    >{{ $t("settings.tenant.createDescription") }}</p>
                  </div>
                </header>
                <div class="flex-1 flex flex-col justify-between">
                  <div class="px-4 divide-y divide-gray-200 sm:px-6">
                    <div class="space-y-3 pt-6 pb-5">
                      <div>
                        <label
                          class="block text-sm font-medium"
                        >{{ $t("account.register.organization") }}</label>

                        <div class="mt-1 rounded-md shadow-sm -space-y-px">
                          <div>
                            <label for="company" class="sr-only">{{ $t("models.workspace.name") }}</label>
                            <input
                              v-model="name"
                              type="text"
                              name="company"
                              id="company"
                              :placeholder="$t('models.workspace.name')"
                              required
                              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <CurrencyToggle class="w-full flex justify-center" theme="light" />
                      </div>
                      <div class="space-y-1">
                        <PlansRadioButtons ref="plans" />
                      </div>
                    </div>

                    <div class="space-y-4 pt-4 pb-6 text-right text-gray-700">
                      <div class="text-sm leading-5 right-0">
                        <span class="inline-flex rounded-sm shadow-sm">
                          <ButtonSecondary @click="close">{{ $t("shared.cancel") }}</ButtonSecondary>
                        </span>
                        <span class="inline-flex rounded-sm shadow-sm ml-2">
                          <ButtonPrimary @click="createTenant">{{ $t("shared.create") }}</ButtonPrimary>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <Modal ref="cardModal">
      <div>
        <PayCard :buttonText="getButtonText" @payed="payed" @error="payError" />
      </div>
    </Modal>
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmModal" @yes="tryRegister" />
  </div>
</template>

<script setup lang="ts">
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Modal from "@/components/ui/modals/Modal.vue";
import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons.vue"
import PayCard from "@/components/front/PayCard.vue";
import CurrencyToggle from "@/components/ui/toggles/CurrencyToggle.vue";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import store from "@/store";
import services from "@/services";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import i18n from "@/locale/i18n";
import { computed, onMounted, ref } from "vue";

const $t = i18n.global.t;

const $emit = defineEmits(['close'])

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const cardModal = ref<InstanceType<typeof Modal>>();
const confirmModal = ref<InstanceType<typeof ConfirmModal>>();

const name = ref("");
const stripeKey = ref("");
const stripeOptions = ref({} as any);

stripeKey.value = import.meta.env.VITE_VUE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
stripeOptions.value = {
  showCardHolderName: true,
  hidePostalCode: false,
  iconStyle: "solid",
  elements: {
    locale: i18n.global.locale,
  },
};

const selectedProduct = computed(() => {
  return store.state.pricing.selectedProduct as SubscriptionProductDto;
})

if (!selectedProduct.value) {
  store.commit("pricing/setSelected", {
    product: store.state.pricing.products[0],
    billingPeriod: SubscriptionBillingPeriod.MONTHLY,
  });
}

onMounted(() => {
  services.subscriptionProducts.getProducts();
})

function close() {
  $emit("close");
}
function createTenant() {
  if (!selectedPrice.value || name.value === "") {
    errorModal.value?.show($t("shared.missingFields"));
  } else {
    confirmModal.value?.show($t("settings.tenant.createConfirm"));
  }
}
function tryRegister() {
  if (selectedPrice.value?.trialDays === 0 && selectedPrice.value?.price > 0) {
    cardModal.value?.show();
  } else {
    register();
  }
}
function payError(error) {
  errorModal.value?.show(i18n.global.t(error));
}
function payed(data) {
  if (data.error) {
    errorModal.value?.show("Error", data.error.message);
  } else {
    register(data.token.id);
  }
}
function register(stripeCardToken = "") {
  const tenantCreateRequest: TenantCreateRequest = {
    name: name.value,
    selectedSubscription: {
      subscriptionPriceId: selectedPrice.value?.id ?? "",
      subscriptionCardToken: stripeCardToken,
      subscriptionCoupon: "",
    },
  };
  services.tenants
    .create(tenantCreateRequest)
    .then(() => {
      name.value = "";
      $emit("close");
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
const getButtonText = computed((): string => {
  if (selectedPrice.value) {
    return (
      (selectedPrice.value.billingPeriod === SubscriptionBillingPeriod.ONCE ? $t("pricing.pay") : $t("pricing.subscribe")) +
      " " +
      priceDescription.value
    );
  }
  return "";
})
const selectedPrice = computed((): SubscriptionPriceDto | undefined => {
  if (selectedProduct.value) {
    return selectedProduct.value.prices.find((f) => f.billingPeriod === store.state.pricing.billingPeriod) ?? selectedProduct.value.prices[0];
  }
  return undefined;
})
const billingPeriod = computed((): string => {
  if (selectedPrice.value) {
    if (selectedPrice.value?.billingPeriod === SubscriptionBillingPeriod.ONCE) {
      return $t("pricing.once").toString();
    } else {
      return "/ " + $t("pricing." + SubscriptionBillingPeriod[selectedPrice.value.billingPeriod] + "Short");
    }
  }
  return "";
})
const priceDescription = computed(() => {
  return "$" + selectedPrice.value?.price + " " + billingPeriod.value;
})
</script>
