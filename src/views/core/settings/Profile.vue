<template>
  <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Profile -->
    <div>
      <div class="md:grid lg:grid-cols-3 md:gap-2">
        <div class="md:col-span-1">
          <div class="sm:px-0">
            <h3
              class="text-lg font-medium leading-6 text-gray-900"
            >{{ $t("settings.profile.profileTitle") }}</h3>
            <p class="mt-1 text-xs leading-5 text-gray-600">{{ $t("settings.profile.profileText") }}</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit.prevent="updateProfile()">
            <div class="shadow overflow-hidden sm:rounded-sm">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-2">
                  <div class="col-span-6 sm:col-span-6 md:col-span-6">
                    <label
                      for="email_address"
                      class="block text-sm font-medium leading-5 text-gray-700"
                    >{{ $t("account.shared.email") }}</label>
                    <input
                      v-model="profile.email"
                      required
                      disabled
                      type="email"
                      id="email_address"
                      class="bg-gray-100 mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>
                  <div class="col-span-6 md:col-span-3">
                    <label
                      for="firstName"
                      class="block text-sm font-medium leading-5 text-gray-700"
                    >{{ $t("settings.profile.firstName") }}</label>
                    <input
                      id="firstName"
                      required
                      v-model="profile.firstName"
                      class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>

                  <div class="col-span-6 md:col-span-3">
                    <label
                      for="lastName"
                      class="block text-sm font-medium leading-5 text-gray-700"
                    >{{ $t("settings.profile.lastName") }}</label>
                    <input
                      v-model="profile.lastName"
                      id="lastName"
                      class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-6">
                    <label
                      for="avatar"
                      class="block text-sm leading-5 font-medium text-gray-700"
                    >{{ $t("shared.avatar") }}</label>
                    <div class="mt-2 flex items-center space-x-3">
                      <div class="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                        <img id="avatar" alt="Avatar" v-if="avatar" :src="avatar" />
                        <svg
                          id="avatar"
                          v-else
                          class="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>

                      <ButtonTertiary
                        @click="showUploadImage = true"
                        type="button"
                      >{{ $t("shared.upload") }}</ButtonTertiary>
                      <ButtonTertiary
                        v-if="avatar"
                        destructive
                        @click="loadedImage(null)"
                        type="button"
                      >{{ $t("shared.delete") }}</ButtonTertiary>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                >{{ $t("shared.save") }}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Separator -->
      <div class="block">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>

      <!-- Security -->
      <div class="md:grid lg:grid-cols-3 md:gap-2">
        <div class="md:col-span-1">
          <div class="sm:px-0">
            <h3
              class="text-lg font-medium leading-6 text-gray-900"
            >{{ $t("settings.profile.securityTitle") }}</h3>
            <p class="mt-1 text-xs leading-5 text-gray-600">
              {{ $t("account.login.forgot") }}
              <a
                @click="logout"
                class="text-theme-600 font-bold hover:text-theme-500"
                :href="'/forgot-password?e=' + email"
              >{{ $t("account.reset.button") }}</a>
            </p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit.prevent="updatePassword()">
            <div class="shadow overflow-hidden sm:rounded-sm">
              <div v-if="canChangePassword()">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-2">
                    <div class="col-span-6 sm:col-span-6">
                      <label
                        for="passwordCurrent"
                        class="block text-sm font-medium leading-5 text-gray-700"
                      >{{ $t("settings.profile.passwordCurrent") }}</label>
                      <input
                        :required="profile.loginType === 0"
                        type="password"
                        id="passwordCurrent"
                        v-model="updatePasswordRequest.passwordCurrent"
                        class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>
                    <div class="col-span-6 md:col-span-3">
                      <label
                        for="password"
                        class="block text-sm font-medium leading-5 text-gray-700"
                      >{{ $t("settings.profile.password") }}</label>
                      <input
                        required
                        type="password"
                        id="password"
                        v-model="updatePasswordRequest.passwordNew"
                        class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>

                    <div class="col-span-6 md:col-span-3">
                      <label
                        for="passwordConfirm"
                        class="block text-sm font-medium leading-5 text-gray-700"
                      >{{ $t("settings.profile.passwordConfirm") }}</label>
                      <input
                        required
                        type="password"
                        v-model="updatePasswordRequest.passwordConfirm"
                        id="passwordConfirm"
                        class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>
                  </div>
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    class="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                  >{{ $t("shared.save") }}</button>
                </div>
              </div>
              <div
                v-else
                class="px-4 py-5 bg-white sm:p-6 block text-sm font-medium leading-5 text-gray-700"
              >{{ $t("settings.profile.cannotChangePassword") }}</div>
            </div>
          </form>
        </div>
      </div>

      <!-- Separator -->
      <div class="block">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>

      <!-- Preferences -->
      <div class="md:grid lg:grid-cols-3 md:gap-2">
        <div class="md:col-span-1">
          <div class="sm:px-0">
            <h3
              class="text-lg font-medium leading-6 text-gray-900"
            >{{ $t("settings.preferences.title") }}</h3>
            <p
              class="mt-1 text-xs leading-5 text-gray-600"
            >{{ $t("settings.preferences.description") }}</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit.prevent>
            <div class="shadow sm:rounded-sm">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-2">
                  <div class="col-span-6 sm:col-span-6">
                    <label
                      for="locale"
                      class="block text-sm font-medium leading-5 text-gray-700"
                    >{{ $t("settings.preferences.language") }}</label>
                    <select
                      id="locale"
                      required
                      v-model="selectedLocale"
                      @change="changedLocale"
                      class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                    >
                      <option
                        v-for="(locale, idx) in locales"
                        :key="idx"
                        :value="locale.lang"
                      >{{ locale.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Separator -->
      <div class="block">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>
      <!-- Danger -->
      <div class="md:grid lg:grid-cols-3 md:gap-2">
        <div class="md:col-span-1">
          <div class="sm:px-0">
            <h3
              class="text-lg font-medium leading-6 text-gray-900"
            >{{ $t("settings.danger.title") }}</h3>
            <p class="mt-1 text-xs leading-5 text-gray-600">{{ $t("settings.danger.description") }}</p>
          </div>
        </div>
        <div class="mt-12 md:mt-0 md:col-span-2">
          <form @submit.prevent>
            <div class="bg-white shadow sm:rounded-sm">
              <div class="px-4 py-5 sm:p-6">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                >{{ $t("settings.danger.deleteYourAccount") }}</h3>
                <div class="mt-2 max-w-xl text-sm leading-5 text-gray-500">
                  <p>{{ $t("settings.danger.onceYouDelete") }}.</p>
                </div>
                <div class="mt-5">
                  <ButtonPrimary
                    destructive
                    @click="deleteAccount"
                    type="button"
                  >{{ $t("settings.danger.deleteAccount") }}</ButtonPrimary>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <UploadImage
      v-if="showUploadImage && !uploadingImage"
      @close="showUploadImage = false"
      :title="$t('shared.avatar')"
      :image="avatar"
      @loaded="loadedImage"
    />
    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmModal" @yes="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import UploadImage from "@/components/ui/uploaders/UploadImage.vue";
import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import store from "@/store";
import i18n from "@/locale/i18n";
import { UserType } from "@/application/enums/core/users/UserType";
import services from "@/services";
import { UserUpdatePasswordRequest } from '@/application/contracts/core/users/UserUpdatePasswordRequest';
import { UserDto } from '@/application/dtos/core/users/UserDto';
import supportedLocales from '@/locale/supportedLocales';
import { UserUpdateRequest } from '@/application/contracts/core/users/UserUpdateRequest';
import { UserUpdateAvatarRequest } from '@/application/contracts/core/users/UserUpdateAvatarRequest';
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.vue";
import { useRouter } from "vue-router";
import { useMeta } from "@/modules/vue-meta";
import { computed, ref } from "vue";

const $t = i18n.global.t;
const router = useRouter();

useMeta({
  title: $t("settings.profile.profileTitle").toString()
})

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const confirmModal = ref<InstanceType<typeof ConfirmModal>>();

const profile = ref<UserDto>({} as UserDto);
const updatePasswordRequest = ref<UserUpdatePasswordRequest>({} as UserUpdatePasswordRequest);
const selectedLocale = i18n.global.locale;
const locales = supportedLocales;
const showUploadImage = ref(false);
const uploadingImage = ref(false);

profile.value.id = store.state.account.user?.id ?? "";
profile.value.email = store.state.account.user?.email ?? "";
profile.value.firstName = store.state.account.user?.firstName ?? "";
profile.value.lastName = store.state.account.user?.lastName ?? "";
profile.value.phone = store.state.account.user?.phone ?? "";
profile.value.loginType = store.state.account.user?.loginType ?? UserLoginType.PASSWORD;

function canChangePassword() {
  return profile.value.loginType === UserLoginType.PASSWORD;
}
function changedLocale(e) {
  const locale = e.target.value;
  services.users
    .updateLocale({ locale })
    .then(() => {
      router.go(0);
    })
    .finally(() => {
      localStorage.setItem("locale", locale);
      i18n.global.locale = locale;
    });
}
function updateProfile() {
  const updateRequest: UserUpdateRequest = {
    firstName: profile.value.firstName,
    lastName: profile.value.lastName,
    phone: profile.value.phone,
  };
  services.users
    .update(profile.value.id, updateRequest)
    .then(() => {
      successModal.value?.show($t("shared.updated"), $t("settings.profile.profileUpdated"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
function logout() {
  store.commit("auth/logout");
}
function updatePassword() {
  services.users
    .updatePassword(updatePasswordRequest.value)
    .then(() => {
      successModal.value?.show($t("shared.updated"), $t("settings.profile.passwordUpdated"));
      updatePasswordRequest.value.passwordCurrent = "";
      updatePasswordRequest.value.passwordNew = "";
      updatePasswordRequest.value.passwordConfirm = "";
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
function deleteAccount() {
  if (store.state.account.user?.type === UserType.Admin) {
    errorModal.value?.show($t("settings.profile.errors.cannotDeleteAdmin"));
  } else {
    confirmModal.value?.show($t("settings.danger.confirmDelete"));
  }
}
function confirmDelete() {
  services.users
    .deleteMe()
    .then(() => {
      // ignore
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
function loadedImage(image) {
  const updateAvatar: UserUpdateAvatarRequest = {
    avatar: image,
  };
  uploadingImage.value = true;
  services.users
    .updateAvatar(updateAvatar)
    .then(() => {
      showUploadImage.value = false;
    })
    .catch((error) => {
      console.error("Error: " + JSON.stringify(error));
    })
    .finally(() => {
      uploadingImage.value = false;
    });
}
const avatar = computed(() => {
  return store.state.account.user?.avatar ?? "";
})
const email = computed(() => {
  return store.state.account.user;
})
</script>
