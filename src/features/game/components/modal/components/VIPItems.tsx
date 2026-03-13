import React, { useContext, useState } from "react";
import {
  getCurrentChapter,
  getChapterTicket,
} from "features/game/types/chapters";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

import lockIcon from "assets/icons/lock.png";
import giftIcon from "assets/icons/gift.png";
import increaseArrow from "assets/icons/increase_arrow.png";
import xpIcon from "assets/icons/xp.png";
import vipIcon from "assets/icons/vip.webp";
import blueVipIcon from "assets/icons/blue_vip.webp";
import purpleVipIcon from "assets/icons/purple_vip.webp";
import multiCast from "src/assets/icons/multi-cast.webp";

import trophyIcon from "assets/icons/trophy.png";
import shopIcon from "assets/icons/shop.png";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { acknowledgeVIP } from "features/announcements/announcementsStorage";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  hasVipAccess,
  VIP_PRICES,
  VIP_TRIAL_PERIOD_MS,
  VipBundle,
} from "features/game/lib/vipAccess";
import { getKeys } from "lib/object";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { gameAnalytics } from "lib/gameAnalytics";
import { REPUTATION_POINTS } from "features/game/lib/reputation";
import * as Auth from "features/auth/lib/Provider";
import { useNow } from "lib/utils/hooks/useNow";
import { hasTimeBasedFeatureAccess } from "lib/flags";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { GameState } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { VIPSavings } from "./VIPSavings";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _vip = (state: MachineState) => state.context.state.vip;
const _state = (state: MachineState) => state.context.state;

const VIP_NAME: Record<VipBundle, TranslationKeys> = {
  "1_MONTH": "vip.1Month",
  "3_MONTHS": "vip.3Months",
  "2_YEARS": "vip.2Years",
};

const VIP_ICONS: Record<VipBundle, string> = {
  "1_MONTH": vipIcon,
  "3_MONTHS": blueVipIcon,
  "2_YEARS": purpleVipIcon,
};

const VIPLabel: React.FC<{ state: GameState; now: number }> = ({
  state,
  now,
}) => {
  const { t } = useAppTranslation();

  if (!state.vip || (!state.vip.trialStartedAt && !state.vip.expiresAt)) {
    return null;
  }
  const hasVip = hasVipAccess({ game: state, now, type: "full" });

  const hasTrial = !hasVip && hasVipAccess({ game: state, now, type: "trial" });

  if (hasTrial) {
    return (
      <Label type="success" className="ml-2" icon={SUNNYSIDE.icons.confirm}>
        {`Trial - ${secondsToString((state.vip.trialStartedAt! + VIP_TRIAL_PERIOD_MS - now) / 1000, { length: "short" })} left`}
      </Label>
    );
  }

  const vipExpiresAt = state.vip?.expiresAt ?? 0;
  const expiresSoon = vipExpiresAt < now + 1000 * 60 * 60 * 24 * 7;

  if (hasVip) {
    return (
      <>
        <div className="flex justify-between my-2">
          <Label type="success" className="ml-2" icon={SUNNYSIDE.icons.confirm}>
            {t("vip.access")}
          </Label>
          {Number(vipExpiresAt) > 0 && (
            <Label
              type={expiresSoon ? "danger" : "transparent"}
              icon={SUNNYSIDE.icons.stopwatch}
            >
              {`Expires: ${new Date(vipExpiresAt).toLocaleDateString()}`}
            </Label>
          )}
        </div>
      </>
    );
  }

  return (
    <Label icon={SUNNYSIDE.icons.stopwatch} type="danger" className="ml-2">
      {t("expired")}
    </Label>
  );
};

export const VIPItems: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { gameService } = useContext(Context);
  const [selected, setSelected] = useState<VipBundle>();
  const { t } = useAppTranslation();
  const { authService } = useContext(Auth.Context);
  const inventory = useSelector(gameService, _inventory);
  const vip = useSelector(gameService, _vip);
  const state = useSelector(gameService, _state);
  const now = useNow();

  const gemBalance = inventory["Gem"] ?? new Decimal(0);

  const handlePurchase = () => {
    gameService.send("vip.bought", {
      effect: { type: "vip.bought", bundle: selected },
      authToken: authService.getSnapshot().context.user.rawToken as string,
    });
    gameAnalytics.trackSink({
      currency: "Gem",
      amount: VIP_PRICES[selected as VipBundle],
      item: selected as VipBundle,
      type: "Web3",
    });
    setSelected(undefined);
  };

  const hasTrial =
    !hasVipAccess({ game: state, type: "full" }) &&
    hasVipAccess({ game: state, now, type: "trial" });

  const hasOneYear = vip && vip.expiresAt > now + 1000 * 60 * 60 * 24 * 365;

  const getExpiresAt = () => {
    if (!vip) return 0;

    const paidVipExpiresAt = vip?.expiresAt ?? 0;

    return paidVipExpiresAt;
  };

  const vipExpiresAt = getExpiresAt();
  const chapterTicket = getChapterTicket(now);
  const currentChapter = getCurrentChapter(now);

  return (
    <>
      <ModalOverlay
        show={!!selected}
        onBackdropClick={() => setSelected(undefined)}
      >
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
      <div className="flex flex-col pt-2 max-h-[400px] scrollable px-0.5 overflow-y-scroll">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            {!!onBack && (
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="w-6 cursor-pointer"
                onClick={onBack}
              />
            )}
            <Label icon={vipIcon} type="default" className="ml-1">
              {t("season.vip.purchase")}
            </Label>
          </div>
          <a
            href="https://docs.sunflower-land.com/roadmap/chapters"
            className="text-xxs underline"
            target="_blank"
            rel="noreferrer"
          >
            {t("read.more")}
          </a>
        </div>
        <p className="text-xs px-1 mt-2 mb-2">{t("season.vip.description")}</p>
        <VIPLabel state={state} now={now} />

        <div className="flex mt-3 mb-2 px-1">
          {getKeys(VIP_PRICES).map((name) => (
            <div className="w-1/3 pr-1" key={name}>
              <ButtonPanel
                key={name}
                className="flex flex-col items-center relative"
                onClick={() => setSelected(name)}
              >
                <span className="whitespace-nowrap mb-2 mt-0.5">
                  {t(VIP_NAME[name])}
                </span>
                <div className="flex flex-1 justify-center items-center mb-6 w-full">
                  <img
                    src={VIP_ICONS[name]}
                    style={{ width: `${PIXEL_SCALE * 12}px` }}
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
        <div className="flex flex-col space-y-1 ml-1 mb-2 justify-between h-full">
          <NoticeboardItems
            items={[
              { text: t("vip.benefit.airdrop"), icon: giftIcon },
              { text: t("vip.benefit.expBoost"), icon: xpIcon },
              {
                text: t("vip.benefit.cookingQueue"),
                icon: ITEM_DETAILS["Pumpkin Soup"].image,
              },
              ...(hasTimeBasedFeatureAccess({
                game: state,
                featureName: "CRAFTING_BOX_QUEUES",
                now,
              })
                ? [
                    {
                      text: t("vip.benefit.craftingQueue"),
                      icon: ITEM_DETAILS["Crafting Box"].image,
                    },
                  ]
                : []),
              {
                text: t("vip.benefit.multicast"),
                icon: multiCast,
              },
              { text: t("vip.benefit.stellaDiscounts"), icon: shopIcon },
              {
                text: t("vip.benefit.bonusDelivery"),
                icon: ITEM_DETAILS[chapterTicket].image,
              },
              {
                text: t("vip.benefit.reputation", {
                  points: REPUTATION_POINTS.VIP,
                }),
                icon: increaseArrow,
                label: hasTrial
                  ? {
                      labelType: "danger",
                      shortDescription: t("vip.fullVipRequired"),
                      boostTypeIcon: lockIcon,
                    }
                  : undefined,
              },
              { text: t("vip.benefit.competition"), icon: trophyIcon },
              ...(currentChapter === "Paw Prints"
                ? [
                    {
                      text: t("vip.benefit.bonusPetEnergy"),
                      icon: SUNNYSIDE.icons.lightning,
                    },
                  ]
                : []),
              ...(currentChapter === "Crabs and Traps"
                ? [
                    {
                      text: t("vip.benefit.bonusFishingAttempts"),
                      icon: ITEM_DETAILS["Rod"].image,
                    },
                  ]
                : []),
            ]}
          />
        </div>
        <div className="mt-3 px-0.5">
          <VIPSavings />
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
      <VIPItems />
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
