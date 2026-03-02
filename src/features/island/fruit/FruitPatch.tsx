import React, { useContext, useRef, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import {
  PATCH_FRUIT_SEEDS,
  PatchFruitName,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { FruitTree } from "./FruitTree";
import Decimal from "decimal.js-light";
import {
  getRequiredAxeAmount,
  getWoodReward,
} from "features/game/events/landExpansion/fruitTreeRemoved";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  FruitPatch as Patch,
  InventoryItemName,
  GameState,
} from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { ResourceDropAnimator } from "components/animation/ResourceDropAnimator";

import powerup from "assets/icons/level_up.png";
import { FRUIT_PATCH_VARIANTS } from "../lib/alternateArt";
import { useSound } from "lib/utils/hooks/useSound";
import { getKeys } from "features/game/types/decorations";
import { QuickSelect } from "features/greenhouse/QuickSelect";
import { Transition } from "@headlessui/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SEASONAL_SEEDS, SeedName } from "features/game/types/seeds";
import { SeasonalSeed } from "../plots/components/SeasonalSeed";
import { Modal } from "components/ui/Modal";
import { isFullMoonBerry } from "features/game/events/landExpansion/seedBought";
import { getCurrentBiome } from "../biomes/biomes";
import { getFruitYield } from "features/game/events/landExpansion/fruitHarvested";

const HasAxes = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  game: GameState,
) => {
  const { amount: axesNeeded } = getRequiredAxeAmount(inventory, game);

  // has enough axes to chop the tree
  if (axesNeeded <= 0) return true;

  return (inventory.Axe ?? new Decimal(0)).gte(axesNeeded);
};

//Update inventory selector if player buys fruit seeds
const HasFruitSeeds = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
) => {
  return Object.fromEntries(
    Object.keys(PATCH_FRUIT_SEEDS).map((seed) => [
      seed,
      inventory[seed as PatchFruitSeedName] ?? new Decimal(0),
    ]),
  );
};

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectGame = (state: MachineState) => state.context.state;
const compareFruit = (prev?: Patch, next?: Patch) =>
  JSON.stringify(prev) === JSON.stringify(next);
const compareGame = (prev: GameState, next: GameState) =>
  isCollectibleBuilt({ name: "Foreman Beaver", game: prev }) ===
  isCollectibleBuilt({ name: "Foreman Beaver", game: next });

const _island = (state: MachineState) => state.context.state.island;
const _farmId = (state: MachineState) => state.context.farmId;
interface Props {
  id: string;
}

export const FruitPatch: React.FC<Props> = ({ id }) => {
  const { gameService, selectedItem, shortcutItem, enableQuickSelect } =
    useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const { t } = useAppTranslation();

  const [playShakingAnimation, setPlayShakingAnimation] = useState(false);
  const [collectingFruit, setCollectingFruit] = useState(false);
  const [collectingWood, setCollectingWood] = useState(false);
  const [collectedFruitName, setCollectedFruitName] =
    useState<PatchFruitName>();
  const [collectedWoodAmount, setCollectedWoodAmount] = useState<number>();
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [showSeasonalSeed, setShowSeasonalSeed] = useState(false);
  const fruitHarvested = useRef(0);
  const fruitPatch = useSelector(
    gameService,
    (state) => state.context.state.fruitPatches[id],
    compareFruit,
  );
  const { fruit, fertiliser } = fruitPatch;
  const game = useSelector(gameService, selectGame, compareGame);
  const activityCount = useSelector(gameService, (state) => {
    const fruitName = state.context.state.fruitPatches[id]?.fruit?.name;
    if (!fruitName) return 0;
    return state.context.state.farmActivity[`${fruitName} Harvested`] ?? 0;
  });
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasAxes(prev, game) === HasAxes(next, game) &&
      JSON.stringify(HasFruitSeeds(prev)) ===
        JSON.stringify(HasFruitSeeds(next)),
  );
  const island = useSelector(gameService, _island);
  const biome = getCurrentBiome(island);
  const { play: harvestAudio } = useSound("harvest");
  const { play: plantAudio } = useSound("plant");
  const { play: treeFallAudio } = useSound("tree_fall");

  const hasAxes = HasAxes(inventory, game);

  const plantTree = async (item?: InventoryItemName) => {
    if (item === "Fruitful Blend" && !fertiliser) {
      fertilise();
      return;
    }

    if (
      item &&
      item in PATCH_FRUIT_SEEDS &&
      !SEASONAL_SEEDS[game.season.season].includes(
        item as PatchFruitSeedName,
      ) &&
      !isFullMoonBerry(item as PatchFruitSeedName)
    ) {
      setShowSeasonalSeed(true);
      return;
    }

    if (
      enableQuickSelect &&
      (!item || !(item in PATCH_FRUIT_SEEDS) || !inventory[item]?.gte(1))
    ) {
      setShowQuickSelect(true);
      return;
    }

    const newState = gameService.send({
      type: "fruit.planted",
      index: id,
      seed: item,
    });

    if (!newState.matches("hoarding")) {
      plantAudio();
    }
  };

  const fertilise = () => {
    gameService.send({
      type: "fruitPatch.fertilised",
      patchID: id,
      fertiliser: selectedItem,
    });
  };

  const harvestFruit = async () => {
    if (!fruitPatch) return;
    const amount =
      fruit?.amount ??
      getFruitYield({
        game,
        name: fruit?.name as PatchFruitName,
        fertiliser: fertiliser?.name,
        prngArgs: { farmId, counter: activityCount },
      }).amount;

    const newState = gameService.send({ type: "fruit.harvested", index: id });

    if (!newState.matches("hoarding")) {
      setCollectingFruit(true);
      setCollectedFruitName(fruit?.name);
      fruitHarvested.current += amount;

      harvestAudio();
      setPlayShakingAnimation(true);

      await new Promise((res) => setTimeout(res, 3000));

      setCollectingFruit(false);
      setCollectedFruitName(undefined);
      fruitHarvested.current = 0;
      setPlayShakingAnimation(false);
    }
  };

  const removeTree = async () => {
    if (!hasAxes) return;

    if (
      !isCollectibleBuilt({ name: "Foreman Beaver", game }) &&
      !game.bumpkin?.skills["No Axe No Worries"]
    )
      shortcutItem("Axe");

    const newState = gameService.send({
      type: "fruitTree.removed",
      index: id,
      selectedItem: "Axe",
    });

    if (!newState.matches("hoarding")) {
      const { woodReward } = getWoodReward({ state: game });
      setCollectingWood(true);
      setCollectedWoodAmount(woodReward);

      treeFallAudio();

      await new Promise((res) => setTimeout(res, 3000));

      setCollectingWood(false);
      setCollectedWoodAmount(undefined);
    }
  };

  return (
    <>
      <div className="w-full h-full relative">
        {/* Fruit patch soil */}
        <img
          src={FRUIT_PATCH_VARIANTS[biome]}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            left: `${PIXEL_SCALE * 1}px`,
            top: `${PIXEL_SCALE * 2}px`,
          }}
        />

        {/* Fruit tree stages */}
        <FruitTree
          plantedFruit={fruit}
          plantTree={() => plantTree(selectedItem)}
          harvestFruit={harvestFruit}
          removeTree={removeTree}
          fertilise={fertilise}
          playShakingAnimation={playShakingAnimation}
          hasAxes={hasAxes}
        />

        {/* Fertiliser */}
        {!!fertiliser && (
          <img
            className="absolute z-10 pointer-events-none"
            src={powerup}
            style={{
              width: `${PIXEL_SCALE * 5}px`,
              bottom: `${PIXEL_SCALE * 16}px`,
              right: `${PIXEL_SCALE * 2}px`,
            }}
          />
        )}

        {/* Fruit drop animation */}
        {collectingFruit && (
          <ResourceDropAnimator
            resourceName={collectedFruitName}
            resourceAmount={fruitHarvested.current}
          />
        )}

        {/* Wood drop animation */}
        {collectingWood && (
          <ResourceDropAnimator
            resourceName={"Wood"}
            resourceAmount={collectedWoodAmount}
          />
        )}
      </div>
      <Transition
        appear={true}
        show={showQuickSelect}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex bottom-20 left-10 absolute z-40"
        as="div"
      >
        <QuickSelect
          options={getKeys(PATCH_FRUIT_SEEDS)
            .filter(
              (seed) =>
                SEASONAL_SEEDS[game.season.season].includes(seed) ||
                isFullMoonBerry(seed),
            )
            .map((seed) => ({
              name: seed as InventoryItemName,
              icon: PATCH_FRUIT_SEEDS[seed].yield as InventoryItemName,
              showSecondaryImage: true,
            }))}
          onClose={() => setShowQuickSelect(false)}
          onSelected={(seed) => {
            plantTree(seed as PatchFruitSeedName);
            setShowQuickSelect(false);
          }}
          type={t("quickSelect.cropSeeds")}
          showExpanded
        />
      </Transition>

      <Modal show={showSeasonalSeed} onHide={() => setShowSeasonalSeed(false)}>
        <SeasonalSeed
          seed={selectedItem as SeedName}
          season={game.season.season}
          onClose={() => setShowSeasonalSeed(false)}
        />
      </Modal>
    </>
  );
};
