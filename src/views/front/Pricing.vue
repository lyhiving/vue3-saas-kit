<template>
  <div>
    <Header />
    <div class="pt-6 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-slate-200 sm:text-4xl"
          >{{ $t("front.pricing.title") }}</h2>
          <p class="mt-4 text-lg leading-6 text-gray-500">{{ $t("front.pricing.headline") }}</p>
        </div>
        <Plans />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/front/Header.vue";
import Plans from "@/components/front/Plans.vue"
import Footer from "@/components/front/Footer.vue";
import { useMeta } from "@/modules/vue-meta";
import i18n from "@/locale/i18n";

export default defineComponent({
  name: 'Pricing',
  components: {
    Header,
    Plans,
    Footer,
  },
  setup() {
    useMeta({ title: i18n.global.t("front.pricing.title") })
  }
})
</script>
