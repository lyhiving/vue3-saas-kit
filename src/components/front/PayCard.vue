<template>
  <StripeElements
    v-if="stripeLoaded"
    v-slot="{ elements }"
    ref="elms"
    :stripe-key="stripeKey"
    :instance-options="instanceOptions"
    :elements-options="elementsOptions"
  >
    {{ stripeKey }}
    <StripeElement
      ref="card"
      :elements="elements"
      :options="cardOptions"
      @change="handleCardChange"
    />
  </StripeElements>
  <button
    class="mt-2 block w-full py-2 px-3 border border-transparent rounded-sm text-white font-semibold bg-gray-800 hover:bg-gray-700 focus:bg-gray-900 focus:outline-shadow sm:text-sm sm:leading-5"
    :class="{
      ' opacity-75 cursor-not-allowed': !cardCompleted || loading
    }"
    type="button"
    :disabled="!cardCompleted || loading"
    @click="pay"
  >{{ buttonText }}</button>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { StripeElements, StripeElement } from 'vue-stripe-js'
import { ref, onBeforeMount } from 'vue'

defineProps({
  buttonText: String
})

const $emit = defineEmits(['payed', 'error'])

const cardCompleted = ref(false)
const stripeKey = ref(import.meta.env.VITE_VUE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "") // test key
const instanceOptions = ref({
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
})
const elementsOptions = ref({
  // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
})
const cardOptions = ref({
  // https://stripe.com/docs/stripe.js#element-options
  // value: {
  //   postalCode: '',
  // },
})
const loading = ref(false)
const stripeLoaded = ref(false)
const card = ref()
const elms = ref()

onBeforeMount(() => {
  const stripePromise = loadStripe(stripeKey.value)
  stripePromise.then(() => {
    stripeLoaded.value = true
  })
})

function handleCardChange(e) {
  if (e.complete) {
    cardCompleted.value = true;
  }
}
function pay() {
  // Get stripe element
  const cardElement = card.value.stripeElement
  loading.value = true;
  // Access instance methods, e.g. createToken()
  elms.value.instance.createToken(cardElement).then((result: any) => {
    if (result.token) {
      $emit("payed", result)
    } else if (result.error) {
      $emit("error", result.error)
    }
  }).catch((error) => {
    $emit("error", error)
  }).finally(() => {
    loading.value = false;
  })
}
</script>