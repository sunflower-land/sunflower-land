import React, { useContext, useEffect, useRef, useState } from "react";
import Decimal from "decimal.js-light";

import token from "assets/icons/token_2.png";
import lightning from "assets/icons/lightning.png";
import tokenStatic from "assets/icons/token_2.png";

import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";

import { Crop, CROPS } from "features/game/types/crops";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { getSellPrice, hasSellBoost } from "features/game/expansion/lib/boosts";
import { setPrecision } from "lib/utils/formatNumber";
import { Bumpkin } from "features/game/types/game";
import { Fruit, FRUIT } from "features/game/types/fruits";

export const Crops: React.FC = () => {
  const cropsAndFruits = { ...CROPS(), ...FRUIT() };
  const [selected, setSelected] = useState<Crop | Fruit>(
    cropsAndFruits.Sunflower
  );
  const { setToast } = useContext(ToastContext);
  const [isSellAllModalOpen, showSellAllModal] = useState(false);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [isPriceBoosted, setIsPriceBoosted] = useState(false);

  const inventory = state.inventory;

  const divRef = useRef<HTMLDivElement>(null);

  const sell = (amount: Decimal) => {
    gameService.send("crop.sold", {
      crop: selected.name,
      amount: setPrecision(amount),
    });
    setToast({
      icon: tokenStatic,
      content: `+${setPrecision(displaySellPrice(selected).mul(amount))}`,
    });
  };

  const cropAmount = setPrecision(new Decimal(inventory[selected.name] || 0));
  const noCrop = cropAmount.lessThanOrEqualTo(0);
  const displaySellPrice = (crop: Crop | Fruit) =>
    getSellPrice(crop, inventory, state.bumpkin as Bumpkin);

  const handleSellOneOrLess = () => {
    const sellAmount = cropAmount.gte(1) ? new Decimal(1) : cropAmount;
    sell(sellAmount);
  };

  const handleSellTen = () => {
    sell(new Decimal(10));
  };

  const handleSellAll = () => {
    sell(cropAmount);
    showSellAllModal(false);
  };

  // ask confirmation if crop supply is greater than 1
  const openConfirmationModal = () => {
    if (cropAmount.equals(1)) {
      handleSellOneOrLess();
    } else {
      showSellAllModal(true);
    }
  };

  const closeConfirmationModal = () => {
    showSellAllModal(false);
  };

  const sellOneButtonText = () => {
    // In the case of 0 the button will be disabled
    if (cropAmount.greaterThan(1) || cropAmount.eq(0)) return "Sell 1";

    return `Sell ${cropAmount}`;
  };

  useEffect(() => {
    setIsPriceBoosted(hasSellBoost(inventory));
  }, [inventory, state.inventory]);

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className="w-full sm:w-3/5 h-fit max-h-48 sm:max-h-96 overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
        ref={divRef}
      >
        {Object.values(cropsAndFruits)
          .filter((crop) => !!crop.sellPrice)
          .map((item) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() => setSelected(item)}
              image={ITEM_DETAILS[item.name].image}
              count={inventory[item.name]}
              parentDivRef={divRef}
            />
          ))}
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center p-2 pb-0">
          <div className="flex space-x-2 justify-start mb-1 sm:items-center sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selected.name].image}
              className="w-5 object-contain sm:w-8 sm:my-1"
              alt={selected.name}
            />
            <span>{selected.name}</span>
          </div>
          <span className="text-xs sm:text-sm sm:text-center">
            {selected.description}
          </span>
          <div className="border-t border-white w-full my-2 pt-1 flex justify-between sm:flex-col sm:items-center">
            <div className="flex justify-center space-x-1 items-center sm:justify-center">
              <img src={token} className="h-4 sm:h-5" />
              {isPriceBoosted && <img src={lightning} className="h-5 sm:h-6" />}
              <span className="text-xs text-shadow text-center">
                {`${displaySellPrice(selected)}`}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-1 mb-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
          <Button
            disabled={cropAmount.eq(0)}
            className="text-xxs sm:text-xs"
            onClick={handleSellOneOrLess}
          >
            {sellOneButtonText()}
          </Button>
          <Button
            disabled={cropAmount.lessThan(10)}
            className="text-xxs sm:text-xs"
            onClick={handleSellTen}
          >
            Sell 10
          </Button>
        </div>
        <Button
          disabled={noCrop}
          className="text-xxs sm:text-xs"
          onClick={openConfirmationModal}
        >
          Sell All
        </Button>
      </OuterPanel>
      <Modal centered show={isSellAllModalOpen} onHide={closeConfirmationModal}>
        <Panel className="md:w-4/5 m-auto">
          <div className="m-auto flex flex-col">
            <span className="text-sm text-center">
              Are you sure you want to <br className="hidden md:block" />
              sell {setPrecision(cropAmount).toNumber()} {selected.name} for{" "}
              <br className="hidden md:block" />
              {parseFloat(
                displaySellPrice(selected)
                  .mul(cropAmount.toNumber())
                  .toFixed(4, Decimal.ROUND_DOWN)
              )}{" "}
              SFL?
            </span>
          </div>
          <div className="flex justify-content-around p-1">
            <Button
              disabled={noCrop}
              className="text-xs"
              onClick={handleSellAll}
            >
              Yes
            </Button>
            <Button
              disabled={noCrop}
              className="text-xs ml-2"
              onClick={closeConfirmationModal}
            >
              No
            </Button>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
