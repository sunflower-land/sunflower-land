import { GameState } from "features/game/types/game";
import {
  TimeBasedFeatureName,
  TIME_BASED_FEATURE_FLAGS_DATES,
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
  const now = useNow({
    live: true,
    autoEndAt: TIME_BASED_FEATURE_FLAGS_DATES[featureName].getTime(),
    intervalMs: 60 * 1000,
  });

  return hasTimeBasedFeatureAccess({ featureName, startTime: now, game });
}
