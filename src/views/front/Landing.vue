<template>
  <div class="relative overflow-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-slate-200">
    <Hero />
    <Features class="relative z-10" />
    <JoinNow />
    <Faq />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Hero from "@/components/front/Hero.vue";
import Features from "@/components/front/Features.vue"
import JoinNow from "@/components/front/JoinNow.vue";
import Faq from "@/components/front/Faq.vue";
import Footer from "@/components/front/Footer.vue";
</script>
