import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";

import { GARBAGE, GarbageName } from "features/game/types/garbage";
import { getGarbageSellPrice } from "features/game/events/landExpansion/garbageSold";

export const GarbageSale: React.FC = () => {
  const garbage = getKeys(GARBAGE).sort((a, b) =>
    GARBAGE[a].sellPrice.sub(GARBAGE[b].sellPrice).toNumber()
  );

  const [selectedName, setSelectedName] = useState<GarbageName>(garbage[0]);

  const selected = GARBAGE[selectedName];
  const { setToast } = useContext(ToastContext);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const price = getGarbageSellPrice(selected);
  const amount = inventory[selectedName] || new Decimal(0);

  const sell = (amount = 1) => {
    gameService.send("garbage.sold", {
      item: selectedName,
      amount,
    });

    setToast({
      icon: token,
      content: `+${price?.mul(amount).toString()}`,
    });
  };

  const Action = () => {
    return (
      <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button
          disabled={amount.lt(1)}
          className="text-xxs sm:text-xs"
          onClick={() => sell(1)}
        >
          Sell 1
        </Button>
        <Button
          disabled={amount.lt(1)}
          className="text-xxs sm:text-xs"
          onClick={() => sell(10)}
        >
          Sell 10
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {garbage.map((name: GarbageName) => (
          <Box
            isSelected={selectedName === name}
            key={name}
            onClick={() => setSelectedName(name)}
            image={ITEM_DETAILS[name].image}
            count={inventory[name] || new Decimal(0)}
          />
        ))}
      </div>
      <OuterPanel className="w-full flex flex-1 flex-col justify-between">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selectedName].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selectedName}
            />
            <span className="text-center mb-1">{selectedName}</span>
          </div>
          <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col sm:space-y-2 sm:items-center">
            <div className="flex space-x-1 justify-center items-center">
              <img src={token} className="h-4 sm:h-5" />
              <span className={classNames("text-xs text-center")}>
                {price.toNumber()}
              </span>
            </div>
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
