<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <h1 class="flex-1 font-bold flex items-center truncate">
          {{ $t("models.user.plural") }}
          <span
            v-if="!loading"
            class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-300"
          >{{ filteredItems.length }}</span>
        </h1>
        <div class="flex items-center space-x-2 h-9">
          <ButtonSecondary @click="reload" type="button">{{ $t("shared.reload") }}</ButtonSecondary>
        </div>
      </div>
    </div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
      <Loading v-if="loading" />
      <div v-else class="space-y-2">
        <div class="flex justify-between">
          <div class="flex items-center justify-start w-full">
            <div class="relative flex items-center w-full">
              <div
                class="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                ref="inputSearch"
                type="text"
                name="buscador"
                id="buscador"
                class="w-full focus:ring-theme-500 focus:border-theme-500 block rounded-md pl-10 sm:text-sm border-gray-300"
                :placeholder="$t('shared.searchDot')"
                v-model="searchInput"
              />
            </div>
          </div>
        </div>
        <div v-if="filteredItems.length === 0">
          <EmptyState
            class="bg-white"
            :captions="{
              thereAreNo: $t('app.workspaces.errors.noUsers'),
            }"
          />
        </div>
        <div v-else>
          <div>
            <div class="flex flex-col">
              <div class="overflow-x-auto">
                <div class="py-2 align-middle inline-block min-w-full">
                  <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            v-for="(header, idx) in headers"
                            :key="idx"
                            scope="col"
                            class="text-xs px-3 py-2 text-left font-medium text-gray-500 tracking-wider select-none truncate"
                          >
                            <div class="flex items-center space-x-1 text-gray-500">
                              <div>{{ header.title }}</div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, idx) in filteredItems" :key="idx">
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            <div class="flex items-center space-x-4">
                              <div>
                                <div
                                  class="text-sm font-medium text-gray-900"
                                >{{ item.firstName }} {{ item.lastName }}</div>
                                <div class="text-sm text-gray-500">{{ item.email }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            <span
                              v-if="item.tenants && item.tenants.length > 0"
                            >{{ getUserTenants(item) }}</span>
                            <span v-else>?</span>
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            <div class="flex items-center space-x-2">
                              <ButtonTertiary
                                :disabled="item.type === 0"
                                @click="impersonate(item)"
                              >{{ $t("models.user.impersonate") }}</ButtonTertiary>
                              <ButtonTertiary
                                :disabled="item.type === 0"
                                @click="changePassword(item)"
                              >{{ $t("settings.profile.changePassword") }}</ButtonTertiary>
                              <ButtonTertiary
                                :disabled="item.type === 0"
                                @click="deleteUser(item)"
                                destructive
                              >{{ $t("shared.delete") }}</ButtonTertiary>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmDelete" @yes="confirmDeleteUser" />
  </div>
</template>

<script setup lang="ts">
import { UserDto } from "@/application/dtos/core/users/UserDto";
import i18n from "@/locale/i18n";
import EmptyState from "@/components/ui/emptyState/EmptyState.vue";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import services from "@/services";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import Loading from "@/components/ui/loaders/Loading.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.vue";
import { useMeta } from "@/modules/vue-meta";
import { computed, onMounted, ref } from "vue";

const $t = i18n.global.t;

useMeta({
  title: i18n.global.t("models.user.plural").toString(),
})


const confirmDelete = ref<InstanceType<typeof ConfirmModal>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();

const items = ref<UserDto[]>([]);
const loading = ref(false);
const searchInput = ref("");
const headers = ref([
  {
    title: i18n.global.t("models.user.object"),
  },
  {
    title: i18n.global.t("models.user.tenants"),
  },
  {
    title: i18n.global.t("shared.actions"),
  },
]);

onMounted(() => {
  reload();
})

function reload() {
  loading.value = true;
  services.users
    .adminGetAll()
    .then((response: UserDto[]) => {
      items.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
function impersonate(user: UserDto) {
  services.authentication.impersonate(user.id)
    .catch(error => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
function changePassword(user: UserDto) {
  const password = prompt($t("settings.profile.changePassword") + " - " + user.email);
  if (!password || password.length < 8) {
    alert("Set a password with 8 characters minimum");
  } else if (user.type === 0) {
    alert("You cannot change password for admin user");
  } else {
    if (confirm("[ADMINISTRATOR] Update password for user " + user.email + "?")) {
      services.users
        .adminUpdatePassword(user.id, password)
        .then(() => {
          alert("Updated");
        })
        .catch((error) => {
          errorModal.value?.show($t("shared.error"), $t(error))
        });
    }
  }
}
function getUserTenants(user: UserDto) {
  return user.tenants.map((f) => `${f.tenant?.name} (${i18n.global.t("settings.profile.roles." + TenantUserRole[f.role])})`).join(", ");
}
function deleteUser(item: UserDto) {
  if (confirmDelete.value) {
    confirmDelete.value.value = item;
    confirmDelete.value.show($t("shared.delete"), $t("shared.delete"), $t("shared.cancel"), $t("admin.users.deleteWarning"));
  }
}
function confirmDeleteUser(item) {
  loading.value = true;
  services.users
    .adminDelete(item.id)
    .then(() => {
      reload();
      successModal.value?.show($t("shared.deleted"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
const filteredItems = computed((): UserDto[] => {
  if (!items.value) {
    return [];
  }
  const filtered = items.value.filter(
    (f) =>
      f.firstName?.toString()?.toUpperCase().includes(searchInput.value.toUpperCase())
  );

  return filtered.sort((x, y) => {
    if (x.createdAt && y.createdAt) {
      return (x.createdAt > y.createdAt ? -1 : 1) ?? -1;
    }
    return -1;
  });
})
</script>
