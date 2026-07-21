import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import emptyDisc from "assets/icons/empty_disc.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import type { AnimalBuildingType } from "features/game/types/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getCoveredAnimalTypes,
  getFeedAllTargets,
  GOLDEN_ANIMAL_ASSETS,
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

  // Bumped when the soonest sleeping animal wakes so eligibility re-evaluates
  const [, setWakeTick] = useState(0);

  const covered = getCoveredAnimalTypes({ state: game, building });
  const { toClaim, toCure, toFeed } = getFeedAllTargets({
    state: game,
    building,
  });
  const eligibleCount = toClaim.length + toCure.length + toFeed.length;

  const buildingKey = makeAnimalBuildingKey(building);
  const allWakeTimes = useMemo(
    () =>
      getValues(game[buildingKey].animals)
        .filter((animal) => covered.includes(animal.type))
        .map((animal) => animal.awakeAt),
    [buildingKey, game, covered],
  );
  const nextWakeAt = Math.min(
    ...allWakeTimes.filter(
      // eslint-disable-next-line react-hooks/purity
      (awakeAt) => awakeAt > Date.now(),
    ),
  );

  useEffect(() => {
    if (!isFinite(nextWakeAt)) return;

    const timeout = setTimeout(
      () => setWakeTick((tick) => tick + 1),
      nextWakeAt - Date.now() + 100,
    );

    return () => clearTimeout(timeout);
  }, [nextWakeAt]);

  if (covered.length === 0) return null;

  const disabled = eligibleCount === 0;

  const handleClick = () => {
    if (disabled) return;

    gameService.send({ type: "animals.fedAll", building });
    playFeedAnimal();
  };

  return (
    <div
      className={classNames("absolute z-10", {
        "cursor-pointer": !disabled,
        "grayscale opacity-50": disabled,
      })}
      style={{
        width: `${PIXEL_SCALE * 18}px`,
        // Directly below the shop disc (top 18px, height 18 * PIXEL_SCALE)
        top: `${18 + PIXEL_SCALE * 20}px`,
        right: `18px`,
      }}
      onClick={handleClick}
    >
      <img src={emptyDisc} alt={t("animals.feedAll")} className="w-full" />
      <img
        src={ITEM_DETAILS[GOLDEN_ANIMAL_ASSETS[covered[0]]].image}
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: `${PIXEL_SCALE * 10}px` }}
      />
    </div>
  );
};
