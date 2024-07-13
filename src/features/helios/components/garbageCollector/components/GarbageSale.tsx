import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";

import { GARBAGE, GarbageName } from "features/game/types/garbage";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const GarbageSale: React.FC = () => {
  const { t } = useAppTranslation();
  // Filter out items that are not available
  const availableGarbage = getKeys(GARBAGE)
    .filter((name) => GARBAGE[name].available)
    .sort((a, b) => GARBAGE[a].sellPrice - GARBAGE[b].sellPrice);

  // Ensure the selected item is one that is available
  const [selectedName, setSelectedName] = useState<GarbageName>(
    availableGarbage[0],
  );

  const selected = GARBAGE[selectedName];
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const price = selected.sellPrice;
  const amount = inventory[selectedName] || new Decimal(0);

  const sell = (amount = 1) => {
    gameService.send("garbage.sold", {
      item: selectedName,
      amount,
    });
  };

  const Action = () => {
    return (
      <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button disabled={amount.lt(1)} onClick={() => sell(1)}>
          {t("sell.one")}
        </Button>
        <Button disabled={amount.lt(10)} onClick={() => sell(10)}>
          {t("sell.ten")}
        </Button>
      </div>
    );
  };

  return (
    <SplitScreenView
      panel={
        <ShopSellDetails
          details={{
            item: selectedName,
          }}
          properties={{
            coins: price,
          }}
          actionView={Action()}
        />
      }
      content={
        <>
          {availableGarbage.map((name: GarbageName) => (
            <Box
              isSelected={selectedName === name}
              key={name}
              onClick={() => setSelectedName(name)}
              image={ITEM_DETAILS[name].image}
              count={inventory[name] || new Decimal(0)}
            />
          ))}
        </>
      }
    />
  );
};
