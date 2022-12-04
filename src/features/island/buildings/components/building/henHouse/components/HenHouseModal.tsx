import React, { useContext, useState } from "react";

import close from "assets/icons/close.png";
import plus from "assets/icons/plus.png";
import chicken from "assets/resources/chicken.png";
import boxChicken from "assets/animals/chickens/box_chicken.png";

import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ANIMALS, getKeys } from "features/game/types/craftables";
import token from "assets/icons/token_2.png";
import { Box } from "components/ui/Box";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getBuyPrice } from "features/game/events/craft";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getSupportedChickens } from "features/game/events/landExpansion/utils";
import { Label } from "components/ui/Label";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

interface Props {
  onClose: () => void;
}

export const HenHouseModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [scrollIntoView] = useScrollIntoView();

  const inventory = state.inventory;

  const chickenCount = inventory.Chicken || new Decimal(0);

  // V1 may have ones without coords
  const placedChickenCount = getKeys(state.chickens).filter(
    (index) => state.chickens[index].coordinates
  ).length;

  const availableSpots = getSupportedChickens(state);

  const startingIndex =
    placedChickenCount === availableSpots
      ? placedChickenCount - 1
      : placedChickenCount;

  const [selectedIndex, setSelectedIndex] = useState(startingIndex);

  const price = getBuyPrice(ANIMALS()["Chicken"], inventory);

  const lessFunds = (amount = 1) => {
    if (!price) return;

    return state.balance.lessThan(price.mul(amount));
  };

  const handleBuy = () => {
    gameService.send("EDIT", {
      placeable: "Chicken",
      action: "chicken.bought",
    });
    scrollIntoView(Section.GenesisBlock);
    onClose();
  };

  const handlePlace = () => {
    gameService.send("EDIT", {
      placeable: "Chicken",
      action: "chicken.placed",
    });
    scrollIntoView(Section.GenesisBlock);
    onClose();
  };

  const Details = () => {
    const isNotPlaced =
      chickenCount.gt(selectedIndex) && selectedIndex >= placedChickenCount;

    if (isNotPlaced) {
      return (
        <div className="flex flex-col justify-center items-center p-2 relative">
          <span className="text-center">Lazy Chicken</span>
          <img
            src={boxChicken}
            className="h-16 img-highlight mt-1"
            alt="chicken"
          />
          <div className="flex mt-2 relative">
            <span className="text-center text-xs">
              Put your chicken to work to start collecting eggs!
            </span>
          </div>

          <Button
            disabled={lessFunds()}
            className="text-xxs sm:text-xs mt-3 whitespace-nowrap"
            onClick={handlePlace}
          >
            Place
          </Button>
        </div>
      );
    }

    const isNew = chickenCount.eq(selectedIndex);

    if (isNew) {
      return (
        <div className="flex flex-col justify-center items-center p-2 relative">
          <span className="text-center">Chicken</span>
          <img
            src={chicken}
            className="h-16 img-highlight mt-1"
            alt="chicken"
          />
          <span className="text-center mt-2 sm:text-sm">
            Feed wheat and collect eggs
          </span>
          <>
            <div className="border-t border-white w-full mt-2 pt-1">
              <div className="flex justify-center items-end">
                <img src={token} className="h-5 mr-1" />
                <span
                  className={classNames("text-xs text-center mt-2 ", {
                    "text-red-500": lessFunds(),
                  })}
                >
                  {`${price?.toNumber()}`}
                </span>
              </div>
            </div>
            <Button
              disabled={lessFunds()}
              className="text-xxs sm:text-xs mt-1 whitespace-nowrap"
              onClick={handleBuy}
            >
              Buy
            </Button>
          </>
        </div>
      );
    }
    return (
      <div className="flex flex-col justify-center items-center p-2 relative">
        <span className="text-center">Working Chicken</span>
        <img src={chicken} className="h-16 img-highlight mt-1" alt="chicken" />
        <span className="text-center mt-2 text-sm">
          Already placed and working hard!
        </span>
      </div>
    );
  };

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive>
          <img src={chicken} className="h-5 mr-2" />
          <span className="text-sm">Chickens</span>
        </Tab>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      <div
        style={{
          minHeight: "200px",
        }}
      >
        <div className="flex flex-col-reverse sm:flex-row">
          <div
            className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
            style={{ maxHeight: TAB_CONTENT_HEIGHT }}
          >
            <div className="flex flex-wrap">
              {new Array(availableSpots).fill(null).map((item, index) => {
                let boxImage = undefined;

                if (placedChickenCount > index) {
                  boxImage = chicken;
                }
                if (chickenCount.gt(index) && index >= placedChickenCount) {
                  boxImage = boxChicken;
                }

                if (chickenCount.eq(index)) {
                  boxImage = plus;
                }

                return (
                  <Box
                    isSelected={selectedIndex === index}
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    image={boxImage}
                    disabled={chickenCount.lt(index)}
                  />
                );
              })}
            </div>
            <div className="flex flex-col items-baseline">
              <Label
                type={placedChickenCount === availableSpots ? "danger" : "info"}
                className="sm:mr-auto m-1"
              >
                {`Capacity ${placedChickenCount}/${availableSpots}`}
              </Label>
              {chickenCount.gte(availableSpots) && (
                <p className="text-xs mx-1 mb-1">
                  Build an extra coop to farm more chickens
                </p>
              )}
            </div>
          </div>
          <OuterPanel className="w-full flex-1">{Details()}</OuterPanel>
        </div>
      </div>
    </Panel>
  );
};
