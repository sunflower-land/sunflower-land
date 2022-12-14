import { ConnectOptions } from "@0xsequence/provider";

export const SEQUENCE_CONNECT_OPTIONS: ConnectOptions = {
  app: "Sunflower Land",
  settings: {
    theme: "dark",
    bannerUrl: `${window.origin}/brand/sequence_banner.png`,
    includedPaymentProviders: ["moonpay", "ramp"],
    lockFundingCurrencyToDefault: true,
    defaultFundingCurrency: "matic",
  },
};
