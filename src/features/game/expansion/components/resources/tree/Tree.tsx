import React, { useContext, useEffect, useRef, useState } from "react";

import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import {
  GameState,
  InventoryItemName,
  Reward,
  Tree as TreeType,
} from "features/game/types/game";
import {
  canChop,
  getRequiredAxeAmount,
  getReward,
  getWoodDropAmount,
} from "features/game/events/landExpansion/chop";
import { KNOWN_IDS } from "features/game/types";
import { TreeName } from "features/game/types/resources";
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
import { useSound } from "lib/utils/hooks/useSound";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { setPrecision } from "lib/utils/formatNumber";
import { Transition } from "@headlessui/react";
import lightning from "assets/icons/lightning.png";
import { useNow } from "lib/utils/hooks/useNow";
import { FarmActivityName } from "features/game/types/farmActivity";

const HITS = 3;
const tool = "Axe";

const HasTool = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  gameState: GameState,
  id: string,
) => {
  const { amount: axesNeeded } = getRequiredAxeAmount(inventory, gameState, id);

  // has enough axes to chop the tree

  if (axesNeeded.lte(0)) return true;

  return (inventory[tool] ?? new Decimal(0)).gte(axesNeeded);
};

const selectIsland = (state: MachineState) => state.context.state.island;
const selectSeason = (state: MachineState) => state.context.state.season.season;
const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectTreesChopped = (state: MachineState) =>
  state.context.state.farmActivity["Tree Chopped"] ?? 0;
const selectGame = (state: MachineState) => state.context.state;
const selectFarmId = (state: MachineState) => state.context.farmId;

const compareResource = (prev: TreeType, next: TreeType) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};
const compareGame = (prev: GameState, next: GameState) =>
  isCollectibleBuilt({ name: "Foreman Beaver", game: prev }) ===
    isCollectibleBuilt({ name: "Foreman Beaver", game: next }) &&
  (prev.bumpkin?.skills["Insta-Chop"] ?? false) ===
    (next.bumpkin?.skills["Insta-Chop"] ?? false);

// A player that has been vetted and is engaged in the season.
const isSeasonedPlayer = (state: MachineState) =>
  // - level 60+
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) >= 60 &&
  // - verified (personhood verification)
  (state.context.verified || isFaceVerified({ game: state.context.state })) &&
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

interface Props {
  id: string;
  index: number;
}

export const Tree: React.FC<Props> = ({ id }) => {
  const { gameService, shortcutItem, showAnimations } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward>();

  // When to hide the resource that pops out
  const [collecting, setCollecting] = useState(false);
  const harvested = useRef<number>(0);

  const isSeasoned = useSelector(gameService, isSeasonedPlayer);

  const divRef = useRef<HTMLDivElement>(null);

  const { play: treeFallAudio } = useSound("tree_fall");

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
    compareResource,
  );
  const game = useSelector(gameService, selectGame, compareGame);
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev, game, id) === HasTool(next, game, id) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0)),
  );

  const treesChopped = useSelector(gameService, selectTreesChopped);
  const activityCount = useSelector(gameService, (state) => {
    const treeName = state.context.state.trees[id]?.name ?? "Tree";
    const activityKey =
      `${treeName === "Tree" ? "Basic Tree" : treeName} Chopped` as FarmActivityName;
    return state.context.state.farmActivity[activityKey] ?? 0;
  });
  const island = useSelector(gameService, selectIsland);
  const season = useSelector(gameService, selectSeason);
  const farmId = useSelector(gameService, selectFarmId);
  const hasTool = HasTool(inventory, game, id);
  const readyAt = resource.wood.choppedAt + TREE_RECOVERY_TIME * 1000;
  const now = useNow({ live: true, autoEndAt: readyAt });
  const timeLeft = getTimeLeft(
    resource.wood.choppedAt,
    TREE_RECOVERY_TIME,
    now,
  );
  const chopped = !canChop(resource);

  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [isRecentlyChopped, setIsRecentlyChopped] = useState(false);
  const choppedAtRef = useRef(resource.wood.choppedAt);

  useEffect(() => {
    if (choppedAtRef.current !== resource.wood.choppedAt) {
      // Important: update the ref so this change is only handled once.
      choppedAtRef.current = resource.wood.choppedAt;
      setIsRecentlyChopped(true);

      const timeout = setTimeout(() => {
        setIsRecentlyChopped(false);
        setIsAnimationRunning(true);
      }, 1900);

      return () => clearTimeout(timeout);
    }
  }, [resource.wood.choppedAt]);

  useEffect(() => {
    if (isAnimationRunning) {
      const timeout = setTimeout(() => {
        setIsAnimationRunning(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAnimationRunning]);

  useUiRefresher({ active: chopped });

  // Calculate expected reward for UI preview (captcha gate for non-seasoned players)
  const treeName: TreeName = resource.name ?? "Tree";

  const { reward: expectedReward } = resource.wood.reward
    ? { reward: resource.wood.reward }
    : getReward({
        skills: game.bumpkin?.skills ?? {},
        farmId,
        itemId: KNOWN_IDS[treeName],
        counter: activityCount,
      });

  const shake = () => {
    if (!hasTool) return;

    setTouchCount((count) => count + 1);
    if (!isCollectibleBuilt({ name: "Foreman Beaver", game })) {
      shortcutItem(tool);
    }

    const hasInstaChop = game.bumpkin.skills["Insta-Chop"];

    // Need to hit enough times to collect resource (unless Insta-Chop)
    if (!hasInstaChop && touchCount < HITS - 1) return;

    // For non-seasoned players with a reward, show captcha first
    // This applies even with Insta-Chop - captcha is a security gate
    if (expectedReward && !isSeasoned) {
      setReward(expectedReward);
      return;
    }

    // Seasoned players or no reward - just chop (reward applied in chop)
    chop();
    setTouchCount(0);
  };

  const onCollectChest = (success: boolean) => {
    setReward(undefined);
    if (success) {
      chop();
      setTouchCount(0);
    }
  };

  const chop = async () => {
    const woodDropAmount =
      resource.wood.amount ??
      getWoodDropAmount({
        game,
        tree: resource,
        farmId,
        itemId: KNOWN_IDS[treeName],
        counter: activityCount,
      }).amount;

    const newState = gameService.send({
      type: "timber.chopped",
      index: id,
      item: "Axe",
    });

    if (!newState.matches("hoarding")) {
      if (showAnimations) {
        setCollecting(true);
        harvested.current = setPrecision(woodDropAmount, 2).toNumber();
      }

      treeFallAudio();

      if (showAnimations) {
        await new Promise((res) => setTimeout(res, 3000));
        setCollecting(false);
        harvested.current = 0;
      }
    }

    if (newState.context.state.farmActivity["Tree Chopped"] === 1) {
      gameAnalytics.trackMilestone({ event: "Tutorial:TreeChopped:Completed" });
    }
  };

  return (
    <div className="relative w-full h-full">
      <Transition
        show={!chopped && isAnimationRunning}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex -top-2 right-0 absolute z-40 pointer-events-none"
        as="div"
      >
        <img src={lightning} className="h-6 img-highlight-heavy" />
      </Transition>
      {/* Resource ready to collect */}
      {!chopped && !isRecentlyChopped && (
        <div ref={divRef} className="absolute w-full h-full" onClick={shake}>
          <RecoveredTree
            hasTool={hasTool}
            touchCount={touchCount}
            showHelper={treesChopped < 3 && treesChopped + 1 === Number(id)}
            island={island}
            season={season}
            id={id}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && (
        <DepletingTree resourceAmount={harvested.current} season={season} />
      )}

      {/* Depleted resource */}
      {(chopped || isRecentlyChopped) && (
        <DepletedTree timeLeft={timeLeft} island={island} season={season} />
      )}

      {/* Chest reward - captcha gate for non-seasoned players */}
      {reward && (
        <ChestReward
          collectedItem={"Wood"}
          reward={reward}
          onCollected={onCollectChest}
          onOpen={() => {
            // No-op - reward is applied in chop(), this is just for the chest animation
          }}
        />
      )}
    </div>
  );
};
