import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import store from "@/store";

const selectedProductTitle = (): string => {
  return store.state.pricing.selectedProduct?.title ?? "";
};
const selectedPrice = (): SubscriptionPriceDto | null => {
  const prices = store.state.pricing.selectedProduct?.prices;
  if (prices && prices.length > 0) {
    return (
      // tslint:disable-next-line: max-line-length
      prices.find((e) => e.billingPeriod === store.state.pricing.billingPeriod && e.currency === store.state.pricing.currency) ?? prices.filter((f) => f.currency === store.state.pricing.currency)[0]
    );
  }
  return null;
};
const selectedBillingPeriod = (): string => {
  const price = selectedPrice();
  if (price?.billingPeriod === SubscriptionBillingPeriod.ONCE) {
    return "once";
  } else {
    return SubscriptionBillingPeriod[store.state.pricing.billingPeriod] + "Short";
  }
};

export default {
  selectedProductTitle,
  selectedPrice,
  selectedBillingPeriod,
};
