import React, { SyntheticEvent, useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { TreasureToolName, TREASURE_TOOLS } from "features/game/types/tools";
import { getKeys } from "features/game/types/craftables";
import { Restock } from "features/island/buildings/components/building/market/Restock";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

const BUY_AMOUNT = 1;

export const TreasureShopBuy: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] =
    useState<TreasureToolName>("Sand Shovel");
  const { gameService, shortcutItem } = useContext(Context);
  const { t } = useAppTranslation();
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const selected = TREASURE_TOOLS[selectedName];
  const inventory = state.inventory;

  const price = selected.price * BUY_AMOUNT ?? 0;

  const lessIngredients = (amount = BUY_AMOUNT) =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.mul(amount).greaterThan(inventory[name] || 0)
    );

  const lessFunds = (amount = BUY_AMOUNT) => {
    if (!price) return;

    return state.coins < price * amount;
  };

  const onToolClick = (seedName: TreasureToolName) => {
    setSelectedName(seedName);
    shortcutItem(seedName);
  };

  const craft = (event: SyntheticEvent, amount = BUY_AMOUNT) => {
    event.stopPropagation();
    gameService.send("tool.crafted", {
      tool: selectedName,
      amount,
    });

    shortcutItem(selectedName);
  };

  const Action = () => {
    if (stock?.equals(0)) {
      return <Restock onClose={onClose} />;
    }

    return (
      <>
        <Button
          disabled={
            lessFunds() || lessIngredients() || stock?.lessThan(BUY_AMOUNT)
          }
          onClick={(e) => craft(e)}
        >
          {t("craft")}
        </Button>
      </>
    );
  };

  const stock = state.stock[selectedName] || new Decimal(0);

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          stock={stock}
          details={{
            item: selectedName,
          }}
          requirements={{ coins: price, resources: selected.ingredients }}
          actionView={Action()}
        />
      }
      content={
        <>
          {getKeys(TREASURE_TOOLS).map((toolName) => (
            <Box
              isSelected={selectedName === toolName}
              key={toolName}
              onClick={() => onToolClick(toolName)}
              image={ITEM_DETAILS[toolName].image}
              count={inventory[toolName]}
            />
          ))}
        </>
      }
    />
  );
};
