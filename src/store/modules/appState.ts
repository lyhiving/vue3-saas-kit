import { Module } from "vuex";
import { AppState, RootState } from "@/store/types";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";

const initialState: AppState = {
  usage: {
    type: 0,
    providers: 0,
    providersInCompliance: 0,
    clients: 0,
    contracts: 0,
    employees: 0,
    storage: 0,
    pendingInvitations: 0,
  },
  features: {
    maxUsers: 1,
    maxWorkspaces: 1,
    maxLinks: 1,
    maxStorage: 1,
    monthlyContracts: 1,
  },
  layout: ApplicationLayout.SIDEBAR,
};

export const app: Module<AppState, RootState> = {
  namespaced: true,
  state: initialState,
  mutations: {
    reset(state) {
      state.usage = initialState.usage;
      state.features  = initialState.features;
    },
    setLayout(state, payload: ApplicationLayout) {
      state.layout = payload;
    },
    setUsage(state, payload: AppUsageSummaryDto) {
      if (payload.type === AppUsageType.ALL) {
        state.usage = payload;
      } else if (payload.type === AppUsageType.PROVIDERS) {
        state.usage.providers = payload.providers;
        state.usage.providersInCompliance = payload.providersInCompliance;
      } else if (payload.type === AppUsageType.CLIENTS) {
        state.usage.clients = payload.clients;
      } else if (payload.type === AppUsageType.EMPLOYEES) {
        state.usage.employees = payload.employees;
      } else if (payload.type === AppUsageType.CONTRACTS) {
        state.usage.contracts = payload.contracts;
      } else if (payload.type === AppUsageType.STORAGE) {
        state.usage.storage = payload.storage;
      } else if (payload.type === AppUsageType.PENDING_INVITATIONS) {
        state.usage.pendingInvitations = payload.pendingInvitations;
      }
    },
    setFeatures(state, payload: TenantFeaturesDto) {
      state.features = payload;
    },
  },
};
