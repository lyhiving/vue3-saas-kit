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
                  <h4 class="text-lg font-medium">{{ $t("app.workspaces.actions.edit") }}</h4>
                </div>
                <Loading v-if="loading" />
                <div v-else-if="!item">{{ $t("shared.notFound") }}</div>
                <form v-else-if="item" @submit.prevent="save" class="space-y-4">
                  <div class="grid grid-cols-2 gap-2">
                    <!-- Workspace Name -->
                    <div class="col-span-2">
                      <label
                        for="name"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.workspace.name") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          autocomplete="off"
                          required
                          v-model="name"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :disabled="loading"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': loading,
                          }"
                        />
                      </div>
                    </div>
                    <!-- Workspace Name: End -->

                    <!-- Workspace Business Main Activity -->
                    <div class="col-span-2">
                      <label
                        for="business-main-activity"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.workspace.businessMainActivity") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="business-main-activity"
                          name="business-main-activity"
                          autocomplete="off"
                          required
                          v-model="businessMainActivity"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': loading,
                          }"
                        />
                      </div>
                    </div>
                    <!-- Workspace Business Main Activity: End -->

                    <!-- Workspace Type -->
                    <div class="col-span-2">
                      <label
                        for="type"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.workspace.type") }}</label>
                      <div class="mt-1 rounded-md shadow-sm w-full">
                        <fieldset name="type" id="type">
                          <legend class="sr-only">{{ $t("models.workspace.type") }}</legend>
                          <div class="bg-white rounded-md -space-y-px">
                            <label
                              class="rounded-tl-md rounded-tr-md relative border py-2 px-4 flex cursor-pointer focus:outline-none"
                              :class="{
                                'bg-theme-50 border-theme-200 z-10': type === 0,
                                'border-gray-200': type !== 0,
                              }"
                            >
                              <input
                                type="radio"
                                class="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                                aria-labelledby="workspace-type-0-label"
                                aria-describedby="workspace-type-0-description"
                                :value="0"
                                :checked="type === 0"
                                @change="changedType"
                              />
                              <div class="ml-3 flex flex-col">
                                <span
                                  id="workspace-type-0-label"
                                  class="block text-sm font-medium"
                                  :class="{
                                    'text-theme-900': type === 0,
                                    'text-gray-900': type !== 0,
                                  }"
                                >{{ $t("app.workspaces.types.PRIVATE") }}</span>

                                <span
                                  id="workspace-type-0-description"
                                  class="block text-sm"
                                  :class="{
                                    'text-theme-700': type === 0,
                                    'text-gray-500': type !== 0,
                                  }"
                                >{{ $t("app.workspaces.typesDescription.PRIVATE") }}</span>
                              </div>
                            </label>

                            <label
                              class="relative border py-2 px-4 flex cursor-pointer focus:outline-none"
                              :class="{
                                'bg-theme-50 border-theme-200 z-10': type === 1,
                                'border-gray-200': type !== 1,
                              }"
                            >
                              <input
                                type="radio"
                                name="workspace-type"
                                class="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                                aria-labelledby="workspace-type-1-label"
                                aria-describedby="workspace-type-1-description"
                                :value="1"
                                :checked="type === 1"
                                @change="changedType"
                              />
                              <div class="ml-3 flex flex-col">
                                <span
                                  id="workspace-type-1-label"
                                  class="block text-sm font-medium"
                                  :class="{
                                    'text-theme-900': type === 1,
                                    'text-gray-900': type !== 1,
                                  }"
                                >{{ $t("app.workspaces.types.PUBLIC") }}</span>
                                <span
                                  id="workspace-type-1-description"
                                  class="block text-sm"
                                  :class="{
                                    'text-theme-700': type === 1,
                                    'text-gray-500': type !== 1,
                                  }"
                                >{{ $t("app.workspaces.typesDescription.PUBLIC") }}</span>
                              </div>
                            </label>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <!-- Workspace Type: End -->

                    <!-- Workspace Registration Number -->
                    <div v-if="type === 1">
                      <label
                        for="registration-number"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.workspace.registrationNumber") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="registration-number"
                          name="registration-number"
                          autocomplete="off"
                          required
                          v-model="registrationNumber"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': loading,
                          }"
                        />
                      </div>
                    </div>
                    <!-- Workspace Registration Number: End -->

                    <!-- Workspace Registration Date -->
                    <div v-if="type === 1">
                      <label
                        for="registration-date"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.workspace.registrationDate") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="date"
                          id="registration-date"
                          name="registration-date"
                          autocomplete="off"
                          required
                          v-model="registrationDate"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': loading,
                          }"
                        />
                      </div>
                    </div>
                    <!-- Workspace Registration Date: End -->

                    <!-- Workspace Users -->
                    <div class="col-span-2">
                      <label
                        for="users"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.plural") }}</label>
                      <div class="mt-2 rounded-md w-full space-y-2">
                        <input
                          type="text"
                          id="users"
                          autocomplete="off"
                          disabled
                          v-model="currentUsersDescription"
                          class="bg-gray-100 cursor-not-allowed w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                        />
                        <button
                          type="button"
                          @click="selectWorkspaceUsers"
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
                          >{{ $t("app.workspaces.actions.selectWorkspaceUsers") }}</span>
                        </button>
                      </div>
                    </div>
                    <!-- Workspace Users: End -->
                  </div>

                  <div class="flex items-center justify-between mt-4">
                    <div v-if="loading" class="text-theme-700 text-sm">
                      <div v-if="loading">{{ $t("shared.loading") }}...</div>
                    </div>
                    <div v-else>
                      <button
                        :disabled="loading"
                        :class="{
                          'bg-gray-100 cursor-not-allowed': loading,
                        }"
                        type="button"
                        @click="remove"
                        class="inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        <div>{{ $t("shared.delete") }}</div>
                      </button>
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
                        <div>{{ $t("shared.save") }}</div>
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

    <ConfirmModal ref="confirmRemove" @yes="yesRemove" />
    <ErrorModal ref="errorModal" />
    <SuccessModal ref="successModal" @closed="close" />
    <select-users ref="selectUsers" @selected="selectedUsers"></select-users>
  </div>
</template>

<script setup lang="ts">
import services from "@/services";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import tinyEventBus from "@/plugins/tinyEventBus";
import store from "@/store";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import SelectUsers from "../users/SelectUsers.vue";
import { useRoute, useRouter } from "vue-router";
import i18n from "@/locale/i18n";
import { computed, onMounted, ref } from "vue";

const $t = i18n.global.t;
const router = useRouter();
const route = useRoute();

defineProps({
  maxSize: {
    default: "sm:max-w-lg"
  }
})

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const selectUsers = ref<InstanceType<typeof SelectUsers>>();
const confirmRemove = ref<InstanceType<typeof ConfirmModal>>();

const id = ref("");
const loading = ref(false);
const name = ref("");
const businessMainActivity = ref("");
const registrationNumber = ref("");
const item = ref<WorkspaceDto | null>(null);
const type = ref<WorkspaceType>(WorkspaceType.PRIVATE);
const registrationDate = ref<Date | null>(null);
const users = ref<UserDto[]>([]);

id.value = route.params.id.toString();

onMounted(() => {
  loading.value = true;
  services.workspaces
    .get(id.value)
    .then((response) => {
      item.value = response;
      name.value = response.name;
      type.value = response.type;
      businessMainActivity.value = response.businessMainActivity;
      registrationNumber.value = response.registrationNumber;
      if (response.registrationDate) {
        registrationDate.value = new Date(DateUtils.dateYMD(response.registrationDate));
      }
      users.value = [];
      response.users.forEach((element) => {
        if (element.user) {
          users.value.push(element.user);
        }
      });
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
})
function close() {
  router.push("/app/settings/workspaces");
}
function save() {
  if (users.value.length === 0) {
    errorModal.value?.show($t("shared.error"), $t("account.tenant.workspaces.errors.atLeastOneUser"));
    return;
  }
  loading.value = true;
  services.workspaces
    .update(id.value, {
      name: name.value,
      type: type.value,
      businessMainActivity: businessMainActivity.value,
      registrationNumber: registrationNumber.value,
      registrationDate: registrationDate.value,
      users: users.value,
    })
    .then(() => {
      tinyEventBus().emitter.emit("workspace-saved");
      successModal.value?.show($t("shared.updated"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function remove() {
  confirmRemove.value?.show($t("shared.confirmDelete"), $t("shared.delete"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
}
function yesRemove() {
  if (currentRole.value === TenantUserRole.MEMBER || currentRole.value === TenantUserRole.GUEST) {
    errorModal.value?.show($t("account.tenant.onlyAdmin"));
  } else {
    loading.value = true;
    services.workspaces
      .delete(id.value)
      .then(() => {
        tinyEventBus().emitter.emit("workspace-deleted", item.value);
        router.push("/app/settings/workspaces");
      })
      .catch((error) => {
        errorModal.value?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
function selectWorkspaceUsers() {
  selectUsers.value?.show(users.value.map((f) => f.id));
}
function selectedUsers(items: UserDto[]) {
  users.value = items;
}
function changedType(e) {
  const _type: WorkspaceType = Number(e.target.value);
  type.value = _type;
}
const currentRole = computed((): TenantUserRole => {
  return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
})
const currentUsersDescription = computed(() => {
  if (users.value.length === 0) {
    return $t("app.users.seletAtLeastOne");
  }
  return users.value.map((f) => `${f.firstName} (${f.email})`).join(", ");
})
</script>
