import { GameAnalyticEvent } from "lib/analytics";
import { IWeb3ConnectStrategy } from "./interfaces/IWeb3ConnectStrategy";
import { ERRORS } from "lib/errors";

export class PhantomStrategy implements IWeb3ConnectStrategy {
  private _provider: any;

  public getConnectEventType(): GameAnalyticEvent {
    return "connect_to_phantom";
  }

  public async initialize(): Promise<void> {
    // _window.phantom doesn't seem to handle polygon atm
    // therefore we will continue to use the provider it attaches to window.ethereum
    const _window: any = window;
    this._provider = _window.phantom ? _window.ethereum : undefined;
  }

  public isAvailable(): boolean {
    return !!(window as any)?.phantom?.ethereum?.isPhantom;
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
    throw new Error(ERRORS.NO_WEB3);
  }
}
