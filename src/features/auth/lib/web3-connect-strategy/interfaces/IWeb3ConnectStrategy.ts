import { OnboardingGameAnalyticEvent } from "lib/analytics";

export interface IWeb3ConnectStrategy {
  getConnectEventType(): OnboardingGameAnalyticEvent;
  initialize(): Promise<void>;
  isAvailable(): boolean;
  getProvider(): any;
  requestAccounts(): Promise<string[]>;
  whenUnavailableAction(): void;
}
