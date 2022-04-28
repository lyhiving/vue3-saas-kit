<template>
  <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="md:grid lg:grid-cols-3 md:gap-2">
      <div class="md:col-span-1">
        <div class="sm:px-0">
          <h3
            class="text-lg font-medium leading-6 text-gray-900"
          >{{ $t("settings.tenant.general") }}</h3>
          <p
            class="mt-1 text-xs leading-5 text-gray-600"
          >{{ $t("settings.tenant.generalDescription") }}</p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form @submit.prevent="updateTenant()" method="POST">
          <div class="shadow overflow-hidden sm:rounded-sm">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-6 sm:col-span-6">
                  <label
                    for="name"
                    class="block text-sm font-medium leading-5 text-gray-700"
                  >{{ $t("shared.name") }}</label>
                  <input
                    v-model="tenant.name"
                    required
                    id="name"
                    class="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                class="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
              >{{ $t("shared.save") }}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <UploadImage
      v-if="showUploadImage && !uploadingImage"
      @close="showUploadImage = false"
      :title="$t('shared.' + imageType)"
      :image="imageCurrent"
      @loaded="loadedImage"
    />
    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import UploadImage from "@/components/ui/uploaders/UploadImage.vue";
import { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import store from "@/store";
import services from "@/services";
import i18n from '@/locale/i18n';
import { useMeta } from "@/modules/vue-meta";
import { ref } from "vue";

const $t = i18n.global.t;

useMeta({
  title: i18n.global.t("app.navbar.tenant").toString()
})

const errorModal = ref<InstanceType<typeof ErrorModal>>();
const successModal = ref<InstanceType<typeof SuccessModal>>();

const tenant = ref<TenantDto>({} as TenantDto);
const imageType = ref("");
const imageCurrent = ref("");
const showUploadImage = ref(false);
const uploadingImage = ref(false);

getCurrentTenantInForm();

function getCurrentTenantInForm() {
  tenant.value.name = store.state.tenant.current?.name ?? "";
  tenant.value.subdomain = store.state.tenant.current?.subdomain ?? "";
  tenant.value.domain = store.state.tenant.current?.domain ?? "";
}
function updateTenant() {
  services.tenants
    .update(tenant.value)
    .then(() => {
      services.tenants.getAll().then(() => {
        getCurrentTenantInForm();
      });

      successModal.value?.show($t("shared.updated"), $t("settings.tenant.updated"));
    })
    .catch((error) => {
      errorModal.value?.show($t("shared.error"), $t(error));
    });
}
function loadedImage(image) {
  const payload: TenantUpdateImageRequest = {
    type: imageType.value,
    logo: imageType.value === "logo" ? image : "",
    icon: imageType.value === "icon" ? image : "",
    logoDarkmode: imageType.value === "logoDarkmode" ? image : "",
  };
  payload.type = imageType.value;
  uploadingImage.value = true;
  services.tenants
    .updateImage(payload)
    .then(() => {
      store.commit("tenant/setCurrentImage", {
        imageType: imageType.value,
        image,
      });
      showUploadImage.value = false;
    })
    .catch((error) => {
      console.error("Error: " + error);
    })
    .finally(() => {
      uploadingImage.value = false;
    });
}
</script>
