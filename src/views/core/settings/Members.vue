<template>
  <div>
    <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else>
        <div class="space-y-2">
          <div class="flex justify-between">
            <div class="flex items-center justify-between w-full space-x-2">
              <div class="relative flex items-center w-full flex-grow">
                <div
                  class="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
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
              <router-link
                to="/app/settings/members/new"
                class="inline-flex space-x-2 items-center px-2 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
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

                <div>{{ $t("shared.new") }}</div>
              </router-link>
            </div>
          </div>
          <div>
            <MembersListAndTable :items="sortedItems" />

            <div v-if="!loading && maxUsersReached">
              <WarningBannner
                :title="$t('app.subscription.errors.limitReached')"
                :text="$t('app.subscription.errors.limitReachedUsers', [maxUsers])"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmAcceptUser" @yes="yesAcceptUser" />
    <ConfirmModal ref="confirmUpgrade" @yes="yesUpdateSubscription" />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
import i18n from "@/locale/i18n";
import tinyEventBus from "@/plugins/tinyEventBus";
import store from "@/store";
import WarningBannner from "@/components/ui/banners/WarningBanner.vue";
import services from "@/services";
import { UserType } from "@/application/enums/core/users/UserType";
import Loading from "@/components/ui/loaders/Loading.vue";
import MembersListAndTable from "@/components/core/settings/members/MembersListAndTable.vue";
import { useRoute, useRouter } from 'vue-router';
import { useMeta } from "@/modules/vue-meta";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const $t = i18n.global.t;
const router = useRouter();
const route = useRoute();

useMeta({
  title: $t("settings.members.title").toString()
})

defineProps({
  title: {
    default: i18n.global.t("settings.members.title")
  }
})

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const confirmAcceptUser = ref<InstanceType<typeof ConfirmModal>>();
const confirmUpgrade = ref<InstanceType<typeof ConfirmModal>>();

const loading = ref(false);
const searchInput = ref("");

const items = ref<TenantUserDto[]>([]);
const tenantJoinSettings = ref({} as any);
const enableLink = ref(false);
const enablePublicUrl = ref(false);
const requireAcceptance = ref(false);
const acceptedUser = ref<TenantUserDto | null>(null);
const acceptUserEmail = ref("");

acceptUserEmail.value = route.query.au?.toString() ?? "";

onMounted(() => {
  tinyEventBus().emitter.on("user-added", () => reload());
  tinyEventBus().emitter.on("user-saved", () => reload());
  tinyEventBus().emitter.on("user-deleted", () => reload());

  reload();
})

onBeforeUnmount(() => {
  tinyEventBus().emitter.off("user-deleted");
  tinyEventBus().emitter.off("user-added");
  tinyEventBus().emitter.off("user-saved");
})

function reload() {
  loading.value = true;
  const promises: any[] = [];
  promises.push(services.tenants.getFeatures());
  promises.push(services.tenantUserInvitations.getInvitationSettings().then((response: TenantJoinSettingsDto) => {
    tenantJoinSettings.value = response;
    enableLink.value = tenantJoinSettings.value.linkActive;
    enablePublicUrl.value = tenantJoinSettings.value.publicUrl;
    requireAcceptance.value = tenantJoinSettings.value.requireAcceptance;
  }));
  promises.push(services.tenantUsers
    .getAll()
    .then((response: TenantUserDto[]) => {
      items.value = [];
      response.forEach((element) => {
        items.value.push(element);
      });

      if (acceptUserEmail.value) {
        const user = items.value.find((f) => f.email === acceptUserEmail.value);
        if (user && user.status === TenantUserStatus.PENDING_ACCEPTANCE) {
          acceptUser(user, true);
        }
      }
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    }));

  Promise.all(promises).finally(() => {
    loading.value = false;
  })
}
// function saved(data) {
//   const idx = items.value.findIndex((f) => f.id === data.id);
//   items.value[idx] = data;
// }
// function deleted(data) {
//   items.value = items.value.filter((f) => f.id !== data.id);
// }
function yesUpdateSubscription() {
  router.push("/app/settings/subscription");
}
function yesAcceptUser() {
  if (isOwnerOrAdmin.value && acceptedUser.value) {
    services.tenantUserInvitations
      .acceptUser(acceptedUser.value)
      .then(() => {
        reload();
      })
      .catch((error) => {
        errorModal.value?.show($t("shared.error"), $t(error));
      });
  }
}
function acceptUser(item: TenantUserDto, accept: boolean) {
  item.accepted = accept;
  acceptedUser.value = item;
  confirmAcceptUser.value?.show($t("shared.accept?", [item.email]).toString(), $t("shared.accept").toString(), $t("shared.cancel").toString());
}
const isOwnerOrAdmin = computed((): boolean => {
  return currentRole.value === TenantUserRole.OWNER || currentRole.value === TenantUserRole.ADMIN;
})
const currentRole = computed((): TenantUserRole => {
  return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
})
const maxUsers = computed((): number => {
  if (store.state.account.user?.type === UserType.Admin) {
    return 0;
  }
  return store.state.app.features.maxUsers;
})
const maxUsersReached = computed(() => {
  return maxUsers.value > 0 && store.state.tenant.members.length >= maxUsers.value;
})
const filteredItems = computed((): TenantUserDto[] => {
  if (!items.value) {
    return [];
  }
  return items.value.filter((f) => f.firstName?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.lastName?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.email?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.phone?.toString().toUpperCase().includes(searchInput.value.toUpperCase()));
})
const sortedItems = computed(() => {
  if (!items.value) {
    return [];
  }
  const filtered = filteredItems.value.slice().sort((x, y) => {
    return x.role > y.role ? -1 : 1;
  });
  return filtered.sort((x, y) => {
    return x.role > y.role ? 1 : -1;
  });
})
</script>
