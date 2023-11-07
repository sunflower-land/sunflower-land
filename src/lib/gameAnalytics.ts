import { GameAnalytics } from "gameanalytics";
import { CONFIG } from "./config";

class GameAnalyticTracker {
  public async initialise(id: number) {
    try {
      // GameAnalytics.setEnabledInfoLog(true);
      // GameAnalytics.setEnabledVerboseLog(true);

      GameAnalytics.configureBuild(CONFIG.RELEASE_VERSION);

      GameAnalytics.configureUserId(`account${id}`);

      GameAnalytics.initialize(
        CONFIG.GAME_ANALYTICS_APP_ID,
        CONFIG.GAME_ANALYTICS_PUB_KEY
      );

      GameAnalytics.startSession();
    } catch (e) {
      console.log(`Game analytics error: `, e);
    }
  }
}

export const gameAnalytics = new GameAnalyticTracker();
