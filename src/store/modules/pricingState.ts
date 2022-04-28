import { Module } from "vuex";
import { PricingState, RootState } from "@/store/types";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { SubscriptionPriceType } from "@/application/enums/core/subscriptions/SubscriptionPriceType";

const initialState: PricingState = {
  products: [],
  selectedProduct: null,
  billingPeriod: SubscriptionBillingPeriod.MONTHLY,
  currency: import.meta.env.VITE_VUE_APP_CURRENCY?.toString() ?? "usd",
};

export const pricing: Module<PricingState, RootState> = {
  namespaced: true,
  state: initialState,
  mutations: {
    reset: (state) => {
      state.products = initialState.products;
      state.selectedProduct = initialState.selectedProduct;
      state.billingPeriod = initialState.billingPeriod;
      state.currency = initialState.currency;
    },
    setProducts: (state: PricingState, payload: SubscriptionProductDto[]) => {
      if (payload) {
        payload = payload.sort((x, y) => {
          return x.tier > y.tier ? 1 : -1;
        });
      }
      state.products = payload;
      if (payload.length > 0) {
        payload.forEach((product) => {
          product.prices.forEach((price) => {
            if (price.type === SubscriptionPriceType.RECURRING) {
              if (!state.currency) {
                state.currency = price.currency;
              }
            }
          });
        });
      }
    },
    setSelected: (state: PricingState, payload) => {
      state.billingPeriod = payload.billingPeriod;
      state.selectedProduct = payload.product;
    },
    setProduct: (state: PricingState, payload: SubscriptionProductDto) => {
      state.selectedProduct = payload;
    },
    setBillingPeriod: (state: PricingState, payload: SubscriptionBillingPeriod) => {
      state.billingPeriod = payload;
    },
    setCurrency: (state: PricingState, payload: string) => {
      state.currency = payload;
    },
  },
};
