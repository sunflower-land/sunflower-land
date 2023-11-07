import { initializeApp } from "firebase/app";
import {
  Analytics,
  AnalyticsCallOptions,
  CustomEventName,
  EventNameString,
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from "firebase/analytics";

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
    const firebaseConfig = {
      apiKey: "AIzaSyCozYr5S8ahU0WSoTS13ctjtFrleD5rZB8",
      authDomain: "sunflower-land.firebaseapp.com",
      projectId: "sunflower-land",
      storageBucket: "sunflower-land.appspot.com",
      messagingSenderId: "1061537811936",
      appId: "1:1061537811936:web:4357cbb765c9c990f66f85",
      measurementId: "G-EM6CNBH1F8",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(app);
  }

  public initialise({
    id,
    type,
    wallet,
  }: {
    id?: number;
    type: "GUEST" | "FULL";
    wallet: string;
  }) {
    if (id) {
      setUserId(this.analytics, id.toString());
    }

    setUserProperties(this.analytics, {
      userType: type,
      wallet,
    });
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
