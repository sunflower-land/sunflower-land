import React, { useContext, useState } from "react";
import {
  SEASONS,
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

import giftIcon from "assets/icons/gift.png";
import increaseArrow from "assets/icons/increase_arrow.png";
import xpIcon from "assets/icons/xp.png";
import vipIcon from "assets/icons/vip.webp";
import blueVipIcon from "assets/icons/blue_vip.webp";
import purpleVipIcon from "assets/icons/purple_vip.webp";

import trophyIcon from "assets/icons/trophy.png";
import shopIcon from "assets/icons/shop.png";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { secondsToString } from "lib/utils/time";
import { acknowledgeVIP } from "features/announcements/announcementsStorage";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  hasVipAccess,
  VIP_DURATIONS,
  VIP_PRICES,
  VipBundle,
} from "features/game/lib/vipAccess";
import { getKeys } from "features/game/types/decorations";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import confetti from "canvas-confetti";
import { hasFeatureAccess } from "lib/flags";

const _farmId = (state: MachineState) => state.context.farmId;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _vip = (state: MachineState) => state.context.state.vip;

type Props = {
  onClose: () => void;
  onSkip?: () => void;
};

const VIP_NAME: Record<VipBundle, TranslationKeys> = {
  "1_MONTH": "vip.1Month",
  "3_MONTHS": "vip.3Months",
  "1_YEAR": "vip.1Year",
};

const VIP_ICONS: Record<VipBundle, string> = {
  "1_MONTH": vipIcon,
  "3_MONTHS": blueVipIcon,
  "1_YEAR": purpleVipIcon,
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
  const { t } = useAppTranslation();

  const inventory = useSelector(gameService, _inventory);
  const vip = useSelector(gameService, _vip);
  const farmId = useSelector(gameService, _farmId);

  const gemBalance = inventory["Gem"] ?? new Decimal(0);

  const handlePurchase = () => {
    const state = gameService.send("vip.purchased", {
      name: selected,
    });
    setSelected(undefined);
    confetti();
  };

  const hasVip = hasVipAccess({
    game: gameService.getSnapshot().context.state,
  });

  const expiresSoon =
    vip && vip.expiresAt < Date.now() + 1000 * 60 * 60 * 24 * 7;

  const hasExpired = vip && vip.expiresAt < Date.now();

  const hasOneYear =
    vip && vip.expiresAt > Date.now() + 1000 * 60 * 60 * 24 * 365;

  return (
    <>
      <ModalOverlay show={!!selected} onBackdropClick={onClose}>
        <Panel className="w-full h-full">
          <div className="flex justify-between">
            <Label type="default" className="mb-2">
              {t("vip.purchase.title")}
            </Label>
            <Label
              icon={ITEM_DETAILS.Gem.image}
              type={
                gemBalance.lt(VIP_PRICES[selected as VipBundle] ?? 0)
                  ? "danger"
                  : "warning"
              }
              className="mb-2"
            >
              {VIP_PRICES[selected as VipBundle]}
            </Label>
          </div>
          <p className="text-sm px-1 mb-2">
            {t("vip.purchase.confirm", {
              name: t(VIP_NAME[selected as VipBundle]),
            })}
          </p>
          {hasVip && (
            <div className="ml-4">
              <Label
                icon={SUNNYSIDE.icons.cancel}
                className="mb-2"
                type="transparent"
              >{`Expires ${new Date(vip?.expiresAt ?? 0).toLocaleDateString()}`}</Label>
              <Label
                icon={SUNNYSIDE.icons.confirm}
                type="transparent"
                className="mb-2"
              >{`Expires ${new Date((vip?.expiresAt ?? 0) + VIP_DURATIONS[selected as VipBundle]).toLocaleDateString()}`}</Label>
            </div>
          )}
          {hasOneYear && (
            <Label type="danger" className="mb-2">
              {t("vip.oneYear.warning")}
            </Label>
          )}
          <div className="flex ">
            <Button className="mr-1" onClick={() => setSelected(undefined)}>
              {t("no")}
            </Button>
            <Button
              disabled={
                hasOneYear ||
                gemBalance.lt(VIP_PRICES[selected as VipBundle] ?? 0)
              }
              onClick={handlePurchase}
            >
              {t("yes")}
            </Button>
          </div>
        </Panel>
      </ModalOverlay>
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
        {hasVip && (
          <>
            <div className="flex justify-between">
              <Label
                type="success"
                className="ml-2"
                icon={SUNNYSIDE.icons.confirm}
              >
                {t("vip.access")}
              </Label>
              <Label
                type={expiresSoon ? "danger" : "transparent"}
                icon={SUNNYSIDE.icons.stopwatch}
              >
                {`Expires: ${new Date(vip?.expiresAt ?? 0).toLocaleDateString()}`}
              </Label>
            </div>
          </>
        )}
        {hasExpired && (
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="danger"
            className="ml-2"
          >
            {t("expired")}
          </Label>
        )}

        <div className="flex">
          {getKeys(VIP_PRICES).map((name) => (
            <div className="w-1/3 pr-1" key={name}>
              <ButtonPanel
                key={name}
                className="flex flex-col items-center relative cursor-pointer hover:bg-brown-300"
                onClick={() => setSelected(name)}
              >
                <span className="whitespace-nowrap mb-2 mt-0.5">
                  {t(VIP_NAME[name])}
                </span>
                <div className="flex flex-1 justify-center items-center mb-6 w-full">
                  <img
                    src={VIP_ICONS[name]}
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
        {/* <Label type="default" icon={vipIcon} className="mb-2 ml-2">
          {t("vip.benefits")}
        </Label> */}
        <div className="flex flex-col ml-2">
          {[
            {
              text: t("vip.benefit.airdrop"),
              icon: giftIcon,
            },
            {
              text: t("vip.benefit.expBoost"),
              icon: xpIcon,
            },
            {
              text: t("vip.benefit.stellaDiscounts"),
              icon: shopIcon,
            },
            {
              text: t("vip.benefit.bonusDelivery"),
              icon: ITEM_DETAILS[getSeasonalTicket()].image,
            },
            ...(hasFeatureAccess(
              gameService.getSnapshot().context.state,
              "REPUTATION_SYSTEM",
            )
              ? [
                  {
                    text: t("vip.benefit.reputation"),
                    icon: increaseArrow,
                  },
                  {
                    text: t("vip.benefit.competition"),
                    icon: trophyIcon,
                  },
                ]
              : []),
          ].map((item, index) => (
            <div className="flex mb-1 items-center" key={index}>
              <img src={item.icon} className="w-6 mr-2 object-contain" />
              <div className="w-full">
                <p className="text-xs  flex-1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const VIPOffer: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const onClose = () => {
    acknowledgeVIP();
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <>
      <VIPItems onClose={onClose} onSkip={onClose} />
      <img
        src={SUNNYSIDE.icons.close}
        className="w-10 absolute -top-12 right-2 cursor-pointer"
        onClick={onClose}
      />
      <Button className="mt-2" onClick={onClose}>
        {t("continue")}
      </Button>
    </>
  );
};
