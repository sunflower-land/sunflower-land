import React, { useContext, useEffect, useState } from "react";
import { Context } from "features/game/GameProvider";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { defaultDialogue, npcDialogues } from "./dialogues";
import { Inventory, Order } from "features/game/types/game";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";

import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import classNames from "classnames";

const OrderCards: React.FC<{
  orders: Order[];
  balance: Decimal;
  inventory: Inventory;
  selectedOrderId?: string;
  onSelectOrder: (id: string) => void;
  hasRequirementsCheck: (order: Order) => boolean;
}> = ({
  orders,
  inventory,
  balance,
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
              onClick={canDeliver ? () => onSelectOrder(order.id) : undefined}
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

interface Props {
  onClose: () => void;
  npc: NPCName;
}

const _delivery = (state: MachineState) => state.context.state.delivery;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _balance = (state: MachineState) => state.context.state.balance;

export const DeliveryModal: React.FC<Props> = ({ npc, onClose }) => {
  const { gameService } = useContext(Context);

  const delivery = useSelector(gameService, _delivery);
  const inventory = useSelector(gameService, _inventory);
  const balance = useSelector(gameService, _balance);

  const orders = delivery.orders.filter((order) => order.from === npc);
  const dialogue = npcDialogues[npc] || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);
  const positive = useRandomItem(dialogue.positiveDelivery);
  const negative = useRandomItem(dialogue.negativeDelivery);

  const hasRequirements = (order?: Order) => {
    if (!order) return false;

    return getKeys(order.items).every((name) => {
      const amount = order.items[name] || new Decimal(0);

      if (name === "sfl") return balance.gte(amount);

      const count = inventory[name] || new Decimal(0);

      return count.gte(amount);
    });
  };

  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>();

  console.log(npc, NPC_WEARABLES[npc]);

  if (!orders.length) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES[npc]}
        onClose={onClose}
        message={[
          {
            text: dialogue.noOrder[
              Math.floor(Math.random() * dialogue.noOrder.length)
            ],
          },
        ]}
      />
    );
  }

  const handleDeliver = () => {
    if (!selectedOrderId) return;

    const state = gameService.send("order.delivered", { id: selectedOrderId });

    const remainingOrders = state.context.state.delivery.orders.filter(
      (order) => order.from === npc
    );

    if (!remainingOrders.length) {
      onClose();
    }
  };

  const canFulfillAnOrder = orders.some(hasRequirements);

  return (
    <SpeakingModal
      bumpkinParts={NPC_WEARABLES[npc]}
      onClose={onClose}
      message={[
        { text: intro },
        {
          text: canFulfillAnOrder ? positive : negative,
          jsx: (
            <OrderCards
              orders={orders}
              inventory={inventory}
              balance={balance}
              selectedOrderId={selectedOrderId}
              onSelectOrder={(id: string) => setSelectedOrderId(id)}
              hasRequirementsCheck={hasRequirements}
            />
          ),
          actions: [
            { text: canFulfillAnOrder ? "Not now" : "Close", cb: onClose },
            ...(canFulfillAnOrder
              ? [{ text: "Deliver", cb: handleDeliver }]
              : []),
          ],
        },
      ]}
    />
  );
};
