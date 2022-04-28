<template>
  <div>
    <Loading v-if="loading" />
    <form v-else @submit.prevent="save">
      <div class="bg-white py-6 px-8 shadow-lg border border-gray-200">
        <div class="flex items-center space-x-3 justify-between">
          <div>
            <h3
              class="text-lg leading-6 font-medium text-gray-900"
            >{{ $t("models.employee.plural") }}</h3>
          </div>
        </div>
        <div class="mt-6">
          <div v-if="!employeesFile && importingEmployees && showImportEmployees">
            <div class="flex items-center justify-between space-x-3">
              <label for="file" class="block text-sm font-normal text-gray-700 truncate">
                {{ $t("app.employees.actions.uploadCsv") }}:
                <span
                  class="font-bold italic truncate"
                >{{ $t("app.employees.actions.uploadCsvColumns") }}</span>
              </label>
              <button
                type="button"
                @click="downloadEmployeesFileTemplate"
                class="inline-flex items-center space-x-1 text-theme-500 hover:text-theme-700 underline text-sm truncate"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <div>{{ $t("app.employees.actions.uploadCsvTemplate") }}</div>
              </button>
            </div>
            <div class="mt-1">
              <UploadDocument
                accept=".csv"
                :description="$t('app.employees.actions.onlyCsv')"
                @droppedFiles="droppedEmployeesFile"
              >
                <template v-slot:icon>
                  <IconEmployees class="mx-auto h-10 w-10 text-gray-400" />
                </template>
              </UploadDocument>
            </div>
          </div>
          <div>
            <div
              v-for="(employee, idxEmployee) in employees"
              :key="idxEmployee"
              class="relative mt-1 grid gap-1 grid-cols-6 py-2"
            >
              <div class="col-span-3 sm:col-span-2">
                <label
                  v-if="idxEmployee === 0"
                  for="first-name"
                  class="block text-xs font-medium text-gray-700 truncate"
                >{{ $t("models.employee.firstName") }}</label>
                <div class="mt-1">
                  <input
                    autocomplete="off"
                    type="text"
                    :name="'employee-first-name-' + idxEmployee"
                    :id="'employee-first-name-' + idxEmployee"
                    :placeholder="$t('models.employee.firstName') + ' ' + (idxEmployee + 1)"
                    v-model="employee.firstName"
                    required
                    class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div class="col-span-3 sm:col-span-2">
                <label
                  v-if="idxEmployee === 0"
                  for="last-name"
                  class="block text-xs font-medium text-gray-700 truncate"
                >{{ $t("models.employee.lastName") }}</label>
                <div class="mt-1">
                  <input
                    autocomplete="off"
                    type="text"
                    :name="'employee-last-name-' + idxEmployee"
                    :id="'employee-last-name-' + idxEmployee"
                    :placeholder="$t('models.employee.lastName') + ' ' + (idxEmployee + 1)"
                    v-model="employee.lastName"
                    required
                    class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div class="col-span-6 sm:col-span-2">
                <label
                  v-if="idxEmployee === 0"
                  for="employee-email"
                  class="block text-xs font-medium text-gray-700 truncate"
                >{{ $t("models.employee.email") }}</label>
                <div class="mt-1 flex items-center space-x-2">
                  <input
                    autocomplete="off"
                    type="email"
                    :name="'employee-email' + idxEmployee"
                    :id="'employee-email' + idxEmployee"
                    :placeholder="$t('models.employee.email') + ' ' + (idxEmployee + 1)"
                    v-model="employee.email"
                    required
                    class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    class="text-gray-700 hover:bg-gray-50 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                    :class="{
                      'top-0': idxEmployee === 0,
                      '-top-3': idxEmployee > 0
                    }"
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
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <button
                type="button"
                @click="addEmployee"
                class="mt-6 flex items-center space-x-1 text-xs text-theme-600"
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
                <span class="uppercase font-medium">{{ $t("app.employees.actions.add") }}</span>
              </button>
              <button
                type="button"
                @click="importingEmployees = !importingEmployees"
                class="mt-6 flex items-center space-x-1 text-xs text-theme-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="uppercase font-medium">{{ $t("app.employees.actions.import") }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="my-4 flex items-center justify-end space-x-2">
        <div class="flex items-center space-x-2">
          <ButtonSecondary
            @click="cancel"
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >{{ $t("shared.cancel") }}</ButtonSecondary>
          <ButtonPrimary
            type="submit"
            class="inline-flex items-center space-x-2 px-3 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{{ $t("shared.save") }}</span>
          </ButtonPrimary>
        </div>
      </div>
    </form>
    <ConfirmModal ref="confirmCreate" @yes="confirmSave" />
    <SuccessModal ref="successModal" @closed="goToProfile" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import services from "@/services";
import UploadDocument from "@/components/ui/uploaders/UploadDocument.vue";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import Loading from "@/components/ui/loaders/Loading.vue";
import IconEmployees from "@/components/layouts/icons/IconEmployees.vue";
import { useRouter } from "vue-router";
import i18n from "@/locale/i18n";
import { ref } from "vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

const $t = i18n.global.t;
const router = useRouter();

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();
const confirmCreate = ref<InstanceType<typeof ConfirmModal>>();

const employeesFile = ref("");

const showImportEmployees = ref(true);
const importingEmployees = ref(false);

const loading = ref(false);

const employees = ref<EmployeeDto[]>([]);

if (import.meta.env.VITE_VUE_APP_SERVICE === 'sandbox') {
  employees.value.push({
    id: undefined,
    firstName: "Luna",
    lastName: "Davis",
    email: "luna.davis@company.com",
  });
}

addEmployee();

function removeEmployee(index) {
  employees.value = employees.value.filter((_x, i) => i !== index);
  if (employees.value.length === 0) {
    employeesFile.value = "";
  }
}
function save() {
  confirmCreate.value?.show($t("shared.confirmSave"), $t("shared.confirm"), $t("shared.back"));
}
function cancel() {
  router.push("/app/employees");
}
function confirmSave() {
  loading.value = true;
  if (employees.value.length > 0) {
    services.employees
      .createMultiple({
        employees: employees.value,
      })
      .then(() => {
        successModal.value?.show($t("shared.saved"));
      })
      .catch((error) => {
        errorModal.value?.show($t("shared.error"), $t(error));
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
function goToProfile() {
  router.push("/app/employees");
}
function addEmployee() {
  employees.value.push({
    id: undefined,
    firstName: "",
    lastName: "",
    email: "",
  });
}
function downloadEmployeesFileTemplate() {
  const rows = [[$t("models.employee.firstName").toString().toUpperCase(), $t("models.employee.lastName").toString().toUpperCase(), $t("models.employee.email").toString().toUpperCase()]];

  const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "plantilla.csv");
  document.body.appendChild(link);

  link.click();
}
function droppedEmployeesFile(filesBase64: FileBase64[], files: File[]) {
  if (files.length > 0) {
    employeesFile.value = filesBase64[0].base64;
    const _employeesFile = files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const employees = csvToArray(e.target.result);
      employees.forEach((employeeObject) => {
        const employee: string[] = Object.values(employeeObject);
        const firstName = employee.length > 0 ? employee[0].toString().replace("\r", "") : "";
        if (firstName === "NOMBRE" || firstName === "FIRST NAME" || firstName === "NAME") {
          return;
        }
        const lastName = employee.length > 1 ? employee[1].toString().replace("\r", "") : "";
        const email = employee.length > 2 ? employee[2].toString().replace("\r", "") : "";
        employees.value.push({
          id: undefined,
          firstName,
          lastName,
          email,
        });
      });
      employees.value = employees.value.filter((f) => f.firstName && f.lastName);
      clearEmptyEmployees();
    };
    reader.readAsText(_employeesFile);
  }
}
function clearEmptyEmployees() {
  employees.value.forEach((employee, index) => {
    if (!employee.firstName || employee.firstName.trim() === "") {
      employees.value = employees.value.filter((_x, i) => i !== index);
    }
  });
}
function csvToArray(str, delimiter = ",") {
  const headers: string[] = str.slice(0, str.indexOf("\n")).split(delimiter);

  let rows = str.slice(str.indexOf("\n") + 1).split("\n");
  const header = headers[0].trim().toUpperCase();
  if (header === "NOMBRE" || header === "FIRST NAME" || header === "NAME") {
    rows = str.split("\n");
  }
  const arr = rows.map((row) => {
    const values = row.split(delimiter);
    const el = headers.reduce((object, _header, index) => {
      object[index] = values[index];
      return object;
    }, {});
    return el;
  });
  return arr;
}
</script>
