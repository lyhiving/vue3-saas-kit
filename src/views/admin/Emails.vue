<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <h1 class="flex-1 font-bold flex items-center truncate">{{ $t("admin.emails.title") }}</h1>
        <div class="flex items-center space-x-2">
          <ButtonSecondary :disabled="loading" @click="reload">{{ $t("shared.reload") }}</ButtonSecondary>
          <ButtonSecondary
            :disabled="loading || !canCreateEmailTemplates"
            @click="createAll"
          >{{ $t("admin.emails.createAll") }}</ButtonSecondary>
        </div>
      </div>
    </div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
      <Loading v-if="loading" />
      <div v-else class="flex flex-col">
        <EmptyState
          class="bg-white"
          v-if="items.length === 0"
          :captions="{
            thereAreNo: $t('admin.emails.noEmails'),
            description: $t('admin.emails.noEmailsDescription')
          }"
        />
        <div v-else class="overflow-x-auto">
          <div class="py-2 align-middle inline-block min-w-full">
            <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      v-for="(header, idx) in headers"
                      :key="idx"
                      scope="col"
                      class="text-xs px-3 py-2 max-w-xs text-left font-medium text-gray-500 tracking-wider select-none truncate"
                    >
                      <div class="flex items-center space-x-1 text-gray-500">
                        <div>{{ header.title }}</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, idx) in items" :key="idx">
                    <td class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">
                      <div class="flex justify-center">
                        <svg
                          v-if="item.created"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 text-theme-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 text-gray-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </td>
                    <td
                      class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600"
                    >{{ item.name }}</td>
                    <td
                      class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600"
                    >{{ item.alias }}</td>
                    <td
                      class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600"
                    >{{ item.subject }}</td>
                    <td class="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">
                      <div class="flex items-center space-x-2">
                        <a
                          :disabled="!item.created"
                          :href="templateUrl(item)"
                          target="_blank"
                          :class="{
                            'text-theme-600 hover:text-theme-800 hover:underline': item.created,
                            'text-gray-300 cursor-not-allowed': !item.created,
                          }"
                        >{{ $t("shared.edit") }}</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import i18n from '@/locale/i18n';
import services from "@/services";
import { EmailTemplateDto } from "@/application/dtos/core/email/EmailTemplateDto";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import Loading from "@/components/ui/loaders/Loading.vue";
import EmptyState from "../../components/ui/emptyState/EmptyState.vue";
import { useMeta } from '@/modules/vue-meta';

useMeta({
  title: i18n.global.t("admin.emails.title").toString()
})

const items = ref<EmailTemplateDto[]>([])
const loading = ref(false);
const canCreateEmailTemplates = ref(false);
const headers = [
  {
    title: i18n.global.t("admin.emails.created"),
  },
  {
    title: i18n.global.t("admin.emails.name"),
  },
  {
    title: i18n.global.t("admin.emails.alias"),
  },
  {
    title: i18n.global.t("admin.emails.subject"),
  },
  {
    title: i18n.global.t("shared.actions"),
  },
];


onMounted(() => {
  reload();
})
function reload() {
  loading.value = true;
  canCreateEmailTemplates.value = false;
  services.setup.getPostmarkTemplates().then((response) => {
    items.value = response;
    if (items.value.filter(f => !f.created).length > 0) {
      canCreateEmailTemplates.value = true;
    }
  })
    .finally(() => {
      loading.value = false;
    })
}
function createAll() {
  loading.value = true;
  services.setup.createPostmarkTemplates().then(() => {
    reload();
  }).catch((error) => {
    loading.value = false;
    console.error(error)
  });
}
function templateUrl(item: EmailTemplateDto) {
  return `https://account.postmarkapp.com/servers/${item.associatedServerId}/templates/${item.templateId}/edit`
}
</script>