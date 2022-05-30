import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";

import token from "assets/icons/token.gif";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";

import { useActor } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CAKES, Craftable } from "features/game/types/craftables";

export const Cakes: React.FC = () => {
  const [selected, setSelected] = useState<Craftable>(
    CAKES()["Sunflower Cake"]
  );
  const { setToast } = useContext(ToastContext);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const sell = (amount = 1) => {
    gameService.send("item.sell", {
      item: selected.name,
      amount,
    });
    setToast({
      content: "SFL +$" + selected.sellPrice?.mul(amount).toString(),
    });
  };

  const handleSellOne = () => {
    sell(1);
  };

  const amount = new Decimal(inventory[selected.name] || 0);

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(CAKES()).map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={ITEM_DETAILS[item.name].image}
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/3">
        <div className="flex flex-col justify-center items-center p-2 ">
          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="w-8 sm:w-12"
            alt={selected.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {selected.description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span className="text-xs text-shadow text-center mt-2 ">
                {`$${selected.sellPrice}`}
              </span>
            </div>
          </div>
          <Button
            disabled={amount.lessThan(1)}
            className="text-xs mt-1"
            onClick={handleSellOne}
          >
            Sell
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
