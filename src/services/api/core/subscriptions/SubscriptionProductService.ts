import { ApiService } from "@/services/api/ApiService";
import store from "@/store";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { ISubscriptionProductService } from "./ISubscriptionProductService";
import i18n from "@/locale/i18n";

export class SubscriptionProductService extends ApiService implements ISubscriptionProductService {
  constructor() {
    super("SubscriptionProduct");
  }
  getProducts(): Promise<SubscriptionProductDto[]> {
    return new Promise((resolve, reject) => {
      super
        .getAll()
        .then((response: SubscriptionProductDto[]) => {
          const currencies: string[] = [];
          response.forEach((product) => {
            product.prices.forEach((price) => {
              if (!currencies.includes(price.currency)) {
                currencies.push(price.currency);
              }
            });
          });
          if (currencies.length > 0 && !currencies.includes(store.state.pricing.currency)) store.commit("pricing/setCurrency", currencies[0]);
          store.commit("pricing/setProducts", response);
          resolve(response);
        })
        .catch((error) => {
          console.log("error", error);

          reject(error);
        });
    });
  }
  createProduct(product: SubscriptionProductDto): Promise<SubscriptionProductDto> {
    product.title = i18n.global.t(product.title).toString();
    product.description = i18n.global.t(product.description).toString();
    return super.post(product, `CreateProduct`);
  }
}
