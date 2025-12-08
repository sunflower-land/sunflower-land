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
import { IslandType, LoveAnimalItem } from "features/game/types/game";
import { getToolPrice } from "features/game/events/landExpansion/craftTool";
import { Restock } from "../../market/restock/Restock";
import { getObjectEntries } from "features/game/expansion/lib/utils";

const isLoveAnimalTool = (
  toolName: WorkbenchToolName | LoveAnimalItem,
): toolName is LoveAnimalItem => {
  return toolName in LOVE_ANIMAL_TOOLS;
};

export const Tools: React.FC = () => {
  const [selectedName, setSelectedName] = useState<
    WorkbenchToolName | LoveAnimalItem
  >("Axe");
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
        <>
          {getObjectEntries(WORKBENCH_TOOLS)
            .filter(([, tool]) => !tool.disabled)
            .map(([toolName, tool]) => {
              const { requiredIsland } = tool;
              const isLocked = !hasRequiredIslandExpansion(
                state.island.type,
                requiredIsland,
              );

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
          {getKeys(LOVE_ANIMAL_TOOLS).map((toolName) => {
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
        </>
      }
    />
  );
};
