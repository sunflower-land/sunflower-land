import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import {
  getCaveMerchantOffersLeft,
  isCaveMerchantOpen,
} from "features/game/types/caveMerchant";
import type {
  CaveMerchantOffer,
  CaveMerchantVisitState,
} from "features/game/types/game";
import { CAVE_MAX_TIER, getNextCaveTier } from "features/game/types/caveTiers";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsToString } from "lib/utils/time";
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

/** Trading stops this long before the visit ends (see `closing`). */
const TRADE_CUTOFF_MS = 5_000;

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

/**
 * Gloomwick's empty stall while he is away, and when he is back. The visit in
 * state is the one the API rolled at load, so once its next opening has
 * passed (or before any visit has loaded) he is due back any moment: the
 * next load or autosave brings the new visit.
 */
const CaveMerchantAway: React.FC<{
  visit?: CaveMerchantVisitState;
  now: number;
}> = ({ visit, now }) => {
  const { t, i18n } = useAppTranslation();

  const due = !visit || now >= visit.nextOpensAt;
  const backIn = visit ? Math.max(0, (visit.nextOpensAt - now) / 1000) : 0;
  // In the player's own language and time zone.
  const returnsAt =
    visit &&
    new Date(visit.nextOpensAt).toLocaleString(i18n.language, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  const stays = visit ? (visit.closesAt - visit.opensAt) / 1000 : 0;

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
            {due
              ? t("cave.merchant.backSoon")
              : t("cave.merchant.backIn", {
                  time: secondsToString(backIn, { length: "medium" }),
                })}
          </Label>
          {!due && (
            <Label type="default">
              {t("cave.merchant.returns", {
                date: returnsAt ?? "",
                time: secondsToString(stays, { length: "short" }),
              })}
            </Label>
          )}
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
  // Rolled by the API on load, like Love Island's shop: the client never
  // prices or predicts stock itself.
  const visit = game.cave?.merchantVisit;
  const open = !!visit && isCaveMerchantOpen(visit, now);
  const offers =
    visit && open
      ? visit.offers
          .filter((offer) => offer.slot <= tier)
          .map((offer) => ({
            ...offer,
            left: getCaveMerchantOffersLeft({
              merchant: game.cave?.merchant,
              visit: visit.index,
              slot: offer.slot,
              limit: offer.limit,
            }),
          }))
      : [];
  const generous = offers.length > 0 && !!visit?.generous;
  const leavesIn = visit ? Math.max(0, (visit.closesAt - now) / 1000) : 0;
  // The clock ticks once a second but the trade is checked at the moment it
  // is sent, so stop trading just before he leaves (or restocks) rather than
  // send a trade for a visit that has ended by the time it lands.
  const closing = leavesIn * 1000 < TRADE_CUTOFF_MS;

  const trade = (slot: number) => {
    if (!visit) return;
    gameService.send({
      type: "cave.merchantOfferBought",
      visit: visit.index,
      slot,
    });
  };

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
              const { left } = offer;
              const required = new Decimal(offer.cost.amount);
              const short = owned(offer.cost.item).lt(required);
              const soldOut = left <= 0;

              return (
                <InnerPanel
                  key={offer.slot}
                  className={classNames("flex items-center gap-2 p-2", {
                    "opacity-70": soldOut,
                  })}
                >
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
                  {/* The middle column gets the room, so names wrap rather
                      than truncate. */}
                  <div className="flex flex-1 flex-col items-start gap-0.5 min-w-0 ml-2">
                    <span className="text-sm">{rewardText(offer)}</span>
                    <span
                      className={classNames("text-xs", {
                        "text-red-700": short && !soldOut,
                      })}
                    >
                      {short && !soldOut
                        ? t("cave.merchant.needMore", {
                            amount: required
                              .minus(owned(offer.cost.item))
                              .toString(),
                            item: getTranslatedItemName(offer.cost.item),
                          })
                        : t("cave.merchant.for", {
                            cost: `${offer.cost.amount} ${getTranslatedItemName(offer.cost.item)}`,
                          })}
                    </span>
                    {offer.curiosity && (
                      <Label type="vibrant">
                        {t("cave.merchant.curiosity")}
                      </Label>
                    )}
                  </div>
                  <div className="flex w-24 shrink-0 flex-col items-center gap-1">
                    {soldOut ? (
                      <Label type="danger">{t("cave.merchant.soldOut")}</Label>
                    ) : (
                      <>
                        <Label type="formula">
                          {t("cave.merchant.left", {
                            left,
                            limit: offer.limit,
                          })}
                        </Label>
                        <Button
                          disabled={short || closing}
                          onClick={() => trade(offer.slot)}
                        >
                          {t("cave.merchant.trade")}
                        </Button>
                      </>
                    )}
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
