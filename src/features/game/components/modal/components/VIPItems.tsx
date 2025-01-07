import React, { useContext, useState } from "react";
import {
  SEASONS,
  SeasonalBanner,
  getCurrentSeason,
  getPreviousSeasonalBanner,
  getSeasonalBanner,
  getSeasonalBannerImage,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { SquareIcon } from "components/ui/SquareIcon";
import { getBannerPrice } from "features/game/events/landExpansion/bannerPurchased";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

import lifeTimeFarmerBannerIcon from "assets/decorations/banners/lifetime_farmer_banner.png";
import giftIcon from "assets/icons/gift.png";
import increaseArrow from "assets/icons/increase_arrow.png";
import xpIcon from "assets/icons/xp.png";
import vipIcon from "assets/icons/vip.webp";
import trophyIcon from "assets/icons/trophy.png";
import shopIcon from "assets/icons/shop.png";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
import { acknowledgeSeasonPass } from "features/announcements/announcementsStorage";
import { ITEM_DETAILS } from "features/game/types/images";
import { VIP_PRICES, VipBundle } from "features/game/lib/vipAccess";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { getKeys } from "features/game/types/decorations";
import { PIXEL_SCALE } from "features/game/lib/constants";

const _farmId = (state: MachineState) => state.context.farmId;
const _inventory = (state: MachineState) => state.context.state.inventory;

type Props = {
  onClose: () => void;
  onSkip?: () => void;
};

const SeasonVIPDiscountTime: React.FC = () => {
  const season = getCurrentSeason();
  const seasonStartDate = SEASONS[season].startDate;
  const seasonEndDate = SEASONS[season].endDate;

  const WEEK = 1000 * 60 * 60 * 24 * 7;

  const discountDates = [
    seasonStartDate.getTime() + 1 * WEEK, // 1 weeks
    seasonStartDate.getTime() + 4 * WEEK, // 4 weeks
    seasonStartDate.getTime() + 8 * WEEK, // 8 weeks
    seasonEndDate.getTime(), // End of season
  ];

  const upcomingDiscountEnd = discountDates.find((date) => date > Date.now());

  if (!upcomingDiscountEnd) {
    return null;
  }

  const secondsLeft = (upcomingDiscountEnd - Date.now()) / 1000;

  // Discounts change at week 2
  return (
    <Label type="info" icon={SUNNYSIDE.icons.timer}>
      {secondsToString(secondsLeft, { length: "medium" })}
    </Label>
  );
};

export const VIPItems: React.FC<Props> = ({ onClose, onSkip }) => {
  const { gameService } = useContext(Context);
  const [selected, setSelected] = useState<VipBundle>();
  const { t } = useTranslation();

  const inventory = useSelector(gameService, _inventory);
  const farmId = useSelector(gameService, _farmId);

  const gemBalance = inventory["Gem"] ?? new Decimal(0);

  const handlePurchase = () => {
    const state = gameService.send("vip.purchased", {
      name: selected,
    });
  };

  const handleClick = (item: VipBundle) => {
    setSelected(item);
  };

  return (
    <>
      {!selected && (
        <div className="flex flex-col space-y-2 pt-2">
          <div className="flex justify-between px-1">
            <Label icon={vipIcon} type="default" className="ml-1">
              {t("season.vip.purchase")}
            </Label>
            <a
              href="https://docs.sunflower-land.com/player-guides/seasons#seasonal-banners"
              className="text-xxs underline"
              target="_blank"
              rel="noreferrer"
            >
              {t("read.more")}
            </a>
          </div>
          <p className="text-xs px-1">{t("season.vip.description")}</p>
          <div className="flex">
            {getKeys(VIP_PRICES).map((name) => (
              <div className="w-1/3 pr-1">
                <ButtonPanel
                  key={name}
                  className="flex flex-col items-center relative cursor-pointer hover:bg-brown-300"
                  onClick={() => setSelected(name)}
                >
                  <span className="whitespace-nowrap mb-2 mt-0.5">{`${name}`}</span>
                  <div className="flex flex-1 justify-center items-center mb-6 w-full">
                    <img
                      src={vipIcon}
                      style={{
                        width: `${PIXEL_SCALE * 12}px`,
                      }}
                      className="w-2/5 sm:w-1/4"
                    />
                  </div>
                  <Label
                    type="warning"
                    iconWidth={11}
                    icon={ITEM_DETAILS.Gem.image}
                    className="absolute h-7  -bottom-2"
                    style={{
                      left: `${PIXEL_SCALE * -3}px`,
                      right: `${PIXEL_SCALE * -3}px`,
                      width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                    }}
                  >
                    {`${VIP_PRICES[name]}`}
                  </Label>
                </ButtonPanel>
              </div>
            ))}
          </div>
          <Label type="default" icon={vipIcon} className="mb-2 ml-2">
            {t("season.vip.benefits")}
          </Label>
          <NoticeboardItems
            items={[
              {
                text: "+500 Reputation Points",
                icon: increaseArrow,
              },
              {
                text: "Monthly airdrop rewards",
                icon: giftIcon,
              },
              {
                text: "10% EXP Boost",
                icon: xpIcon,
              },
              {
                text: `+2 ${getSeasonalTicket()}s (Deliveries + Chores)`,
                icon: ITEM_DETAILS[getSeasonalTicket()].image,
              },
              {
                text: `Bonus competition points`,
                icon: trophyIcon,
              },
              {
                text: `Stella SFL discounts`,
                icon: shopIcon,
              },
            ]}
          />
        </div>
      )}
    </>
  );
};

export const VIPOffer: React.FC = () => {
  const { gameService } = useContext(Context);

  const onClose = () => {
    acknowledgeSeasonPass();
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <>
      <VIPItems onClose={onClose} onSkip={onClose} />
    </>
  );
};
