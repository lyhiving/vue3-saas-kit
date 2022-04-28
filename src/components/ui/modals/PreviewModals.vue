<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonSecondary @click="showSuccessModal()">Success Modal</ButtonSecondary>
      <ButtonSecondary @click="showErrorModal()">Error Modal</ButtonSecondary>
      <ButtonSecondary @click="showConfirmModal()">Confirm Modal</ButtonSecondary>
      <ButtonSecondary @click="showEmptyModal()">Empty Modal</ButtonSecondary>
    </div>
    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmModal" @yes="alert('confirmed')" @no="alert('canceled')" />
    <Modal ref="emptyModal">Your content here...</Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SuccessModal from "./SuccessModal.vue";
import ErrorModal from "./ErrorModal.vue";
import ConfirmModal from "./ConfirmModal.vue";
import Modal from "./Modal.vue";
import ButtonSecondary from "../buttons/ButtonSecondary.vue";

const successModal = ref<InstanceType<typeof SuccessModal>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const confirmModal = ref<InstanceType<typeof ConfirmModal>>();
const emptyModal = ref<InstanceType<typeof Modal>>();

function showSuccessModal() {
  successModal.value?.show('Title', 'Description...');
}
function showErrorModal() {
  errorModal.value?.show('Title', 'Description...');
}
function showConfirmModal() {
  confirmModal.value?.show('Title', 'Confirm', 'Cancel', 'Description...');
}
function showEmptyModal() {
  emptyModal.value?.show();
}
function alert(message) {
  window.alert(message)
}
</script>