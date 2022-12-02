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
import { wallet } from "lib/blockchain/wallet";
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
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";

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
      className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
      style={{ maxHeight: TAB_CONTENT_HEIGHT }}
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
        ? await wallet.getInventory().totalSupply()
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
      <div className="flex flex-col p-2">
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

  const soldOut = amountLeft <= 0;
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
            <p className="text-xxs mb-2">Ready in</p>
            <p className="text-xxs">
              <div
                className="flex item-center justify-center mt-4 mb-4"
                style={{
                  marginRight: `${PIXEL_SCALE * 15}px`,
                }}
              >
                <ProgressBar
                  seconds={secondsLeft}
                  percentage={
                    100 -
                    (secondsLeft / (selected.cooldownSeconds as number)) * 100
                  }
                  type="progress"
                  formatLength="medium"
                />
              </div>
            </p>
          </div>
          <div className="my-3 text-center">
            <a
              href={`https://docs.sunflower-land.com/player-guides/rare-and-limited-items#crafting-limits`}
              className="underline text-xxs hover:text-blue-500 mt-1 block"
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
          <p className="text-xxs my-2">Already minted!</p>
          <p className="text-xxs mb-2">
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
          disabled={
            lessFunds() ||
            lessIngredients() ||
            selected.ingredients === undefined
          }
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
        items={items}
        selected={selected.name}
        inventory={inventory}
        onClick={setSelected}
        type={type}
      />
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          {soldOut && (
            <Label type="danger" className="-mt-2 mb-1">
              Sold out
            </Label>
          )}
          {!!selected.maxSupply && amountLeft > 0 && (
            <Label type="danger" className="-mt-2 mb-1">
              {`${amountLeft} left`}
            </Label>
          )}
          <span className="text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-center mt-2 text-sm">
            {selected.description}
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
                        <span className="text-xs text-center mt-2 text-red-500">
                          {`${inventoryAmount}`}
                        </span>
                        <span className="text-xs text-center mt-2 text-red-500">
                          {`/${requiredAmount}`}
                        </span>
                      </>
                    );
                  } else {
                    // if inventory items is equal to required items
                    return (
                      <span className="text-xs text-center mt-2">
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
                      className={classNames("text-xs text-center mt-2", {
                        "text-red-500": lessFunds(),
                      })}
                    >
                      {`${selected.tokenAmount?.toNumber()}`}
                    </span>
                  </div>
                ))}

              {selected.cooldownSeconds !== undefined &&
                selected.cooldownSeconds > 0 && (
                  <div className="flex justify-center items-end">
                    <img src={timer} className="h-5 mr-1" />
                    <span className="text-xs text-center mt-2">
                      {secondsToString(selected.cooldownSeconds, {
                        length: "short",
                      })}
                    </span>
                  </div>
                )}
            </div>
          )}
          {Action()}
        </div>
        <div className="flex flex-col items-center justify-center">
          <a
            href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${
              KNOWN_IDS[selected.name]
            }`}
            className="underline text-xxs hover:text-blue-500 p-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenSea
          </a>
        </div>
      </OuterPanel>
    </div>
  );
};
