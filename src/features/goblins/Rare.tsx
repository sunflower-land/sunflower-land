import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CraftableItem,
  LimitedItem,
  LimitedItemName,
  makeLimitedItemsByName,
} from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ItemSupply } from "lib/blockchain/Inventory";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import { Context } from "features/game/GoblinProvider";
import { metamask } from "lib/blockchain/metamask";
import { secondsToString } from "lib/utils/time";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import ReCAPTCHA from "react-google-recaptcha";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";

import token from "assets/icons/token.gif";
import { KNOWN_IDS } from "features/game/types";
import { mintCooldown } from "./blacksmith/lib/mintUtils";

const TAB_CONTENT_HEIGHT = 360;

const API_URL = CONFIG.API_URL;

interface Props {
  onClose: () => void;
  items: Partial<Record<LimitedItemName, LimitedItem>>;
  canCraft?: boolean;
}

const Items: React.FC<{
  items: Props["items"];
  selected: InventoryItemName;
  inventory: GameState["inventory"];
  onClick: (item: CraftableItem | LimitedItem) => void;
}> = ({ items, selected, inventory, onClick }) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(TAB_CONTENT_HEIGHT);

  const ordered = Object.values(items);

  return (
    <div
      ref={itemContainerRef}
      style={{
        maxHeight: TAB_CONTENT_HEIGHT,
        minHeight: (TAB_CONTENT_HEIGHT * 2) / 3,
      }}
      className={classNames("overflow-y-auto w-3/5 pt-1 mr-2", {
        scrollable: showScrollbar,
      })}
    >
      <div className="flex flex-wrap h-fit">
        {ordered.map((item) => (
          <Box
            isSelected={selected === item.name}
            key={item.name}
            onClick={() => onClick(item)}
            image={ITEM_DETAILS[item.name].image}
            count={inventory[item.name]}
          />
        ))}
      </div>
    </div>
  );
};
export const Rare: React.FC<Props> = ({ onClose, items, canCraft = true }) => {
  const { goblinService } = useContext(Context);
  const [
    {
      context: { state, limitedItems },
    },
  ] = useActor(goblinService);
  const [isLoading, setIsLoading] = useState(true);
  const [supply, setSupply] = useState<ItemSupply>();
  const [showCaptcha, setShowCaptcha] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supply = API_URL
        ? await metamask.getInventory().totalSupply()
        : ({} as ItemSupply);
      setSupply(supply);

      setIsLoading(false);
    };

    load();
  }, []);

  const inventory = state.inventory;

  const blacksmithItemsByName = makeLimitedItemsByName(items, limitedItems);

  const [selected, setSelected] = useState(
    Object.values(blacksmithItemsByName)[0]
  );

  // Ingredient difference≥
  const lessIngredients = (amount = 1) =>
    selected.ingredients?.some((ingredient) =>
      ingredient.amount.mul(amount).greaterThan(inventory[ingredient.item] || 0)
    );

  const lessFunds = (amount = 1) => {
    if (!selected.tokenAmount) return;

    return state.balance.lessThan(selected.tokenAmount.mul(amount));
  };

  const craft = () => setShowCaptcha(true);

  const onCaptchaSolved = async (token: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    goblinService.send("MINT", { item: selected.name, captcha: token });
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

  const Action = () => {
    if (soldOut) {
      return null;
    }

    console.log({ selected });

    if (
      mintCooldown({
        cooldownSeconds: selected.cooldownSeconds,
        mintedAt: selected.mintedAt,
      }) > 0
    ) {
      return (
        <div className="text-center">
          <a
            href={`https://docs.sunflower-land.com/crafting-guide/farming-and-gathering#crafting-limits`}
            className="underline text-xs hover:text-blue-500 mt-1 block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Already minted
          </a>
          <span className="text-xs text-center">
            {/* TODO: FIX THIS */}
            Available in {secondsToString(selected.cooldownSeconds || 0)}
          </span>
        </div>
      );
    }

    if (!canCraft) return;

    return (
      <>
        <Button
          disabled={lessFunds() || lessIngredients()}
          className="text-xs mt-1"
          onClick={craft}
        >
          Craft
        </Button>
      </>
    );
  };

  if (showCaptcha) {
    return (
      <>
        <ReCAPTCHA
          sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
          onChange={onCaptchaSolved}
          onExpired={() => setShowCaptcha(false)}
          className="w-full m-4 flex items-center justify-center"
        />
        <p className="text-xxs p-1 m-1 text-center">
          Crafting an item will sync your farm to the blockchain.
        </p>
      </>
    );
  }

  return (
    <div className="flex">
      <Items
        items={blacksmithItemsByName}
        selected={selected.name}
        inventory={inventory}
        onClick={setSelected}
      />
      <OuterPanel className="flex-1 min-w-[42%] flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          {soldOut && (
            <span className="bg-blue-600 text-shadow border text-xxs absolute left-0 -top-4 p-1 rounded-md">
              Sold out
            </span>
          )}
          {!!selected.maxSupply && amountLeft > 0 && (
            <span className="bg-blue-600 text-shadow border  text-xxs absolute left-0 -top-4 p-1 rounded-md">
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
            {selected.description}
          </span>
          {canCraft && (
            <div className="border-t border-white w-full mt-2 pt-1">
              {selected.ingredients?.map((ingredient, index) => {
                const item = ITEM_DETAILS[ingredient.item];
                const lessIngredient = new Decimal(
                  inventory[ingredient.item] || 0
                ).lessThan(ingredient.amount);

                return (
                  <div className="flex justify-center items-end" key={index}>
                    <img src={item.image} className="h-5 me-2" />
                    <span
                      className={classNames(
                        "text-xs text-shadow text-center mt-2 ",
                        {
                          "text-red-500": lessIngredient,
                        }
                      )}
                    >
                      {ingredient.amount.toNumber()}
                    </span>
                  </div>
                );
              })}

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
            </div>
          )}

          {Action()}
        </div>
        <a
          href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${
            KNOWN_IDS[selected.name]
          }`}
          className="underline text-xs hover:text-blue-500 mt-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Sea
        </a>
      </OuterPanel>
    </div>
  );
};
