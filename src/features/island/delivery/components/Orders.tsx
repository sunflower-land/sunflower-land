import { SUNNYSIDE } from "assets/sunnyside";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import worldIcon from "assets/icons/world_small.png";
import token from "assets/icons/sfl.webp";
import chest from "assets/icons/chest.png";
import lock from "assets/icons/lock.png";
import lightning from "assets/icons/lightning.png";

import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import {
  QuestNPCName,
  TICKET_REWARDS,
  generateDeliveryTickets,
  getCountAndTypeForDelivery,
  getOrderSellPrice,
} from "features/game/events/landExpansion/deliver";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import { GameState, Order } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPCIcon } from "features/island/bumpkin/components/NPC";

import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { getDayOfYear, secondsToString } from "lib/utils/time";
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
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import { getSeasonalTicket } from "features/game/types/seasons";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
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
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { MachineInterpreter } from "features/game/lib/gameMachine";

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
  gameService: MachineInterpreter;
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

    const { count } = getCountAndTypeForDelivery(state, name);

    return count.gte(amount);
  });
}

const makeRewardAmountForLabel = ({
  order,
  state,
}: {
  order: Order;
  state: GameState;
}) => {
  if (order.reward.sfl !== undefined) {
    const sfl = getOrderSellPrice<Decimal>(state, order);

    return formatNumber(sfl, { decimalPlaces: 4 });
  }

  const coins = getOrderSellPrice<number>(state, order);

  return formatNumber(coins);
};

export type OrderCardProps = {
  order: Order;
  selected: Order;
  onClick: (id: string) => void;
  state: GameState;
};
export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  selected,
  onClick,
  state,
}) => {
  const tickets = generateDeliveryTickets({ game: state, npc: order.from });

  return (
    <div className="py-1 px-1" key={order.id}>
      <ButtonPanel
        onClick={() => onClick(order.id)}
        className={classNames("w-full !py-2 relative", {
          "sm:!bg-brown-200": order.id === selected?.id,
        })}
        style={{ paddingBottom: "20px" }}
      >
        {hasOrderRequirements({ order, state }) && !order.completedAt && (
          <img
            src={SUNNYSIDE.icons.heart}
            className="absolute top-0.5 right-0.5 w-3 sm:w-4"
          />
        )}

        <div className="flex flex-col pb-2">
          <div className="flex items-center my-1">
            <div className="relative mb-2 mr-0.5 -ml-1">
              <NPCIcon parts={NPC_WEARABLES[order.from]} />
            </div>
            <div className="flex-1 flex justify-center h-8 items-center w-6">
              {getKeys(order.items).map((name) => {
                let img: string;

                if (name === "coins") {
                  img = SUNNYSIDE.ui.coinsImg;
                } else if (name === "sfl") {
                  img = token;
                } else {
                  if (isCollectible(name)) {
                    img = ITEM_DETAILS[name].image;
                  } else {
                    img =
                      new URL(
                        `/src/assets/wearables/${ITEM_IDS[name]}.webp`,
                        import.meta.url,
                      ).href ?? SUNNYSIDE.icons.expression_confused;
                  }
                }

                return (
                  <img key={name} src={img} className="w-6 img-highlight" />
                );
              })}
            </div>
          </div>
        </div>

        {order.completedAt && (
          <Label
            type="success"
            className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10 h-6"
            style={{ width: "calc(100% + 15px)" }}
          >
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
          </Label>
        )}
        {!order.completedAt && order.reward.sfl !== undefined && (
          <Label
            type="warning"
            iconWidth={8}
            icon={token}
            className={"absolute -bottom-2 text-center p-1 "}
            style={{
              left: `${PIXEL_SCALE * -3}px`,
              right: `${PIXEL_SCALE * -3}px`,
              width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
              height: "25px",
            }}
          >
            {`${`${makeRewardAmountForLabel({ order, state })}`}`}
          </Label>
        )}
        {!order.completedAt && order.reward.coins !== undefined && (
          <Label
            type="warning"
            icon={SUNNYSIDE.ui.coinsImg}
            className={"absolute -bottom-2 text-center p-1 "}
            style={{
              left: `${PIXEL_SCALE * -3}px`,
              right: `${PIXEL_SCALE * -3}px`,
              width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
              height: "25px",
            }}
          >
            {`${makeRewardAmountForLabel({ order, state })}`}
          </Label>
        )}
        {!order.completedAt && !!tickets && (
          <Label
            icon={ITEM_DETAILS[getSeasonalTicket()].image}
            type="warning"
            className={"absolute -bottom-2 text-center p-1 "}
            style={{
              left: `${PIXEL_SCALE * -3}px`,
              right: `${PIXEL_SCALE * -3}px`,
              width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
              height: "25px",
            }}
          >
            {tickets}
          </Label>
        )}

        {order.id === selected?.id && (
          <div id="select-box" className="hidden md:block">
            <img
              className="absolute pointer-events-none"
              src={SUNNYSIDE.ui.selectBoxTL}
              style={{
                top: `${PIXEL_SCALE * -3}px`,
                left: `${PIXEL_SCALE * -3}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <img
              className="absolute pointer-events-none"
              src={SUNNYSIDE.ui.selectBoxTR}
              style={{
                top: `${PIXEL_SCALE * -3}px`,
                right: `${PIXEL_SCALE * -3}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
          </div>
        )}
      </ButtonPanel>
    </div>
  );
};

export const LockedOrderCard: React.FC<{ npc: NPCName }> = ({ npc }) => {
  return (
    <div className="py-1 px-1">
      <ButtonPanel
        disabled
        className={classNames(
          "w-full !py-2 relative h-full flex items-center justify-center cursor-not-allowed",
        )}
        style={{ paddingBottom: "20px" }}
      >
        <div className="flex flex-col pb-2">
          <div className="flex items-center my-1">
            <div className="relative mb-2 mr-0.5 -ml-1">
              <NPCIcon parts={NPC_WEARABLES[npc]} />
            </div>
            <div className="flex-1 flex justify-center h-8 items-center w-6 ">
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="h-6 img-highlight"
              />
            </div>
          </div>
        </div>

        <Label
          type="formula"
          icon={SUNNYSIDE.icons.lock}
          className="absolute -bottom-2 text-center p-1"
          style={{
            left: `${PIXEL_SCALE * -3}px`,
            right: `${PIXEL_SCALE * -3}px`,
            width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
            height: "25px",
          }}
        >
          {`Lvl ${NPC_DELIVERY_LEVELS[npc as DeliveryNpcName]}`}
        </Label>
      </ButtonPanel>
    </div>
  );
};

export const DeliveryOrders: React.FC<Props> = ({
  selectedId,
  onSelect,
  onClose,
  state,
  gameService,
}) => {
  const { delivery, balance: sfl, coins, npcs, bumpkin } = state;

  const navigate = useNavigate();

  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const orders = delivery.orders
    .filter((order) => Date.now() >= order.readyAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  useEffect(() => {
    acknowledgeOrders(delivery);
  }, [delivery, delivery.orders]);

  let previewOrder = delivery.orders.find((order) => order.id === selectedId);

  if (!previewOrder) {
    previewOrder = orders[0];
  }
  const completedAt = npcs?.[previewOrder.from]?.deliveryCompletedAt;

  const dateKey = new Date().toISOString().substring(0, 10);

  const hasClaimedBonus =
    !!completedAt &&
    new Date(completedAt).toISOString().substring(0, 10) === dateKey;
  const canSkip =
    getDayOfYear(new Date()) !== getDayOfYear(new Date(previewOrder.createdAt));

  const skip = () => {
    setShowSkipDialog(false);
    gameService.send("order.skipped", { id: previewOrder?.id });
    gameService.send("SAVE");
  };

  const select = (id: string) => {
    setShowSkipDialog(false);
    onSelect(id);
  };

  const nextOrder = delivery.orders.find((order) => order.readyAt > Date.now());
  const skippedOrder = delivery.orders.find((order) => order.id === "skipping");
  const { t } = useAppTranslation();

  const makeRewardAmountForLabel = (order: Order) => {
    if (order.reward.sfl !== undefined) {
      const sfl = getOrderSellPrice<Decimal>(state, order);

      return formatNumber(sfl, { decimalPlaces: 4 });
    }

    const coins = getOrderSellPrice<number>(state, order);

    return formatNumber(coins);
  };

  const getLocationName = (npcName: NPCName) => {
    if (RETREAT_BUMPKINS.includes(npcName)) return t("island.goblin.retreat");
    if (BEACH_BUMPKINS.includes(npcName)) return t("island.beach");
    if (KINGDOM_BUMPKINS.includes(npcName)) return t("island.kingdom");
    return t("island.pumpkin.plaza");
  };

  if (gameService.state.matches("revealing") && isRevealing) {
    return <Revealing icon={chest} />;
  }

  if (gameService.state.matches("revealed") && isRevealing) {
    return <Revealed onAcknowledged={() => setIsRevealing(false)} />;
  }

  const { holiday } = getBumpkinHoliday({});

  // Check if matches UTC date
  const isHoliday = holiday === new Date().toISOString().split("T")[0];

  const nextHolidayInSecs =
    (new Date(holiday ?? 0).getTime() - Date.now()) / 1000;

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

  return (
    <div className="flex md:flex-row flex-col-reverse md:mr-1 items-start h-full">
      <InnerPanel
        className={classNames(
          "flex flex-col h-full overflow-hidden scrollable overflow-y-auto pl-1 md:flex w-full md:w-2/3",
          {
            hidden: selectedId,
          },
        )}
      >
        <div className="p-1">
          <div className="flex justify-between gap-1 flex-row w-full">
            <Label type="default">{t("deliveries")}</Label>
            {delivery.doubleDelivery === dateKey && (
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
          {`Coins`}
        </Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 w-full ">
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
            <Label
              type="default"
              icon={ITEM_DETAILS[getSeasonalTicket()].image}
            >
              {getSeasonalTicket()}
            </Label>
            {isHoliday && (
              <Label type="formula" icon={lock} className="mt-1">
                {t("delivery.holiday")}
              </Label>
            )}
            {nextHolidayInSecs > 0 && nextHolidayInSecs < 24 * 60 * 60 && (
              <Label type="danger" icon={lock} className="mt-1">
                {`${secondsToString(nextHolidayInSecs, {
                  length: "medium",
                })} left`}
              </Label>
            )}
          </div>
          {level <= 8 && (
            <span className="text-xs mb-2">
              {t("bumpkin.delivery.earnTickets", {
                ticket: getSeasonalTicket(),
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
        <div className="grid grid-cols-3 sm:grid-cols-4 w-full ">
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
            <Label type="default" icon={token}>
              {`SFL`}
            </Label>
          </div>
          {level <= 12 && (
            <span className="text-xs mb-2">
              {t("bumpkin.delivery.earnSFL")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 w-full ">
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

        {nextOrder && !skippedOrder && (
          <div className="w-1/2 sm:w-1/3 p-1">
            <OuterPanel
              className="w-full !py-2 relative"
              style={{ height: "80px" }}
            >
              <p className="text-center mb-0.5 mt-1 text-sm">
                {t("next.order")}{" "}
              </p>
              <div className="flex justify-center items-center">
                <img src={SUNNYSIDE.icons.timer} className="h-4 mr-2" />
                <p className="text-xs">
                  {secondsToString((nextOrder.readyAt - Date.now()) / 1000, {
                    length: "medium",
                  })}
                </p>
              </div>
            </OuterPanel>
          </div>
        )}
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
        <InnerPanel
          className={classNames(
            "md:ml-1 md:flex md:flex-col items-center flex-1 relative h-auto w-full",
            {
              hidden: !selectedId,
            },
          )}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className={classNames(
              "absolute top-2 left-2 cursor-pointer md:hidden z-10",
              {
                hidden: !selectedId,
                block: !!selectedId,
              },
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
                backgroundImage: `url(${getImageUrl(ITEM_IDS[NPC_WEARABLES[previewOrder.from].background])})`,
                backgroundSize: "100%",
              }}
            />
            <div key={previewOrder.from} className="w-9/12 md:w-full md:-ml-8">
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

                <Label type="default" icon={worldIcon} className="ml-1">
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
                      balance={
                        getCountAndTypeForDelivery(state, itemName).count
                      }
                      showLabel
                      requirement={
                        new Decimal(previewOrder?.items[itemName] ?? 0)
                      }
                    />
                  );
                })}
              </div>
              <div
                className="flex justify-between w-full border-t border-white"
                style={{
                  marginTop: "3px",
                  paddingTop: "3px",
                  marginBottom: "6px",
                }}
              >
                <div className="flex items-center">
                  <SquareIcon
                    icon={
                      previewOrder.reward.coins
                        ? SUNNYSIDE.ui.coinsImg
                        : previewOrder.reward.sfl
                          ? token
                          : ITEM_DETAILS[getSeasonalTicket()].image
                    }
                    width={7}
                  />
                  <span className="text-xs ml-1">{t("reward")}</span>
                </div>
                <Label type="warning" className="whitespace-nowrap">
                  <span className={!isMobile ? "text-xxs" : ""}>
                    {`${
                      generateDeliveryTickets({
                        game: state,
                        npc: previewOrder.from,
                      }) || makeRewardAmountForLabel(previewOrder)
                    } ${
                      previewOrder.reward.coins
                        ? t("coins")
                        : previewOrder.reward.sfl
                          ? "SFL"
                          : getSeasonalTicket()
                    }`}
                  </span>
                </Label>
              </div>
              <div className="mb-1">
                {delivery.doubleDelivery === dateKey && !hasClaimedBonus && (
                  <Label type="vibrant" icon={lightning}>
                    {t("2x.rewards")}
                  </Label>
                )}
              </div>
              <div>
                {!previewOrder.completedAt &&
                  hasOrderRequirements({
                    order: previewOrder,
                    state,
                  }) && (
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
                        location: RETREAT_BUMPKINS.includes(
                          previewOrder?.from as NPCName,
                        )
                          ? t("world.retreat")
                          : BEACH_BUMPKINS.includes(
                                previewOrder?.from as NPCName,
                              )
                            ? t("world.beach")
                            : KINGDOM_BUMPKINS.includes(
                                  previewOrder?.from as NPCName,
                                )
                              ? t("world.kingdom")
                              : t("world.plaza"),
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
          {isHoliday &&
            !!generateDeliveryTickets({
              game: state,
              npc: previewOrder.from,
            }) && (
              <Label
                type="danger"
                className="mb-1"
                icon={SUNNYSIDE.icons.stopwatch}
              >
                {t("deliveries.closed")}
              </Label>
            )}
        </InnerPanel>
      )}
    </div>
  );
};
