import React, { useContext, useEffect, useRef, useState } from "react";

import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import { InventoryItemName, Rock } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import { RecoveredCrimstone } from "./components/RecoveredCrimstone";
import { DepletingCrimstone } from "./components/DepletingCrimstone";
import { DepletedCrimstone } from "./components/DepletedCrimstone";
import { useSound } from "lib/utils/hooks/useSound";
import { getCrimstoneDropAmount } from "features/game/events/landExpansion/mineCrimstone";

const HITS = 3;
const tool = "Gold Pickaxe";

const HasTool = (inventory: Partial<Record<InventoryItemName, Decimal>>) => {
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
  index: number;
}

export const Crimstone: React.FC<Props> = ({ id, index }) => {
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
      HasTool(prev) === HasTool(next) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0)),
  );

  const hasTool = HasTool(inventory);
  const timeLeft = getTimeLeft(resource.stone.minedAt, CRIMSTONE_RECOVERY_TIME);
  const mined = !canMine(resource, CRIMSTONE_RECOVERY_TIME);

  useUiRefresher({ active: mined });

  const strike = () => {
    if (!hasTool) return;

    setTouchCount((count) => count + 1);
    shortcutItem(tool);

    // need to hit enough times to collect resource
    if (touchCount < HITS - 1) return;

    // can collect resources otherwise
    mine();
    setTouchCount(0);
  };

  const mine = async () => {
    const crimstoneMined = getCrimstoneDropAmount({
      game: state,
      rock: {
        ...resource,
        // Set minesLeft to 5 if the stage is 1, otherwise use the current minesLeft
        ...{ minesLeft: crimstoneStage === 1 ? 5 : resource.minesLeft },
      },
    });
    const newState = gameService.send("crimstoneRock.mined", {
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
      {/* Resource ready to collect */}
      {!mined && (
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
      {mined && (
        <DepletedCrimstone
          timeLeft={timeLeft}
          minesLeft={resource.minesLeft}
          minedAt={resource.stone.minedAt}
        />
      )}
    </div>
  );
};
