import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import sflIcon from "assets/icons/sfl.webp";
import coinsImg from "assets/icons/coins.webp";
import worldIcon from "assets/icons/world_small.png";
import heartBg from "assets/ui/heart_bg.png";
import chest from "assets/icons/chest.png";
import lockIcon from "assets/skills/lock.png";

import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { getOrderSellPrice } from "features/game/events/landExpansion/deliver";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import { Order } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPCIcon } from "features/island/bumpkin/components/NPC";

import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { getDayOfYear, secondsToString } from "lib/utils/time";
import { acknowledgeOrders, generateDeliveryMessage } from "../lib/delivery";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineState } from "features/game/lib/gameMachine";
import { getSeasonalTicket } from "features/game/types/seasons";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Label } from "components/ui/Label";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

// Bumpkins
export const BEACH_BUMPKINS: NPCName[] = [
  "corale",
  "shelly",
  "tango",
  "finn",
  "finley",
  "miranda",
];

export const RETREAT_BUMPKINS: NPCName[] = [
  "grubnuk",
  "goblet",
  "guria",
  "gordo",
];

interface Props {
  selectedId?: string;
  onSelect: (id?: string) => void;
}

const _delivery = (state: MachineState) => state.context.state.delivery;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _sfl = (state: MachineState) => state.context.state.balance;
const _coins = (state: MachineState) => state.context.state.coins;

export const DeliveryOrders: React.FC<Props> = ({ selectedId, onSelect }) => {
  const { gameService } = useContext(Context);

  const delivery = useSelector(gameService, _delivery);
  const inventory = useSelector(gameService, _inventory);
  const sfl = useSelector(gameService, _sfl);
  const coins = useSelector(gameService, _coins);

  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const gameState = gameService.state.context.state;

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

  const canSkip =
    getDayOfYear(new Date()) !== getDayOfYear(new Date(previewOrder.createdAt));

  const skip = () => {
    setShowSkipDialog(false);
    gameService.send("order.skipped", { id: previewOrder?.id });
    gameService.send("SAVE");
  };

  const hasRequirements = (order?: Order) => {
    if (!order) return false;

    return getKeys(order.items).every((name) => {
      if (name === "coins") return coins >= (order.items[name] ?? 0);
      if (name === "sfl") return sfl.gte(order.items[name] ?? 0);

      const amount = order.items[name] || new Decimal(0);
      const count = inventory[name] || new Decimal(0);

      return count.gte(amount);
    });
  };

  const select = (id: string) => {
    setShowSkipDialog(false);
    onSelect(id);
  };

  const nextOrder = delivery.orders.find((order) => order.readyAt > Date.now());
  const skippedOrder = delivery.orders.find((order) => order.id === "skipping");
  const { t } = useAppTranslation();

  const progress = Math.min(
    delivery.milestone.goal,
    delivery.milestone.goal -
      (delivery.milestone.total - delivery.fulfilledCount)
  );

  const reachMilestone = () => {
    gameService.send("REVEAL", {
      event: {
        type: "delivery.milestoneReached",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
  };

  const makeRewardAmountForLabel = (order: Order) => {
    if (order.reward.sfl !== undefined) {
      const sfl = getOrderSellPrice<Decimal>(gameState, order);

      return sfl.toFixed(2);
    }

    const coins = getOrderSellPrice<number>(gameState, order);

    return coins % 1 === 0 ? coins.toString() : coins.toFixed(2);
  };

  if (gameService.state.matches("revealing") && isRevealing) {
    return <Revealing icon={chest} />;
  }

  if (gameService.state.matches("revealed") && isRevealing) {
    return <Revealed onAcknowledged={() => setIsRevealing(false)} />;
  }

  const { tasksAreClosing, tasksStartAt, tasksCloseAt, tasksAreFrozen } =
    getSeasonChangeover({ id: gameService.state.context.farmId });

  return (
    <div className="flex md:flex-row flex-col-reverse md:mr-1 items-start h-full">
      <div
        className={classNames("md:flex flex-col w-full md:w-2/3 h-full", {
          hidden: selectedId,
        })}
      >
        {
          // Give 24 hours heads up before tasks close
          tasksAreClosing && (
            <div className="flex flex-col items-center">
              <p className="text-xs text-center">{t("orderhelp.New.Season")}</p>
              <Label type="info" icon={SUNNYSIDE.icons.timer} className="mt-1">
                {secondsToString((tasksCloseAt - Date.now()) / 1000, {
                  length: "full",
                })}
              </Label>
            </div>
          )
        }
        {tasksAreFrozen && (
          <div className="flex flex-col items-center">
            <p className="text-xs text-center">
              {t("orderhelp.New.Season.arrival")}
            </p>
            <Label
              type="info"
              icon={SUNNYSIDE.icons.stopwatch}
              className="mt-1"
            >
              {secondsToString((tasksStartAt - Date.now()) / 1000, {
                length: "full",
              })}
            </Label>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 w-full scrollable overflow-y-auto pl-1">
          {orders.map((order) => {
            return (
              <div className="py-1 px-2" key={order.id}>
                <OuterPanel
                  onClick={() => select(order.id)}
                  className={classNames(
                    "w-full cursor-pointer hover:bg-brown-200 !py-2 relative",
                    {
                      "sm:!bg-brown-200 sm:img-highlight":
                        order.id === previewOrder?.id,
                    }
                  )}
                  style={{ paddingBottom: "20px" }}
                >
                  {hasRequirements(order) && !order.completedAt && (
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
                      <div className="flex-1 flex justify-center h-8 items-center w-6 ">
                        {getKeys(order.items).map((name) => {
                          let img: string;

                          if (name === "coins") {
                            img = coinsImg;
                          } else if (name === "sfl") {
                            img = sflIcon;
                          } else {
                            img = ITEM_DETAILS[name].image;
                          }

                          return (
                            <img
                              key={name}
                              src={img}
                              className="w-6 img-highlight"
                            />
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
                      icon={sflIcon}
                      className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10 h-6"
                      style={{ width: "calc(100% + 15px)" }}
                    >
                      {`${`${makeRewardAmountForLabel(order)}`}`}
                    </Label>
                  )}
                  {!order.completedAt && order.reward.coins !== undefined && (
                    <Label
                      type="warning"
                      icon={coinsImg}
                      className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10 h-6"
                      style={{ width: "calc(100% + 15px)" }}
                    >
                      {`${makeRewardAmountForLabel(order)}`}
                    </Label>
                  )}
                  {!order.completedAt && order.reward.tickets && (
                    <Label
                      icon={ITEM_DETAILS[getSeasonalTicket()].image}
                      type="warning"
                      className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10 h-6"
                      style={{ width: "calc(100% + 15px)" }}
                    >
                      {order.reward.tickets}
                    </Label>
                  )}

                  {order.id === previewOrder?.id && (
                    <div id="select-box" className="hidden md:block">
                      <img
                        className="absolute pointer-events-none"
                        src={selectBoxTL}
                        style={{
                          top: `${PIXEL_SCALE * -3}px`,
                          left: `${PIXEL_SCALE * -3}px`,
                          width: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                      <img
                        className="absolute pointer-events-none"
                        src={selectBoxTR}
                        style={{
                          top: `${PIXEL_SCALE * -3}px`,
                          right: `${PIXEL_SCALE * -3}px`,
                          width: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                    </div>
                  )}
                </OuterPanel>
              </div>
            );
          })}
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
              <p className="text-center mb-0.5 mt-1 text-sm loading">
                {t("skipping")}
              </p>
            </OuterPanel>
          </div>
        )}

        <div className="flex items-center mb-1 mt-2">
          <div className="w-6">
            <img src={lockIcon} className="h-4 mx-auto" />
          </div>
          <span className="text-xs">{t("new.delivery.levelup")}</span>
        </div>
      </div>
      {previewOrder && (
        <OuterPanel
          className={classNames(
            "md:ml-1 md:flex md:flex-col items-center flex-1 relative h-full w-full",
            {
              hidden: !selectedId,
              "mt-[24px] md:mt-0": true,
            }
          )}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className={classNames(
              "absolute -top-9 left-0 h-6 w-6 cursor-pointer md:hidden z-10",
              {
                hidden: !selectedId,
                block: !!selectedId,
              }
            )}
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
            <p className="z-10 absolute bottom-1 right-1.5 capitalize text-xs">
              {previewOrder.from}
            </p>

            <div
              className="absolute -inset-2 bg-repeat"
              style={{
                height: `${PIXEL_SCALE * 50}px`,
                backgroundImage: `url(${heartBg})`,
                backgroundSize: `${32 * PIXEL_SCALE}px`,
              }}
            />
            <div key={previewOrder.from} className="w-1/2 md:w-full md:-ml-8">
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
                    <p className="text-xs">{t("orderhelp.SkipIn")}</p>
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
                <>
                  <Button onClick={() => setShowSkipDialog(false)}>
                    {t("orderhelp.NoRight")}
                  </Button>
                  <Button onClick={skip} className="mt-1">
                    {t("skip.order")}
                  </Button>
                </>
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
                    from: previewOrder?.from,
                    id: previewOrder.id,
                  })}
                </p>

                {RETREAT_BUMPKINS.includes(previewOrder.from) ? (
                  <Label type="default" icon={worldIcon} className="ml-1">
                    {t("island.goblin.retreat")}
                  </Label>
                ) : BEACH_BUMPKINS.includes(previewOrder.from) ? (
                  <Label type="default" icon={worldIcon} className="ml-1">
                    {t("island.beach")}
                  </Label>
                ) : (
                  <Label type="default" icon={worldIcon} className="ml-1">
                    {t("island.pumpkin.plaza")}
                  </Label>
                )}
              </div>
              <div className="pt-1 pb-2">
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
                      balance={inventory[itemName] ?? new Decimal(0)}
                      showLabel
                      requirement={
                        new Decimal(previewOrder?.items[itemName] ?? 0)
                      }
                    />
                  );
                })}
              </div>
              {previewOrder.completedAt ? (
                <div className="flex">
                  <img src={SUNNYSIDE.icons.confirm} className="mr-2 h-4" />
                  <p className="text-xxs">{t("completed")}</p>
                </div>
              ) : (
                <p
                  className="underline text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
                  onClick={() => setShowSkipDialog(true)}
                >
                  {t("skip.order")}
                  {"?"}
                </p>
              )}
            </div>
          )}
          {tasksAreFrozen && (
            <Label
              type="danger"
              className="mb-1"
              icon={SUNNYSIDE.icons.stopwatch}
            >
              {t("deliveries.closed")}
            </Label>
          )}
        </OuterPanel>
      )}
    </div>
  );
};
