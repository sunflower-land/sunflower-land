import React, { useContext, useRef, useState } from "react";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import {
  PlotCropName,
  GREENHOUSE_CROPS,
  GreenHouseCrop,
  PLOT_CROPS,
  PlotCrop,
} from "features/game/types/crops";
import { useActor } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { setPrecision } from "lib/utils/formatNumber";
import {
  GREENHOUSE_FRUIT,
  GreenHouseFruit,
  PATCH_FRUIT,
  PatchFruit,
} from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
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
import { PLOT_CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { NPC_WEARABLES } from "lib/npcs";
import { BulkSellModal } from "components/ui/BulkSellModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { hasFeatureAccess } from "lib/flags";
import {
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
} from "features/game/events/landExpansion/harvest";

export const isExoticCrop = (
  item: PlotCrop | PatchFruit | ExoticCrop | GreenHouseFruit | GreenHouseCrop,
): item is ExoticCrop => {
  return item.name in EXOTIC_CROPS;
};

export const Crops: React.FC = () => {
  const [selected, setSelected] = useState<
    PlotCrop | PatchFruit | ExoticCrop | GreenHouseFruit | GreenHouseCrop
  >(PLOT_CROPS.Sunflower);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [customAmount, setCustomAmount] = useState(new Decimal(0));
  const [isCustomSellModalOpen, showCustomSellModal] = useState(false);

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
        amount: setPrecision(amount, 2),
      });

      if (state.context.state.bumpkin?.activity?.["Sunflower Sold"] === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:SunflowerSold:Completed",
        });
      }
    }
  };

  const displaySellPrice = (
    crop: PlotCrop | PatchFruit | ExoticCrop | GreenHouseFruit | GreenHouseCrop,
  ) =>
    isExoticCrop(crop)
      ? crop.sellPrice
      : getSellPrice({ item: crop, game: state });

  const cropAmount = setPrecision(inventory[selected.name] ?? 0, 2);
  const coinAmount = setPrecision(
    new Decimal(displaySellPrice(selected)).mul(
      state.island.type !== "basic" ? new Decimal(customAmount) : cropAmount,
    ),
    2,
  );

  const handleSell = (amount: Decimal) => {
    sell(amount);
    setShowConfirmationModal(false);
    setCustomAmount(new Decimal(0));
  };

  const openConfirmationModal = () => {
    setShowConfirmationModal(true);
    showCustomSellModal(false);
  };
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setCustomAmount(new Decimal(0));
  };

  const openBulkSellModal = () => {
    showCustomSellModal(true);
  };
  const closeBulkSellModal = () => {
    showCustomSellModal(false);
    setCustomAmount(new Decimal(0));
  };

  const exotics = getKeys(EXOTIC_CROPS)
    // sort by sell price
    .sort((a, b) => EXOTIC_CROPS[a].sellPrice - EXOTIC_CROPS[b].sellPrice)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: EXOTIC_CROPS[key],
      }),
      {} as Record<ExoticCropName, ExoticCrop>,
    );

  const cropsAndFruits = Object.values({
    ...PLOT_CROPS,
    ...PATCH_FRUIT(),
    ...exotics,
    ...GREENHOUSE_FRUIT(),
    ...GREENHOUSE_CROPS,
  });

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
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex space-x-1 mb-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                      {cropAmount.greaterThan(1) && (
                        <Button onClick={() => handleSell(new Decimal(1))}>
                          {t("sell.one")}
                        </Button>
                      )}
                      {cropAmount.greaterThan(0) && (
                        <Button
                          onClick={() =>
                            handleSell(
                              cropAmount.greaterThan(10)
                                ? new Decimal(10)
                                : cropAmount,
                            )
                          }
                        >
                          {t(
                            cropAmount.greaterThan(10)
                              ? "sell.ten"
                              : "sell.amount",
                            { amount: cropAmount },
                          )}
                        </Button>
                      )}
                    </div>
                    <div>
                      {cropAmount.greaterThan(10) && (
                        <Button
                          onClick={
                            state.island.type !== "basic"
                              ? openBulkSellModal
                              : openConfirmationModal
                          }
                        >
                          {t(
                            state.island.type !== "basic"
                              ? "sell.inBulk"
                              : "sell.all",
                          )}
                        </Button>
                      )}
                    </div>
                    {cropAmount.lessThanOrEqualTo(0) && (
                      <p className="text-xxs text-center mb-1">
                        {t("crops.noCropsToSell", { cropName: selected.name })}
                      </p>
                    )}
                  </div>
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
                icon={PLOT_CROP_LIFECYCLE.Sunflower.crop}
                type="default"
              >
                {`Basic Crops`}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
              {cropsAndFruits
                .filter((crop) => !!crop.sellPrice && crop.name in PLOT_CROPS)
                .filter((crop) => isBasicCrop(crop.name as PlotCropName))
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
            <div className="flex">
              <Label
                className="mr-3 ml-2 mb-1"
                icon={PLOT_CROP_LIFECYCLE.Carrot.crop}
                type="default"
              >
                {`Medium Crops`}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
              {cropsAndFruits
                .filter((crop) => !!crop.sellPrice && crop.name in PLOT_CROPS)
                .filter((crop) => isMediumCrop(crop.name as PlotCropName))
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
            <div className="flex">
              <Label
                className="mr-3 ml-2 mb-1"
                icon={PLOT_CROP_LIFECYCLE.Kale.crop}
                type="default"
              >
                {`Advanced Crops`}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
              {cropsAndFruits
                .filter((crop) => !!crop.sellPrice && crop.name in PLOT_CROPS)
                .filter((crop) => isAdvancedCrop(crop.name as PlotCropName))
                .filter(
                  (crop) =>
                    crop.name !== "Barley" || hasFeatureAccess(state, "BARLEY"),
                )
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
            <div className="flex">
              <Label className="mr-3 ml-2 mb-1" icon={orange} type="default">
                {t("fruits")}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
              {cropsAndFruits
                .filter(
                  (fruit) => !!fruit.sellPrice && fruit.name in PATCH_FRUIT(),
                )
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
                  />
                ))}
            </div>

            <>
              <div className="flex">
                <Label
                  className="mr-3 ml-2 mb-1"
                  icon={SUNNYSIDE.icons.greenhouseIcon}
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
                      (crop.name in GREENHOUSE_CROPS ||
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
                    />
                  ))}
              </div>
            </>
          </div>
        }
      />
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={closeConfirmationModal}
        messages={[
          t("confirmation.sell", {
            amount: state.island.type !== "basic" ? customAmount : cropAmount,
            name: selected.name,
            coinAmount,
          }),
        ]}
        onCancel={closeConfirmationModal}
        onConfirm={() =>
          handleSell(
            state.island.type !== "basic"
              ? new Decimal(customAmount)
              : cropAmount,
          )
        }
        confirmButtonLabel={
          state.island.type !== "basic"
            ? t("sell.amount", { amount: customAmount })
            : t("sell.all")
        }
        bumpkinParts={NPC_WEARABLES.betty}
      />
      <BulkSellModal
        show={isCustomSellModalOpen}
        onHide={closeBulkSellModal}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        itemAmount={cropAmount}
        bumpkinParts={NPC_WEARABLES.betty}
        maxDecimalPlaces={2}
        onCancel={closeBulkSellModal}
        onSell={openConfirmationModal}
        coinAmount={coinAmount}
      />
    </>
  );
};
