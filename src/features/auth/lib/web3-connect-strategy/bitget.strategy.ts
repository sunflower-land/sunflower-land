import { OnboardingGameAnalyticEvent } from "lib/onboardingAnalytics";
import { IWeb3ConnectStrategy } from "./interfaces/IWeb3ConnectStrategy";
import { ERRORS } from "lib/errors";

export class BitgetStrategy implements IWeb3ConnectStrategy {
  private _provider: any;

  public getConnectEventType(): OnboardingGameAnalyticEvent {
    return "connect_to_bitget";
  }

  public async initialize(): Promise<void> {
    const _window: any = window;

    this._provider = _window.bitkeep?.ethereum;
  }

  public isAvailable(): boolean {
    return !!(window as any).bitkeep?.ethereum;
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
    throw new Error(ERRORS.NO_WEB3_BITGET);
  }
}
