import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import token from "assets/icons/token.gif";
import lightning from "assets/icons/lightning.png";

import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";

import { Crop, CROPS } from "features/game/types/crops";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { getSellPrice, hasSellBoost } from "features/game/lib/boosts";

export const Plants: React.FC = () => {
  const [selected, setSelected] = useState<Crop>(CROPS().Sunflower);
  const { setToast } = useContext(ToastContext);
  const [isSellAllModalOpen, showSellAllModal] = React.useState(false);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [isPriceBoosted, setIsPriceBoosted] = useState(false);

  const inventory = state.inventory;
  const cropAmount = new Decimal(inventory[selected.name] || 0);
  const noCrop = cropAmount.equals(0);
  const displaySellPrice = (crop: Crop) => getSellPrice(crop, inventory);
  const [bulkSellAmount, setBulkSellAmount] = useState(cropAmount);

  useEffect(() => {
    setBulkSellAmount(cropAmount);
  }, [selected.name, isSellAllModalOpen]);

  const incrementBulkSellAmount = (amount: number) => {
    const newAmount = bulkSellAmount.plus(amount);
    setBulkSellAmount(
      newAmount.greaterThan(cropAmount) ? cropAmount : newAmount
    );
  };

  const decrementBulkSellAmount = (amount: number) => {
    const newAmount = bulkSellAmount.minus(amount);
    setBulkSellAmount(newAmount.lessThan(1) ? new Decimal(1) : newAmount);
  };

  const sell = (amount = 1) => {
    gameService.send("item.sell", {
      item: selected.name,
      amount,
    });
    setToast({
      content: "SFL +$" + displaySellPrice(selected).mul(amount).toString(),
    });
    // Immediately update bulkSell to prevent UI flashing between renders
    setBulkSellAmount(cropAmount.minus(amount));
  };

  const handleSellOne = () => {
    sell(1);
  };

  const handleSellAll = () => {
    sell(bulkSellAmount.toNumber());
    showSellAllModal(false);
  };

  // ask confirmation if crop supply is greater than 1
  const openConfirmationModal = () => {
    if (cropAmount.equals(1)) {
      handleSellOne();
    } else {
      showSellAllModal(true);
    }
  };

  const closeConfirmationModal = () => {
    showSellAllModal(false);
  };

  useEffect(() => {
    setIsPriceBoosted(hasSellBoost(inventory));
  }, [inventory, state.inventory]);

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(CROPS()).map((item) => (
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
          <span className="text-shadow">{selected.name}</span>
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
              {isPriceBoosted && <img src={lightning} className="h-6 me-2" />}
              <span className="text-xs text-shadow text-center mt-2 ">
                {`$${displaySellPrice(selected)}`}
              </span>
            </div>
          </div>

          <Button
            disabled={cropAmount.lessThan(1)}
            className="flex-1 text-xs mt-1 w-70"
            onClick={handleSellOne}
          >
            Sell 1
          </Button>
          <Button
            disabled={noCrop}
            className="text-xs mt-1 whitespace-nowrap"
            onClick={openConfirmationModal}
          >
            Sell All
          </Button>
        </div>
      </OuterPanel>
      <Modal centered show={isSellAllModalOpen} onHide={closeConfirmationModal}>
        <Panel className="md:w-4/5 m-auto">
          <div className="m-auto flex flex-col">
            <span className="text-sm text-center text-shadow">
              Are you sure you want to <br className="hidden md:block" />
              sell your {selected.name}?
            </span>
            <div className="flex items-center justify-center ms-1 mt-1">
              <div>
                <Button
                  disabled={bulkSellAmount.lessThanOrEqualTo(1)}
                  className="flex-1 text-xs mt-1 w-70"
                  onClick={() => decrementBulkSellAmount(1)}
                >
                  -1
                </Button>
                <Button
                  disabled={bulkSellAmount.lessThanOrEqualTo(10)}
                  className="flex-1 text-xs mt-1 w-70"
                  onClick={() => decrementBulkSellAmount(10)}
                >
                  -10
                </Button>
              </div>
              <div className="flex mx-2">
                <span className="text-sm text-center text-shadow mr-1">
                  {bulkSellAmount.toNumber()}
                </span>
                <img
                  src={ITEM_DETAILS[selected.name].image}
                  className="h-5 mr-1"
                />
              </div>
              <div>
                <Button
                  disabled={cropAmount.minus(bulkSellAmount).lessThan(1)}
                  className="flex-1 text-xs mt-1 w-70"
                  onClick={() => incrementBulkSellAmount(1)}
                >
                  +1
                </Button>
                <Button
                  disabled={cropAmount.minus(bulkSellAmount).lessThan(10)}
                  className="flex-1 text-xs mt-1 w-70"
                  onClick={() => incrementBulkSellAmount(10)}
                >
                  +10
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-end my-1">
              <span className="text-xs text-shadow text-center mt-2 ">+</span>
              <img src={token} className="h-5 mx-1" />
              <span className="text-xs text-shadow text-center mt-2 ">
                {`$${displaySellPrice(selected).mul(bulkSellAmount)}`}
              </span>
            </div>
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
