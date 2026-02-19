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
  const isHoliday = holiday === new Date(now).toISOString().split("T")[0];

  const baseTickets = generateDeliveryTickets({
    game: state,
    npc: npcName,
    now,
    order,
  });
  const tickets = isHoliday && !isTicketNPC(npcName) ? 0 : baseTickets;
  const ticketDisplay =
    isHoliday && isTicketNPC(npcName) && baseTickets > 0 ? 0 : tickets;

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
        {!order.completedAt && !!ticketDisplay && (
          <Label
            icon={ITEM_DETAILS[getChapterTicket(now)].image}
            type="warning"
            className={"absolute -bottom-2 text-center p-1 "}
            style={{
              left: `${PIXEL_SCALE * -3}px`,
              right: `${PIXEL_SCALE * -3}px`,
              width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
              height: "25px",
            }}
          >
            {ticketDisplay}
          </Label>
        )}
        {order.id === selected?.id && (
          <div id="select-box" className="hidden md:block">
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
