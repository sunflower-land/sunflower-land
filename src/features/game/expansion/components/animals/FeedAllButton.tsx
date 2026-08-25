import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  getAnimalReadyAt,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import type { AnimalBuildingType } from "features/game/types/animals";
import {
  getCoveredAnimalTypes,
  getFeedAllTargets,
} from "features/game/events/landExpansion/feedAllAnimals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { getValues } from "lib/object";

const _state = (state: MachineState) => state.context.state;

export const FeedAllButton: React.FC<{ building: AnimalBuildingType }> = ({
  building,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _state);
  const { play: playFeedAnimal } = useSound("feed_animal");

  // The clock eligibility is judged against. Advanced by the effect below
  // whenever the soonest sleeping animal wakes, so the button re-evaluates
  // without reading Date.now() during render (the compiler memoises on it).
  const [now, setNow] = useState(Date.now);

  const covered = useMemo(
    () => getCoveredAnimalTypes({ state: game, building }),
    [building, game],
  );
  const { toClaim, toCure, toFeed } = getFeedAllTargets({
    state: game,
    building,
    createdAt: now,
  });
  const eligibleCount = toClaim.length + toCure.length + toFeed.length;

  const buildingKey = makeAnimalBuildingKey(building);
  const allWakeTimes = useMemo(
    () =>
      getValues(game[buildingKey].animals)
        .filter((animal) => covered.includes(animal.type))
        .map((animal) => getAnimalReadyAt(animal, game)),
    [buildingKey, game, covered],
  );

  useEffect(() => {
    const nextWakeAt = Math.min(
      ...allWakeTimes.filter((awakeAt) => awakeAt > now),
    );

    if (!Number.isFinite(nextWakeAt)) return;

    // `now` re-arms the chain: each firing schedules the following wake.
    // A stale `now` (e.g. throttled timers) clamps to 0, fires immediately
    // and self-corrects.
    const timeout = setTimeout(
      () => setNow(Date.now()),
      Math.max(0, nextWakeAt - now + 100),
    );

    return () => clearTimeout(timeout);
  }, [allWakeTimes, now]);

  if (covered.length === 0) return null;

  const disabled = eligibleCount === 0;

  const handleClick = () => {
    // Re-derive eligibility from the live machine snapshot rather than
    // the render-scoped state, which can go stale (e.g. a double-tap
    // before React re-renders after the first click consumed every
    // target).
    const targets = getFeedAllTargets({
      state: gameService.getSnapshot().context.state,
      building,
    });
    const hasEligible =
      targets.toClaim.length + targets.toCure.length + targets.toFeed.length >
      0;
    if (!hasEligible) return;

    gameService.send({ type: "animals.fedAll", building });
    playFeedAnimal();
  };

  return (
    <div
      className={classNames("z-10", {
        "cursor-pointer": !disabled,
        "opacity-60": disabled,
      })}
      onClick={handleClick}
    >
      <img
        src={SUNNYSIDE.animalFoods.grinder}
        alt={t("animals.feedAll")}
        style={{ width: `${PIXEL_SCALE * 18}px` }}
      />
      <img
        src={SUNNYSIDE.icons.lightning}
        alt=""
        className={classNames(
          "absolute -top-0.5 -right-0.5 pointer-events-none",
          {
            "animate-pulsate img-highlight": !disabled,
          },
        )}
        style={{ width: `${PIXEL_SCALE * 8}px` }}
      />
    </div>
  );
};
