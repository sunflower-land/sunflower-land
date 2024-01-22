import React, { useContext, useEffect, useRef, useState } from "react";

import { RUBY_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import { loadAudio, miningFallAudio } from "lib/utils/sfx";
import { InventoryItemName, Rock } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import { getBumpkinLevel } from "features/game/lib/level";
import { getBumpkinLevelRequiredForNode } from "features/game/expansion/lib/expansionNodes";
import { RecoveredRuby } from "./components/RecoveredRuby";
import { DepletingRuby } from "./components/DepletingRuby";
import { DepletedRuby } from "./components/DepletedRuby";

const HITS = 3;
const tool = "Gold Pickaxe";

const HasTool = (inventory: Partial<Record<InventoryItemName, Decimal>>) => {
  return (inventory[tool] ?? new Decimal(0)).gte(1);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const showHelper = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) >= 3 &&
  !state.context.state.bumpkin?.activity?.["Ruby Mined"];
const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

interface Props {
  id: string;
  index: number;
}

export const Ruby: React.FC<Props> = ({ id, index }) => {
  const { gameService, shortcutItem } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);

  // When to hide the resource that pops out
  const [collecting, setCollecting] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState<number>();

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAudio([miningFallAudio]);
  }, []);

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
    (state) => state.context.state.rubies[id],
    compareResource
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev) === HasTool(next) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0))
  );

  const needsHelp = useSelector(gameService, showHelper);

  const hasTool = HasTool(inventory);
  const timeLeft = getTimeLeft(resource.stone.minedAt, RUBY_RECOVERY_TIME);
  const mined = !canMine(resource, RUBY_RECOVERY_TIME);

  const bumpkinLevelRequired = getBumpkinLevelRequiredForNode(
    index,
    "Ruby Rock"
  );
  const bumpkinLevel = useSelector(gameService, _bumpkinLevel);
  const bumpkinTooLow = bumpkinLevel < bumpkinLevelRequired;

  useUiRefresher({ active: mined });

  const strike = () => {
    if (bumpkinTooLow) return;
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
    const newState = gameService.send("rubyRock.mined", {
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
          <RecoveredRuby
            bumpkinLevelRequired={bumpkinLevelRequired}
            hasTool={hasTool}
            touchCount={touchCount}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && <DepletingRuby resourceAmount={collectedAmount} />}

      {/* Depleted resource */}
      {mined && <DepletedRuby timeLeft={timeLeft} />}
    </div>
  );
};
