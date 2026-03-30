import { GameState } from "features/game/types/game";
import { getBumpkinLevel } from "features/game/lib/level";
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
    getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 60 &&
    (verified || isFaceVerified({ game })) &&
    hasReputation({
      game,
      reputation: Reputation.Grower,
      now,
    })
  );
}
