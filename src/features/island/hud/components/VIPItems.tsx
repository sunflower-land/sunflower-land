import React, { useContext, useState } from "react";
import {
  SeasonalBanner,
  getPreviousSeasonalBanner,
  getSeasonalBanner,
  getSeasonalBannerImage,
} from "features/game/types/seasons";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { SquareIcon } from "components/ui/SquareIcon";
import { getBannerPrice } from "features/game/events/landExpansion/bannerPurchased";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

import lifeTimeFarmerBannerIcon from "assets/decorations/banners/lifetime_farmer_banner.png";
import giftIcon from "assets/icons/gift.png";
import blockBucksIcon from "assets/icons/block_buck.png";
import xpIcon from "assets/icons/xp.png";
import vipIcon from "assets/icons/vip.webp";

type VIPItem = SeasonalBanner | "Lifetime Farmer Banner";

const ORIGINAL_SEASONAL_BANNER_PRICE = 90;

const _inventory = (state: MachineState) => state.context.state.inventory;

export const VIPItems: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const [selected, setSelected] = useState<VIPItem>();

  const inventory = useSelector(gameService, _inventory);

  const seasonBannerImage = getSeasonalBannerImage();
  const previousBanner = getPreviousSeasonalBanner();
  const hasPreviousBanner = !!inventory[previousBanner];
  const seasonBanner = getSeasonalBanner();
  const actualSeasonBannerPrice = getBannerPrice(
    seasonBanner,
    hasPreviousBanner
  ).toNumber();
  const hasDiscount = actualSeasonBannerPrice < ORIGINAL_SEASONAL_BANNER_PRICE;

  return (
    <>
      {!selected && (
        <div className="flex flex-col space-y-2">
          <OuterPanel
            className="flex flex-col px-1 cursor-pointer relative"
            onClick={() => setSelected("Lifetime Farmer Banner")}
          >
            <Label
              type="default"
              className="mb-2"
              icon={lifeTimeFarmerBannerIcon}
            >
              {t("season.lifetime.farmer")}
            </Label>
            <div className="flex flex-col space-y-1 sm:space-y-2 text-xs sm:text-sm pb-1">
              <div className="flex items-center space-x-2">
                <SquareIcon icon={giftIcon} width={7} />
                <span>{t("season.supporter.gift")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SquareIcon icon={seasonBannerImage} width={7} />
                <span>{t("season.free.season.passes")}</span>
              </div>
              <Label
                type="warning"
                icon={blockBucksIcon}
                className="absolute right-1 bottom-1"
              >
                {getBannerPrice(
                  "Lifetime Farmer Banner",
                  hasPreviousBanner
                ).toNumber()}
              </Label>
            </div>
          </OuterPanel>
          <OuterPanel
            className="flex flex-col px-1 cursor-pointer relative"
            onClick={() => setSelected(seasonBanner)}
          >
            <Label type="default" className="mb-2" icon={seasonBannerImage}>
              {getSeasonalBanner()}
            </Label>
            <div className="flex flex-col space-y-1 sm:space-y-2 text-xs sm:text-sm pb-1">
              <div className="flex items-center space-x-2">
                <SquareIcon icon={giftIcon} width={7} />
                <span>{t("season.mystery.gift")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SquareIcon icon={vipIcon} width={7} />
                <span>{t("season.vip.access")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SquareIcon icon={xpIcon} width={7} />
                <span>{t("season.xp.boost")}</span>
              </div>
              {hasDiscount && (
                <span
                  className="absolute right-2 bottom-8 text-xs discounted"
                  style={{}}
                >{` ${ORIGINAL_SEASONAL_BANNER_PRICE} `}</span>
              )}
              <Label
                type="warning"
                icon={blockBucksIcon}
                className="absolute right-1 bottom-1"
              >
                {getBannerPrice(
                  "Lifetime Farmer Banner",
                  hasPreviousBanner
                ).toNumber()}
              </Label>
            </div>
          </OuterPanel>
        </div>
      )}
      {selected && <div className="flex flex-col space-y-1">{`Hey there`}</div>}
    </>
  );
};
