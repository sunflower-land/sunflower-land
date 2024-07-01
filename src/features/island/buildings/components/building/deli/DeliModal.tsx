import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  DELI_COOKABLES,
} from "features/game/types/consumables";
import { MachineInterpreter } from "features/island/buildings/lib/craftingMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  crafting: boolean;
  itemInProgress?: CookableName;
  craftingService?: MachineInterpreter;
  buildingId: string;
}
export const DeliModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  itemInProgress,
  craftingService,
  buildingId,
}) => {
  const deliRecipes = Object.values(DELI_COOKABLES).sort(
    (a, b) => a.experience - b.experience, // Sorts Foods based on their cooking time
  );
  const [selected, setSelected] = useState<Cookable>(
    deliRecipes.find((recipe) => recipe.name === itemInProgress) ||
      deliRecipes[0],
  );

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        bumpkinParts={{
          body: "Beige Farmer Potion",
          hair: "Parlour Hair",
          pants: "Farmer Overalls",
          shirt: "Bumpkin Art Competition Merch",
          tool: "Farmer Pitchfork",
          background: "Farm Background",
          shoes: "Black Farmer Boots",
        }}
        tabs={[{ icon: chefHat, name: "Deli" }]}
        onClose={onClose}
        container={OuterPanel}
      >
        <Recipes
          selected={selected}
          setSelected={setSelected}
          recipes={deliRecipes}
          onCook={onCook}
          onClose={onClose}
          crafting={crafting}
          craftingService={craftingService}
          buildingName="Deli"
          buildingId={buildingId}
          currentlyCooking={selected.name}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
