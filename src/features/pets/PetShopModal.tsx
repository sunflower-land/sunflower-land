import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/lib/crafting";
import { GameState, Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { PET_SHOP_ITEMS, PetShopItemName } from "features/game/types/petShop";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

export const PetShopModal: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<PetShopItemName>(
    getKeys(PET_SHOP_ITEMS)[0],
  );
  const selectedItemDetails = PET_SHOP_ITEMS[selectedItem];
  const { gameService } = useContext(Context);
  const gameState = useSelector(gameService, (state) => state.context.state);
  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );
  const coinBalance = useSelector(
    gameService,
    (state) => state.context.state.coins,
  );
  const craftedCount = useSelector(
    gameService,
    (state) =>
      state.context.state.bumpkin.activity[`${selectedItem} Crafted`] ?? 0,
  );
  const { ingredients, coins, limit, inventoryLimit } = selectedItemDetails;

  const hasReachedInventoryLimit =
    !!inventoryLimit && (inventory[selectedItem]?.gte(inventoryLimit) ?? false);

  const canBuy = () => {
    if (coinBalance < (coins ?? 0)) return false;

    if (limit && craftedCount >= limit) return false;

    if (hasReachedInventoryLimit) return false;

    const hasIngredients = getObjectEntries(ingredients).every(
      ([name, amount]) => {
        const hasAmount = inventory[name]?.greaterThan(amount ?? 0) ?? false;
        return hasAmount;
      },
    );

    return hasIngredients;
  };

  const buy = () => {
    gameService.send("collectible.crafted", {
      name: selectedItem,
    });
  };

  return (
    <SplitScreenView
      panel={
        <PetShopPanel
          gameState={gameState}
          selectedItem={selectedItem}
          ingredients={ingredients}
          coins={coins ?? 0}
          canBuy={canBuy}
          onClick={buy}
          craftedCount={craftedCount}
          limit={limit}
          hasReachedInventoryLimit={hasReachedInventoryLimit}
        />
      }
      content={
        <PetShopContent
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          inventory={inventory}
        />
      }
    />
  );
};

const PetShopContent: React.FC<{
  selectedItem: PetShopItemName;
  setSelectedItem: (item: PetShopItemName) => void;
  inventory: Inventory;
}> = ({ selectedItem, setSelectedItem, inventory }) => (
  <div className="flex flex-wrap">
    {getKeys(PET_SHOP_ITEMS).map((name) => (
      <Box
        key={name}
        image={ITEM_DETAILS[name].image}
        isSelected={selectedItem === name}
        onClick={() => setSelectedItem(name)}
        count={inventory[name]}
      />
    ))}
  </div>
);

const PetShopPanel: React.FC<{
  gameState: GameState;
  selectedItem: PetShopItemName;
  ingredients: Inventory;
  coins: number;
  canBuy: () => boolean;
  onClick: () => void;
  limit?: number;
  craftedCount: number;
  hasReachedInventoryLimit: boolean;
}> = ({
  gameState,
  selectedItem,
  ingredients,
  coins,
  canBuy,
  onClick,
  limit,
  craftedCount,
  hasReachedInventoryLimit,
}) => (
  <CraftingRequirements
    gameState={gameState}
    details={{ item: selectedItem }}
    requirements={{
      resources: ingredients,
      coins,
    }}
    actionView={
      <PetShopActionView
        limit={limit}
        craftedCount={craftedCount}
        canBuy={canBuy}
        onClick={onClick}
        hasReachedInventoryLimit={hasReachedInventoryLimit}
      />
    }
  />
);

const PetShopActionView: React.FC<{
  limit?: number;
  craftedCount: number;
  canBuy: () => boolean;
  onClick: () => void;
  hasReachedInventoryLimit: boolean;
}> = ({ limit, craftedCount, canBuy, onClick, hasReachedInventoryLimit }) => {
  const { t } = useAppTranslation();

  if (hasReachedInventoryLimit) {
    return <p className="text-xxs text-center">{`Inventory Limit Reached!`}</p>;
  }

  return (
    <div className="flex flex-col sm:items-center gap-2">
      {limit && (
        <Label type="danger">{`Limit: ${craftedCount}/${limit}`}</Label>
      )}
      <Button disabled={!canBuy()} onClick={onClick}>
        {t("buy")}
      </Button>
    </div>
  );
};
