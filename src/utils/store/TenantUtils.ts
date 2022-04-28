import { SubscriptionCardDto } from "@/application/dtos/core/subscriptions/SubscriptionCardDto";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import store from "@/store";

const activeProducts = (): TenantProductDto[] => {
  if (store.state.tenant.subscription && store.state.tenant.subscription.myProducts) {
    return store.state.tenant.subscription.myProducts;
  }
  return [];
};

const activeProduct = (): TenantProductDto | null => {
  if (store.state.tenant.subscription && store.state.tenant.subscription.myProducts?.length > 0) {
    return store.state.tenant.subscription.myProducts[0];
  }
  return null;
};

const defaultSubscriptionCard = (): SubscriptionCardDto | undefined => {
  if (store.state.tenant.subscription && store.state.tenant.subscription.paymentMethods?.length > 0) {
    return store.state.tenant.subscription.paymentMethods[0].card;
  }
  return undefined;
};

export default {
  activeProducts,
  activeProduct,
  defaultSubscriptionCard,
};
