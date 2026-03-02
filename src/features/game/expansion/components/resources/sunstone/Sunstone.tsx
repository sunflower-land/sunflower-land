import React, { useContext, useEffect, useRef, useState } from "react";

import { SUNSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import { InventoryItemName, Rock } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { canMine } from "features/game/lib/resourceNodes";
import { getBumpkinLevel } from "features/game/lib/level";
import { DepletedSunstone } from "./components/DepletedSunstone";
import { RecoveredSunstone } from "./components/RecoveredSunstone";
import { DepletingSunstone } from "./components/DepletingSunstone";
import { useSound } from "lib/utils/hooks/useSound";
import { useNow } from "lib/utils/hooks/useNow";

const HITS = 3;
const tool = "Gold Pickaxe";

const HasTool = (inventory: Partial<Record<InventoryItemName, Decimal>>) => {
  return (inventory[tool] ?? new Decimal(0)).gte(1);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;

const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

export const getSunstoneStage = (minesLeft: number) => {
  if (minesLeft === 10) return 1;
  if (minesLeft === 9) return 2;
  if (minesLeft === 8) return 3;
  if (minesLeft === 7) return 4;
  if (minesLeft === 6) return 5;
  if (minesLeft === 5) return 6;
  if (minesLeft === 4) return 7;
  if (minesLeft === 3) return 8;
  if (minesLeft === 2) return 9;
  return 10;
};

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

interface Props {
  id: string;
  index: number;
}

export const Sunstone: React.FC<Props> = ({ id, index }) => {
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

  const resource = useSelector(
    gameService,
    (state) => state.context.state.sunstones[id],
    compareResource,
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev) === HasTool(next) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0)),
  );

  const hasTool = HasTool(inventory);
  const readyAt = resource.stone.minedAt + SUNSTONE_RECOVERY_TIME * 1000;
  const now = useNow({ live: true, autoEndAt: readyAt });
  const timeLeft = getTimeLeft(
    resource.stone.minedAt,
    SUNSTONE_RECOVERY_TIME,
    now,
  );
  const mined = !canMine(resource, "Sunstone Rock");

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
    const newState = gameService.send({
      type: "sunstoneRock.mined",
      index: id,
    });

    if (!newState.matches("hoarding")) {
      if (showAnimations) {
        setCollecting(true);
        harvested.current = 1;
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
          <RecoveredSunstone
            hasTool={hasTool}
            touchCount={touchCount}
            minesLeft={resource.minesLeft}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && (
        <DepletingSunstone
          resourceAmount={harvested.current}
          minesLeft={resource.minesLeft}
        />
      )}

      {/* Depleted resource */}
      {mined && (
        <DepletedSunstone timeLeft={timeLeft} minesLeft={resource.minesLeft} />
      )}
    </div>
  );
};
