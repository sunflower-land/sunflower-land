import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { ItemSupply, totalSupply } from "lib/blockchain/Inventory";
import { Context } from "features/game/GoblinProvider";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";

import {
  GoblinBlacksmithItemName,
  GOBLIN_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const API_URL = CONFIG.API_URL;

const ALLOW_MULTIPLE_MINTS: InventoryItemName[] = [
  "Heart Balloons",
  "Flamingo",
  "Blossom Tree",
  "Beach Ball",
];

interface Props {
  onClose: () => void;
}

export const GoblinBlacksmithItems: React.FC<Props> = ({ onClose }) => {
  const { goblinService } = useContext(Context);
  const [
    {
      context: { state, mintedAtTimes },
    },
  ] = useActor(goblinService);

  const itemNames = getKeys(GOBLIN_BLACKSMITH_ITEMS(state)).filter(
    (item) => !GOBLIN_BLACKSMITH_ITEMS(state)[item].disabled
  );

  const [isLoading, setIsLoading] = useState(true);
  const [supply, setSupply] = useState<ItemSupply>();
  const [selectedName, setSelectedName] = useState<GoblinBlacksmithItemName>(
    itemNames[0]
  );

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
  const { t } = useAppTranslation();
  const inventory = state.inventory;
  const selectedItem = GOBLIN_BLACKSMITH_ITEMS(state)?.[selectedName];

  if (itemNames.length === 0 || !selectedItem) {
    return (
      <div className="p-1 min-h-[200px]">{t("winner.mintTime.one")}</div>
    );
  }

  const lessIngredients = () => {
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0)
    );
  };

  const notEnoughSFL = selectedItem.sfl?.greaterThan(state.balance);

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

  const disabled =
    notEnoughSFL || lessIngredients() || selectedItem.ingredients === undefined;

  const Action = () => {
    const { t } = useAppTranslation();
    if (soldOut) return <></>;

    if (selectedItem.disabled)
      return <span className="text-xxs text-center my-1">{t("coming.soon")}</span>;

    if (inventory[selectedName] && !ALLOW_MULTIPLE_MINTS.includes(selectedName))
      return <span className="text-xxs text-center my-1">{t("alr.minted")}</span>;

    return (
      <Button disabled={disabled} onClick={craft}>
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
            sfl: selectedItem.sfl,
          }}
          actionView={Action()}
        />
      }
      content={
        <>
          {getKeys(GOBLIN_BLACKSMITH_ITEMS(state))
            .filter((name) => !GOBLIN_BLACKSMITH_ITEMS(state)?.[name]?.disabled)
            .map((name) => (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={ITEM_DETAILS[name].image}
                count={inventory[name]}
              />
            ))}
        </>
      }
    />
  );
};
