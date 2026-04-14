import { GameState } from "features/game/types/game";
import {
  TimeBasedFeatureName,
  TIME_BASED_FEATURE_FLAG_WINDOWS,
  hasTimeBasedFeatureAccess,
} from "lib/flags";
import { useNow } from "./useNow";

export function useTimeBasedFeatureAccess({
  featureName,
  game,
}: {
  featureName: TimeBasedFeatureName;
  game: GameState;
}) {
  const window = TIME_BASED_FEATURE_FLAG_WINDOWS[featureName];
  const now = useNow({
    live: true,
    autoEndAt: window.end?.getTime() ?? window.start.getTime(),
    intervalMs: 60 * 1000,
  });

  return hasTimeBasedFeatureAccess({ featureName, now, game });
}
