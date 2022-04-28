import { Module } from "vuex";
import store from "@/store";
import { TenantState, RootState } from "@/store/types";
import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";

const initialState: TenantState = {
  tenants: [],
  current: null,
  subscription: null,
  members: [],
  workspaces: [],
  currentWorkspace: null,
  features: null,
};

export const tenant: Module<TenantState, RootState> = {
  namespaced: true,
  state: initialState,
  mutations: {
    reset(state: TenantState) {
      state.tenants = [];
      state.current = null;
      state.subscription = null;
      state.members = [];
      state.workspaces = [];
      state.currentWorkspace = null;
      state.features = null;
    },
    setMyTenants: (state: TenantState, payload: TenantDto[]) => {
      state.tenants = payload;
    },
    setCurrent: (state: TenantState, payload: TenantDto) => {
      state.current = payload;
    },
    setCurrentWorkspace: (state: TenantState, payload: WorkspaceDto) => {
      state.currentWorkspace = payload;
    },
    setCurrentImage: (state: TenantState, { imageType, image }) => {
      if (state.current) {
        if (imageType === "icon") {
          state.current.icon = image;
        } else if (imageType === "logo") {
          state.current.logo = image;
        } else if (imageType === "logoDarkmode") {
          state.current.logoDarkmode = image;
        }
      }
    },
    setSubscription: (state: TenantState, payload: SubscriptionGetCurrentResponse) => {
      state.subscription = payload;
      if (payload) {
        if (state.tenants && payload.customer) {
          state.tenants.forEach((tenant) => {
            if (tenant.subscriptionCustomerId === payload.customer.id) {
              tenant.products = payload.myProducts;
            }
          });
        }
        if (payload.myProducts?.length > 0) {
          store.commit("pricing/setProduct", payload.myProducts[0].subscriptionProduct);
          store.commit("pricing/setBillingPeriod", payload.myProducts[0].subscriptionPrice.billingPeriod);
        }
      }
    },
    setMembers(state: TenantState, payload: TenantUserDto[]) {
      state.members = payload;
    },
    setWorkspaces(state: TenantState, payload: WorkspaceDto[]) {
      // state.currentWorkspace = null;
      state.workspaces = payload;
      if (state.currentWorkspace) {
        if (!payload.find((f) => f.id === state.currentWorkspace?.id)) {
          state.currentWorkspace = null;
        }
      }
      if (payload?.length > 0 && !state.currentWorkspace) {
        const defaultWorkspace = payload.find((f) => f.default);
        if (defaultWorkspace) {
          state.currentWorkspace = defaultWorkspace;
        } else {
          state.currentWorkspace = payload[0];
        }
      }
    },
    setSettings(state: TenantState, payload: TenantDto) {
      if (state.current) {
        state.current.name = payload.name;
        state.current.subdomain = payload.subdomain;
      }
    },
  },
};
