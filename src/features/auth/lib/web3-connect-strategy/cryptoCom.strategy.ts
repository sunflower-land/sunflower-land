import { OnboardingGameAnalyticEvent } from "lib/onboardingAnalytics";
import { IWeb3ConnectStrategy } from "./interfaces/IWeb3ConnectStrategy";
import { ERRORS } from "lib/errors";

export class CryptoComStrategy implements IWeb3ConnectStrategy {
  private _provider: any;

  public getConnectEventType(): OnboardingGameAnalyticEvent {
    return "connect_to_crypto_com";
  }

  public async initialize(): Promise<void> {
    const _window: any = window;

    this._provider = undefined;

    if (typeof _window.deficonnectProvider !== "undefined") {
      this._provider = _window.deficonnectProvider;
    }

    if (navigator?.userAgent?.includes("DeFiWallet") && window.ethereum) {
      this._provider = window.ethereum;
    }
  }

  public isAvailable(): boolean {
    return (
      typeof (window as any).deficonnectProvider !== "undefined" ||
      (navigator?.userAgent?.includes("DeFiWallet") && window.ethereum)
    );
  }

  public getProvider(): any {
    return this._provider;
  }

  public async requestAccounts(): Promise<string[]> {
    if (!this._provider) {
      throw new Error(ERRORS.WALLET_INITIALISATION_FAILED);
    }

    const accounts: string[] = await this._provider.request({
      method: "eth_requestAccounts",
    });

    return accounts;
  }

  public whenUnavailableAction(): void {
    throw new Error(ERRORS.NO_WEB3_CRYPTO_COM);
  }
}
