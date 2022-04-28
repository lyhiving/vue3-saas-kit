<template>
  <div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else-if="item && item.id">
        <div class="relative min-h-screen">
          <main class="py-4">
            <div
              class="max-w-5xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl"
            >
              <div class="flex items-center space-x-5 truncate">
                <div class="flex-shrink-0">
                  <div class="relative">
                    <span class="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                      <svg
                        class="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="truncate">
                  <div class="flex items-center space-x-2">
                    <h1 class="text-2xl font-bold text-gray-900">{{ item.firstName }}</h1>
                  </div>
                  <p class="text-sm font-medium text-gray-500 truncate">
                    {{ $t("shared.added") }}
                    <span v-if="item.createdByUser">
                      {{ $t("shared.by") }}
                      <span
                        class="text-gray-900"
                      >{{ item.createdByUser.firstName }} {{ item.createdByUser.lastName }}</span>
                    </span>
                    {{ $t("shared.in") }}
                    <time>{{ dateMonthDayYear(item.createdAt) }}</time>
                  </p>
                </div>
              </div>
              <div
                class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3"
              >
                <ButtonSecondary @click="edit">{{ $t("shared.edit") }}</ButtonSecondary>
              </div>
            </div>

            <div class="mt-8 max-w-3xl mx-auto lg:max-w-7xl">
              <div>
                <div class="lg:grid lg:grid-cols-3 lg:gap-6">
                  <div class="lg:col-span-1">
                    <div class="px-4 sm:px-0">
                      <h3
                        class="text-lg font-medium leading-6 text-gray-900"
                      >{{ $t("app.employees.profile.title") }}</h3>
                      <p
                        class="mt-1 text-sm text-gray-600"
                      >{{ $t("app.employees.profile.general") }}</p>
                    </div>
                  </div>
                  <div class="mt-5 lg:mt-0 lg:col-span-2">
                    <form @submit.prevent="save" method="POST">
                      <div class="shadow overflow-hidden sm:rounded-md">
                        <div class="px-4 py-5 bg-white sm:p-6">
                          <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 lg:col-span-3">
                              <label
                                for="first-name"
                                class="block text-sm font-medium text-gray-700"
                              >{{ $t("models.employee.firstName") }}</label>
                              <input
                                type="text"
                                ref="firstNameInput"
                                name="first-name"
                                id="first-name"
                                autocomplete="first-name"
                                v-model="firstName"
                                required
                                :disabled="!editing"
                                :class="{ 'bg-gray-100': !editing }"
                                class="mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>

                            <div class="col-span-6 lg:col-span-3">
                              <label
                                for="last-name"
                                class="block text-sm font-medium text-gray-700"
                              >{{ $t("models.employee.lastName") }}</label>
                              <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autocomplete="last-name"
                                v-model="lastName"
                                required
                                :disabled="!editing"
                                :class="{ 'bg-gray-100': !editing }"
                                class="mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>

                            <div class="col-span-6">
                              <label
                                for="email-address"
                                class="block text-sm font-medium text-gray-700"
                              >{{ $t("models.employee.email") }}</label>
                              <input
                                type="email"
                                name="email-address"
                                id="email-address"
                                autocomplete="email"
                                v-model="email"
                                :disabled="!editing"
                                :class="{ 'bg-gray-100': !editing }"
                                class="mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="editing"
                          class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between"
                        >
                          <div>
                            <button
                              type="button"
                              @click="deleteEmployee"
                              :disabled="!editing"
                              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >{{ $t("shared.delete") }}</button>
                          </div>
                          <div class="flex items-center space-x-2">
                            <button
                              type="button"
                              @click="cancel"
                              :disabled="!editing"
                              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >{{ $t("shared.cancel") }}</button>
                            <button
                              type="submit"
                              :disabled="!editing || thereAreNoChanges"
                              :class="{
                                ' opacity-50 cursor-not-allowed': !editing || thereAreNoChanges,
                              }"
                              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >{{ $t("shared.save") }}</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
    <SuccessModal ref="successModal" />
    <SuccessModal ref="successModalDeleted" @closed="successModalDeletedClosed" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmSave" @yes="saveConfirm" />
    <ConfirmModal ref="confirmDeleteEmployee" @yes="confirmedDeleteEmployee" />
  </div>
</template>

<script setup lang="ts">
import services from "@/services";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import { useRouter } from "vue-router";
import i18n from "@/locale/i18n";
import { computed, nextTick, onMounted, ref } from "vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

const props = defineProps({
  id: {
    default: ""
  }
})

const $t = i18n.global.t;
const router = useRouter();

const firstNameInput = ref<HTMLInputElement>();
const confirmSave = ref<InstanceType<typeof ConfirmModal>>();
const confirmDeleteEmployee = ref<InstanceType<typeof ConfirmModal>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const successModalDeleted = ref<InstanceType<typeof SuccessModal>>();

const loading = ref(false);
const firstName = ref("");
const lastName = ref("");
const email = ref("");

const editing = ref(false);

const item = ref<EmployeeDto>({} as EmployeeDto);

onMounted(() => {
  reload();
})

function reload() {
  loading.value = true;
  services.employees
    .get(props.id)
    .then((response) => {
      item.value = response;
      loadProfile();
    })
    .finally(() => {
      loading.value = false;
    });
}
function loadProfile() {
  firstName.value = item.value.firstName;
  lastName.value = item.value.lastName;
  email.value = item.value.email ?? "";
}
function edit() {
  editing.value = true;
  nextTick(() => {
    firstNameInput.value?.focus();
    firstNameInput.value?.select();
  });
}
function save() {
  if (thereAreNoChanges.value) {
    errorModal.value?.show($t("shared.error"), $t("shared.noChanges"));
  } else {
    confirmSave.value?.show($t("shared.saveChanges"), $t("shared.yes"), $t("shared.cancel"));
  }
}
function deleteEmployee() {
  confirmDeleteEmployee.value?.show($t("shared.confirmDelete"), $t("shared.yes"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
}
function successModalDeletedClosed() {
  router.push("/app/employees");
}
function confirmedDeleteEmployee() {
  loading.value = true;
  services.employees
    .delete(props.id)
    .then(() => {
      successModalDeleted.value?.show($t("shared.deleted"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function saveConfirm() {
  loading.value = true;
  services.employees
    .update(props.id, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    })
    .then((response) => {
      successModal.value?.show($t("shared.updated"));
      item.value = response;
      loadProfile();
      editing.value = false;
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function cancel() {
  loadProfile();
  editing.value = false;
}
function dateMonthDayYear(value: Date | undefined) {
  return DateUtils.dateMonthDayYear(value);
}
const thereAreNoChanges = computed(() => {
  if (item.value) {
    return firstName.value === item.value.firstName && lastName.value === item.value.lastName && email.value === item.value.email;
  }
  return true;
})
</script>
