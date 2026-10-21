import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import {
  CAVE_MERCHANT_STAY_MS,
  type CaveMerchantOffer,
  type CaveMerchantVisit,
  getCaveMerchantGenerosity,
  getCaveMerchantOffersLeft,
  getCaveMerchantStock,
  getCaveMerchantVisit,
  isCaveMerchantOpen,
} from "features/game/types/caveMerchant";
import { CAVE_MAX_TIER, getNextCaveTier } from "features/game/types/caveTiers";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { formatDateTime, secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Modal } from "components/ui/Modal";
import {
  CloseButtonPanel,
  type PanelTabs,
} from "features/game/components/CloseablePanel";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { CaveToolsShop } from "./CaveToolsShop";

const _game = (state: MachineState) => state.context.state;

type Tab = "tools" | "trades";

/**
 * A visit after a long enough wait to price at 1.2x or better (5.5 days or
 * more, the longer half of the 4-7 day range) gets a badge.
 */
const GENEROUS_VISIT = 1.2;

/** An item square in a trade: the item and its amount. */
const TradeBox: React.FC<{
  image: string;
  amount?: string;
  short?: boolean;
}> = ({ image, amount, short }) => (
  <div
    className="relative flex shrink-0 items-center justify-center bg-brown-600"
    style={{
      width: `${PIXEL_SCALE * 18}px`,
      height: `${PIXEL_SCALE * 18}px`,
      ...pixelDarkBorderStyle,
    }}
  >
    <SquareIcon icon={image} width={11} />
    {amount && (
      <Label
        type={short ? "danger" : "default"}
        className="absolute text-xxs px-0.5"
        style={{
          bottom: `${PIXEL_SCALE * -4}px`,
          right: `${PIXEL_SCALE * -4}px`,
        }}
      >
        {amount}
      </Label>
    )}
  </div>
);

/** "2 Sand Drill" style text for an offer's reward. */
const rewardText = (offer: CaveMerchantOffer) =>
  `${offer.reward.amount} ${getTranslatedItemName(offer.reward.item)}`;

/** Gloomwick's empty stall while he is away, and when he is back. */
const CaveMerchantAway: React.FC<{
  visit: CaveMerchantVisit;
  now: number;
}> = ({ visit, now }) => {
  const { t } = useAppTranslation();

  const next = getCaveMerchantVisit(visit.nextOpensAt);
  const backIn = Math.max(0, (next.opensAt - now) / 1000);

  return (
    <InnerPanel className="flex items-center gap-3 p-2">
      <div className="relative shrink-0">
        <div className="opacity-50">
          <NPCIcon parts={NPC_WEARABLES.gloomwick} width={PIXEL_SCALE * 18} />
        </div>
        <img
          src={SUNNYSIDE.icons.sleeping}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 9}px`,
            top: `${PIXEL_SCALE * -2}px`,
            right: `${PIXEL_SCALE * -3}px`,
          }}
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm">{t("cave.merchant.awayTitle")}</span>
        <span className="text-xs">{t("cave.merchant.awayDescription")}</span>
        <div className="flex flex-wrap gap-1">
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {t("cave.merchant.backIn", {
              time: secondsToString(backIn, { length: "medium" }),
            })}
          </Label>
          <Label type="default">
            {t("cave.merchant.returns", {
              date: formatDateTime(new Date(next.opensAt).toISOString()),
              time: secondsToString(CAVE_MERCHANT_STAY_MS / 1000, {
                length: "short",
              }),
            })}
          </Label>
        </div>
      </div>
    </InnerPanel>
  );
};

/**
 * Gloomwick's menu: the same Sand Shovel / Sand Drill shelf Jafar sells, and
 * his Cave trades - a fresh set of bulk bridges each visit (one more slot per
 * Cave tier), with a countdown to when he leaves or returns.
 */
export const CaveMerchantModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);
  const now = useNow({ live: true });
  const [tab, setTab] = useState<Tab>("tools");

  const tier = game.cave?.tier ?? 0;
  const nextTier = getNextCaveTier(tier);
  const visit = getCaveMerchantVisit(now);
  const open = isCaveMerchantOpen(visit, now);
  const offers = open ? getCaveMerchantStock(visit.index, tier) : [];
  // Keyed on the wait, not the offers: rounding costs down already makes
  // most offers beat 1.2x, so the offers alone would badge nearly every visit.
  const generous =
    offers.length > 0 &&
    getCaveMerchantGenerosity(visit.waitHours) >= GENEROUS_VISIT;
  const leavesIn = Math.max(0, (visit.closesAt - now) / 1000);

  const trade = (slot: number) =>
    gameService.send({
      type: "cave.merchantOfferBought",
      visit: visit.index,
      slot,
    });

  const owned = (item: CaveMerchantOffer["cost"]["item"]) =>
    game.inventory[item] ?? new Decimal(0);

  const tabs: PanelTabs<Tab>[] = [
    {
      id: "tools",
      icon: ITEM_DETAILS["Sand Shovel"].image,
      name: t("tools"),
    },
    {
      id: "trades",
      icon: ITEM_DETAILS["Green Beetle"].image,
      name: t("cave.merchant.trades"),
    },
  ];

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.gloomwick}
        tabs={tabs}
        currentTab={tab}
        setCurrentTab={setTab}
        container={OuterPanel}
      >
        {tab === "tools" && <CaveToolsShop />}

        {tab === "trades" && (
          <div className="flex flex-col gap-1">
            {!open && <CaveMerchantAway visit={visit} now={now} />}

            {open && (
              <InnerPanel className="flex flex-col gap-1 p-1">
                <span className="text-xs">
                  {t("cave.merchant.description")}
                </span>
                <div className="flex flex-wrap gap-1">
                  <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                    {t("cave.merchant.leaves", {
                      time: secondsToString(leavesIn, { length: "medium" }),
                    })}
                  </Label>
                  <Label type="default">
                    {t("cave.merchant.tierProgress", {
                      tier,
                      count: offers.length,
                      total: CAVE_MAX_TIER,
                    })}
                  </Label>
                  {generous && (
                    <Label type="vibrant">{t("cave.merchant.generous")}</Label>
                  )}
                </div>
              </InnerPanel>
            )}

            {offers.map((offer) => {
              const left = getCaveMerchantOffersLeft({
                merchant: game.cave?.merchant,
                visit: visit.index,
                slot: offer.slot,
                limit: offer.limit,
              });
              const required = new Decimal(offer.cost.amount);
              const short = owned(offer.cost.item).lt(required);
              const soldOut = left <= 0;

              return (
                <InnerPanel
                  key={offer.slot}
                  className={classNames(
                    "flex flex-col sm:flex-row sm:items-center gap-2 p-2",
                    { "opacity-70": soldOut },
                  )}
                >
                  <div className="flex items-center gap-2 sm:flex-1 min-w-0">
                    <TradeBox
                      image={ITEM_DETAILS[offer.cost.item].image}
                      amount={
                        short
                          ? `${owned(offer.cost.item).toString()}/${required.toString()}`
                          : required.toString()
                      }
                      short={short}
                    />
                    <img
                      src={SUNNYSIDE.icons.arrow_right}
                      className="shrink-0"
                      style={{ width: `${PIXEL_SCALE * 7}px` }}
                    />
                    <TradeBox
                      image={ITEM_DETAILS[offer.reward.item].image}
                      amount={offer.reward.amount.toString()}
                    />
                    <div className="flex flex-col min-w-0 ml-1">
                      <span className="text-sm truncate">
                        {rewardText(offer)}
                      </span>
                      <span className="text-xxs truncate">
                        {`${offer.cost.amount} ${getTranslatedItemName(offer.cost.item)}`}
                      </span>
                    </div>
                    {offer.curiosity && (
                      <Label type="formula" className="shrink-0">
                        {t("cave.merchant.curiosity")}
                      </Label>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <Label type={soldOut ? "danger" : "formula"}>
                      {soldOut
                        ? t("cave.merchant.soldOut")
                        : t("cave.merchant.left", { left, limit: offer.limit })}
                    </Label>
                    <Button
                      className="w-28"
                      disabled={soldOut || short}
                      onClick={() => trade(offer.slot)}
                    >
                      {t("cave.merchant.trade")}
                    </Button>
                  </div>
                </InnerPanel>
              );
            })}

            {/* Each Cave tier adds one more slot to his stock. */}
            {open && nextTier && (
              <Label type="default" icon={SUNNYSIDE.icons.lock}>
                {t("cave.merchant.moreOffers", { tier: nextTier })}
              </Label>
            )}
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
