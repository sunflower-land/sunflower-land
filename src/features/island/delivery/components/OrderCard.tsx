import React from "react";
import { GameState, Order } from "features/game/types/game";
import {
  generateDeliveryTickets,
  getOrderSellPrice,
} from "features/game/events/landExpansion/deliver";
import { ButtonPanel } from "components/ui/Panel";
import classNames from "classnames";
import { hasOrderRequirements } from "./Orders";
import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/lib/crafting";
import { ITEM_DETAILS } from "features/game/types/images";
import { getChapterTicket } from "features/game/types/chapters";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { Decimal } from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import { useNow } from "lib/utils/hooks/useNow";
import { getBumpkinHoliday } from "lib/utils/getSeasonWeek";
import { isTicketNPC } from "features/island/delivery/lib/delivery";

import token from "assets/icons/flower_token.webp";
import deliveryIcon from "assets/icons/delivery_heart.webp";
import { getWearableImage } from "features/game/lib/getWearableImage";

const makeRewardAmountForLabel = ({
  order,
  state,
}: {
  order: Order;
  state: GameState;
}) => {
  if (order.reward.sfl !== undefined) {
    const { reward: sfl } = getOrderSellPrice<Decimal>(state, order);

    return formatNumber(sfl, { decimalPlaces: 4 });
  }

  const { reward: coins } = getOrderSellPrice<number>(state, order);

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
  const now = useNow();
  const npcName = order.from;
  const { holiday } = getBumpkinHoliday({ now });
  const todayDate = new Date(now).toISOString().split("T")[0];
  const isHoliday = holiday === todayDate;

  const baseTickets = generateDeliveryTickets({
    game: state,
    npc: npcName,
    now,
    order,
  });
  const tickets = isHoliday && !isTicketNPC(npcName) ? 0 : baseTickets;
  const ticketDisplay =
    isHoliday && isTicketNPC(npcName) && baseTickets > 0 ? 0 : tickets;
  const hasRewardAmount =
    order.reward.coins !== undefined || order.reward.sfl !== undefined;
  const showTickets = !order.completedAt && !!ticketDisplay;
  const showCoinsOrSFL = !order.completedAt && hasRewardAmount;
  const hasAnyReward = showCoinsOrSFL || showTickets;
  const chapterTicket = getChapterTicket(now);

  return (
    <div className="py-1 px-1" key={order.id}>
      <ButtonPanel
        onClick={() => onClick(order.id)}
        className={classNames("w-full !py-2 relative", {
          "sm:!bg-brown-200": order.id === selected?.id,
        })}
        style={{ paddingBottom: hasAnyReward ? "28px" : "20px" }}
      >
        {hasOrderRequirements({ order, state }) && !order.completedAt && (
          <img
            src={deliveryIcon}
            className="absolute top-0.5 right-0.5 w-3 sm:w-4"
          />
        )}
        <div className="flex flex-col pb-2">
          <div className="flex items-center my-1">
            <div className="relative mb-2 mr-0.5 -ml-1">
              <NPCIcon parts={NPC_WEARABLES[npcName]} />
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
                      getWearableImage(name) ??
                      SUNNYSIDE.icons.expression_confused;
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
        {!order.completedAt && hasAnyReward && (
          <div
            className="absolute -bottom-2 left-0 right-0 flex justify-center"
            style={{
              left: `${PIXEL_SCALE * -3}px`,
              right: `${PIXEL_SCALE * -3}px`,
              width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
            }}
          >
            <Label type="warning" className="text-center flex gap-x-1 w-full">
              {order.reward.sfl !== undefined && (
                <div className="flex items-center">
                  <span className="text-xs">
                    {makeRewardAmountForLabel({ order, state })}
                  </span>
                  <img src={token} className="h-4 w-auto ml-1" />
                </div>
              )}
              {order.reward.coins !== undefined && (
                <div className="flex items-center">
                  <span className="text-xs">
                    {makeRewardAmountForLabel({ order, state })}
                  </span>
                  <img
                    src={SUNNYSIDE.ui.coinsImg}
                    className="h-4 w-auto ml-1"
                  />
                </div>
              )}
              {showTickets && (
                <div className="flex items-center">
                  <span className="text-xs mx-1">{ticketDisplay}</span>
                  <img
                    src={ITEM_DETAILS[chapterTicket].image}
                    className="h-4 w-auto"
                  />
                </div>
              )}
              {getKeys(order.reward.items ?? {})
                .filter((item) => item !== chapterTicket)
                .map((item) => (
                  <div className="flex items-center" key={item}>
                    <span className="text-xs">{item}</span>
                    <img
                      src={ITEM_DETAILS[item].image}
                      className="h-4 w-auto ml-1"
                    />
                  </div>
                ))}
            </Label>
          </div>
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
            <img
              className="absolute pointer-events-none"
              src={SUNNYSIDE.ui.selectBoxBR}
              style={{
                bottom: `${PIXEL_SCALE * -3}px`,
                right: `${PIXEL_SCALE * -3}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <img
              className="absolute pointer-events-none"
              src={SUNNYSIDE.ui.selectBoxBL}
              style={{
                bottom: `${PIXEL_SCALE * -3}px`,
                left: `${PIXEL_SCALE * -3}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
          </div>
        )}
      </ButtonPanel>
    </div>
  );
};
