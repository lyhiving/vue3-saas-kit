<template>
  <div>
    <Breadcrumb
      :menu="[
        {
          title: $t('app.contracts.title'),
          routePath: '/app/contracts/pending'
        },
        {
          title: $t('app.contracts.new.title'),
          routePath: '/app/contract/new',
        },
      ]"
    />

    <div class="lg:py-8 max-w-2xl mx-auto">
      <Loading v-if="loading" />
      <div v-else>
        <div v-if="maxContractsReached">
          <WarningBanner
            redirect="/app/settings/subscription"
            :title="$t('app.subscription.errors.limitReached')"
            :text="$t('app.subscription.errors.limitReachedContracts', [features.monthlyContracts])"
          />
        </div>
        <form v-else>
          <div class="sm:space-y-4 divide-y divide-gray-200">
            <div class="bg-white py-6 px-8 shadow-lg border border-gray-200 space-y-6">
              <div class="flex items-center space-x-3 justify-between">
                <div>
                  <div>
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                    >{{ $t("app.contracts.new.title") }}</h3>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{{ $t("app.contracts.new.description") }}</p>
                </div>
                <IconContract class="h-8 w-8 text-gray-800" />
              </div>

              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-6">
                  <label
                    for="link"
                    class="block text-xs font-medium text-gray-700 truncate"
                  >{{ $t("models.link.object") }}</label>
                  <LinkSelector
                    id="link"
                    ref="linkSelector"
                    class="mt-1 w-full"
                    @selected="selectedLink"
                  />
                </div>

                <div class="sm:col-span-6">
                  <label
                    for="name"
                    class="block text-xs font-medium text-gray-700 truncate"
                  >{{ $t("shared.name") }}</label>
                  <div class="mt-1 flex rounded-md shadow-sm w-full">
                    <input
                      id="name"
                      ref="inputName"
                      v-model="name"
                      type="text"
                      name="name"
                      autocomplete="off"
                      required
                      :placeholder="$t('app.contracts.placeholders.name')"
                      class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                    />
                  </div>
                </div>

                <div class="sm:col-span-6">
                  <label
                    for="description"
                    class="block text-xs font-medium text-gray-700 truncate"
                  >{{ $t("shared.description") }}</label>
                  <div class="mt-1 flex rounded-md shadow-sm w-full">
                    <textarea
                      id="description"
                      v-model="description"
                      rows="3"
                      autocomplete="off"
                      required
                      :placeholder="$t('app.contracts.placeholders.description')"
                      class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                    />
                  </div>
                </div>

                <div class="sm:col-span-6">
                  <label
                    class="block text-xs font-medium text-gray-700 truncate"
                  >{{ $t("shared.file") }}</label>
                  <div class="mt-1">
                    <PdfViewer
                      v-if="contractFile"
                      :file="contractFile"
                      :editing="true"
                      @removeFile="removeFile"
                    />
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

            <div class="bg-white py-6 px-8 shadow-lg border border-gray-200">
              <div class="flex items-center space-x-3 justify-between">
                <div>
                  <div>
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                    >{{ $t("app.contracts.signatories") }}</h3>
                  </div>
                  <p
                    class="mt-1 text-sm text-gray-500"
                  >{{ $t("app.contracts.new.addSignatories") }}.</p>
                </div>
                <IconSign class="h-8 w-8 text-gray-800" />
              </div>
              <div>
                <div
                  v-for="(member, idxMember) in members"
                  :key="idxMember"
                  class="grid grid-cols-6 items-center space-x-2 relative py-3 gap-3 sm:gap-0"
                >
                  <button
                    type="button"
                    class="absolute origin-top-right right-0 top-0 mt-1 mr-0 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                    :disabled="members.length <= 1"
                    :class="{
                      'text-gray-400 cursor-not-allowed': members.length <= 1,
                      'text-gray-700 hover:bg-gray-50': members.length > 1,
                    }"
                    @click="removeMember(idxMember)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
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
                  </button>
                  <div class="col-span-6 sm:col-span-2">
                    <label
                      for="full-name"
                      class="block text-xs font-medium text-gray-700 truncate"
                    >{{ $t("account.shared.fullName") }}</label>
                    <div class="mt-1">
                      <input
                        id="full-name"
                        :ref="'fullName-' + idxMember"
                        v-model="member.name"
                        required
                        type="text"
                        name="full-name"
                        :placeholder="$t('account.shared.name')"
                        disabled
                        autocomplete="full-name"
                        class="bg-gray-100 cursor-not-allowed shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div class="col-span-3 sm:col-span-2">
                    <div class="flex items-start space-x-2">
                      <div class="flex-grow">
                        <label
                          for="email"
                          class="block text-xs font-medium text-gray-700 truncate"
                        >{{ $t("account.shared.email") }}</label>
                        <div class="mt-1">
                          <input
                            id="email"
                            v-model="member.email"
                            name="email"
                            type="email"
                            disabled
                            :placeholder="member.role === 0 ? $t('app.contracts.placeholders.signatoryEmail') : $t('app.contracts.placeholders.spectatorEmail')"
                            autocomplete="email"
                            required
                            class="bg-gray-100 cursor-not-allowed shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-span-3 sm:col-span-2">
                    <div class="flex items-start space-x-2">
                      <div class="flex-grow">
                        <label
                          for="role"
                          class="block text-xs font-medium text-gray-700 truncate"
                        >{{ $t("shared.role") }}</label>
                        <div class="mt-1">
                          <select
                            id="role"
                            v-model="member.role"
                            autocomplete="email"
                            class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option :value="0">{{ $t("app.contracts.signatory") }}</option>
                            <option :value="1">{{ $t("app.contracts.spectator") }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  class="mt-6 flex items-center space-x-1 text-xs text-theme-600"
                  @click="addMember"
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
                  >{{ $t("app.contracts.actions.selectSignatoryOrSpectator") }}</span>
                </button>
              </div>
            </div>

            <div v-if="imProvider" class="bg-white py-6 px-8 shadow-lg border border-gray-200">
              <div class="flex items-center space-x-3 justify-between">
                <div>
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                  >{{ $t("models.employee.plural") }}</h3>
                  <p class="mt-1 text-sm text-gray-500">{{ $t("app.employees.actions.select") }}.</p>
                </div>
                <IconWorkers class="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <div>
                  <div
                    v-for="(employee, idxEmployee) in employees"
                    :key="idxEmployee"
                    class="relative mt-1 grid gap-1 grid-cols-6 py-2"
                  >
                    <button
                      type="button"
                      class="text-gray-700 hover:bg-gray-50 absolute origin-top-right right-0 top-0 mr-0 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                      @click="removeEmployee(idxEmployee)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
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
                    </button>
                    <div class="col-span-6 sm:col-span-2">
                      <label
                        :for="'employee-first-name-' + idxEmployee"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.employee.fullName") }}</label>
                      <div class="mt-1">
                        <input
                          id="employee-first-name-"
                          :ref="'employee-first-name-' + idxEmployee"
                          v-model="employee.firstName"
                          type="text"
                          name="employee-first-name-"
                          :placeholder="$t('models.employee.object') + ' ' + (idxEmployee + 1)"
                          autocomplete="off"
                          required
                          disabled
                          class="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div class="col-span-3 sm:col-span-2">
                      <label
                        :for="'employee-last-name-' + idxEmployee"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.employee.lastName") }}</label>
                      <div class="mt-1">
                        <input
                          id="employee-last-name"
                          v-model="employee.lastName"
                          type="text"
                          name="employee-last-name"
                          autocomplete="off"
                          required
                          disabled
                          class="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div class="col-span-3 sm:col-span-2">
                      <label
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.employee.email") }}</label>
                      <div class="mt-1">
                        <input
                          id="employee-email"
                          v-model="employee.email"
                          type="text"
                          name="employee-email"
                          autocomplete="off"
                          required
                          disabled
                          class="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <button
                      type="button"
                      class="mt-6 flex items-center space-x-1 text-xs text-theme-600"
                      @click="addEmployee"
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
                      >{{ $t("app.employees.actions.selectEmployees") }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="py-5">
            <div class="flex justify-end py-3 px-4 lg:px-0 lg:py-0">
              <router-link
                to="/app/contracts/pending"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
              >{{ $t("shared.cancel") }}</router-link>
              <button
                type="button"
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                @click="save"
              >{{ $t("app.contracts.new.save") }}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <SelectEmployees ref="selectEmployees" @selected="selectedEmployees" />
    <SelectContractMembers ref="selectContractMembers" @selected="selectedContractMembers" />
    <ConfirmModal ref="confirmCreate" @yes="saveContract" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
// import pdf from "vue3-pdf";
import store from "@/store";
import { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
import services from "@/services";
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import IconContract from "@/assets/icons/IconContract.vue";
import IconSign from "@/assets/icons/IconSign.vue";
import IconWorkers from "@/assets/icons/IconWorkers.vue";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import WarningBanner from "@/components/ui/banners/WarningBanner.vue";
import { AddContractMemberDto } from "@/application/contracts/app/contracts/AddContractMemberDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import Loading from "@/components/ui/loaders/Loading.vue";
import LinkSelector from "@/components/app/links/selectors/LinkSelector.vue";
import SelectEmployees from "@/components/app/employees/SelectEmployees.vue";
import SelectContractMembers from "@/components/app/contracts/SelectContractMembers.vue";
import UploadDocument from "@/components/ui/uploaders/UploadDocument.vue";
import i18n from "@/locale/i18n";
import { useRoute, useRouter } from 'vue-router';
import { useMeta } from "@/modules/vue-meta";
import { computed, nextTick, onMounted, ref } from "vue";
import PdfViewer from "@/components/ui/pdf/PdfViewer.vue";

const $t = i18n.global.t;
const router = useRouter();
const route = useRoute();

useMeta({
  title: $t("app.contracts.new.title").toString()
})

const inputName = ref<HTMLInputElement>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const confirmCreate = ref<InstanceType<typeof ConfirmModal>>();
const selectEmployees = ref<InstanceType<typeof SelectEmployees>>();
const selectContractMembers = ref<InstanceType<typeof SelectContractMembers>>();
const linkSelector = ref<InstanceType<typeof LinkSelector>>();

const name = ref("");
const link = ref<LinkDto | null>(null);
const linkId = ref("");
const description = ref("");
const contractFile = ref("");
const employeesFile = ref("");
const members = ref<AddContractMemberDto[]>([]);
const employees = ref<EmployeeDto[]>([]);
const loading = ref(false);
const preselectLinkId = ref("");

onMounted(() => {
  preselectLinkId.value = route.query?.l?.toString() ?? "";
  if (preselectLinkId.value) {
    services.links.get(preselectLinkId.value).then((link) => {
      linkSelector.value?.select(link);
    });
  }
  loadFeatures();
})

function loadFeatures() {
  services.tenants.getCurrentUsage(AppUsageType.CONTRACTS);
  services.tenants.getFeatures();
}
function addMember() {
  if (!link.value || !link.value.id) {
    errorModal.value?.show($t("shared.missingFields"), $t("app.contracts.errors.linkRequired"));
  } else {
    selectContractMembers.value?.show(
      link.value,
      link.value?.id,
      members.value.map((f) => f.userId)
    );
  }
}
function addEmployee() {
  selectEmployees.value?.show(employees.value.map((f) => f.id));
}
function removeFile() {
  contractFile.value = "";
}
function removeMember(index) {
  members.value = members.value.filter((_x, i) => i !== index);
}
function removeEmployee(index) {
  employees.value = employees.value.filter((_x, i) => i !== index);
  if (employees.value.length === 0) {
    employeesFile.value = "";
  }
}
function save() {
  if (maxContractsReached.value) {
    errorModal.value?.show($t("shared.error"), $t("app.subscription.errors.limitReachedContracts"));
  } else if (!link.value || !link.value.id) {
    errorModal.value?.show($t("shared.missingFields"), $t("app.contracts.errors.linkRequired"));
    return;
  } else if (!name.value) {
    errorModal.value?.show($t("shared.missingFields"), $t("app.contracts.errors.nameRequired"));
    return;
  } else if (!description.value) {
    errorModal.value?.show($t("app.contracts.errors.descriptionRequired"));
    return;
  } else if (!contractFile.value) {
    errorModal.value?.show($t("shared.missingFields"), $t("app.contracts.errors.fileRequired"));
  } else if (!members.value || members.value.filter((f) => f.role === ContractMemberRole.SIGNATORY).length < 2) {
    errorModal.value?.show($t("shared.missingFields"), $t("app.contracts.errors.atLeastNSignatories"));
    return;
  } else {
    confirmCreate.value?.show($t("app.contracts.actions.create"), $t("shared.create"), $t("shared.cancel"), $t("app.contracts.actions.createDescription"));
  }
}
function saveContract() {
  loading.value = true;
  services.contracts
    .create({
      linkId: linkId.value,
      // clientWorkspaceId: clientWorkspaceId.value,
      name: name.value,
      description: description.value,
      file: contractFile.value,
      members: members.value,
      employees: employees.value,
    })
    .then((response: ContractDto) => {
      router.push("/app/contract/" + response.id);
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    })
    .finally(() => {
      loading.value = false;
    });
}
function droppedContractFile(files: FileBase64[]) {
  if (files.length > 0) {
    const mb = files[0].file.size / 1048576;
    if (mb >= 20) {
      errorModal.value?.show("Límite excedido", $t("app.contracts.errors.maxFileReached"));
    } else {
      contractFile.value = files[0].base64;
    }
  }
}
function selectedLink(id: string, _link: LinkDto) {
  linkId.value = id;
  link.value = _link;
  nextTick(() => {
    inputName.value?.focus();
    inputName.value?.select();
  });
}
function selectedEmployees(items: EmployeeDto[]) {
  employees.value = items;
}
function selectedContractMembers(items: AddContractMemberDto[]) {
  members.value = items;
}
const imProvider = computed(() => {
  return store.state.tenant.currentWorkspace?.id === link.value?.providerWorkspaceId;
})
const features = computed((): TenantFeaturesDto => {
  return store.state.app.features;
})
const usage = computed((): AppUsageSummaryDto => {
  return store.state.app.usage;
})
const maxContractsReached = computed(() => {
  if (!features.value) {
    return true;
  } else {
    return features.value.monthlyContracts > 0 && usage.value.contracts >= features.value.monthlyContracts;
  }
})
</script>
