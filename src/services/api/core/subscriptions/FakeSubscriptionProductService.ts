/* eslint-disable @typescript-eslint/no-unused-vars */
import store from "@/store";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import plans from "@/application/pricing/plans";
import { ISubscriptionProductService } from "./ISubscriptionProductService";

export class FakeSubscriptionProductService implements ISubscriptionProductService {
  getProducts(): Promise<SubscriptionProductDto[]> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        const currencies: string[] = [];
        plans.forEach((product) => {
          product.prices.forEach((price) => {
            if (!currencies.includes(price.currency)) {
              currencies.push(price.currency);
            }
          });
        });
        if (currencies.length > 0 && !currencies.includes(store.state.pricing.currency)) store.commit("pricing/setCurrency", currencies[0]);
        store.commit("pricing/setProducts", plans);
        resolve(plans);
      }, 500);
    });
  }
  createProduct(_product: SubscriptionProductDto): Promise<SubscriptionProductDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
