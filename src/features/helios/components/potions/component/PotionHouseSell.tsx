import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { EXOTIC_CROPS, ExoticCropName } from "features/game/types/beans";

export const PotionHouseSell: React.FC = () => {
  const exoticCrops = getKeys(EXOTIC_CROPS).sort((a, b) =>
    EXOTIC_CROPS[a].sellPrice.sub(EXOTIC_CROPS[b].sellPrice).toNumber()
  );

  const [selectedName, setSelectedName] = useState<ExoticCropName>(
    exoticCrops[0]
  );

  const selected = EXOTIC_CROPS[selectedName];
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const amount = inventory[selectedName] || new Decimal(0);

  const sell = (amount = 1) => {
    gameService.send("treasure.sold", {
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
            sfl: selected.sellPrice,
          }}
          actionView={
            <Button disabled={amount.lt(1)} onClick={() => sell(1)}>
              Sell
            </Button>
          }
        />
      }
      content={
        <>
          {exoticCrops.map((name: ExoticCropName) => (
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
