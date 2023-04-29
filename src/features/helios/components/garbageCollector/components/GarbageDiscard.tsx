import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";

import { DISCARD, DiscardName } from "features/game/types/garbage";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";

export const GarbageDiscard: React.FC = () => {
  const [selectedName, setSelectedName] = useState<DiscardName>(DISCARD[0]);

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const amount = inventory[selectedName] || new Decimal(0);

  const discard = (amount = 1) => {
    gameService.send("garbage.discarded", {
      item: selectedName,
      amount,
    });
  };

  const Action = () => {
    return (
      <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button disabled={amount.lt(1)} onClick={() => discard(1)}>
          Discard 1
        </Button>
        <Button disabled={amount.lt(10)} onClick={() => discard(10)}>
          Discard 10
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
            sfl: new Decimal(0),
          }}
          actionView={Action()}
        />
      }
      content={
        <>
          {DISCARD.map((name: DiscardName) => (
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
