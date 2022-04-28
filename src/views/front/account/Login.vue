<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <Logo class="mx-auto h-12 w-auto" />
        <h2
          class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200"
        >{{ $t("account.login.title") }}</h2>
        <p class="mt-2 text-center text-sm text-gray-500">
          {{ $t("shared.or") }}
          <router-link
            to="/pricing"
            class="font-medium text-theme-500 hover:text-theme-400"
          >{{ $t("account.login.orStartTrial", [90]) }}</router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login()" method="POST">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-sm shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">{{ $t("account.shared.email") }}</label>
            <input
              v-model="user.email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-t-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
              :placeholder="$t('account.shared.email')"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t("account.shared.password") }}</label>
            <input
              v-model="user.password"
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-b-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
              :placeholder="$t('account.shared.password')"
            />
          </div>
        </div>

        <div>
          <LoadingButton class="w-full block" type="submit" ref="loadingButton">
            <span class="absolute left-0 inset-y pl-3">
              <svg class="h-5 w-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ $t("account.login.button") }}
          </LoadingButton>
        </div>

        <div class="flex items-center justify-end">
          <div class="text-sm">
            <router-link
              to="/forgot-password"
              class="font-medium text-theme-500 hover:text-theme-400"
            >{{ $t("account.login.forgot") }}</router-link>
          </div>
        </div>
      </form>
      <ErrorModal ref="errorModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Logo from "@/components/front/Logo.vue";
import LoadingButton from '@/components/ui/buttons/LoadingButton.vue';
import { UserLoginRequest } from '@/application/contracts/core/users/UserLoginRequest';
import i18n from "@/locale/i18n";
import services from "@/services";
import { useMeta } from "@/modules/vue-meta";


const $t = i18n.global.t;
useMeta({ title: $t("account.login.title") })

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const loadingButton = ref<InstanceType<typeof LoadingButton>>();

const loading = ref(false);
const user = ref<UserLoginRequest>({} as UserLoginRequest);

function login() {
  loadingButton.value?.start();
  loading.value = true;
  services.authentication
    .login(user.value)
    .catch((error) => {
      loadingButton.value?.stop();
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>