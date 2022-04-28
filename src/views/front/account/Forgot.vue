<template>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo class="mx-auto h-12 w-auto" />
      <div v-if="!emailSent" class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200"
        >{{ $t("account.forgot.title") }}</h2>
        <p
          class="mt-5 text-sm leading-5 text-center text-gray-500"
        >{{ $t("account.reset.headline") }}</p>
        <div class="mt-8 sm:rounded-sm sm:px-10">
          <form @submit.prevent="reset()">
            <div>
              <label
                for="email"
                class="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300"
              >{{ $t("account.shared.email") }}</label>
              <div class="mt-1 rounded-sm shadow-sm">
                <input
                  v-model="email"
                  id="email"
                  type="email"
                  required
                  class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            <div class="mt-6">
              <span class="block w-full rounded-sm shadow-sm">
                <LoadingButton class="w-full block" type="submit" ref="loadingButton">
                  <span class="absolute left-0 inset-y pl-3"></span>
                  {{ $t("account.reset.button") }}
                </LoadingButton>
              </span>
            </div>
          </form>
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div class="relative flex justify-center text-sm leading-5">
                <span
                  class="px-2 bg-white dark:bg-slate-900 text-gray-500"
                >{{ $t("account.forgot.rememberedPassword") }}</span>
              </div>
            </div>

            <div class="mt-6">
              <div>
                <span class="w-full inline-flex rounded-sm shadow-sm">
                  <router-link
                    class="bg-white dark:bg-slate-900 w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-800 rounded-sm text-sm leading-5 font-medium text-gray-900 dark:text-slate-300 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out"
                    tag="button"
                    to="/login"
                  >{{ $t("account.forgot.backToLogin") }}</router-link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="max-w-md w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
          <h2 class="text-xl font-black">
            <h2
              class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200"
            >{{ $t("account.reset.resetSuccess") }}</h2>
          </h2>
          <div class="my-4 leading-tight">
            <p
              class="mt-2 text-center text-sm leading-5 text-gray-900 dark:text-slate-300 max-w"
            >{{ $t("account.reset.emailSent") }}</p>
          </div>
        </div>
      </div>
    </div>

    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import services from "@/services";
import Logo from "@/components/front/Logo.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import { useMeta } from "@/modules/vue-meta";
import i18n from "@/locale/i18n";

const $t = i18n.global.t;
const route = useRoute();
useMeta({ title: $t("account.forgot.title") })

const loadingButton = ref<InstanceType<typeof LoadingButton>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();

const emailSent = ref(false);
const email = ref(route.query.e ? route.query.e.toString() : "");

function reset() {
  loadingButton.value?.start();
  services.authentication
    .reset(email.value)
    .then(() => {
      emailSent.value = true;
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      if (loadingButton.value) {
        loadingButton.value.stop();
      }
    });
}
</script>