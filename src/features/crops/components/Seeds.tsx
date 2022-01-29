import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token.png";
import timer from "assets/icons/timer.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { secondsToString } from "lib/utils/time";

import { Context } from "features/game/GameProvider";
import { Craftable } from "features/game/types/craftables";
import { CropName, CROPS, SEEDS } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from 'features/game/toast/ToastQueueProvider';

interface Props {}

export const Seeds: React.FC<Props> = ({}) => {
  const [selected, setSelected] = useState<Craftable>(SEEDS["Sunflower Seed"]);
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const buy = (amount = 1) => {
    gameService.send("item.crafted", {
      item: selected.name,
      amount,
    });
    setToast({content: "SFL -$"+(selected.price*amount)});
    shortcutItem(selected.name);
  };

  const lessFunds = (amount = 1) =>
    state.balance.lessThan(selected.price * amount);

  const cropName = selected.name.split(" ")[0] as CropName;
  const crop = CROPS[cropName];

  const Action = () => {
    const isLocked = selected.requires && !inventory[selected.requires];
    if (isLocked) {
      return <span className="text-xs mt-1 text-shadow">Locked</span>;
    }

    return (
      <>
        <Button
          disabled={lessFunds()}
          className="text-xs mt-1"
          onClick={() => buy()}
        >
          Buy 1
        </Button>
        <Button
          disabled={lessFunds(10)}
          className="text-xs mt-1"
          onClick={() => buy(10)}
        >
          Buy 10
        </Button>
      </>
    );
  };

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(SEEDS).map((item: Craftable) => (
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
          <span className="text-base text-shadow text-center">
            {selected.name}
          </span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="w-12 img-highlight mt-1"
            alt={selected.name}
          />
          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-end">
              <img src={timer} className="h-5 me-2" />
              <span className="text-xs text-shadow text-center mt-2 ">
                {secondsToString(crop.harvestSeconds)}
              </span>
            </div>
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ", {
                  "text-red-500": lessFunds(),
                })}
              >
                {`$${selected.price}`}
              </span>
            </div>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
