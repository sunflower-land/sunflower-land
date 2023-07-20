import { GameAnalyticEvent } from "lib/analytics";

export interface IWeb3ConnectStrategy {
  getConnectEventType(): GameAnalyticEvent;
  initialize(): Promise<void>;
  isAvailable(): boolean;
  getProvider(): any;
  requestAccounts(): Promise<string[]>;
  whenUnavailableAction(): void;
}
