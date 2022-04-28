<template>
  <div>
    <div
      v-if="showing"
      @keypress.esc="() => showing = false"
      class="fixed z-50 inset-0 overflow-y-auto"
    >
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
            class="max-w-lg inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="just absolute top-0 right-0 -mt-4 pr-4">
              <button
                @click="() => showing = false"
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
            <div class="mt-3 space-y-4">
              <h3 class="font-bold text-lg pb-2 border-b border-gray-100">
                <span v-if="imProvider">{{ $t("app.links.newClient") }}</span>
                <span v-else>{{ $t("app.links.newProvider") }}</span>
              </h3>
              <div>
                <div class="mx-auto">
                  <div class="md:col-span-2 space-y-4">
                    <div>
                      <Loading v-if="loading" />
                      <div v-else-if="maxLinksReached">
                        <WarningBanner
                          redirect="/app/settings/subscription"
                          :title="$t('app.subscription.errors.limitReached')"
                          :text="$t('app.subscription.errors.limitReachedLinks', [maxLinks])"
                        />
                      </div>
                      <div v-else class="bg-white rounded space-y-3">
                        <form @submit.prevent="linkUserWorkspace" class="space-y-4">
                          <div
                            v-if="selectType"
                            class="col-span-2 relative flex items-start select-none cursor-pointer"
                          >
                            <div class="flex items-center h-5 cursor-pointer">
                              <input
                                id="imProvider"
                                v-model="imProvider"
                                aria-describedby="imProvider-description"
                                name="imProvider"
                                type="checkbox"
                                class="cursor-pointer focus:ring-theme-500 h-4 w-4 text-theme-600 border-gray-300 rounded"
                              />
                            </div>
                            <div class="ml-3 text-sm">
                              <label
                                for="imProvider"
                                class="font-medium text-gray-700 cursor-pointer"
                              >{{ $t("app.links.imTheProvider") }}</label>
                            </div>
                          </div>
                          <div class="sm:col-span-6 grid grid-cols-2 gap-2">
                            <div>
                              <label
                                for="email"
                                class="block text-xs font-medium text-gray-700 truncate"
                              >{{ $t("account.shared.email") }}</label>
                              <div class="mt-1 flex rounded-md shadow-sm w-full">
                                <input
                                  type="email"
                                  name="email"
                                  ref="inputEmail"
                                  id="email"
                                  autocomplete="off"
                                  required
                                  v-model="email"
                                  class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                for="workspaceName"
                                class="block text-xs font-medium text-gray-700 truncate"
                              >{{ $t("models.workspace.object") }}</label>
                              <div class="mt-1 flex rounded-md shadow-sm w-full">
                                <input
                                  type="text"
                                  name="workspaceName"
                                  id="workspaceName"
                                  autocomplete="off"
                                  required
                                  v-model="workspaceName"
                                  class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                />
                              </div>
                            </div>
                          </div>

                          <div class="flex items-center justify-between mt-4">
                            <div class="text-theme-700 text-sm">
                              <div v-if="loadingSearching">{{ $t("shared.searching") }}...</div>
                              <div v-else-if="loadingLinking">{{ $t("shared.creating") }}...</div>
                            </div>

                            <button
                              :disabled="loadingSearching || loadingLinking"
                              :class="{
                                'bg-gray-100 cursor-not-allowed': loadingSearching || loadingLinking,
                              }"
                              type="submit"
                              class="inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                              </svg>

                              <div>{{ $t("shared.search") }}</div>
                            </button>
                          </div>
                        </form>
                        <div v-if="workspace">
                          <div
                            class="py-5 px-4 bg-theme-100 w-full border border-theme-200 shadow-sm"
                          >
                            <div class="flex items-center justify-between space-x-1">
                              <div class="flex items-center space-x-2 text-theme-800 truncate">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-9 w-9"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                  />
                                </svg>
                                <div class="truncate">
                                  <p
                                    class="text-base font-medium"
                                  >{{ $t("app.links.accountFound") }}</p>
                                  <p class="text-xs truncate">{{ workspaceName }}</p>
                                </div>
                              </div>
                              <div>
                                <button
                                  ref="buttonCreate"
                                  type="button"
                                  @click="createLink"
                                  class="ml-1 h-8 inline-flex items-center px-4 py-5 text-base leading-5 font-medium rounded-sm text-white bg-theme-800 hover:bg-theme-700 focus:outline-shadow active:bg-theme-900 transition duration-150 ease-in-out"
                                >{{ $t("app.links.link", [email]) }}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <ConfirmModal ref="confirmCreateLinkModal" @yes="confirmCreateLink" />
    <ConfirmModal ref="confirmInviteNewUserModal" @yes="confirmInviteNewUser" />
    <SuccessModal ref="successModal" @closed="createdLink" class="z-50 relative" />
    <ErrorModal class="relative" ref="errorModal" />
  </div>
</template>

<script lang="ts">
import services from "@/services";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import store from "@/store";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import WarningBanner from "@/components/ui/banners/WarningBanner.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import tinyEventBus from "@/plugins/tinyEventBus";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import i18n from "@/locale/i18n";
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import Loading from "@/components/ui/loaders/Loading.vue";

const $t = i18n.global.t;

export default defineComponent({
  components: {
    ErrorModal,
    ConfirmModal,
    SuccessModal,
    WarningBanner,
    Loading
  },
  setup(_, context) {

    const inputEmail = ref<HTMLInputElement>();
    const errorModal = ref<InstanceType<typeof ErrorModal>>();
    const confirmCreateLinkModal = ref<InstanceType<typeof ConfirmModal>>();
    const confirmInviteNewUserModal = ref<InstanceType<typeof ConfirmModal>>();
    const successModal = ref<InstanceType<typeof SuccessModal>>();

    const selectType = ref(true);
    const asProvider = ref(true);
    const imProvider = ref(false);

    const showing = ref(false);
    const loading = ref(false);
    const loadingSearching = ref(false);
    const loadingLinking = ref(false);
    const email = ref("");
    const workspaceName = ref("");
    const workspace = ref<WorkspaceDto | null>(null);
    const linkCreated = ref<LinkDto | null>(null);
    const error = ref("");

    onMounted(() => {
      imProvider.value = asProvider.value;
    })

    function show(_asProvider: boolean, _selectType: boolean) {
      asProvider.value = _asProvider;
      selectType.value = _selectType;
      workspace.value = null;
      email.value = "";
      workspaceName.value = "";

      showing.value = true;
      nextTick(() => {
        inputEmail.value?.focus();
        inputEmail.value?.select();
      });
      reload();
    }
    function reload() {
      loading.value = true;
      const promises: any[] = []
      promises.push(services.tenants.getCurrentUsage(AppUsageType.ALL));
      promises.push(services.tenants.getFeatures());

      Promise.all(promises).finally(() => {
        loading.value = false;
        nextTick(() => {
          if (inputEmail.value) {
            inputEmail.value.focus();
            inputEmail.value.select();
          }
        });
      })
    }
    function linkUserWorkspace() {
      if (!email.value || email.value.trim() === "" || !workspaceName.value || workspaceName.value.trim() === "") {
        errorModal.value?.show($t("shared.missingFields"));
        return;
      }
      error.value = "";
      loadingSearching.value = true;
      workspace.value = null;
      services.links
        .searchUser(email.value)
        .then(() => {
          searchWorkspace();
        })
        .catch(() => {
          confirmInviteNewUserModal.value?.show($t("app.links.accountNotFound"), $t("shared.invite"), $t("shared.cancel"), $t("app.links.invitation.userNotRegistered", [email.value]));
          loadingSearching.value = false;
        });
    }
    function searchWorkspace() {
      services.links
        .searchMember(email.value, workspaceName.value)
        .then(() => {
          createLink();
        })
        .catch(() => {
          errorModal.value?.show($t("shared.error"), $t("app.links.invitation.notFound", [email.value, workspaceName.value]));
        })
        .finally(() => {
          loadingSearching.value = false;
        });
    }
    function createLink() {
      const confirmText = workspace.value?.id ? $t("app.links.link") : $t("shared.invite");
      const inviteText = workspace.value?.id ? "" : $t("app.links.invitation.invite");
      if (imProvider.value) {
        confirmCreateLinkModal.value?.show($t("app.clients.new.add"), confirmText, $t("shared.cancel"), inviteText);
      } else {
        confirmCreateLinkModal.value?.show($t("app.providers.new.add"), confirmText, $t("shared.cancel"), inviteText);
      }
    }
    function confirmInviteNewUser() {
      loadingLinking.value = true;
      services.links
        .createInvitation({
          email: email.value,
          workspaceName: workspaceName.value,
          message: "",
          inviteeIsProvider: !imProvider.value,
        })
        .then(() => {
          successModal.value?.show($t("app.links.pending.invitationSent"), $t("app.links.pending.invitationSentDescription", [email.value]));
        })
        .catch((error) => {
          errorModal.value?.show($t("shared.error"), $t(error));
        })
        .finally(() => {
          loadingLinking.value = false;
        });
    }
    function confirmCreateLink() {
      loadingLinking.value = true;
      services.links
        .create({
          email: email.value,
          workspaceName: workspaceName.value,
          asProvider: !imProvider.value,
          // permissions: permissions.value
        })
        .then((response) => {
          linkCreated.value = response;
          successModal.value?.show($t("app.links.pending.invitationSent"), $t("app.links.invited", [email.value, imProvider.value ? $t("models.client.object") : $t("models.provider.object"), currentWorkspace.value.name]));
          services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
        })
        .catch((error) => {
          errorModal.value?.show($t("shared.error"), $t(error));
        })
        .finally(() => {
          loadingLinking.value = false;
        });
    }
    function createdLink() {
      tinyEventBus().emitter.emit("reload-links");
      context.emit("created", linkCreated.value);
      close();
    }

    const maxLinks = computed((): number => {
      return store.state.app.features.maxLinks;
    })
    const maxLinksReached = computed(() => {
      return maxLinks.value > 0 && store.state.app.usage.providers + store.state.app.usage.clients >= maxLinks.value;
    })
    const currentWorkspace = computed((): WorkspaceDto => {
      return store.state.tenant.currentWorkspace ?? ({} as WorkspaceDto);
    })

    return {
      showing,
      asProvider,
      maxLinksReached,
      email,
      workspaceName,
      workspace,
      maxLinks,
      imProvider,
      selectType,
      loading,
      loadingSearching,
      loadingLinking,
      createdLink,
      confirmCreateLink,
      confirmInviteNewUser,
      linkUserWorkspace,
      createLink,
      show
    }
  }
})
</script>
