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
import {
  TREASURE_COLLECTIBLE_ITEM,
  TreasureCollectibleItem,
} from "features/game/types/collectibles";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
interface ToolContentProps {
  selectedName: TreasureToolName;
  onClose: () => void;
}

const ToolContent: React.FC<ToolContentProps> = ({ onClose, selectedName }) => {
  const { t } = useAppTranslation();

  const { gameService, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

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

  return (
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
          )}
        </>
      }
    />
  );
};

interface CraftContentProps {
  selectedName: TreasureCollectibleItem;
  onClose: () => void;
}

const CraftContent: React.FC<CraftContentProps> = ({
  selectedName,
  onClose,
}) => {
  const { t } = useAppTranslation();

  const selected = TREASURE_COLLECTIBLE_ITEM[selectedName];
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0),
    );
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);
  const isBoost = TREASURE_COLLECTIBLE_ITEM[selectedName].boost;

  const craft = () => {
    gameService.send("collectible.crafted", {
      name: selectedName,
    });

    const count = inventory[selectedName]?.toNumber() ?? 1;
    gameAnalytics.trackMilestone({
      event: `Crafting:Collectible:${selectedName}${count}`,
    });

    shortcutItem(selectedName);
  };

  return (
    <CraftingRequirements
      gameState={state}
      details={{
        item: selectedName,
        from: selected.from,
        to: selected.to,
      }}
      boost={selected.boost}
      requirements={{
        resources: selected.ingredients,
        coins: selected.coins,
      }}
      actionView={
        isAlreadyCrafted && isBoost ? (
          <p className="text-xxs text-center mb-1 font-secondary">
            {t("alr.crafted")}
          </p>
        ) : (
          <Button disabled={lessIngredients()} onClick={craft}>
            {t("craft")}
          </Button>
        )
      }
    />
  );
};

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const TreasureShopBuy: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const [selectedName, setSelectedName] = useState<
    TreasureToolName | TreasureCollectibleItem
  >("Sand Shovel");
  const { gameService, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const divRef = useRef<HTMLDivElement>(null);

  const inventory = state.inventory;

  const onToolClick = (toolName: TreasureToolName) => {
    setSelectedName(toolName);
    shortcutItem(toolName);
  };

  const isTool = (
    name: TreasureToolName | TreasureCollectibleItem,
  ): name is TreasureToolName => name in TREASURE_TOOLS;

  const now = Date.now();
  const shopItems = getKeys(TREASURE_COLLECTIBLE_ITEM).filter(
    (itemName) =>
      (TREASURE_COLLECTIBLE_ITEM[itemName].from?.getTime() ?? 0) <= now &&
      (TREASURE_COLLECTIBLE_ITEM[itemName].to?.getTime() ?? Infinity) > now,
  );

  const unlimitedItems = shopItems.filter(
    (itemName) => !TREASURE_COLLECTIBLE_ITEM[itemName].to,
  );

  const limitedItems = shopItems.filter(
    (itemName) => !!TREASURE_COLLECTIBLE_ITEM[itemName].to,
  );

  const upcomingDates = new Set(
    shopItems
      .map((itemName) => TREASURE_COLLECTIBLE_ITEM[itemName])
      .reduce<Date[]>((acc, item) => (item.to ? [...acc, item.to] : acc), []),
  );

  return (
    <SplitScreenView
      divRef={divRef}
      panel={
        isTool(selectedName) ? (
          <ToolContent onClose={onClose} selectedName={selectedName} />
        ) : (
          <CraftContent onClose={onClose} selectedName={selectedName} />
        )
      }
      content={
        <>
          <div className="flex flex-wrap">
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
            {unlimitedItems.map((name) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  count={inventory[name]}
                  image={ITEM_DETAILS[name].image}
                />
              );
            })}
          </div>

          <div className="mt-2">
            {[...upcomingDates]
              .sort()
              .reverse()
              .map((date) => (
                <div className="py-2">
                  <Label
                    type="warning"
                    icon={SUNNYSIDE.icons.stopwatch}
                    className="ml-1"
                  >
                    {secondsToString(
                      Math.floor((date.getTime() - now) / 1000),
                      {
                        length: "medium",
                        isShortFormat: true,
                        removeTrailingZeros: true,
                      },
                    )}
                  </Label>
                  <div className="flex flex-wrap">
                    {limitedItems
                      .filter(
                        (itemName) =>
                          TREASURE_COLLECTIBLE_ITEM[itemName].to?.getTime() ===
                          date.getTime(),
                      )
                      .map((name) => (
                        <Box
                          isSelected={selectedName === name}
                          key={name}
                          onClick={() => setSelectedName(name)}
                          count={inventory[name]}
                          image={ITEM_DETAILS[name].image}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      }
    />
  );
};
