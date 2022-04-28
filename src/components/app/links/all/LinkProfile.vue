<template>
  <div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else-if="getWorkspace && getWorkspace.id">
        <div class="relative min-h-screen">
          <main class="py-4">
            <div
              class="max-w-5xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl"
            >
              <div class="flex items-center space-x-5 truncate">
                <div class="flex-shrink-0">
                  <div class="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="48"
                      height="48"
                      viewBox="0 0 172 172"
                      class="h-16 w-16"
                      style="fill: #000000"
                    >
                      <g
                        fill="none"
                        fill-rule="nonzero"
                        stroke="none"
                        stroke-width="1"
                        stroke-linecap="butt"
                        stroke-linejoin="miter"
                        stroke-miterlimit="10"
                        stroke-dashoffset="0"
                        font-family="none"
                        font-weight="none"
                        font-size="none"
                        text-anchor="none"
                      >
                        <path d="M0,172v-172h172v172z" fill="none" />
                        <g fill="currentColor">
                          <path
                            d="M150.5,150.5h-129v-114.66667c0,-7.88333 6.45,-14.33333 14.33333,-14.33333h100.33333c7.88333,0 14.33333,6.45 14.33333,14.33333z"
                            fill="#a3bffa"
                          />
                          <path d="M21.5,150.5h129v7.16667h-129z" fill="#667eea" />
                          <path
                            d="M111.08333,96.75h21.5v17.91667h-21.5zM75.25,96.75h21.5v17.91667h-21.5zM39.41667,96.75h21.5v17.91667h-21.5zM111.08333,125.41667h21.5v17.91667h-21.5zM39.41667,125.41667h21.5v17.91667h-21.5zM111.08333,68.08333h21.5v17.91667h-21.5zM75.25,68.08333h21.5v17.91667h-21.5zM39.41667,68.08333h21.5v17.91667h-21.5zM111.08333,39.41667h21.5v17.91667h-21.5zM75.25,39.41667h21.5v17.91667h-21.5zM39.41667,39.41667h21.5v17.91667h-21.5zM75.25,125.41667h21.5v32.25h-21.5z"
                            fill="#5a67d8"
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
                <div class="truncate">
                  <div class="flex items-center space-x-2">
                    <h1 class="text-2xl font-bold text-gray-900">{{ getWorkspace.name }}</h1>
                  </div>
                  <p class="text-sm font-medium text-gray-500 truncate">
                    {{ $t("shared.added") }}
                    <span v-if="getWorkspace.createdByUser">
                      {{ $t("shared.by") }}
                      <span
                        class="text-gray-900"
                      >{{ getWorkspace.createdByUser.email }}</span>
                    </span>
                    {{ $t("shared.in") }}
                    <time>{{ dateMonthDayYear(getWorkspace.createdAt) }}</time>
                  </p>
                </div>
              </div>
              <div
                class="mt-6 flex justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3 justify-end"
              >
                <!-- Options -->
                <span
                  v-click-outside="closeOptions"
                  class="relative inline-flex justify-end rounded-md"
                >
                  <router-link
                    :to="'/app/contract/new?l=' + id"
                    class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-r-0 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500 truncate"
                  >
                    <IconSign class="-ml-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                    {{ $t("app.contracts.new.title") }}
                  </router-link>
                  <span class="-ml-px relative block">
                    <button
                      @click="toggleOptions"
                      type="button"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500"
                      id="option-menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                    >
                      <span class="sr-only">{{ $t("app.shared.buttons.openOptions") }}</span>
                      <svg
                        class="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>

                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <div
                        v-show="openOptions"
                        class="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="option-menu-button"
                        tabindex="-1"
                      >
                        <div class="py-1" role="none">
                          <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->

                          <button
                            type="button"
                            @click="reload"
                            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                            role="menuitem"
                            tabindex="-1"
                            id="option-menu-item-0"
                          >
                            <div>{{ $t("shared.reload") }}</div>
                          </button>

                          <button
                            v-if="isOwnerOrAdmin"
                            type="button"
                            @click="deleteLink"
                            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                            role="menuitem"
                            tabindex="-1"
                            id="option-menu-item-2"
                          >{{ $t("shared.delete") }}</button>
                        </div>
                      </div>
                    </transition>
                  </span>
                </span>
                <!-- Options: End -->
              </div>
            </div>

            <div
              class="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-3 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 xl:gap-6"
            >
              <div class="space-y-6 lg:col-start-1 lg:col-span-2">
                <!-- Description list-->
                <section aria-labelledby="applicant-information-title">
                  <div class="bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                      <h2
                        id="applicant-information-title"
                        class="text-lg leading-6 font-medium text-gray-900"
                      >{{ $t("app.links.profile.company") }}</h2>
                      <p
                        class="mt-1 max-w-2xl text-sm text-gray-500"
                      >{{ $t("app.links.profile.general") }}</p>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                        <div class="sm:col-span-3">
                          <dt
                            class="text-sm font-medium text-gray-500"
                          >{{ $t("models.workspace.name") }}</dt>
                          <dd class="mt-1 text-sm text-gray-900">{{ getWorkspace.name }}</dd>
                        </div>

                        <div class="sm:col-span-2">
                          <dt
                            class="text-sm font-medium text-gray-500"
                          >{{ $t("app.workspaces.typesDescription.PUBLIC") }}</dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            <span
                              v-if="getWorkspace.type === 1"
                              class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                            >{{ $t("shared.yes") }}</span>
                            <span
                              v-else
                              class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                            >{{ $t("shared.no") }}</span>
                          </dd>
                        </div>

                        <div class="sm:col-span-3">
                          <dt
                            class="text-sm font-medium text-gray-500"
                          >{{ $t("models.workspace.businessMainActivity") }}</dt>
                          <dd
                            class="mt-1 text-sm text-gray-900"
                          >{{ getWorkspace.businessMainActivity }}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>
              </div>

              <section aria-labelledby="timeline-title" class="lg:col-start-3 lg:col-span-1">
                <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  <h2
                    id="timeline-title"
                    class="text-lg font-medium text-gray-900"
                  >{{ $t("app.shared.activity.title") }}</h2>

                  <!-- Activity Feed -->
                  <div class="mt-6 flow-root">
                    <ul role="list" class="-mb-8">
                      <li>
                        <div class="relative pb-8">
                          <span
                            v-if="contracts.length > 0"
                            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          ></span>
                          <div class="relative flex space-x-3">
                            <div>
                              <span
                                class="h-8 w-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center ring-8 ring-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div class="min-w-0 flex-1 flex justify-between space-x-2">
                              <div>
                                <p class="text-sm text-gray-500">
                                  {{ $t("shared.added") }}
                                  <span v-if="getWorkspace.createdByUser">
                                    {{ $t("shared.by") }}
                                    <span
                                      class="text-gray-900"
                                    >{{ getWorkspace.createdByUser.firstName }} {{ getWorkspace.createdByUser.lastName }}</span>
                                  </span>
                                </p>
                              </div>
                              <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{{ dateDM(getWorkspace.createdAt) }}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li v-for="(contract, idx) in contracts" :key="idx">
                        <div class="relative pb-8">
                          <span
                            v-if="idx < contracts.length - 1"
                            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          ></span>
                          <div class="relative flex space-x-3">
                            <div class="flex-shrink-0">
                              <IconContractClock
                                v-if="contract.status === 0"
                                class="h-8 w-8 text-yellow-500"
                              />
                              <IconContractCheck
                                v-if="contract.status === 1"
                                class="h-8 w-8 text-teal-500"
                              />
                              <IconContractArchived
                                v-if="contract.status === 2"
                                class="h-8 w-8 text-gray-500"
                              />
                            </div>
                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-2">
                              <div class="truncate">
                                <p class="text-sm text-gray-500">
                                  <router-link
                                    :to="'/app/contract/' + contract.id"
                                    class="font-medium text-gray-600 underline hover:text-gray-700"
                                  >{{ contract.name }}</router-link>
                                </p>
                              </div>
                              <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                <time v-if="contract.createdAt">{{ dateDM(contract.createdAt) }}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
    <SuccessModal ref="successModalDeleted" @closed="successModalDeletedClosed" />
    <ConfirmModal ref="confirmDelete" @yes="confirmedDelete" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import services from "@/services";
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import IconContractClock from "@/assets/icons/IconContractClock.vue";
import IconContractCheck from "@/assets/icons/IconContractCheck.vue";
import IconContractArchived from "@/assets/icons/IconContractArchived.vue";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import store from "@/store";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import IconSign from "@/assets/icons/IconSign.vue";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import { WorkspaceDto } from '@/application/dtos/core/workspaces/WorkspaceDto';
import { useRouter } from "vue-router";
import i18n from "@/locale/i18n";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  id: {
    default: ""
  }
})

const $t = i18n.global.t;
const router = useRouter();

const confirmDelete = ref<InstanceType<typeof ConfirmModal>>();
const successModalDeleted = ref<InstanceType<typeof SuccessModal>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();

const loading = ref(false);
const loadingContracts = ref(false);
const openOptions = ref(false);

const link = ref<LinkDto>({} as LinkDto);
const contracts = ref<ContractDto[]>([]);

onMounted(() => {
  reload();
  reloadContracts();
})
function reload() {
  closeOptions();
  loading.value = true;
  services.links
    .get(props.id)
    .then((response) => {
      link.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
function reloadContracts() {
  loadingContracts.value = true;
  services.contracts
    .getAllByLink(link.value.id)
    .then((response) => {
      contracts.value = response;
    })
    .finally(() => {
      loadingContracts.value = false;
    });
}
function deleteLink() {
  closeOptions();
  confirmDelete.value?.show($t("shared.confirmDelete"), $t("shared.delete"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
}
function confirmedDelete() {
  loading.value = true;
  services.links
    .delete(props.id)
    .then(() => {
      services.tenants.getCurrentUsage(AppUsageType.ALL);
      successModalDeleted.value?.show($t("shared.deleted"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function successModalDeletedClosed() {
  if (link.value.providerWorkspaceId === store.state.tenant.currentWorkspace?.id) {
    router.push("/app/links/clients");
  } else {
    router.push("/app/links/providers");
  }
}
function closeOptions() {
  openOptions.value = false;
}
function toggleOptions() {
  openOptions.value = !openOptions.value;
}
function dateMonthDayYear(value: Date | undefined) {
  return DateUtils.dateMonthDayYear(value);
}
function dateDM(value: Date | undefined) {
  return DateUtils.dateDM(value);
}
function whoAmI(item: LinkDto) {
  const currentWorkspaceId = store.state.tenant.currentWorkspace?.id ?? "";
  if (currentWorkspaceId === item.providerWorkspaceId) {
    return 0;
  }
  return 1;
}
const getWorkspace = computed((): WorkspaceDto | undefined => {
  if (whoAmI(link.value) === 0) {
    return link.value.clientWorkspace;
  } else {
    return link.value.providerWorkspace;
  }
})
const isOwnerOrAdmin = computed((): boolean => {
  return currentRole.value === TenantUserRole.OWNER || currentRole.value === TenantUserRole.ADMIN;
})
const currentRole = computed((): TenantUserRole => {
  return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
})
</script>