import React, { useContext, useEffect, useState } from "react";
import { Context } from "features/game/GameProvider";
import { NPCName } from "lib/npcs";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { defaultDialogue, npcDialogues } from "./dialogues";
import { GameState, Inventory, Order } from "features/game/types/game";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import sfl from "assets/icons/token_2.png";

import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import classNames from "classnames";
import { getOrderSellPrice } from "features/game/events/landExpansion/deliver";
import { getSeasonalTicket } from "features/game/types/seasons";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { DELIVERY_LEVELS } from "features/island/delivery/lib/delivery";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
      hasRequirementsCheck(order)
    );

    if (firstFillableOrder) {
      onSelectOrder(firstFillableOrder.id);
    }
  }, [orders.length]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        {orders.map((order) => {
          const canDeliver = hasRequirementsCheck(order);

          return (
            <OuterPanel
              key={order.id}
              className={classNames(
                "flex flex-1 p-2 flex-col space-y-1 relative",
                {
                  "opacity-50 cursor-default": !canDeliver,
                  "cursor-pointer": canDeliver,
                }
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
                if (itemName === "sfl") {
                  return (
                    <RequirementLabel
                      type="sfl"
                      balance={balance}
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
                    balance={inventory[itemName] ?? new Decimal(0)}
                    showLabel
                    requirement={new Decimal(order?.items[itemName] ?? 0)}
                  />
                );
              })}
              <div className="flex flex-col justify-center">
                {order.reward.sfl && (
                  <div className="flex items-center mt-1">
                    <img src={sfl} className="h-5 mr-1" />
                    <span className="text-xs">
                      {getOrderSellPrice(game, order).toFixed(2)}
                    </span>
                  </div>
                )}
                {order.reward.tickets && (
                  <div
                    className="flex items-center mt-1"
                    key={getSeasonalTicket()}
                  >
                    <img
                      src={ITEM_DETAILS[getSeasonalTicket()].image}
                      className="h-5 mr-1"
                    />
                    <span className="text-xs">{order.reward.tickets}</span>
                  </div>
                )}
              </div>
              {order.id === String(selectedOrderId) && canDeliver && (
                <>
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
                      top: `${PIXEL_SCALE * -5}px`,
                      left: `${PIXEL_SCALE * -3}px`,
                      width: `${PIXEL_SCALE * 8}px`,
                    }}
                  />
                  <img
                    className="absolute pointer-events-none"
                    src={selectBoxTR}
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

  if (game.island.type === "spring") {
    totalExpansions = totalExpansions.add(game.island.previousExpansions ?? 6);
  }

  return totalExpansions;
}

interface Props {
  onClose: () => void;
  npc: NPCName;
  // Skip intro if the npc has two potential actions ie. Craft/Delivery. The intro would have already happened.
  skipIntro?: boolean;
}

const _delivery = (state: MachineState) => state.context.state.delivery;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _balance = (state: MachineState) => state.context.state.balance;
const _game = (state: MachineState) => state.context.state as GameState;

export const DeliveryPanelContent: React.FC<Props> = ({
  npc,
  skipIntro,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const delivery = useSelector(gameService, _delivery);
  const inventory = useSelector(gameService, _inventory);
  const balance = useSelector(gameService, _balance);
  const game = useSelector(gameService, _game);

  let orders = delivery.orders.filter(
    (order) =>
      order.from === npc && Date.now() >= order.readyAt && !order.completedAt
  );

  if (!hasFeatureAccess(gameService.state.context.state, "BEACH")) {
    orders = orders.filter(
      (o) =>
        // Filter out beach NPCs
        !(
          ["corale", "tango", "finley", "finn", "miranda"] as NPCName[]
        ).includes(o.from)
    );
  }

  const dialogue = npcDialogues[npc] || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);
  const positive = useRandomItem(dialogue.positiveDelivery);
  const negative = useRandomItem(dialogue.negativeDelivery);
  const noOrder = useRandomItem(dialogue.noOrder);

  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>();

  const hasRequirements = (order?: Order) => {
    if (!order) return false;

    return getKeys(order.items).every((name) => {
      const amount = order.items[name] || new Decimal(0);

      if (name === "sfl") return balance.gte(amount);

      const count = inventory[name] || new Decimal(0);

      return count.gte(amount);
    });
  };

  if (!orders.length) {
    const totalExpansions = getTotalExpansions({
      game: gameService.state.context.state,
    });

    return (
      <SpeakingText
        onClose={onClose}
        message={[
          {
            text: intro,
          },
          {
            text: totalExpansions.lt(DELIVERY_LEVELS[npc] ?? 0)
              ? `${t("delivery.panel.one")} ${DELIVERY_LEVELS[npc] ?? 10}${t(
                  "delivery.panel.two"
                )}`
              : noOrder,
          },
        ]}
      />
    );
  }

  const handleDeliver = () => {
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!selectedOrderId || !order) {
      // eslint-disable-next-line no-console
      console.log("Delivery: No order selected");
      return;
    }

    const state = gameService.send("order.delivered", { id: selectedOrderId });

    const remainingOrders = state.context.state.delivery.orders.filter(
      (order) =>
        order.from === npc && Date.now() >= order.readyAt && !order.completedAt
    );

    if (!remainingOrders.length) {
      onClose();
    }

    if (order.reward.tickets) {
      const amount = order.reward.tickets || 0;

      gameAnalytics.trackSource({
        item: "Seasonal Ticket",
        amount: new Decimal(amount).toNumber(),
        from: "Delivery",
        type: "Exchange",
      });
    }

    if (order.reward.sfl) {
      gameAnalytics.trackSource({
        item: "SFL",
        amount: order.reward.sfl,
        from: "Delivery",
        type: "Exchange",
      });
    }

    if (state.context.state.delivery.fulfilledCount === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:Delivery:Completed",
      });
    }
  };

  const { tasksAreFrozen } = getSeasonChangeover({
    id: gameService.state.context.farmId,
  });

  if (tasksAreFrozen) {
    return (
      <SpeakingText
        onClose={onClose}
        message={[
          {
            text: intro,
          },
          {
            text: t("delivery.panel.four"),
          },
        ]}
      />
    );
  }

  const canFulfillAnOrder = orders.some(hasRequirements);

  return (
    <SpeakingText
      onClose={onClose}
      message={[
        ...(!skipIntro ? [{ text: intro }] : []),
        {
          text: canFulfillAnOrder ? positive : negative,
          jsx: (
            <OrderCards
              orders={orders}
              inventory={inventory}
              balance={balance}
              game={game}
              selectedOrderId={selectedOrderId}
              onSelectOrder={(id: string) => setSelectedOrderId(id)}
              hasRequirementsCheck={hasRequirements}
            />
          ),
          actions: [
            { text: canFulfillAnOrder ? "Not now" : t("close"), cb: onClose },
            ...(canFulfillAnOrder
              ? [{ text: "Deliver", cb: handleDeliver }]
              : []),
          ],
        },
      ]}
    />
  );
};
