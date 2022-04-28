<template>
  <div>
    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div v-if="tenant && (tenant.logo || tenant.logoDarkmode)">
          <router-link to="/">
            <img alt="Logo" :src="tenant.logo" class="mx-auto h-16 w-auto" />
          </router-link>
        </div>
        <Logo v-else class="mx-auto h-12 w-auto" />
      </div>
      <div v-if="loading"></div>
      <div
        v-else-if="!invitation || !invitation.user"
        class="text-red-500 text-center"
      >{{ $t("shared.invalidInvitation") }}</div>
      <div v-if="invitation && invitation.user">
        <h2 class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">
          {{ $t("shared.hi") }}
          {{ invitation.user.firstName ? invitation.user.firstName : invitation.user.email }}, {{ $t("account.invitation.youWereInvited") }}
          {{ invitation.tenant.name }}
        </h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
          {{ $t("account.register.alreadyRegistered") }}
          <span
            class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
          </span>
        </p>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="py-8 px-4 sm:rounded-sm sm:px-10">
            <form @submit.prevent="accept" class="sm:w-96">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-5"
                >{{ $t("account.shared.email") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    disabled
                    v-model="user.email"
                    id="email"
                    type="email"
                    required
                    class="bg-gray-100 dark:bg-slate-800 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requirePassword" class="mt-6">
                <label
                  for="password"
                  class="block text-sm font-medium leading-5"
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
                  class="block text-sm font-medium leading-5"
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
                  >{{ $t("account.invitation.button") }}</LoadingButton>
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
import { onMounted, ref } from "vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Logo from "@/components/front/Logo.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import services from "@/services";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { UserVerifyRequest } from '@/application/contracts/core/users/UserVerifyRequest';
import { TenantDto } from '@/application/dtos/core/tenants/TenantDto';
import { TenantInvitationResponse } from '@/application/contracts/core/tenants/TenantInvitationResponse';
import { useRoute } from "vue-router";
import i18n from "@/locale/i18n";
import { useMeta } from "@/modules/vue-meta";

const $t = i18n.global.t;
const route = useRoute();

useMeta({ title: $t("account.invitation.title") })

const loadingButton = ref<InstanceType<typeof LoadingButton>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();

const loading = ref(false);
const user = ref<UserVerifyRequest>({} as UserVerifyRequest);
const requirePassword = ref(true);
const invitation = ref<TenantUserDto | null>(null);
const tenant = ref<TenantDto>({} as TenantDto);

onMounted(() => {
  user.value.token = route.query.i ? route.query.i.toString() : "";
  user.value.email = route.query.e ? route.query.e.toString() : "";

  if (route.query.i) {
    loading.value = true;
    services.tenantUserInvitations
      .getInvitation(route.query.i.toString())
      .then((response: TenantInvitationResponse) => {
        invitation.value = response.invitation;
        tenant.value = response.tenant;
        requirePassword.value = response.requiresVerify;
      })
      .finally(() => {
        loading.value = false;
      });
  }
})

function accept() {
  if (user.value.password !== user.value.passwordConfirm) {
    errorModal.value?.show($t("api.errors.passwordMismatch"));
    return;
  }

  loadingButton.value?.start();
  services.tenantUserInvitations.acceptInvitation(route.query.i?.toString() ?? "", user.value).catch((error) => {
    errorModal.value?.show($t("shared.error"), $t(error));
    if (loadingButton.value) {
      loadingButton.value?.stop();
    }
  });
}
</script>