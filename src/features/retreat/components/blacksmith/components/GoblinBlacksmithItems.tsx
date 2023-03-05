import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ItemSupply, totalSupply } from "lib/blockchain/Inventory";
import { Context } from "features/game/GoblinProvider";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";

import { Label } from "components/ui/Label";
import {
  GoblinBlacksmithCraftable,
  GoblinBlacksmithItemName,
  GOBLIN_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";
import { SquareIcon } from "components/ui/SquareIcon";

const TAB_CONTENT_HEIGHT = 364;

const API_URL = CONFIG.API_URL;

const ALLOW_MULTIPLE_MINTS: InventoryItemName[] = [
  "Heart Balloons",
  "Flamingo",
  "Blossom Tree",
];

interface Props {
  onClose: () => void;
}

const Items: React.FC<{
  items: Partial<Record<GoblinBlacksmithItemName, GoblinBlacksmithCraftable>>;
  selected: InventoryItemName;
  inventory: GameState["inventory"];
  onClick: (name: GoblinBlacksmithItemName) => void;
}> = ({ items, selected, inventory, onClick }) => {
  return (
    <div
      className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
      style={{ maxHeight: TAB_CONTENT_HEIGHT }}
    >
      <div className="flex flex-wrap h-fit">
        {getKeys(items)
          .filter((name) => !GOBLIN_BLACKSMITH_ITEMS[name].disabled)
          .map((name) => (
            <Box
              isSelected={selected === name}
              key={name}
              onClick={() => onClick(name)}
              image={ITEM_DETAILS[name].image}
              count={inventory[name]}
            />
          ))}
      </div>
    </div>
  );
};

export const GoblinBlacksmithItems: React.FC<Props> = ({ onClose }) => {
  const { goblinService } = useContext(Context);
  const [
    {
      context: { state, mintedAtTimes },
    },
  ] = useActor(goblinService);
  const [isLoading, setIsLoading] = useState(true);
  const [supply, setSupply] = useState<ItemSupply>();
  const [selectedName, setSelectedName] =
    useState<GoblinBlacksmithItemName>("Lady Bug");

  useEffect(() => {
    const load = async () => {
      const supply = API_URL
        ? await totalSupply(wallet.web3Provider, wallet.myAccount)
        : ({} as ItemSupply);

      console.log({ supply });
      setSupply(supply);

      setIsLoading(false);
    };

    load();

    // Every 5 seconds grab the latest supply
    const poller = window.setInterval(load, 5 * 1000);

    return () => window.clearInterval(poller);
  }, []);

  const inventory = state.inventory;

  const selected = GOBLIN_BLACKSMITH_ITEMS[selectedName];

  const lessIngredients = () => {
    return getKeys(selected.ingredients).some((ingredientName) => {
      const inventoryAmount =
        inventory[ingredientName]?.toDecimalPlaces(1) || new Decimal(0);
      const requiredAmount =
        selected.ingredients[ingredientName]?.toDecimalPlaces(1) ||
        new Decimal(0);
      return new Decimal(inventoryAmount).lessThan(requiredAmount);
    });
  };

  const craft = async () => {
    goblinService.send("MINT", { item: selectedName, captcha: "" });
    onClose();
  };

  if (isLoading) {
    return (
      <div className="h-60">
        <span className="loading">Loading</span>
      </div>
    );
  }

  let amountLeft = 0;

  if (supply && selected.supply) {
    amountLeft = selected.supply - supply[selectedName]?.toNumber();
  }

  const soldOut = amountLeft <= 0;

  const renderRemnants = (
    missingIngredients: boolean,
    inventoryAmount: Decimal,
    requiredAmount: Decimal
  ) => {
    if (missingIngredients) {
      // if inventory items is less than required items
      return (
        <Label type="danger">{`${inventoryAmount}/${requiredAmount}`}</Label>
      );
    } else {
      // if inventory items is equal to required items
      return <span className="text-xs text-center">{`${requiredAmount}`}</span>;
    }
  };

  const Action = () => {
    if (soldOut) return null;

    if (selected.disabled) {
      return <span className="text-xs text-center block">Coming soon</span>;
    }

    if (
      mintedAtTimes[selectedName] &&
      !ALLOW_MULTIPLE_MINTS.includes(selectedName)
    )
      return (
        <div className="flex flex-col text-center mt-2 border-y border-white w-full">
          <p className="text-xxs my-2">Already minted!</p>
        </div>
      );

    return (
      <>
        <Button
          disabled={lessIngredients() || selected.ingredients === undefined}
          className="text-xs mt-1"
          onClick={() => craft()}
        >
          Craft
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <Items
        items={GOBLIN_BLACKSMITH_ITEMS}
        selected={selectedName}
        inventory={inventory}
        onClick={setSelectedName}
      />
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          {soldOut && (
            <Label type="danger" className="-mt-2 mb-1">
              Sold out
            </Label>
          )}
          {!!selected.supply && amountLeft > 0 && (
            <Label type="info" className="-mt-2 mb-1">
              {`${amountLeft} left`}
            </Label>
          )}
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selectedName].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selectedName}
            />
            <span className="sm:text-center mb-1">{selectedName}</span>
          </div>
          <span className="text-xs sm:text-center mb-1">
            {selected.description}
          </span>
          {!!selected.boost && (
            <Label className="mt-1 md:text-center" type="info">
              {selected.boost}
            </Label>
          )}
          <div className="border-t border-white w-full mt-2 pt-1 text-center">
            {getKeys(selected.ingredients).map((ingredientName, index) => {
              const details = ITEM_DETAILS[ingredientName];
              const inventoryAmount =
                inventory[ingredientName]?.toDecimalPlaces(1) || new Decimal(0);
              const requiredAmount =
                selected.ingredients?.[ingredientName]?.toDecimalPlaces(1) ||
                new Decimal(0);

              // Ingredient difference
              const lessIngredient = new Decimal(inventoryAmount).lessThan(
                requiredAmount
              );

              const ingredientCount = getKeys(selected.ingredients).length + 1;

              return (
                <div
                  className={`flex items-center space-x-1 ${
                    ingredientCount > 2 ? "w-1/2" : "w-full"
                  } shrink-0 sm:justify-center my-[1px] sm:mb-1 sm:w-full`}
                  key={index}
                >
                  <SquareIcon icon={details.image} width={7} />
                  {renderRemnants(
                    lessIngredient,
                    inventoryAmount,
                    requiredAmount
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
