import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import { getKeys } from "features/game/types/craftables";
import chefHat from "src/assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  COOKABLES,
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
export const BakeryModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  itemInProgress,
  craftingService,
}) => {
  const cakeRecipes = getKeys(COOKABLES).reduce((acc, name) => {
    if (COOKABLES[name]?.disabled) {
      return acc;
    }

    if (COOKABLES[name].building !== "Bakery") {
      return acc;
    }

    return [...acc, COOKABLES[name]];
  }, [] as Cookable[]);
  const [selected, setSelected] = useState<Cookable>(
    cakeRecipes.find((recipe) => recipe.name === itemInProgress) ||
      cakeRecipes[0]
  );

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <CloseButtonPanel
        bumpkinParts={{
          body: "Goblin Potion",
          hair: "Sun Spots",
          pants: "Lumberjack Overalls",
          shirt: "Red Farmer Shirt",
          tool: "Golden Spatula",
          background: "Farm Background",
          hat: "Chef Hat",
          shoes: "Black Farmer Boots",
        }}
        tabs={[{ icon: chefHat, name: "Bakery" }]}
        onClose={onClose}
      >
        <Recipes
          selected={selected}
          setSelected={setSelected}
          recipes={cakeRecipes}
          onCook={onCook}
          onClose={onClose}
          crafting={crafting}
          craftingService={craftingService}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
