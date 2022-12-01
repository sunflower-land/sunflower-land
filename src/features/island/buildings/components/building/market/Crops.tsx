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
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

export const Crops: React.FC = () => {
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

  const cropAmount = new Decimal(inventory[selected.name] || 0);
  const noCrop = cropAmount.lessThanOrEqualTo(0);
  const displaySellPrice = (crop: Crop) =>
    getSellPrice(crop, inventory, state.bumpkin as Bumpkin);

  const handleSellOneOrLess = () => {
    const sellAmount = cropAmount.gte(1) ? new Decimal(1) : cropAmount;
    sell(sellAmount);
  };
  const handleSellTenOrLess = () => {
    const sellAmount = cropAmount.gte(10) ? new Decimal(10) : cropAmount;
    sell(sellAmount);
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

  useEffect(() => {
    setIsPriceBoosted(hasSellBoost(inventory, state.bumpkin as Bumpkin));
  }, [inventory, state.inventory]);

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        ref={divRef}
      >
        {Object.values(CROPS())
          .filter((crop) => !!crop.sellPrice)
          .map((item) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() => setSelected(item)}
              image={ITEM_DETAILS[item.name].image}
              count={setPrecision(inventory[item.name] ?? new Decimal(0))}
              parentDivRef={divRef}
            />
          ))}
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-center p-2">
          <span className="mb-2">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="w-8 sm:w-12"
            alt={selected.name}
          />
          <span className="text-center mt-2 text-sm">
            {selected.description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              {isPriceBoosted && <img src={lightning} className="h-6 me-2" />}
              <span className="text-xs text-shadow text-center mt-2 ">
                {`${displaySellPrice(selected)}`}
              </span>
            </div>
          </div>
          <div className="flex sm:flex-col w-full">
            <Button
              disabled={noCrop}
              className="text-xs mt-1 mr-1 sm:mr-0 flex-1"
              onClick={handleSellOneOrLess}
            >
              {`Sell ${cropAmount.gte(1) ? "1" : "<1"}`}
            </Button>
            <Button
              disabled={noCrop}
              className="text-xs mt-1 flex-1"
              onClick={handleSellTenOrLess}
            >
              {`Sell ${cropAmount.gte(10) ? "10" : "<10"}`}
            </Button>
          </div>
          <Button
            disabled={noCrop}
            className="text-xs mt-1"
            onClick={openConfirmationModal}
          >
            Sell All
          </Button>
        </div>
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
