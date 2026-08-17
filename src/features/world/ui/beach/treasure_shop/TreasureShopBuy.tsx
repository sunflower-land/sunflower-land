import React, {
  type SyntheticEvent,
  useContext,
  useRef,
  useState,
} from "react";
import { useActor, useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { getKeys, getObjectEntries } from "lib/object";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import {
  TREASURE_TOOLS,
  type TreasureToolName,
} from "features/game/types/tools";
import { makeBulkBuyTools } from "features/island/buildings/components/building/market/lib/makeBulkBuyAmount";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  TREASURE_COLLECTIBLE_ITEM,
  type TreasureCollectibleItem,
  ARTEFACT_SHOP_KEYS,
} from "features/game/types/collectibles";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  ARTEFACT_SHOP_WEARABLES,
  type ArtefactShopWearables,
} from "features/game/types/artefactShop";
import { getChapterTicket } from "features/game/types/chapters";
import { type BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

import lightning from "assets/icons/lightning.png";
import { getToolPrice } from "features/game/events/landExpansion/craftTool";
import type { Keys } from "features/game/types/game";
import { isMobile } from "mobile-device-detect";
import { Restock } from "features/island/buildings/components/building/market/restock/Restock";
import { useNow } from "lib/utils/hooks/useNow";
import type { MachineState } from "features/game/lib/gameMachine";
import { computeAffordableAmount } from "features/island/buildings/components/building/workBench/lib/planToolPurchases";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { formatNumber } from "lib/utils/formatNumber";
import { useSound } from "lib/utils/hooks/useSound";

interface ToolContentProps {
  selectedName: TreasureToolName;
}
const _state = (state: MachineState) => state.context.state;

const ToolContent: React.FC<ToolContentProps> = ({ selectedName }) => {
  const { t } = useAppTranslation();

  const { gameService, shortcutItem } = useContext(Context);

  const state = useSelector(gameService, _state);
  const [showMaxConfirm, setShowMaxConfirm] = useState(false);

  const craftSound = useSound("craft_item");

  const stock = state.stock[selectedName] || new Decimal(0);
  const selected = TREASURE_TOOLS[selectedName];
  const inventory = state.inventory;
  const bulkToolCraftAmount = makeBulkBuyTools(stock);
  const price = getToolPrice(selected, 1, state);

  const lessFunds = (amount = 1) => {
    if (!price) return;

    return state.coins < price * amount;
  };
  const selectedIngredients = selected.ingredients(state.bumpkin.skills);
  const lessIngredients = (amount = 1) =>
    getObjectEntries(selectedIngredients).some(([name, ingredients]) =>
      ingredients?.mul(amount).greaterThan(inventory[name] || 0),
    );

  const stockAmount = stock.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();

  const maxAffordableAmount = computeAffordableAmount(
    stockAmount,
    price,
    state.coins,
    selectedIngredients,
    (name) => inventory[name] ?? new Decimal(0),
  );

  const craft = (event: SyntheticEvent, amount: number) => {
    event.stopPropagation();
    craftSound.play();
    gameService.send("tool.crafted", {
      tool: selectedName,
      amount,
    });

    shortcutItem(selectedName);
  };

  const confirmBuyMax = () => {
    craftSound.play();
    gameService.send("tool.crafted", {
      tool: selectedName,
      amount: maxAffordableAmount,
    });

    shortcutItem(selectedName);
    setShowMaxConfirm(false);
  };

  return (
    <>
      <CraftingRequirements
        gameState={state}
        stock={stock}
        details={{ item: selectedName }}
        requirements={{
          coins: price,
          resources: selectedIngredients,
        }}
        actionView={
          <>
            {stock.equals(0) ? (
              <Restock npc={"jafar"} />
            ) : (
              <div className="flex flex-col space-y-1 w-full">
                <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col">
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
                {stockAmount > bulkToolCraftAmount && (
                  <Button
                    disabled={maxAffordableAmount <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMaxConfirm(true);
                    }}
                  >
                    {t("craft")}{" "}
                    {`${maxAffordableAmount > 0 ? maxAffordableAmount : stockAmount}`}
                  </Button>
                )}
              </div>
            )}
          </>
        }
      />
      <Modal show={showMaxConfirm} onHide={() => setShowMaxConfirm(false)}>
        <CloseButtonPanel onClose={() => setShowMaxConfirm(false)}>
          <div className="flex flex-col items-center p-1">
            <p className="text-sm mb-2 text-center">
              {t("marketplace.areYouSureBulkBuy")}
            </p>
            <div className="flex items-center mb-3">
              <img
                src={ITEM_DETAILS[selectedName].image}
                className="h-8 mr-2"
              />
              <span className="text-sm">
                {maxAffordableAmount} {getTranslatedItemName(selectedName)}
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 mb-3">
              <div className="flex items-center">
                <img src={SUNNYSIDE.ui.coins} className="h-6 mr-1" />
                <span className="text-xs">
                  {formatNumber(price * maxAffordableAmount)}
                </span>
              </div>
              {getObjectEntries(selectedIngredients).map(
                ([ingredientName, ingredientAmount]) =>
                  ingredientAmount && (
                    <div key={ingredientName} className="flex items-center">
                      <img
                        src={ITEM_DETAILS[ingredientName].image}
                        className="h-6 mr-1"
                      />
                      <span className="text-xs">
                        {formatNumber(
                          ingredientAmount.mul(maxAffordableAmount),
                        )}
                      </span>
                    </div>
                  ),
              )}
            </div>
            <div className="flex w-full space-x-1">
              <Button onClick={() => setShowMaxConfirm(false)}>
                {t("cancel")}
              </Button>
              <Button
                disabled={maxAffordableAmount <= 0}
                onClick={confirmBuyMax}
              >
                {t("confirm")}
              </Button>
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

interface CollectibleContentProps {
  selectedName: TreasureCollectibleItem | Keys;
}

const CollectibleContent: React.FC<CollectibleContentProps> = ({
  selectedName,
}) => {
  const { t } = useAppTranslation();

  const selected = TREASURE_COLLECTIBLE_ITEM[selectedName];
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { inventory, pumpkinPlaza } = state;

  const craftSound = useSound("craft_item");

  const isKey = (name: TreasureCollectibleItem | Keys): name is Keys =>
    name in ARTEFACT_SHOP_KEYS;

  const keysBoughtAt =
    pumpkinPlaza.keysBought?.treasureShop[selectedName as Keys]?.boughtAt;
  const keysBoughtToday =
    !!keysBoughtAt &&
    new Date(keysBoughtAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);
  const keysAmountBoughtToday = keysBoughtToday ? 1 : 0;

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0),
    );
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);
  const isBoost = COLLECTIBLE_BUFF_LABELS[selectedName]?.(state);

  const craft = () => {
    craftSound.play();
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
      boost={isBoost}
      requirements={{
        resources: selected.ingredients,
        coins: selected.coins,
      }}
      actionView={
        <>
          {isKey(selectedName) && (
            <div
              className={`flex mb-1 ${
                isMobile ? "items-left" : "justify-center items-center"
              }`}
            >
              <Label type={keysBoughtToday ? "danger" : "default"}>
                {t("keys.dailyLimit", { keysAmountBoughtToday })}
              </Label>
            </div>
          )}
          {isAlreadyCrafted && isBoost ? (
            <p className="text-xxs text-center mb-1 font-secondary">
              {t("alr.crafted")}
            </p>
          ) : (
            <Button
              disabled={
                lessIngredients() || (isKey(selectedName) && keysBoughtToday)
              }
              onClick={craft}
            >
              {t("craft")}
            </Button>
          )}
        </>
      }
    />
  );
};

interface WearableContentProps {
  selectedName: keyof ArtefactShopWearables;
}

const WearableContent: React.FC<WearableContentProps> = ({ selectedName }) => {
  const { t } = useAppTranslation();
  const now = useNow();
  const ticket = getChapterTicket(now);

  const selected = ARTEFACT_SHOP_WEARABLES[selectedName];
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const inventory = state.inventory;
  const wardrobe = state.wardrobe;

  const buySound = useSound("coins_spend");

  if (!selected) return null;

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0),
    );
  const isAlreadyCrafted = (wardrobe[selectedName] ?? 0) >= 1;
  const isBoost = BUMPKIN_ITEM_BUFF_LABELS[selectedName];

  const craft = () => {
    buySound.play();
    gameService.send("wearable.bought", {
      name: selectedName,
    });

    if (selected.ingredients["Gem"]) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: selected.ingredients["Gem"].toNumber() ?? 1,
        item: selectedName,
        type: "Wearable",
      });
    }

    if (selected.ingredients[ticket]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount: selected.ingredients[ticket]?.toNumber() ?? 1,
        item: selectedName,
        type: "Wearable",
      });
    }
  };

  return (
    <CraftingRequirements
      gameState={state}
      details={{
        wearable: selectedName,
        from: selected.from,
        to: selected.to,
      }}
      boost={isBoost}
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

type ArtefactShopItems =
  | TreasureToolName
  | TreasureCollectibleItem
  | BumpkinItem
  | Keys;

export const TreasureShopBuy: React.FC = () => {
  const { t } = useAppTranslation();

  const [selectedName, setSelectedName] =
    useState<ArtefactShopItems>("Sand Shovel");
  const { gameService, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const divRef = useRef<HTMLDivElement>(null);

  const inventory = state.inventory;
  const wardobe = state.wardrobe;

  const onToolClick = (toolName: TreasureToolName) => {
    setSelectedName(toolName);
    shortcutItem(toolName);
  };

  const isTool = (name: ArtefactShopItems): name is TreasureToolName =>
    name in TREASURE_TOOLS;

  const isCollectible = (
    name: ArtefactShopItems,
  ): name is TreasureCollectibleItem => name in TREASURE_COLLECTIBLE_ITEM;

  const isKey = (name: ArtefactShopItems): name is Keys =>
    name in ARTEFACT_SHOP_KEYS;

  const now = useNow();
  const shopCollectibles = getKeys(TREASURE_COLLECTIBLE_ITEM).filter(
    (itemName) =>
      (TREASURE_COLLECTIBLE_ITEM[itemName].from?.getTime() ?? 0) <= now &&
      (TREASURE_COLLECTIBLE_ITEM[itemName].to?.getTime() ?? Infinity) > now,
  );

  const unlimitedCollectibles = shopCollectibles.filter(
    (itemName) =>
      !TREASURE_COLLECTIBLE_ITEM[itemName].to &&
      !(itemName in ARTEFACT_SHOP_KEYS),
  );

  const limitedCollectibles = shopCollectibles.filter(
    (itemName) => !!TREASURE_COLLECTIBLE_ITEM[itemName].to,
  );

  const shopWearables = getKeys(ARTEFACT_SHOP_WEARABLES).filter(
    (itemName) =>
      (ARTEFACT_SHOP_WEARABLES[itemName]?.from?.getTime() ?? 0) <= now &&
      (ARTEFACT_SHOP_WEARABLES[itemName]?.to?.getTime() ?? Infinity) > now,
  );
  const unlimitedWearables = shopWearables.filter(
    (itemName) => !ARTEFACT_SHOP_WEARABLES[itemName]?.to,
  );

  const limitedWearables = shopWearables.filter(
    (itemName) => !!ARTEFACT_SHOP_WEARABLES[itemName]?.to,
  );

  const unlimitedKeys = getKeys(ARTEFACT_SHOP_KEYS);

  return (
    <SplitScreenView
      divRef={divRef}
      panel={
        isTool(selectedName) ? (
          <ToolContent selectedName={selectedName} />
        ) : isCollectible(selectedName) || isKey(selectedName) ? (
          <CollectibleContent selectedName={selectedName} />
        ) : (
          <WearableContent selectedName={selectedName} />
        )
      }
      content={
        <div className="flex flex-col w-full">
          <Label type="default">{t("tools")}</Label>
          <div className="flex flex-wrap mb-2">
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
          </div>

          <Label type="default">{t("collectibles")}</Label>
          <div className="flex flex-wrap mb-2">
            {limitedCollectibles.map((name) => (
              <Box
                isSelected={selectedName === name}
                secondaryImage={SUNNYSIDE.icons.stopwatch}
                alternateIcon={
                  COLLECTIBLE_BUFF_LABELS[name]?.(state) ? lightning : undefined
                }
                key={name}
                onClick={() => setSelectedName(name)}
                count={inventory[name]}
                image={ITEM_DETAILS[name].image}
              />
            ))}
            {unlimitedCollectibles.map((name) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  alternateIcon={
                    COLLECTIBLE_BUFF_LABELS[name]?.(state)
                      ? lightning
                      : undefined
                  }
                  onClick={() => setSelectedName(name)}
                  count={inventory[name]}
                  image={ITEM_DETAILS[name].image}
                />
              );
            })}
          </div>

          <Label type="default">{t("wearables")}</Label>
          <div className="flex flex-wrap mb-2">
            {limitedWearables.map((name) => (
              <Box
                isSelected={selectedName === name}
                secondaryImage={SUNNYSIDE.icons.stopwatch}
                alternateIcon={
                  BUMPKIN_ITEM_BUFF_LABELS[name] ? lightning : undefined
                }
                key={name}
                onClick={() => setSelectedName(name)}
                count={new Decimal(wardobe[name] ?? 0)}
                image={getImageUrl(ITEM_IDS[name])}
              />
            ))}
            {unlimitedWearables.map((name) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  count={new Decimal(wardobe[name] ?? 0)}
                  image={getImageUrl(ITEM_IDS[name])}
                  alternateIcon={
                    BUMPKIN_ITEM_BUFF_LABELS[name] ? lightning : undefined
                  }
                />
              );
            })}
          </div>
          <Label type="default">{t("keys")}</Label>
          <div className="flex flex-wrap mb-2">
            {unlimitedKeys.map((name) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  alternateIcon={
                    COLLECTIBLE_BUFF_LABELS[name]?.(state)
                      ? lightning
                      : undefined
                  }
                  onClick={() => setSelectedName(name)}
                  count={inventory[name]}
                  image={ITEM_DETAILS[name].image}
                />
              );
            })}
          </div>
        </div>
      }
    />
  );
};
