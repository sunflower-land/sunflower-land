import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CraftableItem,
  CRAFTABLES,
  filterLimitedItemsByType,
  LimitedItem,
  LimitedItemName,
} from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ItemSupply } from "lib/blockchain/Inventory";
import { Context } from "features/game/GoblinProvider";
import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";

import token from "assets/icons/token_2.png";
import timer from "assets/icons/timer.png";
import busyGoblin from "assets/npcs/goblin_doing.gif";

import { KNOWN_IDS, LimitedItemType } from "features/game/types";
import { mintCooldown } from "./blacksmith/lib/mintUtils";
import { secondsToString } from "lib/utils/time";
import { ProgressBar } from "components/ui/ProgressBar";

const TAB_CONTENT_HEIGHT = 364;

const API_URL = CONFIG.API_URL;

interface Props {
  onClose: () => void;
  type: LimitedItemType | LimitedItemType[];
  canCraft?: boolean;
}

const Items: React.FC<{
  items: Partial<Record<LimitedItemName, LimitedItem>>;
  selected: InventoryItemName;
  inventory: GameState["inventory"];
  type: LimitedItemType | LimitedItemType[];
  onClick: (item: CraftableItem | LimitedItem) => void;
}> = ({ items, selected, inventory, onClick, type }) => {
  const ordered = Object.values(items);

  return (
    <div
      style={{
        maxHeight: TAB_CONTENT_HEIGHT,
        minHeight: (TAB_CONTENT_HEIGHT * 2) / 3,
      }}
      className="overflow-y-auto w-3/5 pt-1 mr-2 scrollable"
    >
      <div className="flex flex-wrap h-fit">
        {ordered.map((item) => (
          <Box
            isSelected={selected === item.name}
            key={item.name}
            onClick={() => onClick(item)}
            image={ITEM_DETAILS[item.name].image}
            count={inventory[item.name]}
            cooldownInProgress={
              mintCooldown({
                cooldownSeconds: item.cooldownSeconds,
                mintedAt: item.mintedAt,
              }) > 0
            }
          />
        ))}
      </div>
      {type === LimitedItemType.WarTentItem && (
        <p className="text-xxs underline mt-4">
          You can mint multiple War Skull and War Tombstones
        </p>
      )}
    </div>
  );
};
export const Rare: React.FC<Props> = ({ onClose, type, canCraft = true }) => {
  const { goblinService } = useContext(Context);
  const [
    {
      context: { state, limitedItems },
    },
  ] = useActor(goblinService);
  const [isLoading, setIsLoading] = useState(true);
  const [supply, setSupply] = useState<ItemSupply>();

  useEffect(() => {
    const load = async () => {
      const supply = API_URL
        ? await metamask.getInventory().totalSupply()
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

  const items = filterLimitedItemsByType(
    type,
    limitedItems as Record<LimitedItemName, LimitedItem>
  );

  const [selected, setSelected] = useState(Object.values(items)[0]);

  if (selected === undefined) {
    return (
      <div className="flex flex-col">
        <span>Currently Unavailable!</span>
        <span>Please try again later.</span>
      </div>
    );
  }

  // Ingredient difference≥
  const lessIngredients = (amount = 1) =>
    selected.ingredients?.some((ingredient) =>
      ingredient.amount.mul(amount).greaterThan(inventory[ingredient.item] || 0)
    );

  const lessFunds = (amount = 1) => {
    if (!selected.tokenAmount) return;

    return state.balance.lessThan(selected.tokenAmount.mul(amount));
  };

  const craft = async () => {
    goblinService.send("MINT", { item: selected.name, captcha: "" });
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

  if (supply && selected.maxSupply) {
    amountLeft = selected.maxSupply - supply[selected.name]?.toNumber();
  }

  const soldOut = amountLeft <= 0 && !selected.isPlaceholder;
  const amountOfSelectedItemInInventory =
    inventory[selected.name]?.toNumber() || 0;
  const hasItemOnFarm = amountOfSelectedItemInInventory > 0;

  const Action = () => {
    const secondsLeft = mintCooldown({
      cooldownSeconds: selected.cooldownSeconds,
      mintedAt: selected.mintedAt,
    });

    // Rare item is still in the cooldown period
    if (secondsLeft > 0) {
      return (
        <div className="mt-2 border-y border-white w-full">
          <div className="mt-2 flex items-center justify-center">
            <img src={busyGoblin} alt="not available" className="w-12" />
          </div>
          <div className="text-center">
            <p className="text-[10px] mb-2">Ready in</p>
            <p className="text-[10px]">
              <ProgressBar
                seconds={secondsLeft}
                percentage={
                  100 -
                  (secondsLeft / (selected.cooldownSeconds as number)) * 100
                }
              />
            </p>
          </div>
          <div className="my-3 text-center">
            <a
              href={`https://docs.sunflower-land.com/player-guides/rare-and-limited-items#crafting-limits`}
              className="underline text-[10px] hover:text-blue-500 mt-1 block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </div>
        </div>
      );
    }

    if (soldOut) return null;

    console.log({ selected });
    if (hasItemOnFarm && !selected.canMintMultiple)
      return (
        <div className="flex flex-col text-center mt-2 border-y border-white w-full">
          <p className="text-[10px] sm:text-sm my-2">Already minted!</p>
          <p className="text-[8px] sm:text-[10px] mb-2">
            You can only have one of each rare item on your farm at a time.
          </p>
        </div>
      );

    console.log({ selected });
    const item = CRAFTABLES()[selected.name];

    if (item.requires && !inventory[item.requires]) {
      return (
        <div className="flex items-center">
          <span className="text-xs mt-2">{`Early mint requires `}</span>
          <img src={ITEM_DETAILS[item.requires].image} className="w-8 ml-2" />
        </div>
      );
    }

    const currentDate = Date.now();
    const mintReleaseDate = selected.mintReleaseDate;
    if (
      (mintReleaseDate && mintReleaseDate > currentDate) ||
      selected.disabled
    ) {
      return <span className="text-xs mt-2">Coming soon</span>;
    }

    if (!canCraft) return;

    if ([421, 410, 417].includes(selected.id as number)) {
      return null;
    }

    return (
      <>
        <Button
          disabled={lessFunds() || lessIngredients()}
          className="text-xs mt-1"
          onClick={() => craft()}
        >
          Craft
        </Button>
      </>
    );
  };

  return (
    <div className="flex">
      <Items
        items={items}
        selected={selected.name}
        inventory={inventory}
        onClick={setSelected}
        type={type}
      />
      <OuterPanel className="flex-1 min-w-[42%] flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          {soldOut && (
            <span className="bg-error border text-xxs absolute left-0 -top-4 p-1 rounded-md">
              Sold out
            </span>
          )}
          {!!selected.maxSupply && amountLeft > 0 && (
            <span className="bg-blue-600 border  text-xxs absolute left-0 -top-4 p-1 rounded-md">
              {`${amountLeft} left`}
            </span>
          )}
          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {selected.isPlaceholder ? "?" : selected.description}
          </span>
          {canCraft && (
            <div className="border-t border-white w-full mt-2 pt-1 mb-2 text-center">
              {selected.ingredients?.map((ingredient, index) => {
                if (selected.isPlaceholder) {
                  return <span className="text-xs">?</span>;
                }

                const item = ITEM_DETAILS[ingredient.item];
                const inventoryAmount =
                  inventory[ingredient.item]?.toDecimalPlaces(1) || 0;
                const requiredAmount = ingredient.amount?.toDecimalPlaces(1);

                // Ingredient difference
                const lessIngredient = new Decimal(inventoryAmount).lessThan(
                  requiredAmount
                );

                // rendering item remenants
                const renderRemenants = () => {
                  if (lessIngredient) {
                    // if inventory items is less than required items
                    return (
                      <>
                        <span className="text-xs text-shadow text-center mt-2 text-red-500">
                          {`${inventoryAmount}`}
                        </span>
                        <span className="text-xs text-shadow text-center mt-2 text-red-500">
                          {`/${requiredAmount}`}
                        </span>
                      </>
                    );
                  } else {
                    // if inventory items is equal to required items
                    return (
                      <span className="text-xs text-shadow text-center mt-2">
                        {`${requiredAmount}`}
                      </span>
                    );
                  }
                };

                return (
                  <div
                    className="flex justify-center flex-wrap items-end"
                    key={index}
                  >
                    <img src={item.image} className="h-5 me-2" />
                    {renderRemenants()}
                  </div>
                );
              })}

              {/* SFL requirement */}
              {selected.tokenAmount?.gt(0) &&
                (selected.isPlaceholder ? (
                  <span className="text-xs">?</span>
                ) : (
                  <div className="flex justify-center items-end">
                    <img src={token} className="h-5 mr-1" />
                    <span
                      className={classNames(
                        "text-xs text-shadow text-center mt-2 ",
                        {
                          "text-red-500": lessFunds(),
                        }
                      )}
                    >
                      {`$${selected.tokenAmount?.toNumber()}`}
                    </span>
                  </div>
                ))}

              {selected.cooldownSeconds !== undefined &&
                selected.cooldownSeconds > 0 && (
                  <div className="flex justify-center items-end">
                    <img src={timer} className="h-5 mr-1" />
                    <span className="text-xs text-shadow text-center mt-2">
                      {secondsToString(selected.cooldownSeconds)}
                    </span>
                  </div>
                )}
            </div>
          )}
          {Action()}
        </div>
        <a
          href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${
            KNOWN_IDS[selected.name]
          }`}
          className="underline text-xs hover:text-blue-500 my-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Sea
        </a>
      </OuterPanel>
    </div>
  );
};
