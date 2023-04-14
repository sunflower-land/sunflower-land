import React, { useState } from "react";

import { Modal } from "react-bootstrap";
import { getKeys } from "features/game/types/craftables";

import chefHat from "src/assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  COOKABLES,
} from "features/game/types/consumables";
import { MachineInterpreter } from "features/island/buildings/lib/craftingMachine";
import { Equipped } from "features/game/types/bumpkin";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ConversationName } from "features/game/types/conversations";
import { Conversation } from "features/farming/mail/components/Conversation";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  crafting: boolean;
  itemInProgress?: CookableName;
  craftingService?: MachineInterpreter;
  conversation?: ConversationName;
}
export const FirePitModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  itemInProgress,
  craftingService,
  conversation,
}) => {
  const firePitRecipes = getKeys(COOKABLES).reduce((acc, name) => {
    if (COOKABLES[name].building !== "Fire Pit") {
      return acc;
    }

    return [...acc, COOKABLES[name]];
  }, [] as Cookable[]);
  const [selected, setSelected] = useState<Cookable>(
    firePitRecipes.find((recipe) => recipe.name === itemInProgress) ||
      firePitRecipes[0]
  );

  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.bruce;

  if (conversation) {
    return (
      <Modal show={isOpen} onHide={onClose} centered>
        <Panel bumpkinParts={bumpkinParts}>
          <Conversation conversationId={conversation} />
        </Panel>
      </Modal>
    );
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <CloseButtonPanel
        bumpkinParts={bumpkinParts}
        tabs={[{ icon: chefHat, name: "Fire Pit" }]}
        onClose={onClose}
      >
        <Recipes
          selected={selected}
          setSelected={setSelected}
          recipes={firePitRecipes}
          onCook={onCook}
          onClose={onClose}
          crafting={!!crafting}
          craftingService={craftingService}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
