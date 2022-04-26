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
  }, [selected.name]);

  const sell = (amount = 1) => {
    gameService.send("item.sell", {
      item: selected.name,
      amount,
    });
    setToast({
      content: "SFL +$" + displaySellPrice(selected).mul(amount).toString(),
    });
  };

  const handleSellOne = () => {
    sell(1);
  };

  const handleSellAll = () => {
    sell(bulkSellAmount.toNumber());
    showSellAllModal(false);
    setBulkSellAmount(cropAmount.minus(bulkSellAmount));
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
            className="text-xs mt-1"
            onClick={handleSellOne}
          >
            Sell 1
          </Button>
          <Button
            disabled={noCrop}
            className="text-xs mt-1 whitespace-nowrap"
            onClick={openConfirmationModal}
          >
            Sell{" "}
            {bulkSellAmount.equals(cropAmount)
              ? "All"
              : bulkSellAmount.toNumber()}
          </Button>
          <div>
            <input
              className="
                form-range
                w-full
                h-6
                p-0
                bg-transparent
                focus:outline-none focus:ring-0 focus:shadow-none
                slider-thumb
              "
              onChange={(e) => {
                setBulkSellAmount(new Decimal(Number(e.target.value)));
              }}
              type="range"
              min={1}
              max={cropAmount.toNumber()}
              value={bulkSellAmount.toNumber()}
            />
          </div>
        </div>
      </OuterPanel>
      <Modal centered show={isSellAllModalOpen} onHide={closeConfirmationModal}>
        <Panel className="md:w-4/5 m-auto">
          <div className="m-auto flex flex-col">
            <span className="text-sm text-center text-shadow">
              Are you sure you want to <br className="hidden md:block" />
              sell all your {selected.name}?
            </span>
            <span className="text-sm text-center text-shadow mt-1">
              Total: {bulkSellAmount.toNumber()}
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
