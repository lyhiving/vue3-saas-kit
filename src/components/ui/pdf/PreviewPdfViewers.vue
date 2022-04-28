<template>
  <PdfViewer :file="samplePdf" />
</template>

<script setup lang="ts">
import FakePdfBase64 from './FakePdfBase64';
import PdfViewer from './PdfViewer.vue';

const samplePdf = FakePdfBase64;
</script>