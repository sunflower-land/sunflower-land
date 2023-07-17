import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Message, SpeakingModal } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { defaultDialogue, npcDialogues } from "./dialogues";

interface Props {
  onClose: () => void;
  npc: NPCName;
}

const _delivery = (state: MachineState) => state.context.state.delivery;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const DeliveryModal: React.FC<Props> = ({ npc, onClose }) => {
  const { gameService } = useContext(Context);

  const delivery = useSelector(gameService, _delivery);
  const inventory = useSelector(gameService, _inventory);

  // Get order from grimbly
  const order = delivery.orders.filter((order) => order.from === npc)?.[0];
  const dialogue = npcDialogues[npc] || defaultDialogue;

  if (!order) {
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
    // Randomised dialogue
    const intro =
      dialogue.intro[Math.floor(Math.random() * dialogue.intro.length)];
    const positive =
      dialogue.positiveDelivery[
        Math.floor(Math.random() * dialogue.positiveDelivery.length)
      ];
    const negative =
      dialogue.negativeDelivery[
        Math.floor(Math.random() * dialogue.negativeDelivery.length)
      ];

    const message: Message[] = [{ text: intro }];

    if (!hasRequirements()) {
      message.push({
        text: negative,
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
      text: positive,
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
