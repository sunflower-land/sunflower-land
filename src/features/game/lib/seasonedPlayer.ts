import type { GameState } from "features/game/types/game";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";

/** Captcha gate for tree chop / plot harvest: Grower reputation + level + verification. */
export function isSeasonedPlayer({
  game,
  verified,
  now,
}: {
  game: GameState;
  verified: boolean | undefined;
  now: number;
}): boolean {
  return (
    meetsLevelRequirement(
      getAscensionLevel({
        experience: game.bumpkin.experience ?? 0,
        ascensionLevel: game.island.ascensionLevel ?? 0,
      }),
      { ascension: 0, level: 60 },
    ) &&
    (verified || isFaceVerified({ game })) &&
    hasReputation({
      game,
      reputation: Reputation.Grower,
      now,
    })
  );
}
