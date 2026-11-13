import cloneDeep from "lodash.clonedeep";
import type { GameState } from "./game";
import { useNow } from "lib/utils/hooks/useNow";
import { refreshBasicScarecrowTimeAOE } from "features/game/lib/aoe";
import { appendBoostHistory } from "features/game/lib/boostWindows";

// 50% faster crops, +0.2 Crops
export type BuffName = "Power hour";

export type Buff = {
  startedAt: number;
  durationMS: number;
};

export function isBuffActive({
  buff,
  game,
  now,
}: {
  buff: BuffName;
  game: GameState;
  now: number;
}) {
  return (
    game.buffs?.[buff]?.startedAt &&
    game.buffs?.[buff].startedAt + game.buffs?.[buff].durationMS > now
  );
}

export function useActiveBuff({
  buff,
  game,
}: {
  buff: BuffName;
  game: GameState;
}) {
  const { buffs } = game;
  const buffData = buffs?.[buff];
  const buffStartedAt = buffData?.startedAt ?? 0;
  const buffDurationMS = buffData?.durationMS ?? 0;
  const buffEndsAt = buffStartedAt + buffDurationMS;

  const now = useNow({ live: true, autoEndAt: buffEndsAt });
  const isActive = isBuffActive({ buff, game, now });

  return {
    isActive,
    remainingTime: buffEndsAt - now,
  };
}

export function applyBuff({
  buff,
  game,
  now = Date.now(),
}: {
  buff: BuffName;
  game: GameState;
  now?: number;
}) {
  const gameClone = cloneDeep(game);
  if (buff === "Power hour") {
    // The new Power Hour overwrites the previous one, so archive the previous
    // window first — crops still growing keep the time it already sped up.
    const previous = gameClone.buffs?.[buff];
    if (previous && previous.startedAt !== now) {
      appendBoostHistory(
        gameClone,
        buff,
        {
          from: previous.startedAt,
          to: previous.startedAt + previous.durationMS,
        },
        now,
      );
    }

    // Activate the buff FIRST so its speed window is live when we refresh
    // windowed crop timing / AOE below.
    gameClone.buffs = {
      ...(gameClone.buffs ?? {}),
      [buff]: { startedAt: now, durationMS: 1000 * 60 * 60 },
    };

    // Crops accelerate via the Power Hour window itself: re-sync the Basic
    // Scarecrow time-AOE to the new (Power Hour-boosted) ready time so a replant in the gap isn't denied the boost.
    refreshBasicScarecrowTimeAOE(gameClone);

    return gameClone;
  }

  return gameClone;
}
