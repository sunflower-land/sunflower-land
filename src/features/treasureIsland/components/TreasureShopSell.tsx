import React, { useContext, useState } from "react";
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
import { TREASURE, TreasureName } from "features/game/types/treasure";
import { RequirementLabel } from "components/ui/RequirementLabel";
import { SquareIcon } from "components/ui/SquareIcon";

export const TreasureShopSell: React.FC = () => {
  const [selectedName, setSelectedName] =
    useState<TreasureName>("Sea Cucumber");

  const selected = TREASURE()[selectedName];
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const price = selected.sfl;
  const amount = inventory[selectedName] || new Decimal(0);

  const sell = (amount = 1) => {
    // gameService.send("seed.bought", {
    //   item: selectedName,
    //   amount,
    // });

    setToast({
      icon: token,
      content: `-${price?.mul(amount).toString()}`,
    });

    shortcutItem(selectedName);
  };

  const Action = () => {
    return (
      <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button
          disabled={amount.lt(1)}
          className="text-xxs sm:text-xs"
          onClick={() => sell(1)}
        >
          Sell
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {getKeys(TREASURE()).map((name: TreasureName) => (
          <Box
            isSelected={selectedName === name}
            key={name}
            onClick={() => setSelectedName(name)}
            image={ITEM_DETAILS[name].image}
            count={amount}
          />
        ))}
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <SquareIcon icon={ITEM_DETAILS[selectedName].image} width={14} />
            <span className="text-center mb-1">{selectedName}</span>
          </div>
          <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
            <RequirementLabel type="sellForSfl" requirement={price} />
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
