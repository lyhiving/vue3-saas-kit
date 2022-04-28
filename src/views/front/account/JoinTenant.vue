<template>
  <div>
    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div v-if="tenant && (tenant.logo || tenant.logoDarkmode)">
          <router-link to="/">
            <img alt="Logo" :src="tenant.logo" class="mx-auto h-12 w-auto" />
          </router-link>
        </div>
        <Logo v-else class="mx-auto h-12 w-auto" />
      </div>

      <div v-if="requested">
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="max-w-md w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
            <h2
              class="mt-6 text-center text-3xl leading-9 font-bold"
            >{{ $t("account.invitation.successTitle") }}</h2>
            <div class="my-4 leading-tight">
              <p
                class="mt-2 text-center text-sm leading-5 max-w"
              >{{ $t("account.invitation.successText") }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="loading">
          <!-- {{ $t("shared.loading") }} -->
        </div>
        <div
          v-else-if="!tenant"
          class="text-red-500 text-center"
        >{{ $t("shared.invalidInvitation") }}</div>
        <div v-if="tenant && tenant.name">
          <div v-if="emailDisabled && email">
            <p class="mt-2 text-center text-sm leading-5">
              <button
                @click="logout"
                class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
              >{{ $t("account.invitation.anotherEmail") }}</button>
            </p>
          </div>
          <div class="mt-6 text-center text-lg leading-9 font-bold">
            <div v-if="accepted">
              {{ $t("account.invitation.acceptedUser", [tenant.name]) }}
              <p class="font-normal text-base">{{ $t("account.forgot.enterPassword") }}</p>
            </div>
            <div v-else>
              <h2 class="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">
                {{ $t("account.invitation.requestAccess") }}
                {{ tenant.name }}
              </h2>
              <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                {{ $t("account.register.alreadyRegistered") }}
                <span
                  class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
                >
                  <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
                </span>
              </p>
            </div>
          </div>

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
                      :disabled="emailDisabled"
                      v-model="user.email"
                      id="email"
                      type="email"
                      required
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                      :class="{
                        'cursor-not-allowed bg-gray-100': emailDisabled,
                      }"
                    />
                  </div>
                </div>
                <div>
                  <div class="mt-6">
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
                  <div class="mt-6" v-if="!emailDisabled">
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
                </div>

                <div class="mt-6">
                  <span class="block w-full rounded-sm shadow-sm">
                    <LoadingButton class="w-full block" type="submit" ref="loadingButton">
                      <span v-if="accepted">{{ $t("shared.enter") }}</span>
                      <span v-else>{{ $t("shared.request") }}</span>
                    </LoadingButton>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Logo from "@/components/front/Logo.vue";
import store from "@/store";
import services from "@/services";
import { TenantDto } from '@/application/dtos/core/tenants/TenantDto';
import { UserVerifyRequest } from '@/application/contracts/core/users/UserVerifyRequest';
import { useRoute } from "vue-router";
import i18n from "@/locale/i18n";
import { useMeta } from "@/modules/vue-meta";

const $t = i18n.global.t;
const route = useRoute();
useMeta({ title: $t("account.join.title") })

const loadingButton = ref<InstanceType<typeof LoadingButton>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();

const loading = ref(false);
const user = ref<UserVerifyRequest>({} as UserVerifyRequest);
const emailDisabled = ref(false);
const tenant = ref<TenantDto>({} as TenantDto);
const requested = ref(false);
const accepted = ref(false);

const email = computed(() => {
  return store.state.account.user?.email ?? "";
})

user.value.token = route.params.tenant.toString() ?? "";
user.value.email = email.value;
if (!email.value) {
  user.value.email = route.query.e?.toString() ?? "";
  accepted.value = route.query.a === "true";
  if (user.value.email && user.value.email !== "") {
    emailDisabled.value = true;
  }
} else {
  emailDisabled.value = true;
}

onMounted(() => {
  if (route.params.tenant) {
    loading.value = true;
    services.tenantUserInvitations
      .getInviteURL(route.params.tenant.toString())
      .then((response: TenantDto) => {
        tenant.value = response;
      })
      .catch((error) => {
        if (error.status === 404) {
          errorModal.value?.show($t("shared.invalidInvitation"));
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
})

function accept() {
  if (!emailDisabled.value && user.value.password !== user.value.passwordConfirm) {
    errorModal.value?.show($t("account.login.errors.passwordMissmatch"));
    return;
  }
  loadingButton.value?.start();
  services.tenantUserInvitations
    .requestAccess(route.params.tenant.toString(), user.value)
    .then(() => {
      requested.value = true;
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      if (loadingButton.value) {
        loadingButton.value?.stop();
      }
    });
}
function logout() {
  store.commit("auth/logout");
  emailDisabled.value = false;
  user.value.email = "";
}
</script>
