import React, { useContext, useEffect, useRef, useState } from "react";

import { STONE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import type { InventoryItemName, Rock, Skills } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { DepletedStone } from "./components/DepletedStone";
import { DepletingStone } from "./components/DepletingStone";
import { RecoveredStone } from "./components/RecoveredStone";
import { useSound } from "lib/utils/hooks/useSound";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { getRequiredPickaxeAmount } from "features/game/events/landExpansion/stoneMine";
import type { StoneRockName } from "features/game/types/resources";
import {
  getMineBoostWindows,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import { useNodeTimer } from "features/game/lib/useNodeTimer";

const HITS = 3;
const tool = "Pickaxe";

// Field comparator for the mine boost windows so the selector skips re-renders
// without allocating JSON strings per rock on every service update.
const areBoostWindowsEqual = (a: BoostWindow[], b: BoostWindow[]) =>
  a.length === b.length &&
  a.every((window, index) => {
    const other = b[index];
    return (
      other !== undefined &&
      window.from === other.from &&
      window.to === other.to &&
      window.speed === other.speed
    );
  });

const HasTool = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  requiredToolAmount: Decimal,
) => {
  if (requiredToolAmount.lte(0)) return true;
  return (inventory[tool] ?? new Decimal(0)).gte(requiredToolAmount);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

const compareDecimal = (prev: Decimal, next: Decimal) => prev.equals(next);

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

export const Stone: React.FC<Props> = ({ id }) => {
  const { gameService, shortcutItem, showAnimations } = useContext(Context);
  const [touchCount, setTouchCount] = useState(0);

  // When to hide the resource that pops out
  const [collecting, setCollecting] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);
  const harvested = useRef<number>(0);

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
    (state) => state.context.state.stones[id],
    compareResource,
  );
  const name = (resource.name ?? "Stone Rock") as StoneRockName;
  // Pickaxes the next strike costs (0 with a Quarry). Read from live state so a
  // Quarry placed or a rock upgraded mid-session updates the requirement.
  const requiredToolAmount = useSelector(
    gameService,
    (state) => getRequiredPickaxeAmount(state.context.state, id).amount,
    compareDecimal,
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev, requiredToolAmount) === HasTool(next, requiredToolAmount) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0)),
  );
  const skills = useSelector(gameService, selectSkills, compareSkills);
  const season = useSelector(gameService, _selectSeason);
  const island = useSelector(gameService, _selectIsland);
  // Live windowed mine-recovery speed boosts (Ore Hourglass, Badger Shrine,
  // totems). Recomputed from full state but only re-renders when the windows
  // actually change, so the countdown reacts to boosters placed/expired mid-recover.
  const mineBoostWindows = useSelector(
    gameService,
    (state) => getMineBoostWindows(state.context.state, name),
    areBoostWindowsEqual,
  );
  const hasTool = HasTool(inventory, requiredToolAmount);

  const { minedAt, baseDurationMs } = resource.stone;
  const {
    now,
    readyAt,
    countdownSeconds: timeLeft,
  } = useNodeTimer({
    startedAt: minedAt,
    baseDurationMs: baseDurationMs ?? STONE_RECOVERY_TIME * 1000,
    windows: mineBoostWindows,
  });
  // Read readiness off the timer's live readyAt (same live mine windows as the
  // countdown), so the rock unlocks the moment the countdown hits zero.
  const mined = now <= readyAt;

  const strike = () => {
    // Click-time checks read fresh state, like the reducer will.
    const game = gameService.getSnapshot().context.state;
    if (!HasTool(game.inventory, getRequiredPickaxeAmount(game, id).amount)) {
      return;
    }

    if (!isCollectibleBuilt({ name: "Quarry", game })) {
      shortcutItem(tool);
    }

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
    // Read the popup amount off the reducer's result, so it shows exactly what
    // was added (same timestamp, boosts and rolls as the mined event).
    const before =
      gameService.getSnapshot().context.state.inventory.Stone ?? new Decimal(0);
    gameService.send("stoneRock.mined", {
      index: id,
    });
    const stoneMined = (
      gameService.getSnapshot().context.state.inventory.Stone ?? new Decimal(0)
    ).minus(before);

    if (showAnimations) {
      setCollecting(true);
      harvested.current = stoneMined.toNumber();
    }

    miningFallAudio();

    if (showAnimations) {
      await new Promise((res) => setTimeout(res, 3000));
      setCollecting(false);
      harvested.current = 0;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Resource ready to collect */}
      {!mined && (
        <div ref={divRef} className="absolute w-full h-full" onClick={strike}>
          <RecoveredStone
            season={season}
            island={island}
            hasTool={hasTool}
            touchCount={touchCount}
            showHelper={false} // FUTURE ENHANCEMENT
            stoneRockName={name}
            requiredToolAmount={requiredToolAmount}
            inventory={inventory}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && <DepletingStone resourceAmount={harvested.current} />}

      {/* Depleted resource */}
      {mined && (
        <DepletedStone
          season={season}
          island={island}
          timeLeft={timeLeft}
          name={name as StoneRockName}
        />
      )}
    </div>
  );
};
