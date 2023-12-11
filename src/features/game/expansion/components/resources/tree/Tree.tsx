import React, { useContext, useEffect, useRef, useState } from "react";

import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import { treeFallAudio } from "lib/utils/sfx";
import {
  Collectibles,
  InventoryItemName,
  Reward,
  Tree as TreeType,
} from "features/game/types/game";
import {
  canChop,
  getRequiredAxeAmount,
} from "features/game/events/landExpansion/chop";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { DepletedTree } from "./components/DepletedTree";
import { DepletingTree } from "./components/DepletingTree";
import { RecoveredTree } from "./components/RecoveredTree";
import { gameAnalytics } from "lib/gameAnalytics";
import { getBumpkinLevel } from "features/game/lib/level";
import { getBumpkinLevelRequiredForNode } from "features/game/expansion/lib/expansionNodes";

const HITS = 3;
const tool = "Axe";

const HasTool = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  collectibles: Collectibles
) => {
  const axesNeeded = getRequiredAxeAmount(inventory, collectibles);

  // has enough axes to chop the tree

  if (axesNeeded.lte(0)) return true;

  return (inventory[tool] ?? new Decimal(0)).gte(axesNeeded);
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectTreesChopped = (state: MachineState) =>
  state.context.state.bumpkin?.activity?.["Tree Chopped"] ?? 0;
const selectCollectibles = (state: MachineState) =>
  state.context.state.collectibles;

const compareResource = (prev: TreeType, next: TreeType) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};
const compareCollectibles = (prev: Collectibles, next: Collectibles) =>
  isCollectibleBuilt("Foreman Beaver", prev) ===
  isCollectibleBuilt("Foreman Beaver", next);

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

interface Props {
  id: string;
  index: number;
}

export const Tree: React.FC<Props> = ({ id, index }) => {
  const { gameService, shortcutItem } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward>();

  // When to hide the resource that pops out
  const [collecting, setCollecting] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState<number>();

  const divRef = useRef<HTMLDivElement>(null);

  // Reset the shake count when clicking outside of the component
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
    (state) => state.context.state.trees[id],
    compareResource
  );
  const collectibles = useSelector(
    gameService,
    selectCollectibles,
    compareCollectibles
  );
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev, collectibles) === HasTool(next, collectibles) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0))
  );

  const treesChopped = useSelector(gameService, selectTreesChopped);

  const hasTool = HasTool(inventory, collectibles);
  const timeLeft = getTimeLeft(resource.wood.choppedAt, TREE_RECOVERY_TIME);
  const chopped = !canChop(resource);

  const bumpkinLevelRequired = getBumpkinLevelRequiredForNode(index, "Tree");
  const bumpkinLevel = useSelector(gameService, _bumpkinLevel);
  const bumpkinTooLow = bumpkinLevel < bumpkinLevelRequired;

  useUiRefresher({ active: chopped });

  const shake = () => {
    if (bumpkinTooLow) return;
    if (!hasTool) return;

    setTouchCount((count) => count + 1);
    if (!isCollectibleBuilt("Foreman Beaver", collectibles)) shortcutItem(tool);

    // need to hit enough times to collect resource
    if (touchCount < HITS - 1) return;

    // increase touch count if there is a reward
    if (resource.wood.reward) {
      // they have touched enough!
      setReward(resource.wood.reward);
      return;
    }

    // can collect resources otherwise
    chop();
    setTouchCount(0);
  };

  const onCollectChest = (success: boolean) => {
    setReward(undefined);
    if (success) {
      chop();
    }
  };

  const chop = async () => {
    const newState = gameService.send("timber.chopped", {
      index: id,
      item: "Axe",
    });

    if (!newState.matches("hoarding")) {
      setCollecting(true);
      setCollectedAmount(resource.wood.amount);
      treeFallAudio.play();

      await new Promise((res) => setTimeout(res, 3000));
      setCollecting(false);
      setCollectedAmount(undefined);
    }

    if (newState.context.state.bumpkin?.activity?.["Tree Chopped"] === 1) {
      gameAnalytics.trackMilestone({ event: "Tutorial:TreeChopped:Completed" });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Resource ready to collect */}
      {!chopped && (
        <div ref={divRef} className="absolute w-full h-full" onClick={shake}>
          <RecoveredTree
            bumpkinLevelRequired={bumpkinLevelRequired}
            hasTool={hasTool}
            touchCount={touchCount}
            showHelper={treesChopped < 3 && treesChopped + 1 === Number(id)}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && <DepletingTree resourceAmount={collectedAmount} />}

      {/* Depleted resource */}
      {chopped && <DepletedTree timeLeft={timeLeft} />}

      {/* Chest reward */}
      <ChestReward
        collectedItem={"Wood"}
        reward={reward}
        onCollected={onCollectChest}
        onOpen={() =>
          gameService.send("treeReward.collected", {
            treeIndex: id,
          })
        }
      />
    </div>
  );
};
