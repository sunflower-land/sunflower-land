import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { BUILDINGS, BuildingName } from "features/game/types/buildings";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ITEM_ICONS } from "../inventory/Chest";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { IslandType } from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";
import {
  makeUpgradableBuildingKey,
  isBuildingUpgradable,
} from "features/game/events/landExpansion/upgradeBuilding";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { MachineState } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { GameState } from "features/game/types/game";

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
    ...(hasFeatureAccess(state, "AGING_SHED")
      ? (["Aging Shed"] as BuildingName[])
      : []),
  ];

  const VALID_BUILDINGS = [...UNSORTED_BUILDINGS].sort(
    (a, b) => BUILDINGS[a].unlocksAtLevel - BUILDINGS[b].unlocksAtLevel,
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
  const bumpkinLevel = getBumpkinLevel(bumpkin.experience ?? 0);
  const buildingUnlockLevel = buildingBlueprint.unlocksAtLevel;
  const buildingsInInventory = inventory[selectedName] || new Decimal(0);
  const isAlreadyCrafted = buildingsInInventory.greaterThanOrEqualTo(1);

  const ingredients = buildingBlueprint.ingredients.reduce(
    (acc, ingredient) => ({
      ...acc,
      [ingredient.item]: new Decimal(ingredient.amount),
    }),
    {},
  );

  const { coins, ingredients: buildingIngredients } = buildingBlueprint;

  const lessIngredients = () =>
    buildingIngredients.some((ingredient) =>
      ingredient.amount?.greaterThan(inventory[ingredient.item] || 0),
    );

  const craft = () => {
    landscapingMachine.send("SELECT", {
      action: "building.constructed",
      placeable: { name: selectedName },
      requirements: {
        coins,
        ingredients,
      },
    });

    onClose();
  };

  const getAction = () => {
    if (
      !hasRequiredIslandExpansion(island.type, buildingBlueprint.requiredIsland)
    ) {
      return (
        <Label type="danger">
          {t("islandupgrade.requiredIsland", {
            islandType:
              buildingBlueprint.requiredIsland === "spring"
                ? "Petal Paradise"
                : t("islandupgrade.otherIsland", {
                    island: capitalize(
                      buildingBlueprint.requiredIsland as IslandType,
                    ),
                  }),
          })}
        </Label>
      );
    }

    if (bumpkinLevel < buildingUnlockLevel)
      return (
        <div className="flex flex-col w-full justify-center">
          <div className="flex items-center justify-center ">
            <Label type="danger" icon={SUNNYSIDE.icons.player}>
              {t("warning.level.required", { lvl: buildingUnlockLevel })}
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
          boost={COLLECTIBLE_BUFF_LABELS[selectedName]?.({
            skills: bumpkin.skills,
            collectibles,
          })}
          requirements={{
            coins,
            resources: buildingBlueprint.ingredients.reduce(
              (acc, ingredient) => ({
                ...acc,
                [ingredient.item]: new Decimal(ingredient.amount),
              }),
              {},
            ),
          }}
          actionView={getAction()}
        />
      }
      content={
        <>
          {[...getValidBuildings(state)].map((name: BuildingName) => {
            const isLocked =
              getBumpkinLevel(bumpkin.experience ?? 0) <
              BUILDINGS[name].unlocksAtLevel;

            let secondaryIcon = undefined;
            if (isLocked) {
              secondaryIcon = SUNNYSIDE.icons.lock;
            }
            const buildingInInventory = inventory[name] || new Decimal(0);

            if (buildingInInventory.greaterThanOrEqualTo(1)) {
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
