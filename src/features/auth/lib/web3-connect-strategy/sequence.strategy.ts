import { sequence } from "0xsequence";
import { ConnectOptions } from "@0xsequence/provider";
import { OnboardingGameAnalyticEvent } from "lib/onboardingAnalytics";
import { CONFIG } from "lib/config";
import { IWeb3ConnectStrategy } from "./interfaces/IWeb3ConnectStrategy";
import { ERRORS } from "lib/errors";
import { SequenceProvider } from "0xsequence/dist/declarations/src/provider";

const SEQUENCE_CONNECT_OPTIONS: ConnectOptions = {
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

export class SequenceStrategy implements IWeb3ConnectStrategy {
  private _wallet: SequenceProvider | null = null;

  public getConnectEventType(): OnboardingGameAnalyticEvent {
    return "connect_to_sequence";
  }

  public async initialize(): Promise<void> {
    const network = CONFIG.NETWORK === "mainnet" ? "polygon" : "amoy";

    this._wallet = sequence.initWallet(CONFIG.SEQUENCE_ACCESS_KEY, {
      defaultNetwork: network,
    });

    await this._wallet.connect(SEQUENCE_CONNECT_OPTIONS);
  }

  public isAvailable(): boolean {
    return true;
  }

  public getProvider(): any {
    return this._wallet?.getProvider();
  }

  public async requestAccounts(): Promise<string[]> {
    if (!this._wallet?.isConnected()) {
      throw Error(ERRORS.SEQUENCE_NOT_CONNECTED);
    }

    const walletAddress = await this._wallet.getAddress();

    return [walletAddress];
  }

  public whenUnavailableAction(): void {
    throw new Error(ERRORS.NO_WEB3);
  }
}
