<template>
  <div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else-if="item && item.id">
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
                        style="mix-blend-mode: normal"
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
                    <h1 class="text-2xl font-bold text-gray-900">{{ item.name }}</h1>
                  </div>
                  <p class="text-sm font-medium text-gray-500 truncate">
                    {{ $t("shared.createdBy") }}
                    <span v-if="item.createdByUser">
                      {{ $t("shared.by") }}
                      <span
                        class="text-gray-900"
                      >{{ item.createdByUser.email }}</span>
                    </span>
                    {{ $t("shared.in") }}
                    <time
                      v-if="item.createdAt"
                    >{{ dateMonthDayYear(item.createdAt) }}</time>
                  </p>
                </div>
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
                          <dd class="mt-1 text-sm text-gray-900">{{ item.name }}</dd>
                        </div>

                        <div class="sm:col-span-1">
                          <dt
                            class="text-sm font-medium text-gray-500"
                          >{{ $t("models.workspace.plural") }}</dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            <span v-if="item.workspaces">{{ item.workspaces.length }}</span>
                          </dd>
                        </div>
                        <div class="sm:col-span-2">
                          <dt
                            class="text-sm font-medium text-gray-500"
                          >{{ $t("models.user.plural") }}</dt>
                          <dd class="mt-1 text-sm text-gray-900">
                            <span v-if="item.users">{{ item.users.length }}</span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>
              </div>
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
import services from "@/services";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import { useRouter } from "vue-router";
import i18n from "@/locale/i18n";
import { onMounted, ref } from "vue";

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
const openOptions = ref(false);
const item = ref<TenantDto>({} as TenantDto);

onMounted(() => {
  reload();
})

function reload() {
  closeOptions();
  loading.value = true;
  services.tenants
    .get(props.id)
    .then((response) => {
      item.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
}
function confirmedDelete() {
  loading.value = true;
  services.tenants
    .adminDelete(props.id)
    .then(() => {
      successModalDeleted.value?.show($t("shared.deleted"), $t("app.tenants.actions.deleted"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function successModalDeletedClosed() {
  router.push("/admin/tenants");
}
function closeOptions() {
  openOptions.value = false;
}
function dateMonthDayYear(value: Date | undefined) {
  return DateUtils.dateMonthDayYear(value);
}
</script>
