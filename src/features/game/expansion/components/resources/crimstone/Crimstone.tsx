import React, { useContext, useEffect, useRef, useState } from "react";

import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { GameState, InventoryItemName, Rock } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { canMine } from "features/game/lib/resourceNodes";
import { RecoveredCrimstone } from "./components/RecoveredCrimstone";
import { DepletingCrimstone } from "./components/DepletingCrimstone";
import { DepletedCrimstone } from "./components/DepletedCrimstone";
import { useSound } from "lib/utils/hooks/useSound";
import { getCrimstoneDropAmount } from "features/game/events/landExpansion/mineCrimstone";
import { useNow } from "lib/utils/hooks/useNow";
import { isWearableActive } from "features/game/lib/wearables";
import { Transition } from "@headlessui/react";
import lightning from "assets/icons/lightning.png";

const HITS = 3;
const tool = "Gold Pickaxe";

const HasTool = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  game: GameState,
) => {
  // Free mining with Crimstone Spikes Hair
  if (isWearableActive({ name: "Crimstone Spikes Hair", game })) {
    return true;
  }
  return (inventory[tool] ?? new Decimal(0)).gte(1);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectGame = (state: MachineState) => state.context.state;

const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

export const getCrimstoneStage = (minesLeft: number, minedAt: number) => {
  const timeToReset = (CRIMSTONE_RECOVERY_TIME + 24 * 60 * 60) * 1000;
  const now = Date.now();
  if (now - minedAt > timeToReset) {
    return 1;
  }

  if (minesLeft === 5 && now - minedAt < CRIMSTONE_RECOVERY_TIME * 1000)
    return 6;
  if (minesLeft === 5) return 1;
  if (minesLeft === 4) return 2;
  if (minesLeft === 3) return 3;
  if (minesLeft === 2) return 4;
  return 5;
};

interface Props {
  id: string;
}

export const Crimstone: React.FC<Props> = ({ id }) => {
  const { gameService, shortcutItem, showAnimations } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);

  // When to hide the resource that pops out
  const [collecting, setCollecting] = useState(false);
  const harvested = useRef<number>(0);
  const divRef = useRef<HTMLDivElement>(null);

  const { play: miningFallAudio } = useSound("mining_fall");

  // Reset the touch count when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setTouchCount(0);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const state = useSelector(gameService, selectGame);

  const resource = useSelector(
    gameService,
    (state) => state.context.state.crimstones[id],
    compareResource,
  );
  const crimstoneStage = getCrimstoneStage(
    resource.minesLeft,
    resource.stone.minedAt,
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev, state) === HasTool(next, state) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0)),
  );

  const hasTool = HasTool(inventory, state);
  const readyAt = resource.stone.minedAt + CRIMSTONE_RECOVERY_TIME * 1000;
  const now = useNow({ live: true, autoEndAt: readyAt });
  const timeLeft = getTimeLeft(
    resource.stone.minedAt,
    CRIMSTONE_RECOVERY_TIME,
    now,
  );
  const mined = !canMine(resource, "Crimstone Rock");

  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [isRecentlyMined, setIsRecentlyMined] = useState(false);
  const minedAtRef = useRef(resource.stone.minedAt);

  useEffect(() => {
    if (minedAtRef.current !== resource.stone.minedAt) {
      minedAtRef.current = resource.stone.minedAt;
      setIsRecentlyMined(true);
      const timeout = setTimeout(() => {
        setIsRecentlyMined(false);
        setIsAnimationRunning(true);
      }, 1900);
      return () => clearTimeout(timeout);
    }
  }, [resource.stone.minedAt]);

  useEffect(() => {
    if (isAnimationRunning) {
      const timeout = setTimeout(() => setIsAnimationRunning(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isAnimationRunning]);

  useUiRefresher({ active: mined });

  const strike = () => {
    if (!hasTool) return;

    // Only show tool shortcut if not using Crimstone Spikes Hair (free mining)
    const hasCrimstoneSpikes = isWearableActive({
      name: "Crimstone Spikes Hair",
      game: state,
    });

    if (!hasCrimstoneSpikes) {
      shortcutItem(tool);
    }

    setTouchCount((count) => count + 1);

    // need to hit enough times to collect resource
    if (touchCount < HITS - 1) return;

    // can collect resources otherwise
    mine();
    setTouchCount(0);
  };

  const mine = async () => {
    const { amount: crimstoneMined } = getCrimstoneDropAmount({
      game: state,
      rock: {
        ...resource,
        // Set minesLeft to 5 if the stage is 1, otherwise use the current minesLeft
        ...{ minesLeft: crimstoneStage === 1 ? 5 : resource.minesLeft },
      },
    });
    const newState = gameService.send({
      type: "crimstoneRock.mined",
      index: id,
    });

    if (!newState.matches("hoarding")) {
      if (showAnimations) {
        setCollecting(true);
        harvested.current = crimstoneMined.toNumber();
      }

      miningFallAudio();

      if (showAnimations) {
        await new Promise((res) => setTimeout(res, 3000));
        setCollecting(false);
        harvested.current = 0;
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <Transition
        show={!mined && isAnimationRunning}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex -top-2 right-0 absolute z-40 pointer-events-none"
        as="div"
      >
        <img src={lightning} className="h-6 img-highlight-heavy" />
      </Transition>
      {/* Resource ready to collect */}
      {!mined && !isRecentlyMined && (
        <div ref={divRef} className="absolute w-full h-full" onClick={strike}>
          <RecoveredCrimstone
            hasTool={hasTool}
            touchCount={touchCount}
            minesLeft={resource.minesLeft}
            minedAt={resource.stone.minedAt}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && (
        <DepletingCrimstone
          resourceAmount={harvested.current}
          minesLeft={resource.minesLeft}
          minedAt={resource.stone.minedAt}
        />
      )}

      {/* Depleted resource */}
      {(mined || isRecentlyMined) && (
        <DepletedCrimstone
          timeLeft={timeLeft}
          minesLeft={resource.minesLeft}
          minedAt={resource.stone.minedAt}
        />
      )}
    </div>
  );
};
