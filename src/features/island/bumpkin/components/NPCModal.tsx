import React, { useContext } from "react";

import { getEntries } from "features/game/types/craftables";

import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Feed } from "./Feed";
import { Modal } from "react-bootstrap";
import foodIcon from "src/assets/food/chicken_drumstick.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { CONVERSATIONS } from "features/game/types/conversations";
import { Conversation } from "features/farming/mail/components/Conversation";
import { Panel } from "components/ui/Panel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFeed: (name: ConsumableName) => void;
}
export const NPCModal: React.FC<Props> = ({ isOpen, onFeed, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const availableFood = getEntries(CONSUMABLES)
    .filter(([name, _]) => !!state.inventory[name]?.gt(0))
    .map(([_, consumable]) => consumable);

  const conversationId = state.conversations.find(
    (id) => CONVERSATIONS[id].from === "player"
  );

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      {conversationId ? (
        <Panel bumpkinParts={state.bumpkin?.equipped}>
          <Conversation conversationId={conversationId} />
        </Panel>
      ) : (
        <CloseButtonPanel
          onClose={onClose}
          tabs={[{ icon: foodIcon, name: "Feed Bumpkin" }]}
          bumpkinParts={state.bumpkin?.equipped}
        >
          <Feed food={availableFood} onFeed={onFeed} />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
