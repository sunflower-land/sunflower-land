import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext, useEffect } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import sfl from "assets/icons/token_2.png";
import heartBg from "assets/ui/heart_bg.png";

import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import {
  getDeliverySlots,
  getOrderSellPrice,
} from "features/game/events/landExpansion/deliver";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import { Bumpkin, Order } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC } from "features/island/bumpkin/components/NPC";

import { NPC_WEARABLES } from "lib/npcs";
import { secondsToString } from "lib/utils/time";
import { acknowledgeOrders, generateDeliveryMessage } from "../lib/delivery";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { getSeasonalTicket } from "features/game/types/seasons";

interface Props {
  selectedId?: string;
  onSelect: (id?: string) => void;
}
export const DeliveryOrders: React.FC<Props> = ({ selectedId, onSelect }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const delivery = gameState.context.state.delivery;
  const orders = delivery.orders.filter((order) => Date.now() >= order.readyAt);

  useEffect(() => {
    acknowledgeOrders(delivery);
  }, [delivery.orders]);

  let previewOrder = delivery.orders.find((order) => order.id === selectedId);

  if (!previewOrder) {
    previewOrder = orders[0];
  }

  const deliver = () => {
    gameService.send("order.delivered", { id: previewOrder?.id });
    onSelect(undefined);
  };

  const hasRequirements = (order?: Order) => {
    if (!order) {
      return false;
    }
    return getKeys(order.items).every((name) => {
      const count = gameState.context.state.inventory[name] || new Decimal(0);
      const amount = order.items[name] || new Decimal(0);

      return count.gte(amount);
    });
  };

  const select = (id: string) => {
    onSelect(id);
  };

  const nextOrder = delivery.orders.find((order) => order.readyAt > Date.now());

  if (orders.length === 0 && !nextOrder) {
    return (
      <div className="flex items-center justify-center my-2">
        <img src={SUNNYSIDE.icons.timer} className="h-6 mr-2" />
        <span className="text-sm">More orders coming soon</span>
      </div>
    );
  }

  const canFulfill = hasRequirements(previewOrder as Order);

  const slots = getDeliverySlots(gameState.context.state);
  let emptySlots = slots - orders.length - (nextOrder ? 1 : 0);
  emptySlots = Math.max(0, emptySlots);

  return (
    <div className="flex md:flex-row flex-col-reverse">
      <div
        className={classNames("md:flex flex-col w-full  md:w-2/3", {
          hidden: selectedId,
        })}
      >
        <div className="flex flex-row w-full flex-wrap">
          {orders.map((order) => (
            <div className="w-1/2 sm:w-1/3 p-1" key={order.id}>
              <OuterPanel
                onClick={() => select(order.id)}
                className="w-full cursor-pointer hover:bg-brown-200 py-2 relative"
                style={{ height: "80px" }}
              >
                {hasRequirements(order) && (
                  <img
                    src={SUNNYSIDE.icons.heart}
                    className="absolute top-0.5 right-0.5 w-5"
                  />
                )}

                <div className="flex">
                  <div className="relative bottom-4 h-14 w-12 mr-2 ml-0.5">
                    <NPC parts={NPC_WEARABLES[order.from]} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-start ml-2 h-8 items-center">
                      {getKeys(order.items).map((name) => (
                        <img
                          key={name}
                          src={ITEM_DETAILS[name].image}
                          className="w-6 img-highlight -ml-2"
                        />
                      ))}
                    </div>
                    <div className="flex items-center">
                      {order.reward.sfl && (
                        <div className="flex items-center mt-1">
                          <img src={sfl} className="h-5 mr-1" />
                          <span className="text-xs">
                            {getOrderSellPrice(
                              gameState.context.state.bumpkin as Bumpkin,
                              order
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {/* {getKeys(order.reward.items ?? {}).map((name) => (
                        <div className="flex items-center mt-1" key={name}>
                          <img
                            src={ITEM_DETAILS[name].image}
                            className="h-5 mr-1"
                          />
                          <span className="text-xs">
                            {order.reward.items?.[name]}
                          </span>
                        </div>
                      ))} */}
                    </div>
                  </div>
                </div>

                {order.id === previewOrder?.id && (
                  <div className="hidden md:block">
                    <img
                      className="absolute pointer-events-none"
                      src={selectBoxBL}
                      style={{
                        bottom: `${PIXEL_SCALE * -3}px`,
                        left: `${PIXEL_SCALE * -3}px`,
                        width: `${PIXEL_SCALE * 8}px`,
                      }}
                    />
                    <img
                      className="absolute pointer-events-none"
                      src={selectBoxBR}
                      style={{
                        bottom: `${PIXEL_SCALE * -3}px`,
                        right: `${PIXEL_SCALE * -3}px`,
                        width: `${PIXEL_SCALE * 8}px`,
                      }}
                    />
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
          ))}

          {nextOrder && (
            <div className="w-1/2 sm:w-1/3 p-1">
              <OuterPanel
                className="w-full py-2 relative"
                style={{ height: "80px" }}
              >
                <p className="text-center mb-0.5 mt-1 text-sm">Next order:</p>
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
          {new Array(emptySlots).fill(null).map((_, i) => (
            <div className="w-1/2 sm:w-1/3 p-1" key={i}>
              <OuterPanel
                className="w-full py-2 relative"
                style={{ height: "80px" }}
              ></OuterPanel>
            </div>
          ))}
        </div>
        <div className="px-1 mb-1 flex-1 flex items-end">
          <div>
            <div className="flex">
              <a
                href="https://docs.sunflower-land.com/player-guides/seasons#seasonal-tickets"
                target="_blank"
                className="text-xxs underline hover:text-blue-500"
                rel="noreferrer"
              >
                Bonus Offer
              </a>
              <img src={SUNNYSIDE.icons.timer} className="h-4 ml-2" />
              {/* TEMP */}
              {Date.now() < new Date("2023-05-03T00:00:00").getTime() && (
                <img
                  src={ITEM_DETAILS[getSeasonalTicket()].image}
                  className="h-4 ml-1"
                />
              )}
            </div>
            <div className="flex items-center">
              <p className="text-xxs">
                Earn 5 Seasonal Tickets for each order.
              </p>
            </div>
          </div>
        </div>
      </div>
      {previewOrder && (
        <OuterPanel
          className={classNames(
            " md:flex md:flex-col items-center flex-1 relative",
            {
              hidden: !selectedId,
            }
          )}
        >
          <div
            className="mb-1 mx-auto w-full col-start-1 row-start-1 overflow-hidden z-0  rounded-lg relative"
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
          <div className="flex-1 p-1">
            <p className="text-xs mb-2" style={{ height: "60px" }}>
              {generateDeliveryMessage({
                from: previewOrder?.from,
                id: previewOrder.id,
              })}
            </p>
            {getKeys(previewOrder.items).map((itemName) => (
              <RequirementLabel
                key={itemName}
                type="item"
                item={itemName}
                balance={
                  gameState.context.state.inventory[itemName] ?? new Decimal(0)
                }
                showLabel
                requirement={new Decimal(previewOrder?.items[itemName] ?? 0)}
              />
            ))}
          </div>
          <Button disabled={!canFulfill} onClick={deliver}>
            Deliver
          </Button>
        </OuterPanel>
      )}
    </div>
  );
};
