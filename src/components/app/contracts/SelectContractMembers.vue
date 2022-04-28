<template>
  <div>
    <div v-show="showing" @keypress.esc="close" class="fixed z-50 inset-0 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
          </div>
        </transition>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
        <transition
          enter-active-class="ease-out duration-300"
          enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-show="showing"
            class="inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
            :class="maxSize"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="just absolute top-0 right-0 -mt-4 pr-4">
              <button
                @click="close"
                type="button"
                class="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">{{ $t("shared.close") }}</span>
                <svg
                  class="h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
            <div class="mt-3">
              <div class="max-w-lg mx-auto">
                <div>
                  <div class="text-center">
                    <IconSign class="mx-auto h-12 w-12 text-gray-800" />
                    <h2
                      class="mt-2 text-lg font-medium text-gray-900"
                    >{{ $t("app.contracts.members.add") }}</h2>
                    <p class="mt-1 text-sm text-gray-500">{{ $t("app.contracts.members.select") }}</p>
                  </div>
                  <form action="#" class="mt-6 flex">
                    <label for="search" class="sr-only">{{ $t("shared.search") }}</label>
                    <input
                      v-model="searchInput"
                      type="text"
                      name="search"
                      id="search"
                      class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      :placeholder="$t('shared.searchDot')"
                    />
                  </form>
                </div>
                <div class="mt-5">
                  <h3
                    class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >{{ $t("models.user.plural") }}</h3>

                  <Loading v-if="loading" />
                  <div v-else-if="items.length === 0">
                    <EmptyState
                      class="bg-white"
                      to="/app/settings/members/new"
                      :captions="{
                        new: $t('shared.add'),
                        thereAreNo: getNoMembers(),
                      }"
                      icon="plus"
                    />
                  </div>
                  <div v-else>
                    <ul
                      role="list"
                      class="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200"
                    >
                      <li
                        class="py-2 flex items-center justify-between space-x-3"
                        v-for="(item, idx) in filteredItems"
                        :key="idx"
                      >
                        <div v-if="item.user" class="min-w-0 flex-1 flex items-center space-x-3">
                          <div class="min-w-0 flex-1">
                            <p class="text-sm font-bold text-gray-900 truncate">
                              {{ item.user.firstName }}
                              {{ item.user.lastName }}
                              <span
                                class="text-xs font-normal"
                              >({{ item.user.email }})</span>
                            </p>
                            <p class="text-sm text-gray-500 truncate">
                              <span v-if="item.workspace">{{ item.workspace.name }}</span>
                            </p>
                          </div>
                        </div>
                        <div v-if="item.user" class="flex-shrink-0">
                          <button
                            @click="toggle(item)"
                            type="button"
                            class="inline-flex items-center py-2 px-3 border border-transparent rounded-full focus:outline-none"
                            :class="{
                              'text-gray-800 bg-gray-100 hover:bg-teal-200': !isSelected(item),
                              'text-teal-800 bg-teal-100 hover:bg-red-200 ': isSelected(item),
                            }"
                          >
                            <!-- Heroicon name: solid/plus-sm -->
                            <svg
                              v-if="!isSelected(item)"
                              class="-ml-1 mr-0.5 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            <svg
                              v-else
                              class="-ml-1 mr-0.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            <span
                              v-if="!isSelected(item)"
                              class="text-sm font-medium text-gray-900"
                            >
                              {{ $t("shared.add") }}
                              <span
                                class="sr-only"
                              >{{ item.user.firstName }} {{ item.user.lastName }}</span>
                            </span>
                            <span v-else class="text-sm font-medium text-gray-900">
                              {{ $t("shared.remove") }}
                              <span
                                class="sr-only"
                              >{{ item.user.firstName }} {{ item.user.lastName }}</span>
                            </span>
                          </button>
                        </div>
                      </li>
                    </ul>
                    <div class="py-3 text-right flex justify-end">
                      <div class="flex items-center space-x-2">
                        <button
                          type="button"
                          @click="close"
                          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                        >{{ $t("shared.cancel") }}</button>
                        <button
                          @click="accept"
                          type="submit"
                          :disabled="selected.length === 0"
                          :class="{
                            ' opacity-50 cursor-not-allowed': selected.length === 0,
                          }"
                          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                        >{{ $t("shared.accept") }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <ErrorModal ref="errorModal" />
    </div>
  </div>
</template>

<script lang="ts">
import services from "@/services";
import EmptyState from "@/components/ui/emptyState/EmptyState.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import IconSign from "@/assets/icons/IconSign.vue";
import { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
import { WorkspaceUserDto } from "@/application/dtos/core/workspaces/WorkspaceUserDto";
import { AddContractMemberDto } from "@/application/contracts/app/contracts/AddContractMemberDto";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { TranslateResult } from "vue-i18n";
import Loading from "@/components/ui/loaders/Loading.vue";
import i18n from "@/locale/i18n";
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  components: {
    EmptyState,
    ErrorModal,
    IconSign,
    Loading
  },
  props: {
    maxSize: {
      default: "sm:max-w-lg"
    }
  },
  setup(_, context) {
    const $t = i18n.global.t;

    const errorModal = ref<InstanceType<typeof ErrorModal>>();

    const title = ref("");
    const closeText = ref<TranslateResult | string>("");
    const showing = ref(false);
    const searchInput = ref("");
    const items = ref<WorkspaceUserDto[]>([]);
    const loading = ref(false);
    const selected = ref<string[]>([]);
    const link = ref<LinkDto | null>(null);
    const linkId = ref("");

    onMounted(() => {
      closeText.value = $t("shared.close").toString();
    })

    function show(_link: LinkDto, _linkId: string, _selected: string[]) {
      link.value = _link;
      linkId.value = _linkId;
      selected.value = _selected;
      showing.value = true;

      reload();
    }
    function reload() {
      loading.value = true;
      services.links
        .getLinkUsers(linkId.value)
        .then((response) => {
          items.value = response;
        })
        .catch((error) => {
          errorModal.value?.show($t("shared.error"), $t(error));
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function close() {
      context.emit("closed");
      showing.value = false;
    }
    function toggle(item: WorkspaceUserDto) {
      if (isSelected(item)) {
        selected.value = selected.value.filter((f) => f !== item.userId);
      } else {
        selected.value.push(item.userId);
      }
    }
    function isSelected(item: WorkspaceUserDto) {
      return selected.value.find((f) => f === item.userId);
    }
    function accept() {
      const selected: AddContractMemberDto[] = [];
      items.value.forEach((element) => {
        if (isSelected(element)) {
          const contractMember: AddContractMemberDto = {
            userId: element.userId,
            role: ContractMemberRole.SIGNATORY,
            name: (element.user?.firstName + " " + element.user?.lastName).trim(),
            email: element.user?.email ?? "",
          };
          selected.push(contractMember);
        }
      });
      context.emit("selected", selected);
      close();
    }
    function getNoMembers() {
      if (link.value?.providerWorkspace && link.value.clientWorkspace) {
        return $t("app.tenants.members.noMembersFoundIn", [link.value?.clientWorkspace.name, link.value?.providerWorkspace.name]);
      }
      return $t("app.tenants.members.noMembers");
    }
    const filteredItems = computed((): WorkspaceUserDto[] => {
      if (!items.value) {
        return [];
      }
      return items.value.filter((f) => f.id?.toUpperCase().includes(searchInput.value.toUpperCase()) || f.workspace?.name?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.user?.firstName?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.user?.lastName?.toString().toUpperCase().includes(searchInput.value.toUpperCase()) || f.user?.email?.toString().toUpperCase().includes(searchInput.value.toUpperCase()));
    })

    return {
      title,
      showing,
      searchInput,
      loading,
      items,
      filteredItems,
      selected,
      isSelected,
      accept,
      toggle,
      getNoMembers,
      show,
      close,
    }
  }
})
</script>
