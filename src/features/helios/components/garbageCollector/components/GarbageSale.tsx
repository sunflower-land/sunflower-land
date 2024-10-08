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
  const garbage = getKeys(GARBAGE).sort(
    (a, b) => GARBAGE[a].sellPrice - GARBAGE[b].sellPrice,
  );

  const [selectedName, setSelectedName] = useState<GarbageName>(garbage[0]);

  const selected = GARBAGE[selectedName];
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  // Undefined if zero
  const price = selected.sellPrice || undefined;
  // Undefined if zero
  const gems = selected.gems || undefined;
  const amount = inventory[selectedName] || new Decimal(0);

  const sell = (amount = 1) => {
    gameService.send("garbage.sold", {
      item: selectedName,
      amount,
    });
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
            gems: gems,
          }}
          actionView={<Action amount={amount} sell={sell} />}
        />
      }
      content={
        <>
          {garbage.map((name: GarbageName) => (
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

const Action: React.FC<{
  amount: Decimal;
  sell: (amount?: number) => void;
}> = ({ amount, sell }) => {
  const { t } = useAppTranslation();

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
