import React, { useContext, useRef, useState } from "react";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import {
  ALL_PRODUCE,
  Crop,
  CROPS,
  GreenHouseCrop,
  ProduceName,
} from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { setPrecision } from "lib/utils/formatNumber";
import { GreenHouseFruit, PatchFruit } from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { ExoticCrop } from "features/game/types/beans";
import { getKeys } from "features/game/types/craftables";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { NPC_WEARABLES } from "lib/npcs";
import { BulkSellModal } from "components/ui/BulkSellModal";
import { SUNNYSIDE } from "assets/sunnyside";

import { SEASONAL_SEEDS, SEEDS } from "features/game/types/seeds";
import { SEASON_ICONS } from "./SeasonalSeeds";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { isExoticCrop } from "features/game/types/crops";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";

const _state = (state: MachineState) => state.context.state;

export const SeasonalCrops: React.FC = () => {
  const [selected, setSelected] = useState<
    Crop | PatchFruit | ExoticCrop | GreenHouseFruit | GreenHouseCrop
  >(CROPS.Sunflower);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [customAmount, setCustomAmount] = useState(new Decimal(0));
  const [isCustomSellModalOpen, showCustomSellModal] = useState(false);

  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const state = useSelector(gameService, _state);

  const { island, season } = state;
  const { type: islandType } = island;

  const divRef = useRef<HTMLDivElement>(null);

  const sell = (amount: Decimal) => {
    if (isExoticCrop(selected.name)) {
      gameService.send({ type: "treasure.sold", item: selected.name, amount });
    } else {
      const state = gameService.send({
        type: "crop.sold",
        crop: selected.name,
        amount: setPrecision(amount, 2),
      });

      if (state.context.state.farmActivity?.["Sunflower Sold"] === 1) {
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

  const cropAmount = setPrecision(
    getCountAndType(state, selected.name).count,
    2,
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
                            islandType !== "basic"
                              ? openBulkSellModal
                              : openConfirmationModal
                          }
                        >
                          {t(
                            islandType !== "basic" ? "sell.inBulk" : "sell.all",
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
        maxDecimalPlaces={2}
        onCancel={closeBulkSellModal}
        onSell={openConfirmationModal}
        coinAmount={coinAmount}
      />
    </>
  );
};
