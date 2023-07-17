import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { NPC_WEARABLES } from "lib/npcs";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Message, SpeakingModal } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";

interface Props {
  onClose: () => void;
}

const _delivery = (state: MachineState) => state.context.state.delivery;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const Grimbly: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const delivery = useSelector(gameService, _delivery);
  const inventory = useSelector(gameService, _inventory);

  // Get order from grimbly
  const order = delivery.orders.filter(
    (order) => order.from === "grimbly"
  )?.[0];

  if (!order) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES.grimbly}
        onClose={onClose}
        message={[{ text: "I don't have any orders for you right now." }]}
      />
    );
  }

  const handleDeliver = () => {
    gameService.send("order.delivered", { id: order.id });
    onClose();
  };

  const hasRequirements = () => {
    return getKeys(order.items).every((name) => {
      const count = inventory[name] || new Decimal(0);
      const amount = order.items[name] || new Decimal(0);

      return count.gte(amount);
    });
  };

  const createMessages = () => {
    const message: Message[] = [
      { text: "Oh its you... I thought you would never get here!" },
    ];

    if (!hasRequirements()) {
      message.push({
        text: "It looks like you're wasting my time. Come back when you have the items I need!",
        jsx: (
          <div className="flex flex-col space-y-1 mt-3">
            {getKeys(order.items).map((itemName) => (
              <RequirementLabel
                key={itemName}
                type="item"
                item={itemName}
                balance={inventory[itemName] ?? new Decimal(0)}
                showLabel
                requirement={new Decimal(order?.items[itemName] ?? 0)}
              />
            ))}
          </div>
        ),
        actions: [{ text: "Close", cb: onClose }],
      });

      return message;
    }

    message.push({
      text: "Great! It looks like you have everything I need. Are you ready to deliver?",
      jsx: (
        <div className="flex flex-col space-y-1 mt-3">
          {getKeys(order.items).map((itemName) => (
            <RequirementLabel
              key={itemName}
              type="item"
              item={itemName}
              balance={inventory[itemName] ?? new Decimal(0)}
              showLabel
              requirement={new Decimal(order?.items[itemName] ?? 0)}
            />
          ))}
        </div>
      ),
      actions: [
        { text: "Not now", cb: onClose },
        { text: "Deliver", cb: handleDeliver },
      ],
    });

    return message;
  };

  return (
    <SpeakingModal
      bumpkinParts={NPC_WEARABLES.grimbly}
      onClose={onClose}
      message={createMessages()}
    />
  );
};
