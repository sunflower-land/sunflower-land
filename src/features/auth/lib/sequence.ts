import { ConnectOptions } from "@0xsequence/provider";

export const SEQUENCE_CONNECT_OPTIONS: ConnectOptions = {
  app: "Sunflower Land",
  settings: {
    theme: "dark",
    bannerUrl: "https://sunflower-land.com/play/brand/sequence_banner.png",
    includedPaymentProviders: ["ramp"],
    lockFundingCurrencyToDefault: true,
    defaultFundingCurrency: "matic",
    defaultPurchaseAmount: 10,
  },
};
