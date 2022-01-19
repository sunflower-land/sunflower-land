import React, { useContext, useState } from "react";

import token from "assets/icons/token.png";
import timer from "assets/icons/timer.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { Context, InventoryItemName } from "features/game/GameProvider";

import { Crop, CROPS } from "../lib/crops";
import { secondsToString } from "lib/utils/time";
import { Button } from "components/ui/Button";
import classNames from "classnames";

interface Props {}

export const Seeds: React.FC<Props> = ({}) => {
  const [selected, setSelected] = useState<Crop>(CROPS.Sunflower);

  const { state, dispatcher, shortcutItem } = useContext(Context);
  const inventory = state.inventory;

  const hasFunds = state.balance >= selected.buyPrice;

  const buy = () => {
    const seed: InventoryItemName = `${selected.name} Seed`;
    dispatcher({
      type: "seed.buy",
      seed: seed,
    });

    shortcutItem(seed);
  };

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(CROPS).map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={item.images.seed}
            count={inventory[`${item.name} Seed`]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/3">
        <div className="flex flex-col justify-center items-center p-2 ">
          <span className="text-base text-shadow text-center">{`${selected.name} Seed`}</span>
          <img
            src={selected.images.seed}
            className="w-12 img-highlight mt-1"
            alt={selected.name}
          />
          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-end">
              <img src={timer} className="h-5 me-2" />
              <span className="text-xs text-shadow text-center mt-2 ">
                {secondsToString(selected.harvestSeconds)}
              </span>
            </div>
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ", {
                  "text-red-500": !hasFunds,
                })}
              >
                {`$${selected.buyPrice}`}
              </span>
            </div>
          </div>
          <Button disabled={!hasFunds} className="text-xs mt-1" onClick={buy}>
            Buy
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
