import React, { useContext, useEffect, useRef, useState } from "react";

import { GOLD_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import { InventoryItemName, Rock, Skills } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { DepletedGold } from "./components/DepletedGold";
import { DepletingGold } from "./components/DepletingGold";
import { RecoveredGold } from "./components/RecoveredGold";
import { canMine } from "features/game/lib/resourceNodes";
import { useSound } from "lib/utils/hooks/useSound";
import { getGoldDropAmount } from "features/game/events/landExpansion/mineGold";
import { GoldRockName } from "features/game/types/resources";
import { useNow } from "lib/utils/hooks/useNow";

const HITS = 3;
const tool = "Iron Pickaxe";

const HasTool = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  goldRock: Rock,
) => {
  const requiredToolAmount = goldRock.multiplier ?? 1;
  if (requiredToolAmount <= 0) return true;
  return (inventory[tool] ?? new Decimal(0)).gte(requiredToolAmount);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectGame = (state: MachineState) => state.context.state;

const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

const selectSkills = (state: MachineState) =>
  state.context.state.bumpkin?.skills;

const compareSkills = (prev: Skills, next: Skills) =>
  (prev["Tap Prospector"] ?? false) === (next["Tap Prospector"] ?? false);

const _selectSeason = (state: MachineState) =>
  state.context.state.season.season;
const _selectIsland = (state: MachineState) => state.context.state.island;

interface Props {
  id: string;
}

export const Gold: React.FC<Props> = ({ id }) => {
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
    (state) => state.context.state.gold[id],
    compareResource,
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev, resource) === HasTool(next, resource) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0)),
  );
  const skills = useSelector(gameService, selectSkills, compareSkills);
  const state = useSelector(gameService, selectGame);
  const season = useSelector(gameService, _selectSeason);
  const island = useSelector(gameService, _selectIsland);

  const readyAt = resource.stone.minedAt + GOLD_RECOVERY_TIME * 1000;
  const now = useNow({ live: true, autoEndAt: readyAt });

  const hasTool = HasTool(inventory, resource);
  const goldRockName = (resource.name ?? "Gold Rock") as GoldRockName;
  const timeLeft = getTimeLeft(resource.stone.minedAt, GOLD_RECOVERY_TIME, now);
  const mined = !canMine(resource, goldRockName);

  useUiRefresher({ active: mined });

  const strike = () => {
    if (!hasTool) return;

    shortcutItem(tool);

    if (skills["Tap Prospector"]) {
      // insta-mine the mineral
      return mine();
    }

    setTouchCount((count) => count + 1);
    // need to hit enough times to collect resource
    if (touchCount < HITS - 1) return;

    // can collect resources otherwise
    mine();
    setTouchCount(0);
  };

  const mine = async () => {
    const goldMined = new Decimal(
      resource.stone.amount ??
        getGoldDropAmount({
          game: state,
          rock: resource,
          createdAt: Date.now(),
          criticalDropGenerator: (name) =>
            !!(resource.stone.criticalHit?.[name] ?? 0),
        }).amount,
    );
    const newState = gameService.send("goldRock.mined", {
      index: id,
    });

    if (!newState.matches("hoarding")) {
      if (showAnimations) {
        setCollecting(true);
        harvested.current = goldMined.toNumber();
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
          <RecoveredGold
            season={season}
            island={island}
            hasTool={hasTool}
            touchCount={touchCount}
            goldRockName={goldRockName}
            requiredToolAmount={new Decimal(resource.multiplier ?? 1)}
            inventory={inventory}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && <DepletingGold resourceAmount={harvested.current} />}

      {/* Depleted resource */}
      {mined && (
        <DepletedGold
          season={season}
          island={island}
          timeLeft={timeLeft}
          name={goldRockName}
        />
      )}
    </div>
  );
};
