import React, { useContext, useState } from "react";

import close from "assets/icons/close.png";
import token from "assets/icons/token_2.png";
import questionMark from "assets/icons/expression_confused.png";
import grubShopIcon from "assets/bumpkins/small/hats/chef_hat.png";
import stopwatch from "assets/icons/stopwatch.png";

import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Box } from "components/ui/Box";
import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { secondsToString } from "lib/utils/time";

interface Props {
  onClose: () => void;
}

export type GrubShopOrder = {
  id: string;
  name: ConsumableName;
  sfl: Decimal;
};

// TODO - we need to store the opening and closing times for the shop
export type GrubShop = {
  opensAt: number;
  closesAt: number;
  orders: GrubShopOrder[];
};

const ORDERS: GrubShopOrder[] = [
  {
    id: "asdj123",
    name: "Boiled Egg",
    sfl: new Decimal(10),
  },
  {
    id: "asdasd",
    name: "Beetroot Cake",
    sfl: new Decimal(20),
  },
  {
    id: "3",
    name: "Sunflower Cake",
    sfl: new Decimal(20),
  },
  {
    id: "4",
    name: "Bumpkin Broth",
    sfl: new Decimal(20),
  },
  {
    id: "5",
    name: "Mashed Potato",
    sfl: new Decimal(20),
  },
  {
    id: "6",
    name: "Wheat Cake",
    sfl: new Decimal(20),
  },
  {
    id: "7",
    name: "Pumpkin Soup",
    sfl: new Decimal(20),
  },
  {
    id: "8",
    name: "Mashed Potato",
    sfl: new Decimal(20),
  },
];

const GRUB_SHOP: GrubShop = {
  opensAt: new Date("2022-10-05").getTime(),
  closesAt: new Date("2022-10-08").getTime(),
  orders: ORDERS,
};
export const GrubShopModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [selectedId, setSelectedId] = useState<string>(GRUB_SHOP.orders[0].id);

  const selected = ORDERS.find((order) => order.id === selectedId);

  const secondsLeft = (GRUB_SHOP.closesAt - Date.now()) / 1000;

  const Content = () => {
    const isClosed = GRUB_SHOP.closesAt < Date.now();
    if (isClosed) {
      return (
        <div className="text-center">
          <p>The Grub Shop is closed on Tuesdays.</p>
          <p className="mt-2 text-sm">
            Come back tomorrow to view the Grublin Orders.
          </p>
        </div>
      );
    }

    return (
      <>
        <div
          style={{
            minHeight: "200px",
          }}
        >
          <div className="flex">
            <div className="w-3/5 flex flex-wrap h-fit">
              {Object.values(GRUB_SHOP.orders).map((item, index) => (
                <Box
                  isSelected={selectedId === item.id}
                  key={item.name}
                  onClick={() => setSelectedId(item.id)}
                  image={
                    index <= 3 ? ITEM_DETAILS[item.name].image : questionMark
                  }
                  disabled={index > 3}
                  count={state.inventory[item.name]}
                />
              ))}
            </div>
            {selected && (
              <OuterPanel className="flex-1 w-1/3 relative">
                <span className="bg-blue-600 border flex text-[8px] sm:text-xxs items-center absolute -top-4 p-[3px] rounded-md whitespace-nowrap">
                  <img src={stopwatch} className="w-3 left-0 -top-4 mr-1" />
                  <span className="mt-[2px]">{`${secondsToString(
                    secondsLeft as number,
                    {
                      separator: " ",
                    }
                  )} left`}</span>
                </span>
                <div className="flex flex-col justify-center items-center p-2 ">
                  <span className="text-shadow text-center">
                    {selected.name}
                  </span>
                  <img
                    src={ITEM_DETAILS[selected.name].image}
                    className="h-16 img-highlight mt-1"
                    alt={selected.name}
                  />
                  <span className="text-shadow text-center mt-2 sm:text-sm">
                    {ITEM_DETAILS[selected.name].description}
                  </span>

                  <div className="border-t border-white w-full mt-2 pt-1">
                    <div className="flex justify-center items-end">
                      <img src={token} className="h-5 mr-1" />
                      <span className="text-xs text-shadow text-center mt-2 ">
                        {`$${selected.sfl.toNumber()}`}
                      </span>
                    </div>
                  </div>
                  <Button
                    disabled={!state.inventory[selected.name]}
                    className="text-xs mt-1"
                    onClick={console.log}
                  >
                    Sell
                  </Button>
                </div>
              </OuterPanel>
            )}
          </div>
        </div>
      </>
    );
  };
  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive>
            <img src={grubShopIcon} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Grub Shop</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      {Content()}
    </Panel>
  );
};
