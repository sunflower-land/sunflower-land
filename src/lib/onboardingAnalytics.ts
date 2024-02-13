import {
  Analytics,
  AnalyticsCallOptions,
  CustomEventName,
  EventNameString,
  getAnalytics,
  logEvent,
  setUserId,
} from "firebase/analytics";
import { app } from "./firebase";

export type OnboardingGameAnalyticEvent =
  | EventNameString
  | "connect_wallet"
  | "connect_to_metamask"
  | "connect_to_phantom"
  | "connect_to_okx"
  | "connect_to_crypto_com"
  | "connect_to_sequence"
  | "connect_to_walletconnect"
  | "connect_to_bitget"
  | "create_account"
  | "mint_farm"
  | "offer_seen"
  | "not_enough_matic"
  | "offer_accepted"
  | "tutorial_begin"
  | "tutorial_complete"
  | "earn_virtual_currency"
  | "spend_virtual_currency"
  | "level_up"
  | "unlock_achievement"
  // Custom events
  | "chore_complete"
  | "play_as_guest"
  | "wallet_connected"
  | "wallet_funded"
  | "select_poko"
  | "select_matic";

/**
 * Events used to track new users onboarding
 * For in-game events, refer to gameAnalytics.ts
 */
class OnboardingAnalytics {
  private analytics: Analytics;

  public constructor() {
    this.analytics = getAnalytics(app);
  }

  public initialise({ id }: { id?: number }) {
    if (id) {
      setUserId(this.analytics, id.toString());
    }
  }

  /*
    Stick to standard Firebase events - this ensures reports work seamlessly
    Recommended game events: https://support.google.com/analytics/answer/9267735
  */
  public logEvent(
    eventName: OnboardingGameAnalyticEvent,
    eventParams?: {
      [key: string]: any;
    },
    options?: AnalyticsCallOptions
  ): void {
    logEvent(
      this.analytics,
      eventName as CustomEventName<OnboardingGameAnalyticEvent>,
      eventParams,
      options
    );
  }
}

export const onboardingAnalytics = new OnboardingAnalytics();
