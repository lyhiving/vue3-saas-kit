<template>
  <div>
    <SlideOver @close="close" :title="title">
      <template v-slot:content class="space-y-2">
        <UploadDocument
          ref="pictureInput"
          accept="image/png, image/jpg, image/jpeg"
          :description="title"
          @dropped="onChange"
        />
        <div v-if="image">
          <img class="w-full h-auto" alt="Image" :src="image" />
        </div>
      </template>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SlideOver from "../slideOvers/SlideOver.vue";
import UploadDocument from "./UploadDocument.vue";

defineProps({
  title: String,
  image: String,
})

const $emit = defineEmits(["loaded", "close"])
const image = ref("");

function onChange(base64: string, _file: File) {
  image.value = base64;
  console.log("file", _file)
  $emit("loaded", base64);
}
function close() {
  $emit("close");
}
</script>