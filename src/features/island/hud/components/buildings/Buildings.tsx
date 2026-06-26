import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { BUILDINGS, type BuildingName } from "features/game/types/buildings";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ITEM_ICONS } from "../inventory/Chest";
import {
  getAscensionLevel,
  levelRequirementToTotal,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import type { IslandType } from "features/game/types/game";
import { getIslandName } from "features/game/types/game";
import {
  makeUpgradableBuildingKey,
  isBuildingUpgradable,
} from "features/game/events/landExpansion/upgradeBuilding";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import type { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { getObjectEntries } from "lib/object";

interface Props {
  onClose: () => void;
}

const getValidBuildings = (state: GameState): BuildingName[] => {
  const UNSORTED_BUILDINGS: BuildingName[] = [
    "Kitchen",
    "Water Well",
    "Bakery",
    "Hen House",
    "Deli",
    "Smoothie Shack",
    "Toolshed",
    "Warehouse",
    "Compost Bin",
    "Turbo Composter",
    "Premium Composter",
    "Greenhouse",
    "Crop Machine",
    "Crafting Box",
    "Barn",
    "Fish Market",
    "Pet House",
    "Aging Shed",
  ];

  const VALID_BUILDINGS = [...UNSORTED_BUILDINGS].sort(
    (a, b) =>
      levelRequirementToTotal(BUILDINGS[a].unlocksAtLevel) -
      levelRequirementToTotal(BUILDINGS[b].unlocksAtLevel),
  );

  return VALID_BUILDINGS;
};

const _state = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _landscapingMachine = (state: MachineState) =>
  state.children.landscaping as MachineInterpreter;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _coinBalance = (state: MachineState) => state.context.state.coins;
const _island = (state: MachineState) => state.context.state.island;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _season = (state: MachineState) => state.context.state.season.season;

export const Buildings: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] = useState<BuildingName>("Water Well");
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const inventory = useSelector(gameService, _inventory);
  const landscapingMachine = useSelector(gameService, _landscapingMachine);
  const bumpkin = useSelector(gameService, _bumpkin);
  const coinBalance = useSelector(gameService, _coinBalance);
  const island = useSelector(gameService, _island);
  const collectibles = useSelector(gameService, _collectibles);
  const season = useSelector(gameService, _season);
  const { t } = useAppTranslation();
  const buildingBlueprint = BUILDINGS[selectedName];
  const bumpkinLevel = getAscensionLevel({
    experience: bumpkin.experience ?? 0,
    ascensionLevel: island.ascensionLevel ?? 0,
  });
  const buildingUnlockLevel = buildingBlueprint.unlocksAtLevel;
  const buildingsInInventory = inventory[selectedName] || new Decimal(0);
  const isAlreadyCrafted = buildingsInInventory.greaterThanOrEqualTo(1);

  const { coins, ingredients: buildingIngredients } = buildingBlueprint;

  const lessIngredients = () =>
    getObjectEntries(buildingIngredients).some(([ingredient, amount]) =>
      amount?.greaterThan(inventory[ingredient] || 0),
    );

  const craft = () => {
    const selection = {
      action: "building.constructed",
      placeable: { name: selectedName },
      requirements: { coins, ingredients: buildingIngredients },
    };

    // This modal lives on the main screen, not inside the landscaping HUD.
    // When already landscaping just select the building; otherwise enter
    // landscaping mode so the player can place what they crafted.
    if (landscapingMachine) {
      landscapingMachine.send("SELECT", selection);
    } else {
      gameService.send("LANDSCAPE", { ...selection, location: "farm" });
    }

    onClose();
  };

  const getAction = () => {
    if (
      !hasRequiredIslandExpansion(island.type, buildingBlueprint.requiredIsland)
    ) {
      return (
        <Label type="danger">
          {t("islandupgrade.requiredIsland", {
            islandType: getIslandName(
              buildingBlueprint.requiredIsland as IslandType,
            ),
          })}
        </Label>
      );
    }

    if (!meetsLevelRequirement(bumpkinLevel, buildingUnlockLevel))
      return (
        <div className="flex flex-col w-full justify-center">
          <div className="flex items-center justify-center ">
            <Label type="danger" icon={SUNNYSIDE.icons.player}>
              {t("warning.level.required", { lvl: buildingUnlockLevel.level })}
            </Label>
          </div>
        </div>
      );

    if (isAlreadyCrafted) {
      return (
        <p className="text-xxs text-center mb-1 font-secondary">
          {t("alr.crafted")}
        </p>
      );
    }

    return (
      <Button
        disabled={lessIngredients() || coinBalance < coins}
        onClick={craft}
      >
        {t("build")}
      </Button>
    );
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
          }}
          boost={COLLECTIBLE_BUFF_LABELS[selectedName]?.(state)}
          requirements={{
            coins,
            resources: buildingIngredients,
          }}
          actionView={getAction()}
        />
      }
      content={
        <>
          {[...getValidBuildings(state)].map((name: BuildingName) => {
            const blueprint = BUILDINGS[name];
            const inventoryCount = inventory[name] || new Decimal(0);
            const isLocked = !meetsLevelRequirement(
              bumpkinLevel,
              blueprint.unlocksAtLevel,
            );

            let secondaryIcon = undefined;
            if (isLocked) {
              secondaryIcon = SUNNYSIDE.icons.lock;
            }

            if (inventoryCount.greaterThanOrEqualTo(1)) {
              secondaryIcon = SUNNYSIDE.icons.confirm;
            }

            const hasLevel = isBuildingUpgradable(name)
              ? state[makeUpgradableBuildingKey(name)].level
              : undefined;

            const image =
              ITEM_ICONS(season, getCurrentBiome(island), hasLevel)[name] ??
              ITEM_DETAILS[name].image;

            return (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={image}
                secondaryImage={secondaryIcon}
                showOverlay={isLocked}
              />
            );
          })}
        </>
      }
    />
  );
};
