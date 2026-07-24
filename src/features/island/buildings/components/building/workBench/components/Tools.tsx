import React, {
  type SyntheticEvent,
  useContext,
  useMemo,
  useState,
} from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import {
  type WorkbenchToolName,
  WORKBENCH_TOOLS,
  LOVE_ANIMAL_TOOLS,
  type Tool,
} from "features/game/types/tools";
import { getKeys } from "lib/object";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { makeBulkBuyTools } from "../../market/lib/makeBulkBuyAmount";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import type { IslandType, LoveAnimalItem } from "features/game/types/game";
import { getIslandName } from "features/game/types/game";
import { getToolPrice } from "features/game/events/landExpansion/craftTool";
import { Restock } from "../../market/restock/Restock";
import { getObjectEntries } from "lib/object";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import {
  computeAffordableAmount,
  planToolPurchases,
} from "../lib/planToolPurchases";
import { ToolBatchBuyModal } from "./ToolBatchBuyModal";

const isLoveAnimalTool = (
  toolName: WorkbenchToolName | LoveAnimalItem,
): toolName is LoveAnimalItem => {
  return toolName in LOVE_ANIMAL_TOOLS;
};

export const Tools: React.FC = () => {
  const [selectedName, setSelectedName] = useState<
    WorkbenchToolName | LoveAnimalItem
  >("Axe");
  const [showBatchBuy, setShowBatchBuy] = useState(false);
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

    if (
      selectedName === "Axe" &&
      state.context.state.farmActivity?.["Axe Crafted"] === amount
    ) {
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

  const maxAffordableAmount = () => {
    if (isLoveAnimalTool(selectedName)) return 0;

    return computeAffordableAmount(
      stock.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber(),
      price,
      state.coins,
      selectedIngredients,
      (name) => inventory[name] ?? new Decimal(0),
    );
  };

  const hasRequiredLevel = (tool: Tool) => {
    if (tool.requiredLevel === undefined) {
      return true;
    }

    const ascension = getAscensionLevel({
      experience: state.bumpkin.experience ?? 0,
      ascensionLevel: state.island.ascensionLevel ?? 0,
    });

    if (tool.requiredLevel) {
      return meetsLevelRequirement(ascension, tool.requiredLevel);
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
            islandType: getIslandName(selected.requiredIsland as IslandType),
          })}
        </Label>
      );
    }

    if (!hasRequiredLevel(selected)) {
      return (
        <Label type="danger" className="mx-auto">
          {t("warning.level.required", {
            lvl: selected.requiredLevel?.level ?? 0,
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
        {stock.greaterThan(bulkToolCraftAmount) &&
          (() => {
            const craftAllAmount = maxAffordableAmount();

            return (
              <Button
                disabled={craftAllAmount <= 0}
                onClick={(e) => craft(e, craftAllAmount)}
              >
                {t("craft")} {craftAllAmount}
              </Button>
            );
          })()}
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

  const buyAllEnabled = state.settings.toolShop?.buyAllEnabled ?? true;

  const buyAllPlan = useMemo(
    () =>
      planToolPurchases(state, [
        ...LAND_TOOLS.map(([toolName]) => toolName),
        ...WATER_TOOLS.map(([toolName]) => toolName),
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  return (
    <SplitScreenView
      panel={
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
          }}
          actionView={getAction()}
        />
      }
      content={
        <div className="flex flex-col w-full relative">
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
          {buyAllEnabled && (
            <div className="mt-2 mb-2">
              <Button
                disabled={LAND_TOOLS.length === 0 && WATER_TOOLS.length === 0}
                onClick={() => setShowBatchBuy(true)}
              >
                {t("tools.batchBuy")}
              </Button>
            </div>
          )}
          <ToolBatchBuyModal
            show={showBatchBuy}
            onClose={() => setShowBatchBuy(false)}
            tools={[...LAND_TOOLS, ...WATER_TOOLS]}
            settings={state.settings.toolShop?.buyAll ?? {}}
            plan={buyAllPlan}
            coins={state.coins}
          />
        </div>
      }
    />
  );
};
