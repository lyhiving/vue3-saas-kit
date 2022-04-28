<template>
  <div class="max-w-lg mx-auto pb-12">
    <Loading v-if="loading" />
    <div v-else>
      <div v-if="items.length === 0">
        <EmptyState
          class="bg-white"
          :captions="{
            thereAreNo: $t('app.links.pending.empty'),
          }"
        />
      </div>
      <ul v-else role="list" class="sm:grid grid-cols-1 gap-3">
        <li
          v-for="(item, idx) in items"
          :key="idx"
          class="col-span-1 bg-white rounded-sm shadow-md divide-y divide-gray-200 border-t sm:border border-gray-300"
        >
          <div class="w-full flex items-center justify-between p-6 space-x-6">
            <div class="w-full space-y-2">
              <div
                v-if="item.createdByWorkspaceId !== currentWorkspaceId && item.createdByUser"
                class="flex items-center justify-between space-x-3"
              >
                <p
                  class="text-sm font-normal text-gray-700 border-b pb-3 mb-2 w-full"
                >{{ item.createdByUser.firstName }} ({{ item.createdByUser.email }}) {{ $t("app.links.invitation.hasSentYou") }}.</p>
              </div>
              <div class="flex items-center justify-between space-x-3">
                <h3 class="text-gray-900 text-sm font-medium truncate">
                  <span v-if="whoAmI(item) === 0">{{ item.clientWorkspace.name }}</span>
                  <span v-else>{{ item.providerWorkspace.name }}</span>
                </h3>
                <span
                  v-if="whoAmI(item) !== 0"
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-teal-800 text-sm font-medium bg-teal-100 rounded-sm border-teal-300"
                >{{ $t("models.provider.object") }}</span>
                <span
                  v-else
                  class="flex-shrink-0 inline-block px-2 py-0.5 text-purple-800 text-sm font-medium bg-purple-100 rounded-sm border-purple-300"
                >{{ $t("models.client.object") }}</span>
              </div>
              <div
                class="sm:flex sm:items-center sm:space-x-2 sm:justify-between text-gray-500 text-sm"
              >
                <p class="truncate">
                  <span v-if="whoAmI(item) === 0">{{ item.clientWorkspace.name }}</span>
                  <span v-else>{{ item.providerWorkspace.name }}</span>
                </p>
                <p
                  class="font-light text-sm truncate"
                  v-if="item.createdAt"
                >{{ dateAgo(item.createdAt) }}</p>
              </div>
            </div>
          </div>
          <div>
            <div
              v-if="item.status === 0 && item.createdByWorkspaceId !== currentWorkspaceId"
              class="-mt-px flex divide-x divide-gray-200"
            >
              <div class="w-0 flex-1 flex">
                <button
                  type="button"
                  @click="reject(item)"
                  class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-theme-500 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span class="ml-3">{{ $t("shared.cancel") }}</span>
                </button>
              </div>
              <div class="-ml-px w-0 flex-1 flex">
                <button
                  type="button"
                  @click="accept(item)"
                  class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-theme-500 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  <span v-if="whoAmI(item) === 0" class="ml-3">{{ $t("shared.accept") }}</span>
                  <span v-else class="ml-3">{{ $t("shared.accept") }}</span>
                </button>
              </div>
            </div>
            <div v-else class="-mt-px flex divide-x divide-gray-200">
              <div class="w-full">
                <div
                  v-if="item.status === 0"
                  class="bg-gray-100 w-full relative -mr-px flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="ml-3">{{ $t("app.links.pending.invitationSent") }}</span>
                </div>
                <div
                  v-if="item.status === 2"
                  class="w-full relative -mr-px flex-1 inline-flex items-center justify-center py-4 text-sm bg-red-50 text-red-700 font-medium border border-transparent rounded-bl-lg"
                >
                  <span class="ml-3">{{ $t("shared.rejected") }}</span>
                </div>
                <div
                  v-else-if="item.status === 1"
                  class="w-full relative flex-1 inline-flex items-center justify-center py-4 text-sm bg-teal-50 text-teal-700 font-medium border border-transparent rounded-br-lg"
                >
                  <span class="ml-3">{{ $t("shared.accepted") }}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <ConfirmModal ref="modalAccept" @yes="accepted" />
    <ConfirmModal ref="modalReject" @yes="rejected" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import services from "@/services";
import store from "@/store";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import EmptyState from "@/components/ui/emptyState/EmptyState.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import tinyEventBus from "@/plugins/tinyEventBus";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import i18n from "@/locale/i18n";
import { onBeforeUnmount } from "@vue/runtime-core";
import { computed, onMounted, ref } from "vue";

const $t = i18n.global.t;

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const modalReject = ref<InstanceType<typeof ConfirmModal>>();
const modalAccept = ref<InstanceType<typeof ConfirmModal>>();

const loading = ref(false);
const error = ref("");
const items = ref<LinkDto[]>([]);

onMounted(() => {
  reload();
  tinyEventBus().emitter.on("reload-links", () => {
    reload();
  });
})

onBeforeUnmount(() => {
  tinyEventBus().emitter.off("reload-links");
})

function reload() {
  items.value = [];
  loading.value = true;
  services.links
    .getAllPending()
    .then((response) => {
      items.value = response;
    })
    .catch((_error) => {
      error.value = _error;
    })
    .finally(() => {
      loading.value = false;
    });
}
function reject(item: LinkDto) {
  const whoAmIName = whoAmI(item) === 0 ? $t("models.provider.object") : $t("models.client.object");
  if (modalReject.value) {
    modalReject.value.value = item;
    modalReject.value.show($t("app.links.invitation.confirmReject"), $t("shared.reject"), $t("shared.back"), $t("app.links.invitation.rejectWarning", [whoAmIName, inviterWorkspace(item).name]));
  }
}
function accept(item: LinkDto) {
  const whoAmIName = whoAmI(item) === 0 ? $t("models.provider.object") : $t("models.client.object");
  if (modalAccept.value) {
    modalAccept.value.value = item;
    modalAccept.value.show($t("app.links.invitation.confirmAccept", [whoAmIName]), $t("shared.accept"), $t("shared.back"), $t("app.links.invitation.acceptWarning", [inviterWorkspace(item).name]));
  }
}
function accepted(item: LinkDto) {
  loading.value = true;
  services.links
    .acceptOrReject(item.id, {
      accepted: true,
    })
    .then(() => {
      item.status = 1;
      services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function rejected(item: LinkDto) {
  loading.value = true;
  services.links
    .acceptOrReject(item.id, {
      accepted: false,
    })
    .then(() => {
      item.status = 2;
      services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function whoAmI(item: LinkDto) {
  const currentWorkspaceId = store.state.tenant.currentWorkspace?.id ?? "";
  if (currentWorkspaceId === item.providerWorkspaceId) {
    return 0;
  }
  return 1;
}
function inviterWorkspace(item: LinkDto): WorkspaceDto {
  if (item.createdByWorkspaceId === item.providerWorkspaceId) {
    return item.providerWorkspace;
  }
  return item.clientWorkspace;
}
function dateAgo(value: Date) {
  return DateUtils.dateAgo(value);
}
const currentWorkspaceId = computed(() => {
  return store.state.tenant.currentWorkspace?.id ?? "";
})
</script>
