import React, { useContext, useRef, useState } from "react";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import {
  ALL_PRODUCE,
  type Crop,
  CROPS,
  type GreenHouseCrop,
  type ProduceName,
} from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { setPrecision } from "lib/utils/formatNumber";
import type { GreenHouseFruit, PatchFruit } from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import type { ExoticCrop } from "features/game/types/beans";
import { getKeys } from "lib/object";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { NPC_WEARABLES } from "lib/npcs";
import { BulkSellModal } from "components/ui/BulkSellModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { needsFirstCropSale } from "./lib/onboarding";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SEASONAL_SEEDS, SEEDS } from "features/game/types/seeds";
import { SEASON_ICONS } from "./SeasonalSeeds";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { isExoticCrop } from "features/game/types/crops";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import {
  CHAPTER_CROP_WEEK,
  CHAPTER_CROP_WEEK_CROP,
  isChapterCropWeekActive,
} from "features/game/types/chapterCropWeek";
import { hasUpgradedChapterCropWeekSkill } from "features/game/types/bumpkinSkills";
import { useNow } from "lib/utils/hooks/useNow";
import { SpecialEventPanel } from "../SpecialEventPanel";

const _state = (state: MachineState) => state.context.state;

/** Pulsing hand over the button that sells everything (tutorial nudge). */
const SellHelper: React.FC = () => (
  <img
    className="absolute pointer-events-none z-30 animate-pulsate"
    src={SUNNYSIDE.icons.click_icon}
    style={{
      width: `${PIXEL_SCALE * 18}px`,
      right: `${PIXEL_SCALE * -4}px`,
      top: `${PIXEL_SCALE * 2}px`,
    }}
  />
);

export const SeasonalCrops: React.FC = () => {
  const [selected, setSelected] = useState<
    Crop | PatchFruit | ExoticCrop | GreenHouseFruit | GreenHouseCrop
  >(CROPS.Sunflower);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [customAmount, setCustomAmount] = useState(new Decimal(0));
  const [isCustomSellModalOpen, showCustomSellModal] = useState(false);

  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

  const state = useSelector(gameService, _state);

  const now = useNow({
    live: true,
    autoEndAt: CHAPTER_CROP_WEEK.endDate.getTime(),
  });
  const isCropWeek = isChapterCropWeekActive(now);

  const { island, season } = state;

  // Nudge a new player to sell all of their first Sunflowers.
  const showSellHelper =
    selected.name === "Sunflower" && needsFirstCropSale(state);
  const { type: islandType } = island;

  const divRef = useRef<HTMLDivElement>(null);

  const sell = (amount: Decimal) => {
    if (isExoticCrop(selected.name)) {
      gameService.send("treasure.sold", {
        item: selected.name,
        amount,
      });
    } else {
      // Read before the sale lands: afterwards the nudge is already cleared.
      const before = gameService.getSnapshot().context.state;
      const isFirstSale = needsFirstCropSale(before);
      const isFirstSunflowerSale =
        selected.name === "Sunflower" &&
        !before.farmActivity?.["Sunflower Sold"];

      gameService.send("crop.sold", {
        crop: selected.name,
        amount: setPrecision(amount, 2),
      });

      // Tutorial: with coins in hand, Betty points the player at her seeds.
      if (isFirstSale) {
        openModal("BETTY_BUY");
      }

      // "Sunflower Sold" counts units, not sales, so compare against the
      // state before the sale rather than checking for a total of 1.
      if (isFirstSunflowerSale) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:SunflowerSold:Completed",
        });
      }
    }
  };

  const displaySellPrice = (
    crop: Crop | PatchFruit | ExoticCrop | GreenHouseFruit | GreenHouseCrop,
  ) =>
    isExoticCrop(crop.name)
      ? crop.sellPrice
      : getSellPrice({ item: crop, game: state }).price;

  // Exotic crops sell through `treasure.sold`, which only accepts whole
  // amounts; regular crops go through `crop.sold`, which allows fractions.
  const sellDecimalPlaces = isExoticCrop(selected.name) ? 0 : 2;

  const cropAmount = setPrecision(
    getCountAndType(state, selected.name).count,
    sellDecimalPlaces,
  );
  const coinAmount = setPrecision(
    new Decimal(displaySellPrice(selected)).mul(
      islandType !== "basic" ? new Decimal(customAmount) : cropAmount,
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

  const crops = ALL_PRODUCE;

  const currentSeason = season.season;

  const seasonal = getKeys(SEEDS)
    .filter((seed) => SEASONAL_SEEDS[currentSeason].includes(seed))
    .map((name) => SEEDS[name].yield)
    .filter(Boolean) as ProduceName[];

  const seasons = getKeys(SEASONAL_SEEDS).filter((season) =>
    SEASONAL_SEEDS[season].find((seed) => SEEDS[seed].yield === selected.name),
  );

  return (
    <>
      <SplitScreenView
        divRef={divRef}
        panel={
          <>
            <ShopSellDetails
              details={{
                item: selected.name,
                seasons: seasons,
              }}
              properties={{
                coins: displaySellPrice(selected),
              }}
              actionView={
                <>
                  {selected.name === CHAPTER_CROP_WEEK_CROP &&
                    hasUpgradedChapterCropWeekSkill(
                      state.bumpkin.skills,
                      "Crops",
                    ) && (
                      <Label type="warning" className="mb-1">
                        {t("chapterCropWeek.ascensionBoostsPaused")}
                      </Label>
                    )}
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex space-x-1 mb-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                      {cropAmount.greaterThan(1) && (
                        <Button onClick={() => handleSell(new Decimal(1))}>
                          {t("sell.one")}
                        </Button>
                      )}
                      {cropAmount.greaterThan(0) && (
                        <div className="relative w-full">
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
                          {/* With 10 or fewer, this button sells the lot */}
                          {showSellHelper &&
                            cropAmount.lessThanOrEqualTo(10) && <SellHelper />}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      {cropAmount.greaterThan(10) && (
                        <>
                          <Button
                            onClick={
                              islandType !== "basic"
                                ? openBulkSellModal
                                : openConfirmationModal
                            }
                          >
                            {t(
                              islandType !== "basic"
                                ? "sell.inBulk"
                                : "sell.all",
                            )}
                          </Button>
                          {showSellHelper && <SellHelper />}
                        </>
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
                className="mr-3 ml-2 mb-1 capitalize"
                icon={SEASON_ICONS[currentSeason]}
                type="default"
              >
                {currentSeason}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
              {seasonal
                .filter((name) => !!crops[name].sellPrice)
                .map((name) => {
                  const { count } = getCountAndType(state, name);

                  return (
                    <Box
                      isSelected={selected.name === name}
                      key={name}
                      onClick={() => setSelected(crops[name])}
                      image={ITEM_DETAILS[name].image}
                      count={count}
                      parentDivRef={divRef}
                    />
                  );
                })}
            </div>
            {isCropWeek && (
              <SpecialEventPanel
                image={ITEM_DETAILS[CHAPTER_CROP_WEEK_CROP].image}
                title={t("chapterCropWeek.specialEventCrop")}
                endDate={CHAPTER_CROP_WEEK.endDate}
                isSelected={selected.name === CHAPTER_CROP_WEEK_CROP}
                count={getCountAndType(state, CHAPTER_CROP_WEEK_CROP).count}
                onSelect={() => setSelected(crops[CHAPTER_CROP_WEEK_CROP])}
              />
            )}
            <div className="flex">
              <Label
                className="mr-3 ml-2 mb-1 capitalize"
                icon={SUNNYSIDE.icons.seedling}
                type="default"
              >
                {t("cropGuide.otherProduce")}
              </Label>
            </div>
            <div className="flex flex-wrap mb-2">
              {getKeys(crops)
                .filter((name) => !seasonal.includes(name))
                .filter((name) => name !== CHAPTER_CROP_WEEK_CROP)
                .filter((name) => !!crops[name].sellPrice)
                .map((name) => {
                  const { count } = getCountAndType(state, name);

                  return (
                    <Box
                      isSelected={selected.name === name}
                      key={name}
                      onClick={() => setSelected(crops[name])}
                      image={ITEM_DETAILS[name].image}
                      count={count}
                      parentDivRef={divRef}
                    />
                  );
                })}
            </div>
          </div>
        }
      />
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={closeConfirmationModal}
        messages={[
          t("confirmation.sell", {
            amount: islandType !== "basic" ? customAmount : cropAmount,
            name: selected.name,
            coinAmount,
          }),
        ]}
        onCancel={closeConfirmationModal}
        onConfirm={() =>
          handleSell(
            islandType !== "basic" ? new Decimal(customAmount) : cropAmount,
          )
        }
        confirmButtonLabel={
          islandType !== "basic"
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
        maxDecimalPlaces={sellDecimalPlaces}
        onCancel={closeBulkSellModal}
        onSell={openConfirmationModal}
        coinAmount={coinAmount}
      />
    </>
  );
};
