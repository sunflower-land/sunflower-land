import React, { useEffect } from "react";
import { NPCName } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { GameState, Inventory, Order } from "features/game/types/game";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import token from "assets/icons/sfl.webp";

import classNames from "classnames";
import {
  generateDeliveryTickets,
  getCountAndTypeForDelivery,
  getOrderSellPrice,
} from "features/game/events/landExpansion/deliver";
import { getChapterTicket } from "features/game/types/chapters";
import { ITEM_DETAILS } from "features/game/types/images";
import { BumpkinDelivery } from "./BumpkinDelivery";
import { formatNumber } from "lib/utils/formatNumber";

interface OrderCardsProps {
  orders: Order[];
  balance: Decimal;
  game: GameState;
  inventory: Inventory;
  selectedOrderId?: string;
  onSelectOrder: (id: string) => void;
  hasRequirementsCheck: (order: Order) => boolean;
}

export const OrderCards: React.FC<OrderCardsProps> = ({
  orders,
  inventory,
  balance,
  game,
  selectedOrderId,
  onSelectOrder,
  hasRequirementsCheck,
}) => {
  useEffect(() => {
    const firstFillableOrder = orders.find((order) =>
      hasRequirementsCheck(order),
    );

    if (firstFillableOrder) {
      onSelectOrder(firstFillableOrder.id);
    }
  }, [orders.length]);

  const makeRewardAmountForLabel = (order: Order) => {
    if (order.reward.sfl !== undefined) {
      const sfl = getOrderSellPrice<Decimal>(game, order);

      return formatNumber(sfl, { decimalPlaces: 4 });
    }

    const coins = getOrderSellPrice<number>(game, order);

    return formatNumber(coins);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        {orders.map((order) => {
          const canDeliver = hasRequirementsCheck(order);

          const tickets = generateDeliveryTickets({ game, npc: order.from });

          return (
            <OuterPanel
              key={order.id}
              className={classNames(
                "flex flex-1 !p-2 flex-col space-y-1 relative",
                {
                  "opacity-50 cursor-default": !canDeliver,
                  "cursor-pointer": canDeliver,
                },
              )}
              onClick={
                canDeliver
                  ? (e) => {
                      e.stopPropagation();
                      onSelectOrder(order.id);
                    }
                  : undefined
              }
            >
              {getKeys(order.items).map((itemName) => {
                if (itemName === "coins") {
                  return (
                    <RequirementLabel
                      type="coins"
                      balance={game.coins}
                      requirement={order?.items[itemName] ?? 0}
                      showLabel
                    />
                  );
                }

                if (itemName === "sfl") {
                  return (
                    <RequirementLabel
                      type="sfl"
                      balance={game.balance}
                      requirement={new Decimal(order?.items[itemName] ?? 0)}
                      showLabel
                    />
                  );
                }

                return (
                  <RequirementLabel
                    key={itemName}
                    type="item"
                    item={itemName}
                    balance={getCountAndTypeForDelivery(game, itemName).count}
                    showLabel
                    requirement={new Decimal(order?.items[itemName] ?? 0)}
                  />
                );
              })}
              <div className="flex flex-col justify-center">
                {order.reward.sfl !== undefined && (
                  <div className="flex items-center mt-1">
                    <img src={token} className="h-5 mr-1" />
                    <span className="text-xs">
                      {makeRewardAmountForLabel(order)}
                    </span>
                  </div>
                )}
                {order.reward.coins !== undefined && (
                  <div className="flex items-center mt-1">
                    <img src={SUNNYSIDE.ui.coinsImg} className="h-5 mr-1" />
                    <span className="text-xs">
                      {makeRewardAmountForLabel(order)}
                    </span>
                  </div>
                )}
                {!!tickets && (
                  <div
                    className="flex items-center mt-1"
                    key={getChapterTicket()}
                  >
                    <img
                      src={ITEM_DETAILS[getChapterTicket()].image}
                      className="h-5 mr-1"
                    />
                    <span className="text-xs">{tickets}</span>
                  </div>
                )}
              </div>
              {order.id === String(selectedOrderId) && canDeliver && (
                <>
                  <img
                    className="absolute pointer-events-none"
                    src={SUNNYSIDE.ui.selectBoxTL}
                    style={{
                      bottom: `${PIXEL_SCALE * -3}px`,
                      left: `${PIXEL_SCALE * -3}px`,
                      width: `${PIXEL_SCALE * 8}px`,
                    }}
                  />
                  <img
                    className="absolute pointer-events-none"
                    src={SUNNYSIDE.ui.selectBoxTR}
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
                      top: `${PIXEL_SCALE * -5}px`,
                      left: `${PIXEL_SCALE * -3}px`,
                      width: `${PIXEL_SCALE * 8}px`,
                    }}
                  />
                  <img
                    className="absolute pointer-events-none"
                    src={SUNNYSIDE.ui.selectBoxBR}
                    style={{
                      top: `${PIXEL_SCALE * -5}px`,
                      right: `${PIXEL_SCALE * -3}px`,
                      width: `${PIXEL_SCALE * 8}px`,
                    }}
                  />
                </>
              )}
            </OuterPanel>
          );
        })}
      </div>
    </>
  );
};

export function getTotalExpansions({
  game,
}: {
  game: Pick<GameState, "inventory" | "island">;
}) {
  let totalExpansions = game.inventory["Basic Land"] ?? new Decimal(3);

  if (game.island.type !== "basic") {
    totalExpansions = totalExpansions.add(game.island.previousExpansions ?? 6);
  }

  return totalExpansions;
}

interface Props {
  onClose?: () => void;
  npc: NPCName;
}

export const DeliveryPanelContent: React.FC<Props> = ({ npc, onClose }) => {
  return <BumpkinDelivery npc={npc} onClose={onClose} />;
};
