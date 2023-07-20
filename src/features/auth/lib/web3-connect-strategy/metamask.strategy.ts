import MetaMaskOnboarding from "@metamask/onboarding";
import { GameAnalyticEvent } from "lib/analytics";
import { IWeb3ConnectStrategy } from "./interfaces/IWeb3ConnectStrategy";
import { ERRORS } from "lib/errors";

export class MetamaskStrategy implements IWeb3ConnectStrategy {
  private _provider: any;

  public getConnectEventType(): GameAnalyticEvent {
    return "connect_to_metamask";
  }

  public async initialize(): Promise<void> {
    this._provider = window.ethereum;
  }

  public isAvailable(): boolean {
    return !!window.ethereum;
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
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
  }
}
