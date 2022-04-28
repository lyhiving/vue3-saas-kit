import { ApiService } from "@/services/api/ApiService";
import store from "@/store";
import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { SubscriptionCouponDto } from "@/application/dtos/core/subscriptions/SubscriptionCouponDto";
import { SelectedSubscriptionRequest } from "@/application/contracts/core/subscriptions/SelectedSubscriptionRequest";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { ISubscriptionManagerService } from "./ISubscriptionManagerService";

export class SubscriptionManagerService extends ApiService implements ISubscriptionManagerService {
  constructor() {
    super("SubscriptionManager");
  }
  getCurrentSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      super
        .get("GetCurrentSubscription")
        .then((subscription: SubscriptionGetCurrentResponse) => {
          store.commit("tenant/setSubscription", subscription);
          resolve(subscription);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getCoupon(couponId: string, currency: string): Promise<SubscriptionCouponDto> {
    return super.get(`GetCoupon/${couponId}/${currency}`);
  }
  updateSubscription(subscription: SelectedSubscriptionRequest): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      return super
        .post(subscription, `UpdateSubscription`)
        .then((response) => {
          store.commit("tenant/setSubscription", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  cancelSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(null, "CancelSubscription")
        .then((response) => {
          store.commit("tenant/setSubscription", response);
          store.commit("pricing/setSelected", {
            product: null,
            billingPeriod: SubscriptionBillingPeriod.MONTHLY,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateCardToken(cardToken: string): Promise<SubscriptionGetCurrentResponse> {
    return super.post(cardToken, `UpdateCardToken/${cardToken}`);
  }
  createCustomerPortalSession(): Promise<SubscriptionGetCurrentResponse> {
    return super.post(null, `CreateCustomerPortalSession`);
  }
}
