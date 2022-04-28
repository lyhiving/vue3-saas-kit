<template>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo class="mx-auto h-12 w-auto" />
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200"
        >{{ $t("account.verify.title") }}</h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
          {{ $t("account.register.alreadyRegistered") }}
          <span
            class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
          </span>
        </p>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="sm:rounded-sm sm:px-10">
            <form @submit.prevent="verify">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300"
                >{{ $t("account.shared.email") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    disabled
                    :class="{
                      'bg-gray-100 dark:bg-slate-800 cursor-not-allowed': true
                    }"
                    v-model="user.email"
                    id="email"
                    type="email"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requireName" class="mt-6">
                <label
                  for="firstName"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300"
                >{{ $t("account.register.firstName") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.firstName"
                    id="firstName"
                    type="text"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requireName" class="mt-6">
                <label
                  for="lastName"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300"
                >{{ $t("account.register.lastName") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.lastName"
                    id="lastName"
                    type="text"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requirePassword" class="mt-6">
                <label
                  for="password"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300"
                >{{ $t("account.shared.password") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.password"
                    id="password"
                    type="password"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requirePassword" class="mt-6">
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300"
                >{{ $t("account.register.confirmPassword") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.passwordConfirm"
                    id="confirmPassword"
                    type="password"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>

              <div class="mt-6">
                <span class="block w-full rounded-sm shadow-sm">
                  <LoadingButton
                    class="w-full block"
                    type="submit"
                    ref="loadingButton"
                  >{{ $t("account.verify.button") }}</LoadingButton>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Logo from "@/components/front/Logo.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import services from "@/services";
import { UserVerifyRequest } from '@/application/contracts/core/users/UserVerifyRequest';
import i18n from "@/locale/i18n";
import { useRoute } from "vue-router";
import { useMeta } from "@/modules/vue-meta";

const $t = i18n.global.t;
const route = useRoute();
useMeta({ title: $t("account.verify.title") })

const loadingButton = ref<InstanceType<typeof LoadingButton>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();

const user = ref<UserVerifyRequest>({} as UserVerifyRequest);

const requireName = ref(false);
const requirePassword = ref(true);

user.value.email = route.query.e ? route.query.e.toString() : "";
user.value.token = route.query.t ? route.query.t.toString() : "";

function verify() {
  if (user.value.password !== user.value.passwordConfirm) {
    errorModal.value?.show(
      $t("account.login.errors.passwordMissmatch")
    );
    return;
  }

  loadingButton.value?.start();
  services.authentication
    .verify(user.value)
    .catch(error => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      if (loadingButton.value) {
        loadingButton.value?.stop();
      }
    });
}
</script>