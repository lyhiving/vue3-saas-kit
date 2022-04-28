<template>
  <div>
    <div>
      <div @keypress.esc="close" class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in"
            leave-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
              <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
            </div>
          </transition>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              class="inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
              :class="maxSize"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div class="just absolute top-0 right-0 -mt-4 pr-4">
                <button
                  @click="close"
                  type="button"
                  class="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
                >
                  <span class="sr-only">{{ $t("shared.close") }}</span>
                  <svg
                    class="h-5 w-5 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="mt-3 space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-lg font-medium">{{ $t("settings.members.actions.new") }}</h4>
                </div>
                <div v-if="maxUsersReached">
                  <WarningBanner
                    redirect="/app/settings/subscription"
                    :title="$t('app.subscription.errors.limitReached')"
                    :text="$t('app.subscription.errors.limitReachedUsers', [maxUsers])"
                  />
                </div>
                <Loading v-if="loading" />
                <form v-else @submit.prevent="save" class="space-y-4">
                  <div class="grid grid-cols-2 gap-2">
                    <!-- Email -->
                    <div class="col-span-2">
                      <label
                        for="email"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.email") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="email"
                          ref="inputEmail"
                          name="email"
                          id="email"
                          autocomplete="off"
                          required
                          v-model="email"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :disabled="loading"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': loading,
                          }"
                        />
                      </div>
                    </div>
                    <!-- Email: End -->

                    <!-- User First Name -->
                    <div>
                      <label
                        for="first-name"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.firstName") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="first-name"
                          name="first-name"
                          autocomplete="off"
                          required
                          v-model="firstName"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': loading,
                          }"
                        />
                      </div>
                    </div>
                    <!-- User First Name: End -->

                    <!-- User Last Name -->
                    <div>
                      <label
                        for="last-name"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.lastName") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="last-name"
                          name="last-name"
                          autocomplete="off"
                          required
                          v-model="lastName"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': loading,
                          }"
                        />
                      </div>
                    </div>
                    <!-- User Last Name: End -->

                    <!-- User Role -->
                    <div class="col-span-2">
                      <label
                        for="last-name"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.role") }}</label>
                      <div class="mt-1 rounded-md shadow-sm w-full">
                        <fieldset>
                          <legend class="sr-only">{{ $t("models.user.role") }}</legend>
                          <div class="bg-white rounded-md -space-y-px">
                            <label
                              v-for="(option, idxRole) in roleOptions"
                              :key="idxRole"
                              class="relative border py-2 px-4 flex cursor-pointer focus:outline-none"
                              :class="{
                                'bg-theme-50 border-theme-200 z-10': role === option.value,
                                'border-gray-200': role !== option.value,
                                'rounded-tl-md rounded-tr-md': idxRole === 0,
                                'rounded-bl-md rounded-br-md': idxRole === roleOptions.length - 1,
                              }"
                            >
                              <input
                                type="radio"
                                name="tenant-user-role"
                                class="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                                aria-labelledby="tenant-user-role-0-label"
                                aria-describedby="tenant-user-role-0-description"
                                :value="option.value"
                                :checked="role === option.value"
                                @change="changedRole"
                              />
                              <div class="ml-3 flex flex-col">
                                <span
                                  id="tenant-user-role-0-label"
                                  class="block text-sm font-medium"
                                  :class="{
                                    'text-theme-900': role === option.value,
                                    'text-gray-900': role !== option.value,
                                  }"
                                >{{ option.name }}</span>

                                <span
                                  id="tenant-user-role-0-description"
                                  class="block text-sm"
                                  :class="{
                                    'text-theme-700': role === option.value,
                                    'text-gray-500': role !== option.value,
                                  }"
                                >{{ option.description }}</span>
                              </div>
                            </label>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <!-- User Role: End -->

                    <!-- User Workspaces -->
                    <div class="col-span-2">
                      <label
                        for="description"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.workspace.plural") }}</label>
                      <div class="mt-2 rounded-md w-full space-y-2">
                        <input
                          type="text"
                          id="description"
                          autocomplete="off"
                          disabled
                          v-model="currentWorkspacesDescription"
                          class="bg-gray-100 cursor-not-allowed w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                        />
                        <button
                          type="button"
                          @click="selectUserWorkspaces"
                          class="flex items-center space-x-1 text-xs text-theme-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span
                            class="uppercase font-medium"
                          >{{ $t("app.workspaces.actions.selectUserWorkspaces") }}</span>
                        </button>
                      </div>
                    </div>
                    <!-- User Workspaces: End -->
                  </div>

                  <div class="flex items-center justify-between mt-4">
                    <div class="text-theme-700 text-sm">
                      <div v-if="loading">{{ $t("shared.loading") }}...</div>
                    </div>

                    <div class="flex items-center space-x-2">
                      <button
                        :disabled="loading"
                        :class="{
                          'bg-gray-100 cursor-not-allowed': loading,
                        }"
                        type="button"
                        @click="close"
                        class="inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        <div>{{ $t("shared.cancel") }}</div>
                      </button>
                      <button
                        :disabled="loading"
                        :class="{
                          'opacity-50 cursor-not-allowed': loading,
                        }"
                        type="submit"
                        class="inline-flex items-center px-3 py-2 border space-x-2 border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        <div>{{ $t("shared.invite") }}</div>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <ErrorModal ref="errorModal" />
    <SuccessModal ref="successModal" @closed="close" />
    <select-workspaces ref="selectWorkspaces" @selected="selectedWorkspaces"></select-workspaces>
  </div>
</template>

<script setup lang="ts">
import services from "@/services";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import SelectWorkspaces from "@/components/core/workspaces/SelectWorkspaces.vue";
import tinyEventBus from "@/plugins/tinyEventBus";
import store from "@/store";
import WarningBanner from "@/components/ui/banners/WarningBanner.vue";
import Loading from "@/components/ui/loaders/Loading.vue";
import i18n from "@/locale/i18n";
import { useRouter } from "vue-router";
import { computed, nextTick, onMounted, ref } from "vue";

const $t = i18n.global.t;
const router = useRouter();

defineProps({
  maxSize: {
    default: "sm:max-w-lg"
  }
})

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const selectWorkspaces = ref<InstanceType<typeof SelectWorkspaces>>();
const inputEmail = ref<HTMLInputElement>();

const loading = ref(false);
const email = ref("");
const firstName = ref("");
const lastName = ref("");
const phone = ref("");
const role = ref<TenantUserRole>(TenantUserRole.MEMBER);
const roleOptions = ref([
  {
    value: 0,
    name: i18n.global.t("settings.profile.roles.OWNER"),
    description: i18n.global.t("settings.profile.permissions.OWNER"),
  },
  {
    value: 1,
    name: i18n.global.t("settings.profile.roles.ADMIN"),
    description: i18n.global.t("settings.profile.permissions.ADMIN"),
  },
  {
    value: 2,
    name: i18n.global.t("settings.profile.roles.MEMBER"),
    description: i18n.global.t("settings.profile.permissions.MEMBER"),
  },
  {
    value: 3,
    name: i18n.global.t("settings.profile.roles.GUEST"),
    description: i18n.global.t("settings.profile.permissions.GUEST"),
  },
]);
const workspaces = ref<WorkspaceDto[]>([]);

onMounted(() => {
  nextTick(() => {
    if (inputEmail.value) {
      inputEmail.value?.focus();
      inputEmail.value?.select();
    }
  });
})
function close() {
  router.push("/app/settings/members");
}
function save() {
  if (workspaces.value.length === 0) {
    errorModal.value?.show($t("shared.error"), $t("account.tenant.members.errors.atLeastOneWorkspace"));
    return;
  }
  loading.value = true;
  services.tenantUserInvitations
    .inviteUser({
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      role: role.value,
      workspaces: workspaces.value,
    })
    .then((response) => {
      tinyEventBus().emitter.emit("user-added", response);
      successModal.value?.show($t("app.tenants.members.invitationSent"), $t("app.tenants.members.invitationDescription", [email.value, $t("settings.profile.roles." + TenantUserRole[role.value])]));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function selectUserWorkspaces() {
  selectWorkspaces.value?.show([]);
}
function selectedWorkspaces(items: WorkspaceDto[]) {
  workspaces.value = items;
}
function changedRole(e) {
  const _role: TenantUserRole = Number(e.target.value);
  role.value = _role;
}
const currentWorkspacesDescription = computed(() => {
  if (workspaces.value.length === 0) {
    return $t("app.workspaces.seletAtLeastOne");
  }
  return workspaces.value.map((f) => f.name).join(", ");
})
const maxUsers = computed((): number => {
  return store.state.app.features.maxUsers;
})
const maxUsersReached = computed(() => {
  return maxUsers.value > 0 && store.state.tenant.members.length >= maxUsers.value;
})
</script>
