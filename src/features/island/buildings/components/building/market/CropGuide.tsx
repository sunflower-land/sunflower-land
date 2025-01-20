import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { SEASON_ICONS } from "./SeasonalSeeds";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import seasonIcon from "assets/icons/season.webp";
import lightningIcon from "assets/icons/lightning.png";
import { getKeys } from "features/game/types/decorations";
import {
  CROP_SEEDS,
  CropName,
  CROPS,
  getCropCategory,
  GREENHOUSE_SEEDS,
  GreenHouseCropName,
  ProduceName,
} from "features/game/types/crops";
import { SEASONAL_SEEDS, SeedName } from "features/game/types/seeds";
import { EXOTIC_CROPS, ExoticCropName } from "features/game/types/beans";
import { Label } from "components/ui/Label";
import { FLOWER_SEEDS, FlowerSeedName } from "features/game/types/flowers";
import {
  GREENHOUSE_FRUIT_SEEDS,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
} from "features/game/types/fruits";
import { secondsToString } from "lib/utils/time";
import { SELLABLE } from "features/game/events/landExpansion/sellCrop";
import { GREENHOUSE_CROP_TIME_SECONDS } from "features/game/events/landExpansion/harvestGreenHouse";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
export const CropGuide = () => {
  const { gameState } = useGame();
  const inventory = gameState.context.state.inventory;
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="scrollable max-h-[300px] overflow-y-scroll">
      <div className="p-1">
        <NoticeboardItems
          items={[
            {
              text: t("cropGuide.earnCoins"),
              icon: SUNNYSIDE.ui.coins,
            },

            {
              text: t("cropGuide.payAttentionToSeason"),
              icon: seasonIcon,
            },
          ]}
        />
      </div>
      <Label type="default" className="mb-2">
        {t("cropGuide.crops")}
      </Label>
      {getKeys({ ...CROP_SEEDS }).map((seed, index) => {
        const crop = CROP_SEEDS[seed].yield as CropName;
        return (
          <CropRow
            key={seed}
            crop={crop}
            seed={seed}
            seconds={CROPS[crop].harvestSeconds}
            coins={CROPS[crop].sellPrice}
            alternateBg={index % 2 === 0}
          />
        );
      })}
      <div className="flex my-2 items-center">
        <Label type="default" className="mr-2">
          {t("cropGuide.fruits")}
        </Label>
        {!inventory["Fruit Patch"] && (
          <Label type="danger">{t("cropGuide.fruitPatchRequired")}</Label>
        )}
      </div>

      <p className="text-xs ml-2 mb-2">{t("cropGuide.fruit.description")}</p>
      {getKeys({ ...PATCH_FRUIT_SEEDS }).map((seed, index) => {
        const crop = PATCH_FRUIT_SEEDS[seed].yield;
        return (
          <CropRow
            key={seed}
            seed={seed}
            crop={crop}
            seconds={PATCH_FRUIT_SEEDS[seed].plantSeconds}
            coins={PATCH_FRUIT()[crop].sellPrice}
            alternateBg={index % 2 === 0}
          />
        );
      })}
      <div className="flex my-2 items-center">
        <Label type="default" className="mr-2">
          {t("cropGuide.greenhouse")}
        </Label>
        {!inventory.Greenhouse && (
          <Label type="danger">{t("cropGuide.greenhouseRequired")}</Label>
        )}
      </div>
      {getKeys({ ...GREENHOUSE_FRUIT_SEEDS, ...GREENHOUSE_SEEDS }).map(
        (seed, index) => {
          const crop = { ...GREENHOUSE_FRUIT_SEEDS, ...GREENHOUSE_SEEDS }[seed]
            .yield as GreenHouseCropName;
          return (
            <CropRow
              key={seed}
              crop={crop}
              seed={seed}
              seconds={GREENHOUSE_CROP_TIME_SECONDS[crop]}
              coins={SELLABLE[crop].sellPrice}
              alternateBg={index % 2 === 0}
            />
          );
        },
      )}

      <div className="flex my-2 items-center">
        <Label type="default" className="mr-2">
          {t("cropGuide.flower")}
        </Label>
        {!inventory["Flower Bed"] && (
          <Label type="danger">{t("cropGuide.flowerbedRequired")}</Label>
        )}
      </div>
      <p className="text-xs ml-2 mb-2">{t("cropGuide.flower.description")}</p>
      {getKeys({ ...FLOWER_SEEDS }).map((seed, index) => {
        return (
          <FlowerRow
            key={seed}
            seed={seed}
            seconds={FLOWER_SEEDS[seed].plantSeconds}
            alternateBg={index % 2 === 0}
          />
        );
      })}

      <Label type="default" className="my-2">
        {t("cropGuide.exotics")}
      </Label>
      <p className="text-xs ml-2 mb-2">
        {t("cropGuide.discoverExoticsDuringSpecialEvents")}
      </p>
      {getKeys({ ...EXOTIC_CROPS }).map((crop, index) => {
        return (
          <ExoticRow
            key={crop}
            crop={crop}
            coins={EXOTIC_CROPS[crop].sellPrice}
            alternateBg={index % 2 === 0}
          />
        );
      })}
    </InnerPanel>
  );
};

export const CropRow: React.FC<{
  crop: ProduceName;
  seed: SeedName;
  seconds: number;
  coins: number;
  alternateBg?: boolean;
}> = ({ crop, seed, seconds, coins, alternateBg }) => {
  const seasons = getKeys(SEASONAL_SEEDS).filter((season) =>
    SEASONAL_SEEDS[season].includes(seed as SeedName),
  );
  const { t } = useAppTranslation();
  return (
    <div
      className={`flex justify-between items-center p-1 ${
        alternateBg ? "bg-[#ead4aa] rounded-md" : ""
      }`}
    >
      <div className="flex items-center">
        <div className="flex items-center w-32 mr-2">
          <img src={ITEM_DETAILS[crop].image} className="w-6 h-auto mr-2" />
          <div className="flex-1">
            <p className="text-xs">{crop}</p>
            <p className="text-xxs">{t(getCropCategory(crop))}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center mr-2">
            <img src={SUNNYSIDE.icons.stopwatch} className="w-3 mr-1" />
            <p className="text-xxs">
              {secondsToString(seconds, { length: "short" })}
            </p>
          </div>
          <div className="flex items-center">
            <img src={SUNNYSIDE.ui.coins} className="w-3 mr-1" />
            <p className="text-xxs">{coins.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {seasons.map((season) => (
          <img key={season} src={SEASON_ICONS[season]} className="w-6 ml-1" />
        ))}
      </div>
    </div>
  );
};

export const FlowerRow: React.FC<{
  seed: FlowerSeedName;
  seconds: number;
  alternateBg?: boolean;
}> = ({ seed, seconds, alternateBg }) => {
  const seasons = getKeys(SEASONAL_SEEDS).filter((season) =>
    SEASONAL_SEEDS[season].includes(seed as SeedName),
  );
  return (
    <div
      className={`flex justify-between items-center p-1 ${
        alternateBg ? "bg-[#ead4aa] rounded-md" : ""
      }`}
    >
      <div className="flex items-center">
        <div className="flex items-center w-32 mr-2">
          <img src={ITEM_DETAILS[seed].image} className="w-6 h-auto mr-2" />
          <div className="flex-1">
            <p className="text-xs">{seed}</p>
            <p className="text-xxs">{`Flower`}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center mr-2">
            <img src={SUNNYSIDE.icons.stopwatch} className="w-3 mr-1" />
            <p className="text-xxs">
              {secondsToString(seconds, { length: "short" })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {seasons.map((season) => (
          <img key={season} src={SEASON_ICONS[season]} className="w-6 ml-1" />
        ))}
      </div>
    </div>
  );
};

export const ExoticRow: React.FC<{
  crop: ExoticCropName;
  coins: number;
  alternateBg?: boolean;
}> = ({ crop, coins, alternateBg }) => {
  const { t } = useAppTranslation();
  return (
    <div
      className={`flex justify-between items-center p-1 ${
        alternateBg ? "bg-[#ead4aa] rounded-md" : ""
      }`}
    >
      <div className="flex items-center">
        <div className="flex items-center w-32 mr-2">
          <img src={ITEM_DETAILS[crop].image} className="w-6 h-auto mr-2" />
          <div className="flex-1">
            <p className="text-xs">{crop}</p>
            <p className="text-xxs">{t(getCropCategory(crop))}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <img src={SUNNYSIDE.ui.coins} className="w-3 mr-1" />
            <p className="text-xxs">{coins.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-6 ml-1 flex justify-center items-center">
          <img src={lightningIcon} className="w-4 " />
        </div>
      </div>
    </div>
  );
};
