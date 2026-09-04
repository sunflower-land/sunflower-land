import React, { useContext, useEffect, useRef, useState } from "react";

import { SUNSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import type { InventoryItemName, Rock } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { DepletedSunstone } from "./components/DepletedSunstone";
import { RecoveredSunstone } from "./components/RecoveredSunstone";
import { DepletingSunstone } from "./components/DepletingSunstone";
import { useSound } from "lib/utils/hooks/useSound";
import {
  getMineBoostWindows,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import { useNodeTimer } from "features/game/lib/useNodeTimer";

const HITS = 3;
const tool = "Gold Pickaxe";

const HasTool = (inventory: Partial<Record<InventoryItemName, Decimal>>) => {
  return (inventory[tool] ?? new Decimal(0)).gte(1);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;

const compareResource = (prev: Rock, next: Rock) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

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
  // Sunstone has no temporary recovery boost, so this is always the empty set
  // and `speed` stays 1. The window-aware code path is kept for uniformity with
  // the other rocks; the lightning indicator simply never shows.
  const mineBoostWindows = useSelector(
    gameService,
    (state) => getMineBoostWindows(state.context.state, "Sunstone Rock"),
    areBoostWindowsEqual,
  );

  const hasTool = HasTool(inventory);

  const { minedAt, baseDurationMs } = resource.stone;
  const {
    now,
    readyAt,
    speed,
    displaySeconds: timeLeft,
  } = useNodeTimer({
    startedAt: minedAt,
    baseDurationMs,
    windows: mineBoostWindows,
    legacyReadyAt: minedAt + SUNSTONE_RECOVERY_TIME * 1000,
  });
  // Sunstone has no recovery boost, so readiness is purely `now` vs the local
  // readyAt — no need to subscribe to (or pass) the full game state. Equivalent to
  // `!canMine(resource, "Sunstone Rock", game, now)` for a boost-less rock.
  const mined = now <= readyAt;

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
    gameService.send("sunstoneRock.mined", {
      index: id,
    });

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
        <DepletedSunstone
          timeLeft={timeLeft}
          minesLeft={resource.minesLeft}
          speed={speed}
          readyAt={readyAt}
          now={now}
        />
      )}
    </div>
  );
};
