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
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import classNames from "classnames";

type VIPItem = SeasonalBanner | "Lifetime Farmer Banner";

export const ORIGINAL_SEASONAL_BANNER_PRICE = 90;
export const LIFETIME_FARMER_BANNER_PRICE = 540;

const _inventory = (state: MachineState) => state.context.state.inventory;

type Props = {
  onClose: () => void;
};

export const VIPItems: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [selected, setSelected] = useState<VIPItem>();
  const { t } = useTranslation();

  const inventory = useSelector(gameService, _inventory);

  const blockBuckBalance = inventory["Block Buck"] ?? new Decimal(0);
  const seasonBannerImage = getSeasonalBannerImage();
  const previousBanner = getPreviousSeasonalBanner();
  const hasPreviousBanner = !!inventory[previousBanner];
  const seasonBanner = getSeasonalBanner();
  const actualSeasonBannerPrice = getBannerPrice(
    seasonBanner,
    hasPreviousBanner
  ).toNumber();
  const hasDiscount = actualSeasonBannerPrice < ORIGINAL_SEASONAL_BANNER_PRICE;
  const canAffordSeasonBanner = blockBuckBalance.gte(actualSeasonBannerPrice);
  const canAffordLifetimeBanner = blockBuckBalance.gte(
    LIFETIME_FARMER_BANNER_PRICE
  );
  const hasLifeTimeBanner = inventory["Lifetime Farmer Banner"] !== undefined;
  const hasSeasonBanner = !!inventory[seasonBanner];

  const handlePurchase = () => {
    const state = gameService.send("banner.purchased", {
      name: selected,
    });

    const { inventory } = state.context.state;

    // TODO: Update this if more vip items are added
    if (!!inventory["Lifetime Farmer Banner"] && !!inventory[seasonBanner]) {
      onClose();
    } else {
      setSelected(undefined);
    }
  };

  const handleClick = (item: VIPItem) => {
    if (item === "Lifetime Farmer Banner" && hasLifeTimeBanner) return;

    if (item === seasonBanner && hasSeasonBanner) return;

    setSelected(item);
  };

  const getSelectedImage = () => {
    switch (selected) {
      case "Lifetime Farmer Banner":
        return lifeTimeFarmerBannerIcon;
      case getSeasonalBanner():
        return getSeasonalBannerImage();
      default:
        return "";
    }
  };

  const getCanPurchaseItem = () => {
    if (selected === "Lifetime Farmer Banner") {
      return canAffordLifetimeBanner;
    }

    if (selected === seasonBanner) {
      return canAffordSeasonBanner;
    }

    return false;
  };

  const getErrorLabel = () => {
    if (selected === "Lifetime Farmer Banner" && !canAffordLifetimeBanner) {
      return <Label type="danger">{t("offer.not.enough.BlockBucks")}</Label>;
    }

    if (selected === seasonBanner && !canAffordSeasonBanner) {
      return <Label type="danger">{t("offer.not.enough.BlockBucks")}</Label>;
    }
  };

  const getSeasonalBannerPriceLabel = () => {
    if (hasSeasonBanner) {
      return (
        <SquareIcon
          className="absolute right-1 bottom-1"
          icon={SUNNYSIDE.icons.confirm}
          width={7}
        />
      );
    }

    if (!hasSeasonBanner && hasLifeTimeBanner) {
      return (
        <Label type="success" className="absolute right-1 bottom-1">
          {t("free")}
        </Label>
      );
    }

    return (
      <Label
        type="warning"
        icon={blockBucksIcon}
        className="absolute right-1 bottom-1"
      >
        {getItemPrice(seasonBanner)}
      </Label>
    );
  };

  const getItemPrice = (item?: VIPItem) => {
    if (item === "Lifetime Farmer Banner") {
      return getBannerPrice(
        "Lifetime Farmer Banner",
        hasPreviousBanner
      ).toNumber();
    }

    if (item === seasonBanner) {
      return getBannerPrice(
        seasonBanner,
        hasPreviousBanner,
        hasLifeTimeBanner
      ).toNumber();
    }

    return 0;
  };

  return (
    <>
      {!selected && (
        <div className="flex flex-col space-y-2 pt-2">
          <div className="flex justify-between px-1">
            <Label
              icon={vipIcon}
              type="default"
              className="ml-1"
            >{`Purchase VIP Items`}</Label>
            <a
              href="https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals#block-bucks"
              className="text-xxs underline"
              target="_blank"
              rel="noreferrer"
            >
              {t("read.more")}
            </a>
          </div>
          <OuterPanel
            className={classNames(
              "flex flex-col px-1 cursor-pointer relative",
              {
                "cursor-not-allowed": hasLifeTimeBanner,
                "hover:bg-brown-300": !hasLifeTimeBanner,
              }
            )}
            onClick={
              !hasLifeTimeBanner
                ? () => handleClick("Lifetime Farmer Banner")
                : undefined
            }
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
              {!hasLifeTimeBanner ? (
                <Label
                  type="warning"
                  icon={blockBucksIcon}
                  className="absolute right-1 bottom-1"
                >
                  {getItemPrice("Lifetime Farmer Banner")}
                </Label>
              ) : (
                <SquareIcon
                  className="absolute right-1 bottom-1"
                  icon={SUNNYSIDE.icons.confirm}
                  width={7}
                />
              )}
            </div>
          </OuterPanel>
          <OuterPanel
            className={classNames(
              "flex flex-col px-1 cursor-pointer relative",
              {
                "cursor-not-allowed": hasSeasonBanner,
                "hover:bg-brown-300": !hasSeasonBanner,
              }
            )}
            onClick={
              !hasSeasonBanner ? () => handleClick(seasonBanner) : undefined
            }
          >
            <Label type="default" className="mb-2" icon={seasonBannerImage}>
              {getSeasonalBanner()}
            </Label>
            <div className="flex flex-col space-y-1 sm:space-y-2 text-xs sm:text-sm pb-1">
              {/* Weeks 9-12 will not include the mystery airdrop item */}
              {getSeasonWeek() < 9 && (
                <div className="flex items-center space-x-2">
                  <SquareIcon icon={giftIcon} width={7} />
                  <span>{t("season.mystery.gift")}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <SquareIcon icon={vipIcon} width={7} />
                <span>{t("season.vip.access")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SquareIcon icon={xpIcon} width={7} />
                <span>{t("season.xp.boost")}</span>
              </div>
              {hasDiscount && !hasSeasonBanner && (
                <span
                  className="absolute right-2 bottom-8 text-xs discounted"
                  style={{}}
                >{`${ORIGINAL_SEASONAL_BANNER_PRICE} `}</span>
              )}
              {getSeasonalBannerPriceLabel()}
            </div>
          </OuterPanel>
        </div>
      )}
      {selected && (
        <div className="flex flex-col space-y-2 relative">
          <Label
            type="default"
            icon={getSelectedImage()}
          >{`Purchase ${selected}`}</Label>
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="h-6 w-6 ml-2 cursor-pointer absolute top-6 -left-[6px]"
            onClick={() => setSelected(undefined)}
          />
          <div className="flex flex-col px-1 pt-1 w-full space-y-2 items-center text-sm justify-between">
            <img src={getSelectedImage()} className="w-12 sm:w-16" />
            {getItemPrice(selected as VIPItem) > 0 ? (
              <div className="flex items-center space-x-2">
                <span>{`${t("total")} ${getItemPrice(
                  selected as VIPItem
                )}`}</span>
                <img src={blockBucksIcon} className="w-6" />
              </div>
            ) : (
              <Label type="success">{t("season.free.with.lifetime")}</Label>
            )}
            {!getCanPurchaseItem() && getErrorLabel()}
          </div>
          <Button disabled={!getCanPurchaseItem()} onClick={handlePurchase}>
            {t("confirm")}
          </Button>
        </div>
      )}
    </>
  );
};
