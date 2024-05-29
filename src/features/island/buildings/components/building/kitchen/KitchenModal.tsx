import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import chefHat from "src/assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  KITCHEN_COOKABLES,
} from "features/game/types/consumables";
import { MachineInterpreter } from "features/island/buildings/lib/craftingMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  crafting: boolean;
  itemInProgress?: CookableName;
  craftingService?: MachineInterpreter;
  buildingId: string;
}

export const KitchenModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  itemInProgress,
  craftingService,
  buildingId,
}) => {
  const kitchenRecipes = Object.values(KITCHEN_COOKABLES).sort(
    (a, b) => a.cookingSeconds - b.cookingSeconds // Sorts Foods based on their cooking time
  );
  const [selected, setSelected] = useState<Cookable>(
    kitchenRecipes.find((recipe) => recipe.name === itemInProgress) ||
      kitchenRecipes[0]
  );

  return (
    <>
      <Modal show={isOpen} onHide={onClose}>
        <CloseButtonPanel
          bumpkinParts={{
            body: "Light Brown Farmer Potion",
            hair: "Explorer Hair",
            pants: "Lumberjack Overalls",
            shirt: "Blue Farmer Shirt",
            tool: "Axe",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
          tabs={[{ icon: chefHat, name: "Kitchen" }]}
          onClose={onClose}
        >
          <Recipes
            selected={selected}
            setSelected={setSelected}
            recipes={kitchenRecipes}
            onCook={onCook}
            onClose={onClose}
            crafting={crafting}
            craftingService={craftingService}
            buildingName="Kitchen"
            buildingId={buildingId}
            currentlyCooking={selected.name}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
