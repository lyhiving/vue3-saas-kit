<template>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo class="mx-auto h-12 w-auto" />
      <div v-if="!registered">
        <h2
          class="mt-6 text-center text-lg leading-9 font-bold text-gray-800 dark:text-slate-200"
        >{{ $t("account.register.title") }}</h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-800 dark:text-slate-200 max-w">
          {{ $t("account.register.alreadyRegistered") }}
          <a
            class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
          </a>
        </p>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="py-0 px-0 sm:rounded-sm sm:px-10">
            <form @submit.prevent="tryRegister()" class="space-y-6">
              <!-- Workspace -->
              <div>
                <label class="block text-sm font-medium">{{ $t("account.register.organization") }}</label>

                <div class="mt-1 rounded-md shadow-sm -space-y-px">
                  <div>
                    <label for="company" class="sr-only">{{ $t("models.workspace.object") }}</label>
                    <input
                      id="company"
                      v-model="user.workspaceName"
                      type="text"
                      name="company"
                      required
                      :disabled="!workspaceNameEnabled"
                      :placeholder="$t('models.workspace.name')"
                      :class="{
                        'bg-gray-100 dark:bg-slate-800 cursor-not-allowed': !workspaceNameEnabled,
                      }"
                      class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <!-- Workspace: End  -->

              <!-- Personal Info -->
              <div>
                <legend class="block text-sm font-medium">{{ $t("account.register.personalInfo") }}</legend>
                <div class="mt-1 rounded-sm shadow-sm -space-y-px">
                  <div class="flex">
                    <div class="w-1/2">
                      <label for="first-name" class="sr-only">{{ $t("models.user.firstName") }}</label>
                      <input
                        v-model="user.firstName"
                        ref="inputFirstName"
                        type="text"
                        name="first-name"
                        id="first-name"
                        required
                        class="appearance-none rounded-none rounded-tl-md relative block w-full px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        :placeholder="$t('account.register.firstName')"
                      />
                    </div>
                    <div class="w-1/2">
                      <label for="last-name" class="sr-only">{{ $t("models.user.lastName") }}</label>
                      <input
                        v-model="user.lastName"
                        type="text"
                        name="last-name"
                        id="last-name"
                        required
                        class="appearance-none rounded-none rounded-tr-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        :placeholder="$t('account.register.lastName')"
                      />
                    </div>
                  </div>
                  <div>
                    <label for="email" class="sr-only">{{ $t("models.user.email") }}</label>
                    <input
                      v-model="user.email"
                      type="text"
                      name="email"
                      id="email"
                      required
                      :placeholder="$t('account.shared.email')"
                      :disabled="!emailEnabled"
                      :class="{
                        'bg-gray-100 dark:bg-slate-800 cursor-not-allowed': !emailEnabled,
                      }"
                      class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <input
                    v-model="user.password"
                    id="password"
                    type="password"
                    autocomplete="off"
                    required
                    :placeholder="$t('account.register.password')"
                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                  <input
                    v-model="user.confirmPassword"
                    id="confirmPassword"
                    type="password"
                    autocomplete="off"
                    required
                    :placeholder="$t('account.register.confirmPassword')"
                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-b-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <!-- Personal Info: End -->

              <Plans />

              <div class="mt-2 flex items-center space-x-3">
                <button
                  aria-label="accept-terms-and-conditions"
                  type="button"
                  class="relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                  @click="toggleAcceptTerms"
                  role="switch"
                  aria-checked="false"
                  :class="{
                    'bg-gray-200 dark:bg-gray-700': !acceptTermsAndConditions,
                    'bg-theme-600 dark:bg-theme-400': acceptTermsAndConditions,
                  }"
                >
                  <span class="sr-only">{{ $t("app.workspaces.types.PUBLIC") }}</span>
                  <span
                    class="translate-x-0 pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900 shadow transform ring-0 transition ease-in-out duration-200"
                    :class="{
                      'translate-x-4': acceptTermsAndConditions,
                      'translate-x-0': !acceptTermsAndConditions,
                    }"
                  >
                    <!-- Enabled: "opacity-0 ease-out duration-100", Not Enabled: "opacity-100 ease-in duration-200" -->
                    <span
                      class="opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                      aria-hidden="true"
                      :class="{
                        'hidden opacity-0 ease-out duration-100': acceptTermsAndConditions,
                        'opacity-100 ease-in duration-200': !acceptTermsAndConditions,
                      }"
                    >
                      <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                        <path
                          d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <!-- Enabled: "opacity-100 ease-in duration-200", Not Enabled: "opacity-0 ease-out duration-100" -->
                    <span
                      class="opacity-0 ease-out duration-100 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                      aria-hidden="true"
                      :class="{
                        'opacity-100 ease-in duration-200': acceptTermsAndConditions,
                        'hidden opacity-0 ease-out duration-100': !acceptTermsAndConditions,
                      }"
                    >
                      <svg
                        class="h-3 w-3 text-theme-600 dark:text-theme-400"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
                <span class="flex-grow flex flex-col">
                  <span
                    class="text-sm font-normal dark:bg-gray-900 text-gray-800 dark:text-slate-200"
                    id="accept-terms-and-conditions"
                  >{{ $t("account.register.acceptTerms") }}</span>
                </span>
              </div>

              <div v-show="!loading" class="mt-3">
                <span class="block w-full rounded-sm shadow-sm">
                  <LoadingButton class="w-full block" type="submit" ref="loadingButton">
                    <span
                      v-if="selectedPrice && selectedPrice.price === 0"
                    >{{ $t("pricing.signUpFree") }}</span>
                    <span
                      v-else-if="selectedPrice && selectedPrice.trialDays > 0"
                    >{{ $t("account.register.startTrial", [selectedPrice.trialDays]) }}</span>
                    <span v-else-if="!getButtonText">{{ $t("settings.subscription.plans.select") }}</span>
                    <span v-else>{{ getButtonText }}</span>
                  </LoadingButton>
                </span>
              </div>

              <p
                class="mt-3 py-2 text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700"
              >
                {{ $t("account.register.bySigningUp") }}
                <a
                  target="_blank"
                  href="/terms-and-conditions"
                  class="text-theme-500 underline"
                >{{ $t("account.register.termsAndConditions") }}</a>
                {{ $t("account.register.andOur") }}
                <a
                  target="_blank"
                  href="/privacy-policy"
                  class="text-theme-500 underline"
                >{{ $t("account.register.privacyPolicy") }}</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
      <div v-else class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          class="bg-slate-50 dark:bg-slate-800 max-w-sm w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8"
        >
          <h2
            class="mt-6 text-center text-3xl leading-9 font-bold text-gray-800 dark:text-slate-200"
          >{{ $t("account.register.successTitle") }}</h2>
          <div class="my-4 leading-tight">
            <p
              class="mt-2 text-center text-sm leading-5 text-gray-800 dark:text-slate-200 max-w"
            >{{ $t("account.register.successText") }}</p>
          </div>
        </div>
      </div>
    </div>
    <Modal ref="modalInvitation">
      <div
        class="space-y-6 text-gray-900"
        v-if="linkInvitation && linkInvitation.createdByUser && linkInvitation.createdByWorkspace"
      >
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-theme-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-theme-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3 class="text-lg leading-6 font-medium" id="modal-title">
            {{ $t("app.links.invitation.toBe") }}
            <span
              v-if="linkInvitation.inviteeIsProvider"
              class="font-bold text-theme-600"
            >{{ $t("models.provider.object") }}</span>
            <span v-else class="font-bold text-theme-600">{{ $t("models.client.object") }}</span>
          </h3>
          <div class="mt-4 text-left">
            <p class="font-normal text-base">
              {{ linkInvitation.createdByUser.firstName }}
              <span
                class="italic text-gray-600"
              >({{ linkInvitation.createdByUser.email }})</span>
              {{ $t("app.links.invitation.hasInvitedYou") }}
              <span
                class="font-bold"
              >{{ linkInvitation.createdByWorkspace.name }}</span>
              {{ $t("app.links.invitation.andYourCompany") }}
              <span
                class="font-bold"
              >{{ linkInvitation.workspaceName }}</span>
              {{ " " }}
              <span
                v-if="linkInvitation.inviteeIsProvider"
              >{{ $t("app.links.invitation.reasonAsProvider") }}.</span>
              <span v-else>{{ $t("app.links.invitation.reasonAsClient") }}.</span>
            </p>
          </div>
          <div
            v-if="linkInvitation.message"
            class="mt-4 text-left bg-gray-50 border border-gray-300 py-2 px-2"
          >
            <p class="font-normal text-base text-gray-600">
              <span
                class="font-medium"
              >{{ $t("app.links.invitation.message") }} {{ linkInvitation.createdByUser.firstName }}</span>
              :
              {{ linkInvitation.message }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          ref="buttonAcceptInvitation"
          @click="acceptInvitation"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-theme-600 text-base font-medium text-white hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:col-start-2 sm:text-sm"
        >{{ $t("shared.accept") }}</button>
        <button
          @click="rejectInvitation"
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:mt-0 sm:col-start-1 sm:text-sm"
        >{{ $t("shared.reject") }}</button>
      </div>
    </Modal>
    <Modal ref="cardModal">
      <div>
        <PayCard :buttonText="getButtonText" @payed="payed" @error="payError" />
      </div>
    </Modal>
    <ConfirmModal ref="confirmModalRegister" @yes="confirmedRegister" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import PayCard from "@/components/front/PayCard.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Plans from "@/components/ui/radios/PlansRadioButtons.vue"
import Logo from "@/components/front/Logo.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import Modal from "@/components/ui/modals/Modal.vue";
import store from "@/store";
import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
import services from "@/services";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import NumberUtils from '@/utils/shared/NumberUtils';
import { UserRegisterRequest } from '@/application/contracts/core/users/UserRegisterRequest';
import { SubscriptionCouponDto } from '@/application/dtos/core/subscriptions/SubscriptionCouponDto';
import { SubscriptionBillingPeriod } from '@/application/enums/core/subscriptions/SubscriptionBillingPeriod';
import { SubscriptionProductDto } from '@/application/dtos/core/subscriptions/SubscriptionProductDto';
import { SubscriptionPriceDto } from '@/application/dtos/core/subscriptions/SubscriptionPriceDto';
import { useRoute } from "vue-router";
import i18n from "@/locale/i18n";
import { useMeta } from "@/modules/vue-meta";

const $t = i18n.global.t;
const route = useRoute();
useMeta({ title: $t("account.register.title") })

const inputFirstName = ref<HTMLInputElement>();
const buttonAcceptInvitation = ref<HTMLButtonElement>();
const loadingButton = ref<InstanceType<typeof LoadingButton>>();
const modalInvitation = ref<InstanceType<typeof Modal>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const cardModal = ref<InstanceType<typeof Modal>>();
const confirmModalRegister = ref<InstanceType<typeof ConfirmModal>>();
const loading = ref(false);
const user = ref({} as UserRegisterRequest);
const email = ref("");
const stripeKey = ref("");
const stripeOptions = ref();
// const cardCompleted = ref(false);
const registered = ref(false);
const haveCoupon = ref(false);
const couponCode = ref("");
const couponDescription = ref("");
const coupon = ref<SubscriptionCouponDto | null>(null);
const linkInvitation = ref<LinkInvitationDto | null>(null);

const emailEnabled = ref(true);
const workspaceNameEnabled = ref(true);

const acceptTermsAndConditions = ref(false);

if (route.query.e) {
  user.value.email = route.query.e.toString();
}

stripeKey.value = import.meta.env.VITE_VUE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
stripeOptions.value = {
  showCardHolderName: true,
  hidePostalCode: false,
  iconStyle: "solid",
  elements: {
    locale: i18n.global.locale,
  },
};

onMounted(() => {
  loading.value = true;
  services.subscriptionProducts
    .getProducts()
    .then(() => {
      if (route.query.p) {
        const product = products.value.find((f) => f.tier === Number(route.query.p));
        if (product) {
          store.commit("pricing/setSelected", {
            product,
            billingPeriod: store.state.pricing.billingPeriod,
          });
        }
      }
      if (!selectedProduct.value) {
        store.commit("pricing/setBillingPeriod", SubscriptionBillingPeriod.MONTHLY);
        store.commit("pricing/setCurrency", "usd");
        store.commit("pricng/select", {
          product: products.value[0],
          billingPeriod: store.state.pricing.billingPeriod,
        });
      }

      if (route.params.coupon) {
        haveCoupon.value = true;
        couponCode.value = route.params.coupon.toString();
        searchCoupon(false);
      } else if (route.query.coupon) {
        haveCoupon.value = true;
        couponCode.value = route.query.coupon.toString();
        searchCoupon(false);
      }
      if (route.query.i) {
        services.links.getInvitation(route.query.i.toString()).then((response) => {
          linkInvitation.value = response;
          loadLinkInvitation();
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
})

function loadLinkInvitation() {
  if (linkInvitation.value) {
    if (linkInvitation.value.status === LinkStatus.PENDING) {
      modalInvitation.value?.show();
      nextTick(() => {
        buttonAcceptInvitation.value?.focus();
      });
    }
  }
}
function rejectInvitation() {
  modalInvitation.value?.close();
  services.links.rejectInvitation(linkInvitation.value?.id);
  linkInvitation.value = null;
}
function acceptInvitation() {
  modalInvitation.value?.close();
  user.value.joinedByLinkInvitation = linkInvitation.value?.id;
  emailEnabled.value = false;
  workspaceNameEnabled.value = false;
  user.value.email = linkInvitation.value?.email ?? "";
  user.value.workspaceName = linkInvitation.value?.workspaceName ?? "";
  nextTick(() => {
    if (inputFirstName.value) {
      inputFirstName.value?.focus();
      inputFirstName.value?.select();
    }
  });
}
function searchCoupon(showError) {
  if (!selectedPrice.value) {
    return "";
  }
  if (!couponCode.value) {
    return;
  }
  services.subscriptionManager
    .getCoupon(couponCode.value, selectedPrice.value.currency)
    .then((response: SubscriptionCouponDto) => {
      coupon.value = response;
      if (coupon.value && coupon.value.name) {
        couponDescription.value = coupon.value.name.toString();
      }
    })
    .catch((error) => {
      couponDescription.value = $t("account.register.invalidCoupon").toString();
      if (showError) {
        errorModal.value?.show($t("shared.error"), $t(error));
      }
    });
}
function tryRegister() {
  email.value = user.value.email;
  if (!selectedPrice.value) {
    errorModal.value?.show($t("shared.error"), $t("account.register.errors.priceNotSelected"));
    return;
  }
  if (user.value.password !== user.value.confirmPassword) {
    errorModal.value?.show($t("shared.error"), $t("api.errors.passwordMismatch"));
    return;
  }
  if (!acceptTermsAndConditions.value) {
    errorModal.value?.show($t("shared.error"), $t("account.register.errors.acceptTermsAndConditions"));
    return;
  }
  if (selectedPrice.value.trialDays === 0 && selectedPrice.value.price > 0) {
    cardModal.value?.show();
  } else {
    confirmModalRegister.value?.show($t("account.register.prompts.register.title"), $t("shared.confirm"), $t("shared.back"), $t("account.register.prompts.register.description", [
      $t(selectedProduct.value?.title ?? "")
    ]));
  }
}
function confirmedRegister() {
  register();
}
function payError(error) {
  errorModal.value?.show(i18n.global.t(error));
}
function payed(data) {
  if (data.error) {
    errorModal.value?.show(i18n.global.t("shared.error"), data.error.message);
  } else {
    cardModal.value?.close();
    register(data.token.id);
  }
}
function register(cardToken = "") {
  if (!selectedPrice.value) {
    errorModal.value?.show($t("shared.error"), $t("account.register.errors.priceNotSelected"));
    return;
  } else if (selectedPrice.value && !selectedPrice.value.id) {
    errorModal.value?.show($t("shared.error"), $t("account.register.errors.priceNotInDatabase"));
    return;
  }
  user.value.selectedSubscription = {
    subscriptionPriceId: selectedPrice.value.id ?? "",
    subscriptionCardToken: cardToken,
    subscriptionCoupon: couponCode.value,
  };
  loadingButton.value?.start();
  services.authentication
    .register(user.value)
    .then(() => {
      registered.value = true;
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), error);
    })
    .finally(() => {
      if (loadingButton.value) {
        loadingButton.value?.stop();
      }
    });
}
function toggleAcceptTerms() {
  acceptTermsAndConditions.value = !acceptTermsAndConditions.value
}
function intFormat(value) {
  return NumberUtils.intFormat(value);
}
const products = computed((): SubscriptionProductDto[] => {
  return store.state.pricing.products;
})
const getButtonText = computed((): string => {
  if (!selectedPrice.value) {
    return "";
  }
  return (selectedPrice.value.billingPeriod === SubscriptionBillingPeriod.ONCE ? $t("pricing.pay") : $t("pricing.subscribe")) + " " + priceDescription.value;
})
const selectedPrice = computed((): SubscriptionPriceDto | undefined => {
  return selectedProduct.value?.prices.find((f) => f.billingPeriod === store.state.pricing.billingPeriod && f.currency === store.state.pricing.currency) ?? selectedProduct.value?.prices.filter((f) => f.currency === store.state.pricing.currency)[0];
})
const billingPeriod = computed((): string => {
  if (!selectedPrice.value) {
    return "";
  }
  if (selectedPrice.value.billingPeriod === SubscriptionBillingPeriod.ONCE) {
    return $t("pricing.once").toString();
  } else {
    return "/ " + $t("pricing." + SubscriptionBillingPeriod[selectedPrice.value.billingPeriod] + "Short");
  }
}
)
const discountedPrice = computed((): number => {
  if (!selectedPrice.value) {
    return 0;
  }
  let price = selectedPrice.value.price;
  if (coupon.value) {
    if (coupon.value.amountOff && selectedPrice.value.currency === coupon.value.currency) {
      price = price - coupon.value.amountOff / 100;
    } else if (coupon.value.percentOff) {
      price = Number((price * ((100 - coupon.value.percentOff) / 100)).toFixed(2));
    }
  }
  return price;
})
const priceDescription = computed((): string => {
  if (!selectedPrice.value) {
    return "";
  }
  return "$" + intFormat(discountedPrice.value) + " " + selectedPrice.value.currency + " " + billingPeriod.value;
})
const selectedProduct = computed((): SubscriptionProductDto | null => {
  return store.state.pricing.selectedProduct;
})
</script>
