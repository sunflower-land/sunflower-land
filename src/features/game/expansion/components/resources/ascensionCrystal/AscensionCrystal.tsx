import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "features/game/GameProvider";

import type {
  FiniteResource,
  InventoryItemName,
} from "features/game/types/game";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { useSound } from "lib/utils/hooks/useSound";

import { RecoveredAscensionCrystal } from "./components/RecoveredAscensionCrystal";

const HITS = 3;
const tool = "Gold Pickaxe";

const HasTool = (inventory: Partial<Record<InventoryItemName, Decimal>>) => {
  return (inventory[tool] ?? new Decimal(0)).gte(1);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;

// Cheap field comparator (avoids per-frame JSON.stringify in a resource-heavy
// scene). Single-use nodes only change via mine/move, so these fields suffice.
const compareResource = (prev?: FiniteResource, next?: FiniteResource) =>
  prev?.minesLeft === next?.minesLeft &&
  prev?.stone?.minedAt === next?.stone?.minedAt &&
  prev?.x === next?.x &&
  prev?.y === next?.y;

interface Props {
  id: string;
  index: number;
}

export const AscensionCrystal: React.FC<Props> = ({ id }) => {
  const { gameService, shortcutItem } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);
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
    (state) => state.context.state.ascensionCrystals[id],
    compareResource,
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) => HasTool(prev) === HasTool(next),
  );

  // Single-use: mining deletes the node, so the selector briefly returns
  // undefined before this element unmounts. Bail out instead of crashing.
  // The "+shards" collect feedback outlives this unmount — Land renders it
  // via useMinedCrystalGhosts.
  if (!resource) return null;

  const hasTool = HasTool(inventory);

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

  const mine = () => {
    gameService.send("ascensionCrystal.mined", {
      index: id,
    });

    miningFallAudio();
  };

  return (
    <div className="relative w-full h-full">
      {/* Resource ready to collect — a placed crystal is always mineable */}
      <div ref={divRef} className="absolute w-full h-full" onClick={strike}>
        <RecoveredAscensionCrystal hasTool={hasTool} touchCount={touchCount} />
      </div>
    </div>
  );
};
