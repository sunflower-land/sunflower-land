import React, { useContext, useEffect, useRef, useState } from "react";

import { STONE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import { miningFallAudio } from "lib/utils/sfx";
import { InventoryItemName, Rock } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { DepletedStone } from "./components/DepletedStone";
import { DepletingStone } from "./components/DepletingStone";
import { RecoveredStone } from "./components/RecoveredStone";
import { canMine } from "features/game/expansion/lib/utils";

const HITS = 3;
const tool = "Pickaxe";

const HasTool = (inventory: Partial<Record<InventoryItemName, Decimal>>) => {
  return (inventory[tool] ?? new Decimal(0)).gte(1);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectStonesMined = (state: MachineState) =>
  state.context.state.bumpkin?.activity?.["Stone Mined"] ?? 0;
const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

interface Props {
  id: string;
}

export const Stone: React.FC<Props> = ({ id }) => {
  const { gameService, shortcutItem } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);

  // When to hide the resource that pops out
  const [collecting, setCollecting] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState<number>();

  const divRef = useRef<HTMLDivElement>(null);

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
    (state) => state.context.state.stones[id],
    compareResource
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev) === HasTool(next) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0))
  );
  const stonesMined = useSelector(gameService, selectStonesMined);

  const hasTool = HasTool(inventory);
  const timeLeft = getTimeLeft(resource.stone.minedAt, STONE_RECOVERY_TIME);
  const mined = !canMine(resource, STONE_RECOVERY_TIME);

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
    const newState = gameService.send("stoneRock.mined", {
      index: id,
    });

    if (!newState.matches("hoarding")) {
      setCollecting(true);
      setCollectedAmount(resource.stone.amount);
      miningFallAudio.play();

      await new Promise((res) => setTimeout(res, 3000));
      setCollecting(false);
      setCollectedAmount(undefined);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Resource ready to collect */}
      {!mined && (
        <div ref={divRef} className="absolute w-full h-full" onClick={strike}>
          <RecoveredStone
            hasTool={hasTool}
            touchCount={touchCount}
            showHelper={stonesMined < 2}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && <DepletingStone resourceAmount={collectedAmount} />}

      {/* Depleted resource */}
      {mined && <DepletedStone timeLeft={timeLeft} />}
    </div>
  );
};
