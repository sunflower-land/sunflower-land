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
import { Fruit, FRUIT } from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getBumpkinLevel } from "features/game/lib/level";
import lock from "assets/skills/lock.png";
import lightning from "assets/icons/lightning.png";
import orange from "assets/resources/orange.png";
import {
  EXOTIC_CROPS,
  ExoticCrop,
  ExoticCropName,
} from "features/game/types/beans";
import { getKeys } from "features/game/types/craftables";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

export const isExoticCrop = (
  item: Crop | Fruit | ExoticCrop
): item is ExoticCrop => {
  return item.name in EXOTIC_CROPS;
};

export const Crops: React.FC<{ cropShortage: boolean }> = ({
  cropShortage,
}) => {
  const [selected, setSelected] = useState<Crop | Fruit | ExoticCrop>(
    CROPS().Sunflower
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
    if (isExoticCrop(selected)) {
      gameService.send("treasure.sold", {
        item: selected.name,
        amount,
      });
    } else {
      const state = gameService.send("crop.sold", {
        crop: selected.name,
        amount: setPrecision(amount),
      });

      if (state.context.state.bumpkin?.activity?.["Sunflower Sold"] === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:SunflowerSold:Completed",
        });
      }
    }
  };

  const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);
  const cropAmount = setPrecision(new Decimal(inventory[selected.name] || 0));
  const noCrop = cropAmount.lessThanOrEqualTo(0);
  const displaySellPrice = (crop: Crop | Fruit | ExoticCrop) =>
    isExoticCrop(crop)
      ? crop.sellPrice
      : getSellPrice({ item: crop, game: state });

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

  const exotics = getKeys(EXOTIC_CROPS)
    // sort by sell price
    .sort((a, b) =>
      EXOTIC_CROPS[a].sellPrice.sub(EXOTIC_CROPS[b].sellPrice).toNumber()
    )
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: { ...EXOTIC_CROPS[key], disabled: false, bumpkinLevel: 0 },
      }),
      {} as Record<
        ExoticCropName,
        ExoticCrop & { disabled: false; bumpkinLevel: 0 }
      >
    );

  const cropsAndFruits = Object.values({
    ...CROPS(),
    ...FRUIT(),
    ...exotics,
  }).filter((value) => !value.disabled);

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
          <div className="pl-1">
            <div className="flex">
              <Label
                className="mr-3"
                icon={CROP_LIFECYCLE.Sunflower.crop}
                type="default"
              >
                Crops
              </Label>
              {cropShortage && (
                <Label type="vibrant" icon={SUNNYSIDE.icons.stopwatch}>
                  2x Sale
                </Label>
              )}
            </div>
            <div className="flex flex-wrap">
              {cropsAndFruits
                .filter((crop) => !!crop.sellPrice && crop.name in CROPS())
                .map((item) => (
                  <Box
                    isSelected={selected.name === item.name}
                    key={item.name}
                    onClick={() => setSelected(item)}
                    image={ITEM_DETAILS[item.name].image}
                    count={inventory[item.name]}
                    parentDivRef={divRef}
                    secondaryImage={
                      bumpkinLevel < item.bumpkinLevel ? lock : undefined
                    }
                    showOverlay={bumpkinLevel < item.bumpkinLevel}
                  />
                ))}
            </div>
            <div className="flex">
              <Label className="mr-3" icon={orange} type="default">
                Fruits
              </Label>
            </div>
            <div className="flex flex-wrap">
              {cropsAndFruits
                .filter((crop) => !!crop.sellPrice && crop.name in FRUIT())
                .map((item) => (
                  <Box
                    isSelected={selected.name === item.name}
                    key={item.name}
                    onClick={() => setSelected(item)}
                    image={ITEM_DETAILS[item.name].image}
                    count={inventory[item.name]}
                    parentDivRef={divRef}
                    secondaryImage={
                      bumpkinLevel < item.bumpkinLevel ? lock : undefined
                    }
                    showOverlay={bumpkinLevel < item.bumpkinLevel}
                  />
                ))}
            </div>
            <div className="flex">
              <Label className="mr-3" icon={lightning} type="default">
                Exotics
              </Label>
            </div>
            <div className="flex flex-wrap">
              {cropsAndFruits
                .filter((crop) => !!crop.sellPrice && crop.name in EXOTIC_CROPS)
                .map((item) => (
                  <Box
                    isSelected={selected.name === item.name}
                    key={item.name}
                    onClick={() => setSelected(item)}
                    image={ITEM_DETAILS[item.name].image}
                    count={inventory[item.name]}
                    parentDivRef={divRef}
                    secondaryImage={
                      bumpkinLevel < item.bumpkinLevel ? lock : undefined
                    }
                    showOverlay={bumpkinLevel < item.bumpkinLevel}
                  />
                ))}
            </div>
          </div>
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
