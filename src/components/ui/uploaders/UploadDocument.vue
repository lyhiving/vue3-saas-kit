<template>
  <div
    class="text-gray-600 overflow-hidden drop text-center flex border-2 border-dashed border-gray-300 rounded-md items-center"
    :class="getClasses"
    @dragover.prevent="dragOver"
    @dragleave.prevent="dragLeave"
    @drop.prevent="drop($event)"
  >
    <div v-if="loading" class="mx-auto font-medium text-base">{{ $t("shared.loading") }}...</div>
    <div v-else>
      <h1 class="mx-auto font-bold text-lg text-theme-500">
        <slot name="title"></slot>
      </h1>
      <div class="manual">
        <div class="space-y-1 text-center">
          <slot name="icon"></slot>
          <div class="flex text-sm text-gray-600">
            <label
              for="uploadmyfile"
              class="relative cursor-pointer rounded-md font-medium text-theme-600 hover:text-theme-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-500"
            >
              <span></span>
              <label for="uploadmyfile">
                <p
                  class="font-semibold text-sm underline cursor-pointer hover:text-theme-500"
                >{{ $t("app.shared.buttons.uploadDocument") }}</p>
              </label>
              <input
                type="file"
                id="uploadmyfile"
                :accept="accept"
                :multiple="multiple"
                @change="requestUploadFile"
              />
            </label>
            <p class="pl-1 lowercase">{{ $t("shared.or") }} {{ $t("shared.dragAndDrop") }}</p>
          </div>
          <p class="text-xs text-gray-500">{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import imageCompression from "browser-image-compression";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
import { computed, ref } from "vue";

defineProps({
  accept: String,
  multiple: Boolean,
  description: String,
  imageStyle: {
    default: 0
  },
})

const $emit = defineEmits(["dropped", "droppedFiles"])

const isDragging = ref(false);
const loading = ref(false);

function dragOver() {
  if (!loading.value) {
    isDragging.value = true;
  }
}
function dragLeave() {
  isDragging.value = false;
}
async function compressFile(imageFile: File): Promise<any> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920 / 2,
    useWebWorker: true,
  };
  try {
    const file = await imageCompression(imageFile, options);
    return Promise.resolve(file);
  } catch (error) {
    return Promise.reject(error);
  }
}
async function compressFileNotImage(imageFile: File): Promise<any> {
  return Promise.resolve(imageFile);
}
async function drop(e) {
  let files: any[] = [...e.dataTransfer.files];
  const newImagesPromises: any[] = [];
  await files.forEach((element: File) => {
    if (element.type.includes("image")) {
      newImagesPromises.push(compressFile(element));
    } else {
      newImagesPromises.push(compressFileNotImage(element));
    }
  });
  files = await Promise.all(newImagesPromises);
  const filesArray: FileBase64[] = [];
  const promises: any[] = [];

  files.forEach((file) => {
    const promise = getBase64(file);
    promises.push(promise);
    promise
      .then((response) => {
        filesArray.push({
          file,
          base64: response,
        });
        $emit("dropped", response, file);
      })
      .catch((e) => {
        console.error(e);
      });
  });
  await Promise.all(promises).then(() => {
    $emit("droppedFiles", filesArray, files);
  });
  isDragging.value = false;
}
function requestUploadFile() {
  const src = document.querySelector("#uploadmyfile");
  drop({ dataTransfer: src });
}
function getBase64(file) {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (ev) => {
      resolve(ev?.target?.result);
    };
    reader.readAsDataURL(file);
  });
}
const getClasses = computed(() => {
  return isDragging.value && !loading.value ? "bg-theme-200 border-2 border-dashed border-theme-800" : "";
})
</script>

<style scoped>
.drop {
  align-items: center;
  justify-content: center;
  padding: 1rem;
  transition: background-color 0.2s ease-in-out;
}

#uploadmyfile {
  display: none;
}
</style>
