<template>
  <div>
    <form @submit.prevent>
      <div class="shadow overflow-hidden sm:rounded-sm">
        <div class="px-4 py-5 bg-white sm:p-6">
          <div class="grid grid-cols-6 gap-2">
            <div class="col-span-6 sm:col-span-6 w-full">
              <span
                id="listbox-label"
                class="flex justify-between leading-5 font-medium text-gray-900 mb-4"
              >{{ $t("settings.tenant.payment.title") }}</span>
              <div
                class="flex items-center space-x-1 text-gray-600 text-sm font-semibold"
                v-if="subscriptionCard && !editing"
              >
                <div class="uppercase">{{ subscriptionCard.brand }}</div>
                <div>
                  <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                  {{ $t("settings.tenant.payment.ending") }} **** {{ subscriptionCardLast4 }} - {{ subscriptionCardExpDesc }}
                </div>
              </div>
              <div v-else>
                <div v-if="editing" id="card-element">
                  <card
                    ref="card"
                    class="stripe-card w-full"
                    :class="complete ? 'border-1 border-green-100' : ''"
                    :stripe="stripeKey"
                    :options="stripeOptions"
                    @change="complete = $event.complete"
                  />
                </div>
                <div v-else class="text-red-500 text-sm">{{ $t("settings.tenant.payment.notSet") }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <ButtonSecondary @click="editing = !editing">
            <span>{{ !editing ? $t("shared.edit") : $t("shared.cancel") }}</span>
          </ButtonSecondary>

          <LoadingButton
            class="w-auto ml-3 py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-sm text-white bg-gray-800 shadow-sm hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
            @click="updatePaymentDetails"
            v-if="editing"
            ref="loadingButton"
          >{{ $t("shared.save") }}</LoadingButton>
        </div>
      </div>
    </form>

    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import i18n from "@/locale/i18n";
import TenantUtils from '@/utils/store/TenantUtils';
import { computed, ref } from "vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

const $t = i18n.global.t;

const successModal = ref<InstanceType<typeof SuccessModal>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const loadingButton = ref<InstanceType<typeof LoadingButton>>();

const editing = ref(false);
const stripeKey = ref("");
const stripeOptions = ref();
const complete = ref(false);

stripeKey.value = import.meta.env.VITE_VUE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
stripeOptions.value = {
  showCardHolderName: true,
  hidePostalCode: false,
  iconStyle: "solid",
  elements: {
    locale: i18n.global.locale,
  },
};

function updatePaymentDetails() {
  loadingButton.value?.start();
  // todo
  // createToken()
  //   .then((data) => {
  //     if (data.error) {
  //       errorModal.value?.show(data.error.message);
  //       if (loadingButton.value) {
  //         loadingButton.value?.stop();
  //       }
  //     } else {
  //       if (data.token.id && data.token.id !== "") {
  //         updateCardToken(data.token.id);
  //       }
  //     }
  //   })
  //   .catch((error) => {
  //     errorModal.value?.show($t("shared.error"), $t(error));
  //   })
  //   .finally(() => {
  //     if (loadingButton.value) {
  //       loadingButton.value?.stop();
  //     }
  //     editing.value = false;
  //   });
}
// function updateCardToken(token: string) {
//   services.subscriptionManager
//     .updateCardToken(token)
//     .then(() => {
//       services.subscriptionManager.getCurrentSubscription();
//       successModal.value?.show($t("shared.updated"), $t("settings.tenant.payment.updated"));
//     })
//     .catch((error) => {
//       errorModal.value?.show($t("shared.error"), $t(error));
//     })
//     .finally(() => {
//       if (loadingButton.value) {
//         loadingButton.value?.stop();
//       }
//       editing.value = false;
//     });
// }
const subscriptionCard = computed(() => {
  return TenantUtils.defaultSubscriptionCard();
})
const subscriptionCardLast4 = computed(() => {
  return subscriptionCard.value?.lastFourDigits;
})
const subscriptionCardExpDesc = computed(() => {
  return ("0" + subscriptionCard.value?.expiryMonth).slice(-2) + " / " + subscriptionCard.value?.expiryYear;
})
</script>
