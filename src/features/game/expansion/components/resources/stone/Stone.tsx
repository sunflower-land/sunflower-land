import React, { useContext, useEffect, useRef, useState } from "react";

import { STONE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import type {
  GameState,
  InventoryItemName,
  Rock,
  Skills,
} from "features/game/types/game";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { DepletedStone } from "./components/DepletedStone";
import { DepletingStone } from "./components/DepletingStone";
import { RecoveredStone } from "./components/RecoveredStone";
import { canMine } from "features/game/lib/resourceNodes";
import { useSound } from "lib/utils/hooks/useSound";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  getRequiredPickaxeAmount,
  getStoneDropAmount,
} from "features/game/events/landExpansion/stoneMine";
import type { RockName, StoneRockName } from "features/game/types/resources";
import { useNow } from "lib/utils/hooks/useNow";
import { KNOWN_IDS } from "features/game/types";
import {
  computeReadyAt,
  getEffectiveSpeedAt,
  getMineBoostWindows,
  workAccruedAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";

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
  gameState: GameState,
  id: string,
) => {
  const { amount: requiredToolAmount } = getRequiredPickaxeAmount(
    gameState,
    id,
  );
  if (requiredToolAmount.lte(0)) return true;
  return (inventory[tool] ?? new Decimal(0)).gte(requiredToolAmount);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

const _state = (state: MachineState) => state.context.state;
const _compareQuarryExistence = (prev: GameState, next: GameState) =>
  isCollectibleBuilt({ name: "Quarry", game: prev }) ===
  isCollectibleBuilt({ name: "Quarry", game: next });

const selectSkills = (state: MachineState) =>
  state.context.state.bumpkin?.skills;

const compareSkills = (prev: Skills, next: Skills) =>
  (prev["Tap Prospector"] ?? false) === (next["Tap Prospector"] ?? false);

const _selectSeason = (state: MachineState) =>
  state.context.state.season.season;
const _selectIsland = (state: MachineState) => state.context.state.island;
const selectFarmId = (state: MachineState) => state.context.farmId;

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

  const game = useSelector(gameService, _state, _compareQuarryExistence);
  const farmId = useSelector(gameService, selectFarmId);
  const resource = useSelector(
    gameService,
    (state) => state.context.state.stones[id],
    compareResource,
  );
  const name = (resource.name ?? "Stone Rock") as StoneRockName;
  const activityCount = useSelector(gameService, (state) => {
    const rockName = state.context.state.stones[id]?.name ?? "Stone Rock";
    return state.context.state.farmActivity[`${rockName} Mined`] ?? 0;
  });
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev, game, id) === HasTool(next, game, id) &&
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
  const hasTool = HasTool(inventory, game, id);

  const { minedAt, baseDurationMs } = resource.stone;
  // Speed-rate model (baseDurationMs set): derive the ready time live from the
  // boost windows. Legacy rocks use the back-dated minedAt + base recovery.
  const readyAt =
    baseDurationMs !== undefined
      ? computeReadyAt({
          startedAt: minedAt,
          baseDurationMs,
          windows: mineBoostWindows,
        })
      : minedAt + STONE_RECOVERY_TIME * 1000;

  // Coarse 1s clock to pick the current boost speed; only windowed rocks are
  // boosted. Tick the countdown faster (1000/speed) so it drops ~1s per visual
  // tick rather than jumping by `speed` each second.
  const tickNow = useNow({
    live: baseDurationMs !== undefined,
    autoEndAt: readyAt,
  });
  const speed =
    baseDurationMs !== undefined
      ? getEffectiveSpeedAt({ at: tickNow, windows: mineBoostWindows })
      : 1;
  const intervalMs = Math.max(Math.round(1000 / Math.max(speed, 1)), 250);
  const now = useNow({ live: true, autoEndAt: readyAt, intervalMs });
  // For windowed rocks the remaining time is remaining *work* (in base
  // duration), so it visibly ticks down faster while a boost window is active.
  const timeLeft =
    baseDurationMs !== undefined
      ? Math.max(
          (baseDurationMs -
            workAccruedAt({
              startedAt: minedAt,
              at: now,
              windows: mineBoostWindows,
            })) /
            1000,
          0,
        )
      : getTimeLeft(resource.stone.minedAt, STONE_RECOVERY_TIME, now);
  const mined = !canMine(resource, name, game, now);

  const strike = () => {
    if (!hasTool) return;

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
    const stoneName: RockName = resource.name ?? "Stone Rock";
    const stoneMined = new Decimal(
      resource.stone.amount ??
        getStoneDropAmount({
          game,
          rock: resource,
          createdAt: now,
          id,
          farmId,
          counter: activityCount,
          itemId: KNOWN_IDS[stoneName],
        }).amount,
    );

    gameService.send("stoneRock.mined", {
      index: id,
    });

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
            requiredToolAmount={getRequiredPickaxeAmount(game, id).amount}
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
          speed={speed}
        />
      )}
    </div>
  );
};
