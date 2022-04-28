<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-6 pb-12 p-4 mx-auto max-w-2xl text-slate-900">
    <div class="space-y-1">
      <h3 class="font-medium text-sm">Breadcrumbs</h3>
      <div class="flex items-center space-x-2 p-2 border-dashed border-gray-300 border">
        <PreviewBreadcrumbs />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Tab - as Links</h3>
      <div class="flex items-center space-x-2 p-2 border-dashed border-gray-300 border">
        <PreviewTabsAsLinks />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Tab - as Buttons</h3>
      <div class="p-2 border-dashed border-gray-300 border">
        <PreviewTabsAsButtons />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Buttons</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewButtons />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Buttons - as Links</h3>

      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewButtonsAsLinks />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Buttons - Destructive</h3>

      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewButtonsDestructive />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Dropdowns - Simple</h3>
      <div class="space-x-2 bg-white p-6 border-dashed border-gray-300 border">
        <div class="space-y-2">
          <PreviewDropdownsSimple />
        </div>
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Dropdowns - with Click</h3>
      <div class="space-x-2 bg-white p-6 border-dashed border-gray-300 border">
        <div class="space-y-2">
          <PreviewDropdownsWithClick />
        </div>
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Modals</h3>

      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewModals />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Banners</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewBanners />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Empty States</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewEmptyStates />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Uploaders</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewUploadersDocument />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Pdf Viewer</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewPdfViewers />
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="font-medium text-sm">Loaders</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <PreviewLoaders />
      </div>
    </div>

    <div v-if="withSlideOvers" class="space-y-1">
      <h3 class="font-medium text-sm">Slide-overs</h3>
      <div class="bg-white p-6 border-dashed border-gray-300 border">
        <ButtonSecondary @click="showRightSlideOver = !showRightSlideOver">Right slide-over</ButtonSecondary>
      </div>
    </div>

    <!-- SlideOver -->
    <SlideOver v-if="showRightSlideOver" @close="showRightSlideOver = false">Your content here...</SlideOver>
  </div>
</template>

<script setup lang="ts">
import ButtonSecondary from "./buttons/ButtonSecondary.vue";
import SlideOver from "./slideOvers/SlideOver.vue";
import { ref } from "vue";
import PreviewButtons from "./buttons/PreviewButtons.vue";
import PreviewTabsAsLinks from "./tabs/PreviewTabsAsLinks.vue";
import PreviewTabsAsButtons from "./tabs/PreviewTabsAsButtons.vue";
import PreviewButtonsAsLinks from "./buttons/PreviewButtonsAsLinks.vue";
import PreviewButtonsDestructive from "./buttons/PreviewButtonsDestructive.vue";
import PreviewDropdownsSimple from "./dropdowns/PreviewDropdownsSimple.vue";
import PreviewDropdownsWithClick from "./dropdowns/PreviewDropdownsWithClick.vue";
import PreviewBreadcrumbs from "./breadcrumbs/PreviewBreadcrumbs.vue";
import PreviewModals from "./modals/PreviewModals.vue";
import PreviewBanners from "./banners/PreviewBanners.vue";
import PreviewEmptyStates from "./emptyState/PreviewEmptyStates.vue";
import PreviewUploadersDocument from "./uploaders/PreviewUploadersDocument.vue";
import PreviewPdfViewers from "./pdf/PreviewPdfViewers.vue";
import PreviewLoaders from "./loaders/PreviewLoaders.vue";

defineProps({
  withSlideOvers: Boolean
})

const showRightSlideOver = ref(false)

</script>