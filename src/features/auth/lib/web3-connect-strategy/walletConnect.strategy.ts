import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { IEthereumProvider } from "@walletconnect/ethereum-provider/dist/types/types";
import { CONFIG } from "lib/config";
import { IWeb3ConnectStrategy } from "./interfaces/IWeb3ConnectStrategy";
import { ERRORS } from "lib/errors";
import { GameAnalyticEvent } from "lib/analytics";

export class WalletConnectStrategy implements IWeb3ConnectStrategy {
  private _provider: IEthereumProvider | null = null;

  public getConnectEventType(): GameAnalyticEvent {
    return "connect_to_walletconnect";
  }

  public async initialize(): Promise<void> {
    this._provider = await EthereumProvider.init({
      chains: [CONFIG.POLYGON_CHAIN_ID],
      projectId: CONFIG.WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
      qrModalOptions: {
        themeVariables: { "--wcm-z-index": "1100" }, // Ensures modal appears above splash
      },
    });
  }

  public isAvailable(): boolean {
    return true;
  }

  public getProvider(): any {
    return this._provider;
  }

  public async requestAccounts(): Promise<string[]> {
    if (this._provider === null) {
      throw new Error(ERRORS.WALLET_INITIALISATION_FAILED);
    }

    const accounts: string[] = await this._provider.enable();

    return accounts;
  }

  public whenUnavailableAction(): void {
    throw new Error(ERRORS.NO_WEB3);
  }
}
