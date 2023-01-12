import React, { useContext, useState } from "react";

import close from "assets/icons/close.png";
import plus from "assets/icons/plus.png";
import chicken from "assets/resources/chicken.png";
import boxChicken from "assets/animals/chickens/box_chicken.png";

import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ANIMALS, getKeys } from "features/game/types/craftables";
import { Box } from "components/ui/Box";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getSupportedChickens } from "features/game/events/landExpansion/utils";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementLabel";

interface Props {
  onClose: () => void;
}

export const HenHouseModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  // V1 may have ones without coords
  const workingChickenCount = new Decimal(
    getKeys(state.chickens).filter(
      (index) => state.chickens[index].coordinates
    ).length
  );
  const ownedChickenCount = new Decimal(inventory.Chicken || 0);
  const lazyChickenCount = workingChickenCount.greaterThan(ownedChickenCount)
    ? new Decimal(0)
    : ownedChickenCount.minus(workingChickenCount);

  const availableSpots = getSupportedChickens(state);
  const henHouseFull = ownedChickenCount.greaterThanOrEqualTo(availableSpots);
  const workingCapacityFull =
    workingChickenCount.greaterThanOrEqualTo(availableSpots);

  const price = ANIMALS()["Chicken"].tokenAmount || new Decimal(0);
  const lessFunds = () => {
    if (price.equals(0)) return true;
    return state.balance.lessThan(price);
  };

  const canBuyChicken = !henHouseFull && !workingCapacityFull && !lessFunds();
  const canPlaceLazyChicken =
    !workingCapacityFull && lazyChickenCount.greaterThanOrEqualTo(1);

  const [selectedChicken, setSelectedChicken] = useState<
    "working" | "lazy" | "buy"
  >(canPlaceLazyChicken ? "lazy" : canBuyChicken ? "buy" : "working");

  const handleBuy = () => {
    gameService.send("EDIT", {
      placeable: "Chicken",
      action: "chicken.bought",
    });
    onClose();
  };

  const handlePlace = () => {
    gameService.send("EDIT", {
      placeable: "Chicken",
      action: "chicken.placed",
    });
    onClose();
  };

  const isSaving = gameState.matches("autosaving");

  const Details = () => {
    if (selectedChicken === "buy") {
      return (
        <>
          <div className="flex flex-col justify-center items-center p-2 pb-0 relative">
            <span className="text-center">Chicken</span>
            <img
              src={chicken}
              className="h-16 img-highlight mt-1"
              alt="chicken"
            />
            <span className="text-center mt-2 text-xs">
              Feed wheat and collect eggs
            </span>
            <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
              <RequirementLabel
                type="sfl"
                balance={state.balance}
                requirement={price}
              />
            </div>
          </div>
          <Button
            disabled={!canBuyChicken || isSaving}
            className="whitespace-nowrap"
            onClick={handleBuy}
          >
            {isSaving ? "Saving..." : "Buy"}
          </Button>
        </>
      );
    }

    if (selectedChicken === "lazy") {
      return (
        <>
          <div className="flex flex-col justify-center items-center p-2 pb-0 relative">
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
          </div>
          <Button
            className="text-xs mt-3 whitespace-nowrap"
            onClick={handlePlace}
            disabled={!canPlaceLazyChicken || isSaving}
          >
            {isSaving ? "Saving..." : "Place"}
          </Button>
        </>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center p-2 relative">
        <span className="text-center">Working Chicken</span>
        <img src={chicken} className="h-16 img-highlight mt-1" alt="chicken" />
        <span className="text-center mt-2 text-xs">
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
            style={{ maxHeight: 400 }}
          >
            <div className="flex flex-wrap">
              <Box
                isSelected={selectedChicken === "working"}
                key="working-chicken"
                count={workingChickenCount}
                onClick={() => setSelectedChicken("working")}
                image={chicken}
              />
              <Box
                isSelected={selectedChicken === "lazy"}
                key="lazy-chicken"
                count={lazyChickenCount}
                onClick={() => setSelectedChicken("lazy")}
                image={boxChicken}
              />
              <Box
                isSelected={selectedChicken === "buy"}
                key="buy-chicken"
                onClick={() => setSelectedChicken("buy")}
                image={plus}
              />
            </div>
            <div className="flex flex-col items-baseline w-full">
              <Label
                type={workingCapacityFull ? "danger" : "info"}
                className="sm:mr-auto m-1"
              >
                {`Capacity ${workingChickenCount}/${availableSpots}`}
              </Label>
              {workingCapacityFull && (
                <p className="text-xs mx-1 mb-1">
                  Build an extra Hen House to farm more chickens
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
