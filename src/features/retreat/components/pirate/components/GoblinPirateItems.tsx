import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { ItemSupply, totalSupply } from "lib/blockchain/Inventory";
import { Context } from "features/game/GoblinProvider";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";

import {
  GoblinPirateItemName,
  GOBLIN_PIRATE_ITEMS,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const API_URL = CONFIG.API_URL;

interface Props {
  onClose: () => void;
}

export const GoblinPirateItems: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const { goblinService } = useContext(Context);
  const [
    {
      context: { state, mintedAtTimes },
    },
  ] = useActor(goblinService);
  const [isLoading, setIsLoading] = useState(true);
  const [supply, setSupply] = useState<ItemSupply>();
  const [selectedName, setSelectedName] =
    useState<GoblinPirateItemName>("Iron Idol");

  useEffect(() => {
    const load = async () => {
      const supply = API_URL
        ? await totalSupply(wallet.web3Provider)
        : ({} as ItemSupply);

      setSupply(supply);

      setIsLoading(false);
    };

    load();

    // Every 5 seconds grab the latest supply
    const poller = window.setInterval(load, 5 * 1000);

    return () => window.clearInterval(poller);
  }, []);

  const inventory = state.inventory;
  const collectibles = state.collectibles;

  const selectedItem = GOBLIN_PIRATE_ITEMS[selectedName];

  const hasEnoughIngredients = () => {
    const missingResources = getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

    const coins = goblinService.machine.context.state.coins;
    const missingCoins = (selectedItem.coins ?? 0) > coins;

    return !missingResources && !missingCoins;
  };

  const craft = async () => {
    goblinService.send("MINT", { item: selectedName, captcha: "" });
    onClose();
  };

  if (isLoading) {
    return (
      <div className="h-60">
        <Loading />
      </div>
    );
  }

  let amountLeft = 0;

  if (supply && selectedItem.supply) {
    amountLeft = selectedItem.supply - supply[selectedName]?.toNumber();
  }

  const soldOut = amountLeft <= 0;

  const itemAmount = (name: GoblinPirateItemName) => {
    const inventoryAmount = inventory[name] ?? new Decimal(0);

    return inventoryAmount?.add(collectibles[name]?.length ?? 0);
  };

  const Action = () => {
    if (soldOut) return <></>;

    if (selectedItem.disabled) {
      return (
        <span className="text-xxs text-center my-1">{t("coming.soon")}</span>
      );
    }

    if (inventory[selectedName] || collectibles[selectedName])
      return (
        <span className="text-xxs text-center my-1">{t("alr.minted")}</span>
      );

    return (
      <Button
        disabled={
          !hasEnoughIngredients() || selectedItem.ingredients === undefined
        }
        onClick={craft}
      >
        {t("craft")}
      </Button>
    );
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          stock={new Decimal(amountLeft)}
          isLimitedItem={true}
          details={{
            item: selectedName,
          }}
          boost={selectedItem.boost}
          requirements={{
            resources: selectedItem.ingredients,
            coins: selectedItem.coins,
          }}
          actionView={Action()}
        />
      }
      content={
        <>
          {getKeys(GOBLIN_PIRATE_ITEMS)
            .filter((name) => !GOBLIN_PIRATE_ITEMS[name].disabled)
            .map((name) => (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={ITEM_DETAILS[name].image}
                count={itemAmount(name)}
              />
            ))}
        </>
      }
    />
  );
};
