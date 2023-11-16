import { OnboardingGameAnalyticEvent } from "lib/onboardingAnalytics";

export interface IWeb3ConnectStrategy {
  getConnectEventType(): OnboardingGameAnalyticEvent;
  initialize(): Promise<void>;
  isAvailable(): boolean;
  getProvider(): any;
  requestAccounts(): Promise<string[]>;
  whenUnavailableAction(): void;
}
