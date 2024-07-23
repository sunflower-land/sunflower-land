import React, { SyntheticEvent, useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { TREASURE_TOOLS, TreasureToolName } from "features/game/types/tools";
import { makeBulkBuyTools } from "features/island/buildings/components/building/market/lib/makeBulkBuyAmount";
import { Restock } from "features/island/buildings/components/building/market/Restock";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const TreasureShopBuy: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [selectedName, setSelectedName] =
    useState<TreasureToolName>("Sand Shovel");
  const { gameService, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const divRef = useRef<HTMLDivElement>(null);

  const stock = state.stock[selectedName] || new Decimal(0);
  const selected = TREASURE_TOOLS[selectedName];
  const inventory = state.inventory;
  const bulkToolCraftAmount = makeBulkBuyTools(stock);

  const lessFunds = (amount = 1) => {
    if (!selected.price) return;

    return state.coins < selected.price * amount;
  };
  const lessIngredients = (amount = 1) =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.mul(amount).greaterThan(inventory[name] || 0),
    );

  const craft = (event: SyntheticEvent, amount: number) => {
    event.stopPropagation();
    gameService.send("tool.crafted", {
      tool: selectedName,
      amount,
    });

    shortcutItem(selectedName);
  };

  const onToolClick = (toolName: TreasureToolName) => {
    setSelectedName(toolName);
    shortcutItem(toolName);
  };

  return (
    <SplitScreenView
      divRef={divRef}
      panel={
        <CraftingRequirements
          gameState={state}
          stock={stock}
          details={{ item: selectedName }}
          requirements={{
            coins: selected.price,
            resources: selected.ingredients,
          }}
          actionView={
            <>
              {stock.equals(0) ? (
                <Restock onClose={onClose} />
              ) : (
                <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                  <Button
                    disabled={
                      lessFunds() || lessIngredients() || stock.lessThan(1)
                    }
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
              )}
            </>
          }
        />
      }
      content={
        <>
          {getKeys(TREASURE_TOOLS).map((toolName) => {
            return (
              <Box
                isSelected={selectedName === toolName}
                key={toolName}
                onClick={() => onToolClick(toolName)}
                image={ITEM_DETAILS[toolName].image}
                count={inventory[toolName]}
              />
            );
          })}
        </>
      }
    />
  );
};
