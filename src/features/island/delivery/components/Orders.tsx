import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import token from "assets/icons/flower_token.webp";
import chest from "assets/icons/chest.png";
import lock from "assets/icons/lock.png";
import lightning from "assets/icons/lightning.png";
import chapterPointsIcon from "assets/icons/red_medal_short.webp";

import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import {
  QuestNPCName,
  TICKET_REWARDS,
  areBumpkinsOnHoliday,
  generateDeliveryTickets,
  getOrderSellPrice,
} from "features/game/events/landExpansion/deliver";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import { GameState, Order } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

import { NPCName, NPC_WEARABLES } from "lib/npcs";
import {
  getDayOfYear,
  secondsTillReset,
  secondsToString,
} from "lib/utils/time";
import {
  NPC_DELIVERY_LEVELS,
  DeliveryNpcName,
  acknowledgeOrders,
  generateDeliveryMessage,
  isCoinNPC,
  isSFLNPC,
  isTicketNPC,
} from "../lib/delivery";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Label } from "components/ui/Label";
import { getBumpkinHoliday } from "lib/utils/getSeasonWeek";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { useNavigate } from "react-router";
import { getBumpkinLevel } from "features/game/lib/level";
import { SquareIcon } from "components/ui/SquareIcon";
import { formatNumber } from "lib/utils/formatNumber";
import { isMobile } from "mobile-device-detect";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { Context } from "features/game/GameProvider";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import { useNow } from "lib/utils/hooks/useNow";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { OrderCard } from "./OrderCard";
import { LockedOrderCard } from "./LockedOrderCard";
import { pixelVibrantBorderStyle } from "features/game/lib/style";
import { getChapterTaskPoints } from "features/game/types/tracks";
import { hasTimeBasedFeatureAccess } from "lib/flags";

// Bumpkins
export const BEACH_BUMPKINS: NPCName[] = [
  "corale",
  "tango",
  "finn",
  "finley",
  "miranda",
  "old salty",
  "pharaoh",
];

export const KINGDOM_BUMPKINS: NPCName[] = ["victoria", "jester", "gambit"];

export const RETREAT_BUMPKINS: NPCName[] = [
  "grubnuk",
  "goblet",
  "guria",
  "gordo",
];

interface Props {
  selectedId?: string;
  onSelect: (id?: string) => void;
  onClose: () => void;
  state: GameState;
}

export function hasOrderRequirements({
  order,
  state,
}: {
  state: GameState;
  order?: Order;
}) {
  if (!order) return false;

  const { balance, coins } = state;

  return getKeys(order.items).every((name) => {
    if (name === "coins") return coins >= (order.items[name] ?? 0);
    if (name === "sfl") return balance.gte(order.items[name] ?? 0);

    const amount = order.items[name] || new Decimal(0);

    const { count } = getCountAndType(state, name);

    return count.gte(amount);
  });
}

export const DeliveryOrders: React.FC<Props> = ({
  selectedId,
  onSelect,
  onClose,
  state,
}) => {
  const { gameService } = useContext(Context);

  const { delivery, balance: sfl, coins, npcs, bumpkin } = state;

  const navigate = useNavigate();

  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const now = useNow({ live: true });
  const chapterTicket = getChapterTicket(now);

  const orders = delivery.orders
    .filter((order) => now >= order.readyAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  useEffect(() => {
    acknowledgeOrders(delivery);
  }, [delivery, delivery.orders]);

  let previewOrder = delivery.orders.find((order) => order.id === selectedId);

  if (!previewOrder) {
    previewOrder = orders[0];
  }
  const completedAt = npcs?.[previewOrder.from]?.deliveryCompletedAt;

  const dateKey = new Date(now).toISOString().substring(0, 10);

  const hasClaimedBonus =
    !!completedAt &&
    new Date(completedAt).toISOString().substring(0, 10) === dateKey;
  const canSkip =
    getDayOfYear(new Date(now)) !==
    getDayOfYear(new Date(previewOrder.createdAt));

  const skip = () => {
    setShowSkipDialog(false);
    onSelect(undefined);
    gameService.send("order.skipped", { id: previewOrder?.id });
    gameService.send("SAVE");
  };

  const select = (id: string) => {
    setShowSkipDialog(false);
    onSelect(id);
  };

  const nextOrder = delivery.orders.find((order) => order.readyAt > now);
  const skippedOrder = delivery.orders.find((order) => order.id === "skipping");
  const { t, i18n } = useAppTranslation();

  const makeRewardAmountForLabel = (order: Order) => {
    if (order.reward.sfl !== undefined) {
      const { reward: sfl } = getOrderSellPrice<Decimal>(state, order);

      return formatNumber(sfl, { decimalPlaces: 4 });
    }

    const { reward: coins } = getOrderSellPrice<number>(state, order);

    return formatNumber(coins);
  };

  const getLocationName = (npcName: NPCName) => {
    if (RETREAT_BUMPKINS.includes(npcName)) return t("world.retreat");
    if (BEACH_BUMPKINS.includes(npcName)) return t("world.beach");
    if (KINGDOM_BUMPKINS.includes(npcName)) return t("world.kingdom");
    return t("world.plaza");
  };

  const getPreposition = (location: string) => {
    if (i18n.language === "ru") {
      const customPreposition: Record<string, string> = {
        [t("world.retreat")]: "в",
        [t("world.beach")]: "на",
        [t("world.kingdom")]: "в",
        [t("world.plaza")]: "на",
      };
      return customPreposition[location] || "в";
    }
    return "";
  };

  if (gameService.getSnapshot().matches("revealing") && isRevealing) {
    return <Revealing icon={chest} />;
  }

  if (gameService.getSnapshot().matches("revealed") && isRevealing) {
    return <Revealed onAcknowledged={() => setIsRevealing(false)} />;
  }

  const { holiday } = getBumpkinHoliday({ now });

  // Check if matches UTC date
  const todayDate = new Date(now).toISOString().split("T")[0];
  const isHoliday = holiday === todayDate;

  const nextHolidayInSecs = (new Date(holiday ?? 0).getTime() - now) / 1000;

  const level = getBumpkinLevel(bumpkin?.experience ?? 0);

  const coinOrders = orders.filter((order) => order.reward.coins);
  const sflOrders = orders.filter((order) => order.reward.sfl);
  const ticketOrders = orders.filter(
    (order) => !!TICKET_REWARDS[order.from as QuestNPCName],
  );

  const nextCoinUnlock = getKeys(NPC_DELIVERY_LEVELS)
    .filter((name) => isCoinNPC(name))
    .sort((a, b) => (NPC_DELIVERY_LEVELS[a] > NPC_DELIVERY_LEVELS[b] ? 1 : -1))
    .find((npc) => level < (NPC_DELIVERY_LEVELS?.[npc] ?? 0));

  const nextTicketUnlock = getKeys(NPC_DELIVERY_LEVELS)
    .filter((name) => isTicketNPC(name))
    .sort((a, b) => (NPC_DELIVERY_LEVELS[a] > NPC_DELIVERY_LEVELS[b] ? 1 : -1))
    .find((npc) => level < (NPC_DELIVERY_LEVELS?.[npc] ?? 0));

  const nextSFLUnlock = getKeys(NPC_DELIVERY_LEVELS)
    .filter((name) => isSFLNPC(name))
    .sort((a, b) => (NPC_DELIVERY_LEVELS[a] > NPC_DELIVERY_LEVELS[b] ? 1 : -1))
    .find((npc) => level < (NPC_DELIVERY_LEVELS?.[npc] ?? 0));

  const baseTickets = generateDeliveryTickets({
    game: state,
    npc: previewOrder.from,
    now,
  });

  // During ticket freeze (holiday), quest ticket deliveries are blocked.
  // Coin deliveries can still be completed but award 0 tickets.
  // Hide ticket counts on frozen quest orders to avoid mixed messaging.
  const tickets =
    isHoliday && !isTicketNPC(previewOrder.from) ? 0 : baseTickets;
  const ticketDisplay =
    isHoliday && isTicketNPC(previewOrder.from) && baseTickets > 0
      ? 0
      : tickets;

  const getChapterPoints = () => {
    if (
      isCoinNPC(previewOrder.from) &&
      hasTimeBasedFeatureAccess({
        featureName: "TICKETS_FROM_COIN_NPC",
        now: previewOrder.createdAt,
        game: state,
      })
    ) {
      if (areBumpkinsOnHoliday(previewOrder.createdAt)) {
        return 0;
      } else {
        return getChapterTaskPoints({
          task: "coinDelivery",
          points: 10,
        });
      }
    }
    return getChapterTaskPoints({
      task: "delivery",
      points: ticketDisplay,
    });
  };

  const chapterPoints = getChapterPoints();

  const isFrozenQuestOrder =
    isHoliday && isTicketNPC(previewOrder.from) && baseTickets > 0;
  const hasRewardAmount =
    previewOrder.reward.coins !== undefined ||
    previewOrder.reward.sfl !== undefined;
  const rewardDisplayValue = hasRewardAmount
    ? makeRewardAmountForLabel(previewOrder)
    : ticketDisplay;

  const chapter = getCurrentChapter(now);

  return (
    <div className="flex md:flex-row flex-col-reverse md:mr-1 items-start h-full">
      <InnerPanel
        className={classNames(
          "flex flex-col h-full overflow-hidden scrollable overflow-y-auto pl-1 md:flex w-full md:w-2/3",
          { hidden: selectedId },
        )}
      >
        <div className="p-1">
          <div className="flex justify-between gap-1 flex-wrap w-full">
            <Label type="default">{t("deliveries")}</Label>
            {getActiveCalendarEvent({ calendar: state.calendar }) ===
              "doubleDelivery" && (
              <Label type="vibrant" icon={lightning}>
                {t("double.rewards.deliveries")}
              </Label>
            )}
          </div>
          <p className="my-2 ml-1 text-xs">{t("deliveries.intro")}</p>
        </div>

        <Label
          type="default"
          className="ml-2 mb-2"
          icon={SUNNYSIDE.ui.coinsImg}
        >
          {t("coins")}
        </Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 w-full ml-1">
          {coinOrders.map((order) => {
            return (
              <OrderCard
                state={state}
                key={order.id}
                order={order}
                selected={previewOrder}
                onClick={(id) => select(id)}
              />
            );
          })}
          {nextCoinUnlock && <LockedOrderCard npc={nextCoinUnlock} />}
        </div>

        <div className="px-2 mt-2">
          <div className="flex justify-between items-center">
            <div className="flex  items-center">
              <Label
                type="default"
                icon={ITEM_DETAILS[chapterTicket].image}
                className="mb-2"
              >
                {chapterTicket}
              </Label>
              <img src={chapterPointsIcon} className="h-5 mb-2 ml-0.5" />
            </div>
            {isHoliday && (
              <Label type="formula" icon={lock} className="mt-1">
                {t("delivery.holiday")}
              </Label>
            )}
            <NextHolidayLabel holiday={holiday} now={now} />
          </div>
          {level <= 8 && (
            <span className="text-xs mb-2">
              {t("bumpkin.delivery.earnTickets", {
                ticket: chapterTicket,
              })}
            </span>
          )}
          {nextHolidayInSecs > 0 && nextHolidayInSecs < 24 * 60 * 60 && (
            <span className="text-xs mb-2">
              {t("delivery.holiday.closingSoon")}
            </span>
          )}
          {isHoliday && (
            <span className="text-xs mb-2">{t("delivery.holiday.closed")}</span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 w-full ml-1">
          {ticketOrders.map((order) => {
            return (
              <OrderCard
                state={state}
                key={order.id}
                order={order}
                selected={previewOrder}
                onClick={(id) => select(id)}
              />
            );
          })}
          {nextTicketUnlock && <LockedOrderCard npc={nextTicketUnlock} />}
        </div>

        <div className="px-2 mt-2">
          <div className="flex justify-between">
            <Label type="default" icon={token} className="mb-2">
              {`FLOWER`}
            </Label>
          </div>
          {level <= 12 && (
            <span className="text-xs mb-2">
              {t("bumpkin.delivery.earnSFL")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 w-full ml-1">
          {sflOrders.map((order) => {
            return (
              <OrderCard
                state={state}
                key={order.id}
                order={order}
                selected={previewOrder}
                onClick={(id) => select(id)}
              />
            );
          })}
          {nextSFLUnlock && <LockedOrderCard npc={nextSFLUnlock} />}
        </div>

        {nextOrder && !skippedOrder && <NextOrderPanel nextOrder={nextOrder} />}
        {skippedOrder && (
          <div className="w-1/2 sm:w-1/3 p-1">
            <OuterPanel
              className="w-full !py-2 relative"
              style={{ height: "80px" }}
            >
              <Loading
                className="text-center mb-0.5 mt-1 text-sm loading"
                text={t("skipping")}
              />
            </OuterPanel>
          </div>
        )}
      </InnerPanel>
      {previewOrder && (
        <div
          className={classNames(
            "md:ml-1   flex-1 relative w-full overflow-y-auto scrollable max-h-[440px]",
            { hidden: !selectedId },
          )}
        >
          <InnerPanel
            className={classNames(
              "md:flex md:flex-col items-center relative w-full",
            )}
          >
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className={classNames(
                "absolute top-2 left-2 cursor-pointer md:hidden z-10",
                { hidden: !selectedId, block: !!selectedId },
              )}
              style={{ width: `${PIXEL_SCALE * 11}px` }}
              onClick={() => onSelect(undefined)}
            />
            <div
              className="mb-1 mx-auto w-full col-start-1 row-start-1 overflow-hidden z-0 rounded-lg relative"
              style={{
                height: `${PIXEL_SCALE * 50}px`,
                background:
                  "linear-gradient(0deg, rgba(4,159,224,1) 0%, rgba(31,109,213,1) 100%)",
              }}
            >
              <p
                className="z-10 absolute bottom-1 right-1.5 capitalize text-xs"
                style={{
                  background: "#ffffffaf",
                  padding: "2px",
                  borderRadius: "3px",
                }}
              >
                {previewOrder.from}
              </p>

              <div
                className="absolute -inset-2 bg-repeat"
                style={{
                  height: `${PIXEL_SCALE * 50}px`,
                  backgroundImage: `url(${SUNNYSIDE.ui.heartBg})`,
                  backgroundSize: `${32 * PIXEL_SCALE}px`,
                }}
              />

              <div
                className="absolute -inset-2 bg-repeat"
                style={{
                  height: `${PIXEL_SCALE * 80}px`,
                  backgroundImage: `url(${getImageUrl(ITEM_IDS[NPC_WEARABLES[previewOrder.from].background!])})`,
                  backgroundSize: "100%",
                }}
              />
              <div
                key={previewOrder.from}
                className="w-9/12 md:w-full md:-ml-8"
              >
                <DynamicNFT
                  key={previewOrder.from}
                  bumpkinParts={NPC_WEARABLES[previewOrder.from]}
                />
              </div>
            </div>
            {showSkipDialog && (
              <>
                <div className="flex-1 space-y-2 p-1">
                  <p className="text-xs">{t("orderhelp.Skip.hour")}</p>
                  {canSkip && <p className="text-xs">{t("choose.wisely")}</p>}
                  {!canSkip && (
                    <>
                      <p className="text-xs font-secondary">
                        {`${t("orderhelp.SkipIn")}:`}
                      </p>
                      <div className="flex-1">
                        <RequirementLabel
                          type="time"
                          waitSeconds={secondsTillReset()}
                        />
                      </div>
                    </>
                  )}
                </div>
                {canSkip && (
                  <div className="flex flex-col gap-1">
                    <Button onClick={() => setShowSkipDialog(false)}>
                      {t("orderhelp.NoRight")}
                    </Button>
                    <Button onClick={skip}>{t("skip.order")}</Button>
                  </div>
                )}
                {!canSkip && (
                  <Button onClick={() => setShowSkipDialog(false)}>
                    {t("back")}
                  </Button>
                )}
              </>
            )}
            {!showSkipDialog && (
              <div className="flex-1 space-y-2 p-1 w-full">
                <div className="text-xs space-y-2">
                  <p>
                    {generateDeliveryMessage({
                      from: previewOrder?.from as DeliveryNpcName,
                      id: previewOrder.id,
                    })}
                  </p>

                  <Label
                    type="default"
                    icon={SUNNYSIDE.icons.worldIcon}
                    className="ml-1"
                  >
                    <div className="pl-0.5">
                      {getLocationName(previewOrder.from)}
                    </div>
                  </Label>
                </div>
                <div className="">
                  {getKeys(previewOrder.items).map((itemName, index) => {
                    if (itemName === "sfl") {
                      return (
                        <RequirementLabel
                          key={`${itemName}-${index}-sfl`}
                          type="sfl"
                          balance={sfl}
                          requirement={
                            new Decimal(previewOrder?.items[itemName] ?? 0)
                          }
                          showLabel
                        />
                      );
                    }

                    if (itemName === "coins") {
                      return (
                        <RequirementLabel
                          key={`${itemName}-${index}-coins`}
                          type="coins"
                          balance={coins}
                          requirement={previewOrder?.items[itemName] ?? 0}
                          showLabel
                        />
                      );
                    }

                    return (
                      <RequirementLabel
                        key={`${itemName}-${index}-items`}
                        type="item"
                        item={itemName}
                        balance={getCountAndType(state, itemName).count}
                        showLabel
                        requirement={
                          new Decimal(previewOrder?.items[itemName] ?? 0)
                        }
                      />
                    );
                  })}
                </div>
                <div
                  className="flex flex-col gap-2 w-full border-t border-white"
                  style={{
                    marginTop: "3px",
                    paddingTop: "3px",
                    marginBottom: "6px",
                  }}
                >
                  <div className="flex justify-between w-full">
                    <div className="flex items-center">
                      <SquareIcon
                        icon={
                          previewOrder.reward.coins
                            ? SUNNYSIDE.ui.coinsImg
                            : previewOrder.reward.sfl
                              ? token
                              : ITEM_DETAILS[chapterTicket].image
                        }
                        width={7}
                      />
                      <span className="text-xs ml-1">{t("reward")}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isFrozenQuestOrder && !hasRewardAmount ? (
                        <Label
                          type="danger"
                          className="whitespace-nowrap"
                          icon={SUNNYSIDE.icons.stopwatch}
                        >
                          <span className={!isMobile ? "text-xxs" : ""}>
                            {t("deliveries.closed")}
                          </span>
                        </Label>
                      ) : (
                        <>
                          {hasRewardAmount && (
                            <Label type="warning" className="whitespace-nowrap">
                              <span className={!isMobile ? "text-xxs" : ""}>
                                {`${rewardDisplayValue} ${
                                  previewOrder.reward.coins
                                    ? t("coins")
                                    : previewOrder.reward.sfl
                                      ? "FLOWER"
                                      : chapterTicket
                                }`}
                              </span>
                            </Label>
                          )}
                          {!!ticketDisplay && (
                            <Label
                              type="warning"
                              className="whitespace-nowrap"
                              icon={ITEM_DETAILS[chapterTicket].image}
                            >
                              <span className={!isMobile ? "text-xxs" : ""}>
                                {`${ticketDisplay} ${chapterTicket}`}
                              </span>
                            </Label>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {getKeys(previewOrder.reward.items ?? {}).length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                      {getKeys(previewOrder.reward.items ?? {}).map((item) => (
                        <Label
                          key={item}
                          type="warning"
                          className="whitespace-nowrap"
                        >
                          <span className={!isMobile ? "text-xxs" : ""}>
                            {`${previewOrder.reward.items?.[item]} ${item}`}
                          </span>
                        </Label>
                      ))}
                    </div>
                  )}
                  {/* Points are displayed below in the purple badge. */}
                </div>
                <div className="mb-1">
                  {getActiveCalendarEvent({ calendar: state.calendar }) ===
                    "doubleDelivery" &&
                    !hasClaimedBonus && (
                      <Label type="vibrant" icon={lightning}>
                        {t("2x.rewards")}
                      </Label>
                    )}
                </div>
                <div>
                  {!previewOrder.completedAt &&
                    hasOrderRequirements({ order: previewOrder, state }) && (
                      <Button
                        className="!text-xs !mt-0 !-mb-1"
                        onClick={() => {
                          gameService.send("SAVE");
                          onClose();
                          {
                            if (
                              RETREAT_BUMPKINS.includes(
                                previewOrder?.from as NPCName,
                              )
                            ) {
                              navigate("/world/retreat");
                            } else if (
                              BEACH_BUMPKINS.includes(
                                previewOrder?.from as NPCName,
                              )
                            ) {
                              navigate("/world/beach");
                            } else if (
                              KINGDOM_BUMPKINS.includes(
                                previewOrder?.from as NPCName,
                              )
                            ) {
                              navigate("/world/kingdom");
                            } else {
                              navigate("/world/plaza");
                            }
                          }
                        }}
                      >
                        {t("world.travelTo", {
                          customPreposition: getPreposition(
                            getLocationName(previewOrder.from),
                          ),
                          location: getLocationName(previewOrder.from),
                        })}
                      </Button>
                    )}
                </div>
                {previewOrder.completedAt ? (
                  <div className="flex">
                    <img src={SUNNYSIDE.icons.confirm} className="mr-2 h-4" />
                    <p className="text-xxs">{t("completed")}</p>
                  </div>
                ) : (
                  <p
                    className="underline font-secondary text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
                    onClick={() => setShowSkipDialog(true)}
                  >
                    {t("skip.order")}
                    {"?"}
                  </p>
                )}
              </div>
            )}
            {isHoliday && isTicketNPC(previewOrder.from) && baseTickets > 0 && (
              <Label
                type="danger"
                className="mb-1"
                icon={SUNNYSIDE.icons.stopwatch}
              >
                {t("deliveries.closed")}
              </Label>
            )}
          </InnerPanel>
          {!!chapterPoints && (
            <div
              className={classNames(
                `w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`,
              )}
              style={{
                background: "#b65389",
                color: "#ffffff",
                ...pixelVibrantBorderStyle,
              }}
            >
              <img src={chapterPointsIcon} className="h-4 mr-2" />
              <p className="text-xs">{`+${chapterPoints} ${chapter} points`}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NextHolidayLabel: React.FC<{
  holiday: string | undefined;
  now: number;
}> = ({ holiday }) => {
  const { totalSeconds: secondsRemaining } = useCountdown(
    new Date(holiday ?? 0).getTime(),
  );

  if (!holiday) return null;

  if (secondsRemaining > 0 && secondsRemaining < 24 * 60 * 60) {
    return (
      <Label type="danger" icon={lock} className="mt-1">
        {`${secondsToString(secondsRemaining, {
          length: "medium",
        })} left`}
      </Label>
    );
  }
  return null;
};

const NextOrderPanel: React.FC<{ nextOrder: Order }> = ({ nextOrder }) => {
  const { t } = useAppTranslation();
  const { totalSeconds: secondsRemaining } = useCountdown(nextOrder.readyAt);

  return (
    <div className="w-1/2 sm:w-1/3 p-1">
      <OuterPanel className="w-full !py-2 relative" style={{ height: "80px" }}>
        <p className="text-center mb-0.5 mt-1 text-sm">{t("next.order")} </p>
        <div className="flex justify-center items-center">
          <img src={SUNNYSIDE.icons.timer} className="h-4 mr-2" />
          <p className="text-xs">
            {secondsToString(secondsRemaining, {
              length: "medium",
            })}
          </p>
        </div>
      </OuterPanel>
    </div>
  );
};
