import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import chefHat from "src/assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  JUICE_COOKABLES,
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
}
export const SmoothieShackModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  itemInProgress,
  craftingService,
}) => {
  const JuiceRecipes = Object.values(JUICE_COOKABLES).sort(
    (a, b) => a.cookingSeconds - b.cookingSeconds // Sorts Foods based on their cooking time
  );
  const [selected, setSelected] = useState<Cookable>(
    JuiceRecipes.find((recipe) => recipe.name === itemInProgress) ||
      JuiceRecipes[0]
  );

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        bumpkinParts={{
          body: "Light Brown Farmer Potion",
          hair: "Brown Long Hair",
          pants: "Farmer Pants",
          shirt: "Pineapple Shirt",
          tool: "Parsnip",
          background: "Farm Background",
          shoes: "Black Farmer Boots",
        }}
        tabs={[{ icon: chefHat, name: "Smoothie Shack" }]}
        onClose={onClose}
      >
        <Recipes
          selected={selected}
          setSelected={setSelected}
          recipes={JuiceRecipes}
          onCook={onCook}
          onClose={onClose}
          crafting={crafting}
          craftingService={craftingService}
          buildingName="Smoothie Shack"
        />
      </CloseButtonPanel>
    </Modal>
  );
};
