import React, { useContext, useRef, useState } from "react";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Crop, CROPS } from "features/game/types/crops";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { setPrecision } from "lib/utils/formatNumber";
import { Bumpkin } from "features/game/types/game";
import { Fruit, FRUIT } from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const Crops: React.FC = () => {
  const cropsAndFruits = { ...CROPS(), ...FRUIT() };
  const [selected, setSelected] = useState<Crop | Fruit>(
    cropsAndFruits.Sunflower
  );
  const [isSellAllModalOpen, showSellAllModal] = useState(false);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const divRef = useRef<HTMLDivElement>(null);

  const sell = (amount: Decimal) => {
    gameService.send("crop.sold", {
      crop: selected.name,
      amount: setPrecision(amount),
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
    if (cropAmount.lessThanOrEqualTo(1)) {
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
    if (cropAmount.greaterThanOrEqualTo(1) || cropAmount.eq(0)) return "Sell 1";

    return `Sell ${cropAmount}`;
  };

  return (
    <>
      <SplitScreenView
        divRef={divRef}
        panel={
          <ShopSellDetails
            details={{
              item: selected.name,
            }}
            properties={{
              sfl: displaySellPrice(selected),
            }}
            actionView={
              <>
                <div className="flex space-x-1 mb-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                  <Button
                    disabled={cropAmount.lessThanOrEqualTo(0)}
                    onClick={handleSellOneOrLess}
                  >
                    {sellOneButtonText()}
                  </Button>
                  <Button
                    disabled={cropAmount.lessThan(10)}
                    onClick={handleSellTen}
                  >
                    Sell 10
                  </Button>
                </div>
                <Button disabled={noCrop} onClick={openConfirmationModal}>
                  Sell All
                </Button>
              </>
            }
          />
        }
        content={
          <>
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
          </>
        }
      />
      <Modal centered show={isSellAllModalOpen} onHide={closeConfirmationModal}>
        <CloseButtonPanel className="sm:w-4/5 m-auto">
          <div className="flex flex-col p-2">
            <span className="text-sm text-center">
              Are you sure you want to <br className="hidden sm:block" />
              {`sell ${cropAmount} ${selected.name} for `}
              <br className="hidden sm:block" />
              {`${setPrecision(
                displaySellPrice(selected).mul(cropAmount)
              )} SFL?`}
            </span>
          </div>
          <div className="flex justify-content-around mt-2 space-x-1">
            <Button disabled={noCrop} onClick={closeConfirmationModal}>
              Cancel
            </Button>
            <Button disabled={noCrop} onClick={handleSellAll}>
              Sell All
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
