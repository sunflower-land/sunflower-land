import React, { SyntheticEvent, useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import {
  WorkbenchToolName,
  WORKBENCH_TOOLS,
  LOVE_ANIMAL_TOOLS,
  Tool,
} from "features/game/types/tools";
import { getKeys } from "features/game/types/craftables";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { makeBulkBuyTools } from "../../market/lib/makeBulkBuyAmount";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { capitalize } from "lib/utils/capitalize";
import {
  BoostName,
  GameState,
  IslandType,
  LoveAnimalItem,
} from "features/game/types/game";
import { getToolPrice } from "features/game/events/landExpansion/craftTool";
import { Restock } from "../../market/restock/Restock";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { getBumpkinLevel } from "features/game/lib/level";
import { getTreeRecoveryTimeForDisplay } from "features/game/events/landExpansion/chop";
import { getStoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/stoneMine";
import { getIronRecoveryTimeForDisplay } from "features/game/events/landExpansion/ironMine";
import { getGoldRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineGold";
import { getCrimstoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineCrimstone";
import { getSunstoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineSunstone";
import { getOilRecoveryTimeForDisplay } from "features/game/events/landExpansion/drillOilReserve";
import { translate } from "lib/i18n/translate";

type RecoveryEntry = {
  resourceLabel?: string;
  getRecovery: (game: GameState) => {
    baseTimeMs: number;
    recoveryTimeMs: number;
    boostsUsed: {
      name: BoostName;
      value: string;
    }[];
  };
};

const TOOL_RECOVERY_ENTRIES: Partial<
  Record<WorkbenchToolName, RecoveryEntry[]>
> = {
  Axe: [
    {
      resourceLabel: translate("resource.treeRecoveryTime"),
      getRecovery: (game) => getTreeRecoveryTimeForDisplay({ game }),
    },
  ],
  Pickaxe: [
    {
      resourceLabel: translate("resource.stoneRecoveryTime"),
      getRecovery: (game) => getStoneRecoveryTimeForDisplay({ game }),
    },
  ],
  "Stone Pickaxe": [
    {
      resourceLabel: translate("resource.ironRecoveryTime"),
      getRecovery: (game) => getIronRecoveryTimeForDisplay({ game }),
    },
  ],
  "Iron Pickaxe": [
    {
      resourceLabel: translate("resource.goldRecoveryTime"),
      getRecovery: (game) => getGoldRecoveryTimeForDisplay({ game }),
    },
  ],
  "Gold Pickaxe": [
    {
      resourceLabel: translate("resource.crimstoneRecoveryTime"),
      getRecovery: (game) => getCrimstoneRecoveryTimeForDisplay({ game }),
    },
    {
      resourceLabel: translate("resource.sunstoneRecoveryTime"),
      getRecovery: (game) => getSunstoneRecoveryTimeForDisplay(game),
    },
  ],
  "Oil Drill": [
    {
      resourceLabel: translate("resource.oilRecoveryTime"),
      getRecovery: (game) => getOilRecoveryTimeForDisplay({ game }),
    },
  ],
};

const isLoveAnimalTool = (
  toolName: WorkbenchToolName | LoveAnimalItem,
): toolName is LoveAnimalItem => {
  return toolName in LOVE_ANIMAL_TOOLS;
};

export const Tools: React.FC = () => {
  const [selectedName, setSelectedName] = useState<
    WorkbenchToolName | LoveAnimalItem
  >("Axe");
  const [showTimeBoosts, setShowTimeBoosts] = useState<string | boolean | null>(
    null,
  );
  const { gameService, shortcutItem } = useContext(Context);

  const state = useSelector(gameService, (state) => state.context.state);

  const selected = isLoveAnimalTool(selectedName)
    ? LOVE_ANIMAL_TOOLS[selectedName]
    : WORKBENCH_TOOLS[selectedName];

  const inventory = state.inventory;
  const price = getToolPrice(selected, 1, state);

  const selectedIngredients = selected.ingredients(state.bumpkin.skills);

  const lessIngredients = (amount = 1) =>
    getObjectEntries(selectedIngredients).some(([name, ingredients]) =>
      ingredients?.mul(amount).greaterThan(inventory[name] || 0),
    );

  const lessFunds = (amount = 1) => {
    if (!price) return;

    return state.coins < price * amount;
  };

  const onToolClick = (toolName: WorkbenchToolName | LoveAnimalItem) => {
    setSelectedName(toolName);
    shortcutItem(toolName);
  };

  const craft = (event: SyntheticEvent, amount: number) => {
    event.stopPropagation();
    const state = gameService.send("tool.crafted", {
      tool: selectedName,
      amount,
    });

    if (state.context.state.farmActivity?.["Axe Crafted"] === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:AxeCrafted:Completed",
      });
    }

    shortcutItem(selectedName);
  };

  const craftAnimalTool = (event: SyntheticEvent, amount: number) => {
    event.stopPropagation();
    gameService.send("tool.crafted", {
      tool: selectedName,
      amount,
    });
    shortcutItem(selectedName);
  };

  const stock = state.stock[selectedName] || new Decimal(0);

  const bulkToolCraftAmount = makeBulkBuyTools(stock);
  const { t } = useAppTranslation();

  const hasRequiredLevel = (tool: Tool) => {
    if (tool.requiredLevel === undefined) {
      return true;
    }

    const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);

    if (tool.requiredLevel) {
      return bumpkinLevel >= tool.requiredLevel;
    }

    return true;
  };

  const getAction = () => {
    if (isLoveAnimalTool(selectedName)) {
      return (
        <Button
          disabled={
            (inventory[selectedName] ?? new Decimal(0)).gte(1) || lessFunds()
          }
          onClick={(e) => craftAnimalTool(e, 1)}
          className="w-full"
        >
          {t("craft")}
        </Button>
      );
    }

    if (
      !hasRequiredIslandExpansion(state.island.type, selected.requiredIsland)
    ) {
      return (
        <Label type="danger">
          {t("islandupgrade.requiredIsland", {
            islandType:
              selected.requiredIsland === "spring"
                ? "Petal Paradise"
                : t("islandupgrade.otherIsland", {
                    island: capitalize(selected.requiredIsland as IslandType),
                  }),
          })}
        </Label>
      );
    }

    if (!hasRequiredLevel(selected)) {
      return (
        <Label type="danger" className="mx-auto">
          {t("warning.level.required", {
            lvl: selected.requiredLevel ?? 0,
          })}
        </Label>
      );
    }

    if (stock.equals(0)) {
      return <Restock npc={"blacksmith"} />;
    }

    return (
      <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
        <Button
          disabled={lessFunds() || lessIngredients() || stock.lessThan(1)}
          onClick={(e) => craft(e, 1)}
        >
          {t("craft")} {"1"}
        </Button>
        {bulkToolCraftAmount > 1 && (
          <Button
            disabled={
              lessFunds(bulkToolCraftAmount) ||
              lessIngredients(bulkToolCraftAmount)
            }
            onClick={(e) => craft(e, bulkToolCraftAmount)}
          >
            {t("craft")} {bulkToolCraftAmount}
          </Button>
        )}
      </div>
    );
  };

  const LAND_TOOLS = getObjectEntries(WORKBENCH_TOOLS).filter(
    ([, tool]) => !tool.disabled && tool.type === "land",
  );

  const WATER_TOOLS = getObjectEntries(WORKBENCH_TOOLS).filter(
    ([, tool]) => !tool.disabled && tool.type === "water",
  );

  const ANIMAL_TOOLS = getKeys(LOVE_ANIMAL_TOOLS);

  const recoveryEntries =
    !isLoveAnimalTool(selectedName) && selectedName in TOOL_RECOVERY_ENTRIES
      ? TOOL_RECOVERY_ENTRIES[
          selectedName as keyof typeof TOOL_RECOVERY_ENTRIES
        ]
      : undefined;

  return (
    <SplitScreenView
      panel={
        <div className="flex flex-col">
          <CraftingRequirements
            gameState={state}
            stock={isLoveAnimalTool(selectedName) ? undefined : stock}
            details={{
              item: selectedName,
            }}
            limit={isLoveAnimalTool(selectedName) ? 1 : undefined}
            requirements={{
              coins: price,
              resources: selectedIngredients,
              ...(recoveryEntries &&
                recoveryEntries.length > 0 && {
                  timeRequirements: recoveryEntries.map(
                    ({ resourceLabel, getRecovery }) => {
                      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
                        getRecovery(state);
                      return {
                        resourceLabel,
                        timeSeconds: recoveryTimeMs / 1000,
                        baseTimeSeconds: baseTimeMs / 1000,
                        timeBoostsUsed: boostsUsed,
                      };
                    },
                  ),
                }),
            }}
            showTimeBoosts={showTimeBoosts}
            setShowTimeBoosts={setShowTimeBoosts}
            timeRequirementsContextKey={selectedName}
            actionView={getAction()}
          />
        </div>
      }
      content={
        <div className="flex flex-col">
          <Label type="default" className="mb-1.5">
            {t("landTools")}
          </Label>
          <div className="flex flex-wrap mb-2">
            {LAND_TOOLS.map(([toolName, tool]) => {
              const { requiredIsland } = tool;
              const isLocked =
                !hasRequiredIslandExpansion(
                  state.island.type,
                  requiredIsland,
                ) || !hasRequiredLevel(tool);

              return (
                <Box
                  isSelected={selectedName === toolName}
                  key={toolName}
                  onClick={() => onToolClick(toolName)}
                  image={ITEM_DETAILS[toolName].image}
                  count={inventory[toolName]}
                  secondaryImage={isLocked ? SUNNYSIDE.icons.lock : undefined}
                  showOverlay={isLocked}
                />
              );
            })}
          </div>
          <Label type="default" className="mb-1.5">
            {t("waterTools")}
          </Label>
          <div className="flex flex-wrap mb-2">
            {WATER_TOOLS.map(([toolName, tool]) => {
              const { requiredIsland } = tool;
              const isLocked =
                !hasRequiredIslandExpansion(
                  state.island.type,
                  requiredIsland,
                ) || !hasRequiredLevel(tool);

              return (
                <Box
                  isSelected={selectedName === toolName}
                  key={toolName}
                  onClick={() => onToolClick(toolName)}
                  image={ITEM_DETAILS[toolName].image}
                  count={inventory[toolName]}
                  secondaryImage={isLocked ? SUNNYSIDE.icons.lock : undefined}
                  showOverlay={isLocked}
                />
              );
            })}
          </div>

          <Label type="default" className="mb-1.5">
            {t("animalTools")}
          </Label>
          <div className="flex flex-wrap mb-2">
            {ANIMAL_TOOLS.map((toolName) => {
              return (
                <Box
                  isSelected={selectedName === toolName}
                  key={toolName}
                  image={ITEM_DETAILS[toolName].image}
                  onClick={() => onToolClick(toolName)}
                  count={inventory[toolName]}
                />
              );
            })}
          </div>
        </div>
      }
    />
  );
};
