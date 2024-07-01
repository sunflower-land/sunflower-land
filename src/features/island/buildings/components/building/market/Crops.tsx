import React, { useContext, useRef, useState } from "react";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Crop, CROPS, GREENHOUSE_CROPS } from "features/game/types/crops";
import { useActor } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { setPrecision } from "lib/utils/formatNumber";
import { Fruit, FRUIT, GREENHOUSE_FRUIT } from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { getBumpkinLevel } from "features/game/lib/level";
import lock from "assets/skills/lock.png";
import lightning from "assets/icons/lightning.png";
import greenhouse from "assets/icons/greenhouse.webp";
import orange from "assets/resources/orange.png";
import {
  EXOTIC_CROPS,
  ExoticCrop,
  ExoticCropName,
} from "features/game/types/beans";
import { getKeys } from "features/game/types/craftables";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { NPC_WEARABLES } from "lib/npcs";

export const isExoticCrop = (
  item: Crop | Fruit | ExoticCrop,
): item is ExoticCrop => {
  return item.name in EXOTIC_CROPS;
};
export const Crops: React.FC = () => {
  const [selected, setSelected] = useState<Crop | Fruit | ExoticCrop>(
    CROPS().Sunflower,
  );
  const [isSellAllModalOpen, showSellAllModal] = useState(false);
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
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
    if (cropAmount.greaterThanOrEqualTo(1) || cropAmount.eq(0))
      return t("sell.one");

    return `Sell ${cropAmount}`;
  };

  const exotics = getKeys(EXOTIC_CROPS)
    // sort by sell price
    .sort((a, b) => EXOTIC_CROPS[a].sellPrice - EXOTIC_CROPS[b].sellPrice)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: { ...EXOTIC_CROPS[key], disabled: false, bumpkinLevel: 0 },
      }),
      {} as Record<
        ExoticCropName,
        ExoticCrop & { disabled: false; bumpkinLevel: 0 }
      >,
    );

  const cropsAndFruits = Object.values({
    ...CROPS(),
    ...FRUIT(),
    ...exotics,
    ...GREENHOUSE_FRUIT(),
    ...GREENHOUSE_CROPS(),
  }) as Crop[];

  return (
    <>
      <SplitScreenView
        divRef={divRef}
        panel={
          <>
            <ShopSellDetails
              details={{
                item: selected.name,
              }}
              properties={{
                coins: displaySellPrice(selected),
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
                      {t("sell.ten")}
                    </Button>
                  </div>
                  <Button disabled={noCrop} onClick={openConfirmationModal}>
                    {t("sell.all")}
                  </Button>
                </>
              }
            />
          </>
        }
        content={
          <div className="pl-1">
            <div className="flex">
              <Label
                className="mr-3 ml-2 mb-1"
                icon={CROP_LIFECYCLE.Sunflower.crop}
                type="default"
              >
                {t("crops")}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
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
              <Label className="mr-3 ml-2 mb-1" icon={orange} type="default">
                {t("fruits")}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
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
              <Label className="mr-3 ml-2 mb-1" icon={lightning} type="default">
                {t("exotics")}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
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

            <>
              <div className="flex">
                <Label
                  className="mr-3 ml-2 mb-1"
                  icon={greenhouse}
                  type="default"
                >
                  {t("greenhouse")}
                </Label>
              </div>
              <div className="flex flex-wrap mb-2">
                {cropsAndFruits
                  .filter(
                    (crop) =>
                      !!crop.sellPrice &&
                      (crop.name in GREENHOUSE_CROPS() ||
                        crop.name in GREENHOUSE_FRUIT()),
                  )
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
            </>
          </div>
        }
      />
      <ConfirmationModal
        show={isSellAllModalOpen}
        onHide={closeConfirmationModal}
        messages={[
          t("confirmation.sellCrops", {
            cropAmount: cropAmount,
            cropName: selected.name,
            coinAmount: setPrecision(
              new Decimal(displaySellPrice(selected)).mul(cropAmount),
            ),
          }),
        ]}
        onCancel={closeConfirmationModal}
        onConfirm={handleSellAll}
        confirmButtonLabel={t("sell.all")}
        disabled={noCrop}
        bumpkinParts={NPC_WEARABLES.betty}
      />
    </>
  );
};
