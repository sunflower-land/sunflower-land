import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "features/game/GameProvider";

import type {
  FiniteResource,
  InventoryItemName,
} from "features/game/types/game";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { canMine } from "features/game/lib/resourceNodes";
import { useSound } from "lib/utils/hooks/useSound";

// Placeholder art: reuses the Sunstone visuals until dedicated crystal art lands.
import { DepletingSunstone } from "../sunstone/components/DepletingSunstone";
import { RecoveredSunstone } from "../sunstone/components/RecoveredSunstone";

const HITS = 3;
const tool = "Gold Pickaxe";

const HasTool = (inventory: Partial<Record<InventoryItemName, Decimal>>) => {
  return (inventory[tool] ?? new Decimal(0)).gte(1);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectGame = (state: MachineState) => state.context.state;

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
  const { gameService, shortcutItem, showAnimations } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);

  // Drives the "popping out" animation. State (not a ref) so the render output
  // never depends on mutable ref state — keeps React Compiler / concurrent
  // rendering happy.
  const [collectingAmount, setCollectingAmount] = useState(0);
  const collectingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Clear any pending animation timeout on unmount (mining deletes the node).
  useEffect(() => {
    return () => {
      if (collectingTimeout.current) {
        clearTimeout(collectingTimeout.current);
      }
    };
  }, []);

  const game = useSelector(gameService, selectGame);
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
  if (!resource) return null;

  const hasTool = HasTool(inventory);
  const mined = !canMine(resource, "Ascension Crystal", game);

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

    if (showAnimations) {
      setCollectingAmount(1);
      collectingTimeout.current = setTimeout(() => {
        setCollectingAmount(0);
        collectingTimeout.current = null;
      }, 3000);
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
      {collectingAmount > 0 && (
        <DepletingSunstone
          resourceAmount={collectingAmount}
          minesLeft={resource.minesLeft}
        />
      )}
    </div>
  );
};
