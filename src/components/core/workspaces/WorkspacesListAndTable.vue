<template>
  <div>
    <div v-if="!items || items.length === 0">
      <EmptyState
        class="bg-white"
        to="/app/settings/workspaces/new"
        :captions="{
          new: $t('shared.add'),
          thereAreNo: $t('app.workspaces.errors.noWorkspaces')
        }"
        icon="plus"
      />
    </div>
    <div v-else class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="py-2 align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="(header, idx) in headers"
                    :key="idx"
                    scope="col"
                    class="text-xs px-2 py-1 text-left font-medium text-gray-500 tracking-wider select-none truncate"
                  >
                    <div class="flex items-center space-x-1 text-gray-500">
                      <div>{{ header.title }}</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, idx) in items" :key="idx">
                  <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
                    <div>
                      <div class="text-sm font-bold">{{ item.name }}</div>
                    </div>
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
                    <div>{{ workspaceType(item) }}</div>
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
                    <div>{{ userEmails(item) }}</div>
                  </td>

                  <td class="w-20 px-2 py-2 whitespace-nowrap text-sm text-gray-600">
                    <div class="flex items-center space-x-2">
                      <router-link
                        :to="'/app/settings/workspaces/edit/' + item.id"
                        class="flex items-center space-x-2 text-theme-600 hover:text-theme-900 hover:underline"
                      >
                        <div>{{ $t("shared.edit") }}</div>
                      </router-link>
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
</template>

<script setup lang="ts">
import i18n from '@/locale/i18n';
import { WorkspaceDto } from '@/application/dtos/core/workspaces/WorkspaceDto';
import { WorkspaceType } from '@/application/enums/core/tenants/WorkspaceType';
import EmptyState from '@/components/ui/emptyState/EmptyState.vue';
import { PropType } from '@vue/runtime-core';
import { ref } from 'vue';

const $t = i18n.global.t;

defineProps({
  items: Array as PropType<WorkspaceDto[]>
})

const headers = ref([
  {
    title: i18n.global.t("models.workspace.object"),
  },
  {
    title: i18n.global.t("models.workspace.type"),
  },
  {
    title: i18n.global.t("models.user.plural"),
  },
  {
    title: i18n.global.t("shared.actions"),
  },
]);

function workspaceType(item: WorkspaceDto) {
  return $t("app.workspaces.types." + WorkspaceType[item.type]);
}
function userEmails(item: WorkspaceDto) {
  return item.users.map((f) => f.user?.firstName).join(", ");
}
</script>
