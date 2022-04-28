<template>
  <div class="max-w-5xl xl:max-w-7xl mx-auto pb-6">
    <Loading v-if="loading" />
    <div
      v-else-if="!item || !item.id"
      class="mx-auto p-5 items-center justify-between flex text-red-700"
    >{{ error }}</div>
    <div v-else-if="item" :key="id">
      <div
        class="md:flex space-y-2 md:space-y-0 items-center justify-between py-3 border-b border-gray-200 mb-2 md:space-x-3"
      >
        <div class="font-bold text-xl uppercase truncate">
          <span class="truncate">{{ item.name }}</span>
        </div>
        <div class="flex justify-end items-end space-x-2">
          <button
            v-if="editing && isOwnerOrAdmin"
            @click="deleteContract"
            type="button"
            class="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >{{ $t("shared.delete") }}</button>
          <button
            v-if="editing"
            @click="toggleEdit"
            type="button"
            class="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >{{ $t("shared.cancel") }}</button>
          <button
            ref="buttonSave"
            v-if="editing"
            @click="save"
            type="submit"
            class="inline-flex truncate justify-center px-4 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >{{ $t("shared.saveChanges") }}</button>
          <div v-if="!editing" class="flex items-end space-x-2 space-y-0">
            <DropdownWithClick ref="dropdownOptions" @click="downloadPdf">
              <template v-slot:button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="-ml-0.5 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {{ $t("shared.download") }}
              </template>

              <template v-slot:options>
                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                <button
                  type="button"
                  v-if="canEdit"
                  @click="toggleEdit"
                  :disabled="!canBeEdited"
                  :class="{
                    ' bg-gray-100 cursor-not-allowed': !canBeEdited,
                    ' hover:bg-gray-50': canBeEdited,
                  }"
                  class="w-full text-left text-gray-700 block px-4 py-2 text-sm focus:outline-none"
                  role="menuitem"
                  tabindex="-1"
                  id="option-menu-item-1"
                >
                  <div>{{ $t("shared.edit") }}</div>
                </button>

                <button
                  type="button"
                  @click="reload"
                  class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                  role="menuitem"
                  tabindex="-1"
                  id="option-menu-item-2"
                >
                  <div>{{ $t("shared.reload") }}</div>
                </button>

                <button
                  type="button"
                  @click="send"
                  class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                  role="menuitem"
                  tabindex="-1"
                  id="option-menu-item-6"
                >{{ $t("shared.send") }}</button>
              </template>
            </DropdownWithClick>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 min-h-screen">
        <div class="py-2">
          <div class="grid gap-4 lg:grid-cols-3">
            <div class="lg:col-span-2 space-y-4">
              <div>
                <h3
                  class="mb-2 text-gray-400 font-medium text-sm"
                >{{ $t("app.contracts.details.general") }}</h3>
                <div class="bg-white p-3 rounded border border-gray-100 shadow-md space-y-3">
                  <div class="grid sm:grid-cols-3 gap-2">
                    <div>
                      <label
                        for="provider"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.provider.object") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="provider"
                          id="provider"
                          autocomplete="off"
                          required
                          v-model="providerFullName"
                          disabled
                          class="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="client"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.client.object") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="client"
                          id="client"
                          autocomplete="off"
                          required
                          v-model="clientFullName"
                          disabled
                          class="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="status"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.contract.status") }}</label>
                      <select
                        id="status"
                        name="status"
                        :disabled="!editing"
                        :class="[
                        'mt-1 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md',
                        {
                          'bg-gray-100': !editing,
                          'bg-white': editing
                        }]"
                        v-model="status"
                      >
                        <option :value="0">{{ $t("app.contracts.status.PENDING") }}</option>
                        <option :value="1">{{ $t("app.contracts.status.SIGNED") }}</option>
                        <option :value="2">{{ $t("app.contracts.status.ARCHIVED") }}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      for="name"
                      class="block text-xs font-medium text-gray-700"
                    >{{ $t("models.contract.name") }}</label>
                    <div class="mt-1">
                      <input
                        :disabled="!editing"
                        type="text"
                        ref="inputName"
                        name="name"
                        v-model="name"
                        id="name"
                        class="text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        :class="{
                          'bg-gray-100': !editing,
                          'bg-white': editing,
                        }"
                        :placeholder="$t('models.contract.name')"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      for="description"
                      class="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >{{ $t("models.contract.description") }}</label>
                    <div class="mt-1 sm:col-span-2">
                      <textarea
                        :disabled="!editing"
                        id="description"
                        v-model="description"
                        rows="5"
                        class="p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        :class="{
                          'bg-gray-100': !editing,
                          'bg-white': editing,
                        }"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >{{ $t("models.contract.file") }}</label>
                    <div
                      class="mt-1 sm:col-span-2"
                      :class="{
                        'bg-white': editing,
                      }"
                    >
                      <div v-if="loadingPdf">
                        <div class="overflow-hidden border border-gray-300 rounded-md items-center">
                          <Loading />
                        </div>
                      </div>
                      <div v-else>
                        <PdfViewer
                          v-if="contractPdf && contractPdf.length > 0"
                          :file="contractPdf"
                          :editing="editing"
                        ></PdfViewer>
                        <UploadDocument
                          v-else
                          accept=".pdf"
                          :description="$t('shared.onlyFileTypes', ['.PDF'])"
                          @droppedFiles="droppedContractFile"
                        >
                          <template v-slot:icon>
                            <IconContract class="mx-auto h-10 w-10 text-gray-400" />
                          </template>
                        </UploadDocument>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-5">
              <ContractMembers :items="item.members" />
              <ContractEmployees v-if="item.employees.length > 0" :items="item.employees" />
              <ContractActivity :items="item.activity" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal ref="confirmSendContract" @yes="yesSendContract" />
    <ConfirmModal ref="confirmDelete" @yes="yesDelete" />
    <ErrorModal ref="errorModal" />
    <SuccessModal ref="successModal" />
  </div>
</template>

<script setup lang="ts">
import tinyEventBus from "@/plugins/tinyEventBus";
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import services from "@/services";
import store from "@/store";
import UploadDocument from "@/components/ui/uploaders/UploadDocument.vue";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import ContractMembers from "@/components/app/contracts/ContractMembers.vue";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import Loading from "@/components/ui/loaders/Loading.vue";
import DropdownWithClick from "@/components/ui/dropdowns/DropdownWithClick.vue";
import { useRouter } from 'vue-router';
import i18n from "@/locale/i18n";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import IconContract from "@/assets/icons/IconContract.vue";
import ContractEmployees from "./ContractEmployees.vue";
import ContractActivity from "./ContractActivity.vue";
import PdfViewer from "@/components/ui/pdf/PdfViewer.vue";
import { ContractStatus } from "@/application/enums/app/contracts/ContractStatus";

const router = useRouter();
const $t = i18n.global.t;

const props = defineProps({
  id: {
    default: ""
  }
})

const inputName = ref<HTMLInputElement>();
const buttonSave = ref<HTMLButtonElement>();
const confirmSendContract = ref<InstanceType<typeof ConfirmModal>>();
const confirmDelete = ref<InstanceType<typeof ConfirmModal>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const dropdownOptions = ref<InstanceType<typeof DropdownWithClick>>();


const name = ref("");
const status = ref(ContractStatus.PENDING);
const description = ref("");
const contractPdf = ref("");

const editing = ref(false);

const item = ref<ContractDto | undefined>(undefined);
const error = ref("");
const loading = ref(false);
const loadingPdf = ref(false);

onMounted(() => {
  tinyEventBus().emitter.on("contract-reload", () => {
    reload();
  });
  reload();
})

onBeforeUnmount(() => {
  tinyEventBus().emitter.off("contract-reload");
})

function reload() {
  closeOptions();
  loading.value = true;
  item.value = undefined;
  services.contracts
    .getContract(props.id)
    .then((response) => {
      item.value = response;
      name.value = response.name;
      status.value = response.status;
      description.value = response.description;
      loadPdf();
    })
    .catch((_error) => {
      error.value = _error;
    })
    .finally(() => {
      loading.value = false;
    });
}
function loadPdf() {
  downloadFile(false);
}
function downloadFile(open: boolean) {
  closeOptions();
  loadingPdf.value = true;
  services.contracts
    .downloadFile(props.id)
    .then((response) => {
      if (open) {
        const downloadLink = document.createElement("a");
        const fileName = item.value?.name + ".pdf";
        downloadLink.href = response;
        downloadLink.download = fileName;
        downloadLink.click();
      } else {
        contractPdf.value = response;
      }
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loadingPdf.value = false;
    });
}
function downloadPdf() {
  closeOptions();
  if (item.value) {
    const downloadLink = document.createElement("a");
    const fileName = item.value?.name + ".pdf";
    downloadLink.href = contractPdf.value;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
function toggleEdit() {
  closeOptions();
  editing.value = !editing.value;
  if (editing.value) {
    nextTick(() => {
      inputName.value?.focus();
      inputName.value?.select();
    });
  }
}
function deleteContract() {
  confirmDelete.value?.show($t("shared.confirmDelete"), $t("shared.delete"), $t("shared.cancel"), $t("shared.warningCannotUndo"));
}
function yesDelete() {
  loading.value = true;
  services.contracts
    .delete(item.value?.id)
    .then(() => {
      router.push("/app/contracts/all");
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
      loading.value = false;
    });
}
function droppedContractFile(files: FileBase64[]) {
  if (item.value) {
    if (files.length > 0) {
      contractPdf.value = files[0].base64;
    }
  }
}
function send() {
  closeOptions();
  confirmSendContract.value?.show(
    $t("shared.send"),
    $t("shared.send"),
    $t("shared.cancel"),
    $t("shared.sendTo", [item.value?.members.map((f) => (f.user.firstName + " " + f.user.lastName).trim() + " (" + f.user.email + ")").join(", ")])
  );
}
function yesSendContract() {
  if (!item.value) {
    return;
  }
  services.contracts
    .send(item.value.id, {
      emails: [],
    })
    .then(() => {
      successModal.value?.show($t("shared.sent"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
function save() {
  if (!name.value) {
    errorModal.value?.show($t("shared.error"), $t("app.contracts.errors.nameRequired"));
  } else if (!description.value) {
    errorModal.value?.show($t("shared.error"), $t("app.contracts.errors.descriptionRequired"));
  } else if (!contractPdf.value) {
    errorModal.value?.show($t("shared.error"), $t("app.contracts.errors.fileRequired"));
  } else {
    loading.value = true;
    services.contracts
      .update(props.id, {
        name: name.value,
        status: status.value,
        description: description.value,
        file: contractPdf.value,
      })
      .then(() => {
        editing.value = false;
        successModal.value?.show($t("shared.updated"), $t("shared.saved"));
      })
      .catch((error) => {
        errorModal.value?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
function closeOptions() {
  if (dropdownOptions.value) {
    dropdownOptions.value?.close();
  }
}
const clientFullName = computed(() => {
  if (item.value && item.value.link?.clientWorkspace) {
    return `${item.value.link.clientWorkspace.name}`;
  }
  return "";
})
const providerFullName = computed(() => {
  if (item.value && item.value.link?.providerWorkspace) {
    return `${item.value.link.providerWorkspace.name}`;
  }
  return "";
})
const canBeEdited = computed(() => {
  return item.value?.members.filter((f) => f.role === 0 && f.signDate).length === 0;
})

const isOwnerOrAdmin = computed((): boolean => {
  return currentRole.value === TenantUserRole.OWNER || currentRole.value === TenantUserRole.ADMIN;
})
const currentRole = computed((): TenantUserRole => {
  return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
})
const canEdit = computed(() => {
  if (isOwnerOrAdmin.value) {
    return true;
  }
  return item.value?.createdByUserId === store.state.account.user?.id || true;
})
</script>
