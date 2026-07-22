import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import type { AnimalBuildingType } from "features/game/types/animals";
import { isWearableActive } from "features/game/lib/wearables";
import {
  getCoveredAnimalTypes,
  getFeedAllTargets,
} from "features/game/events/landExpansion/feedAllAnimals";
import { useSound } from "lib/utils/hooks/useSound";
import { getValues } from "lib/object";
import { FeederMachineModal } from "./FeederMachineModal";

const _state = (state: MachineState) => state.context.state;

interface Props {
  // When set and a golden asset covers this building, the machine becomes a
  // one-click feed-all trigger (shown with a lightning bolt). The crafting
  // modal stays reachable whenever medicine or feed is still needed.
  building?: AnimalBuildingType;
}

export const FeederMachine: React.FC<Props> = ({ building }) => {
  const { t } = useAppTranslation();
  const [showFeederMachineModal, setFeederMachineModal] = useState(false);
  const feederMachineImage = SUNNYSIDE.building.feederMachine;

  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _state);
  const { play: playFeedAnimal } = useSound("feed_animal");

  // Bumped when the soonest sleeping animal wakes so eligibility re-evaluates
  const [, setWakeTick] = useState(0);

  const covered = useMemo(
    () => (building ? getCoveredAnimalTypes({ state: game, building }) : []),
    [building, game],
  );

  // Sick animals the bulk action cannot cure (uncovered species, or no
  // Oracle Syringe equipped) need hand-crafted medicine, so the machine
  // must keep opening the crafting modal.
  const hasOracleSyringe = isWearableActive({ name: "Oracle Syringe", game });
  const needsMedicine =
    !!building &&
    getValues(game[makeAnimalBuildingKey(building)].animals).some(
      (animal) =>
        animal.state === "sick" &&
        !(hasOracleSyringe && covered.includes(animal.type)),
    );

  const eligibleCount =
    building && covered.length > 0
      ? (({ toClaim, toCure, toFeed }) =>
          toClaim.length + toCure.length + toFeed.length)(
          getFeedAllTargets({ state: game, building }),
        )
      : 0;

  const allWakeTimes = useMemo(
    () =>
      building
        ? getValues(game[makeAnimalBuildingKey(building)].animals)
            .filter((animal) => covered.includes(animal.type))
            .map((animal) => animal.awakeAt)
        : [],
    [building, game, covered],
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

  const canFeedAll = covered.length > 0 && !needsMedicine && eligibleCount > 0;

  const handleClick = () => {
    if (building && covered.length > 0 && !needsMedicine) {
      // Re-derive eligibility from the live machine snapshot rather than
      // the render-scoped state, which can go stale (e.g. a double-tap
      // before React re-renders after the first click consumed every
      // target).
      const { toClaim, toCure, toFeed } = getFeedAllTargets({
        state: gameService.getSnapshot().context.state,
        building,
      });
      if (toClaim.length + toCure.length + toFeed.length > 0) {
        gameService.send({ type: "animals.fedAll", building });
        playFeedAnimal();
        return;
      }
    }

    setFeederMachineModal(true);
  };

  return (
    <>
      <div
        className="relative cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        <img
          src={SUNNYSIDE.animalFoods.grinder}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
          }}
          // Hover parent
          className="absolute top-0 -right-4 z-20"
        />
        {canFeedAll && (
          <img
            src={SUNNYSIDE.icons.lightning}
            alt={t("animals.feedAll")}
            className="absolute z-30 top-0 -right-4 pointer-events-none img-highlight"
            style={{
              width: `${PIXEL_SCALE * 7}px`,
            }}
          />
        )}
        <img
          src={feederMachineImage}
          className="relative z-0"
          style={{
            width: `${30 * PIXEL_SCALE}px`,
          }}
        />
      </div>

      <FeederMachineModal
        show={showFeederMachineModal}
        onClose={() => setFeederMachineModal(false)}
      />
    </>
  );
};
