import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../Recipes";
import {
  Cookable,
  CookableName,
  KITCHEN_COOKABLES,
} from "features/game/types/consumables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { BuildingProduct } from "features/game/types/game";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  cooking?: BuildingProduct;
  itemInProgress?: CookableName;
  buildingId: string;
  queue: BuildingProduct[];
  readyRecipes: BuildingProduct[];
}

export const KitchenModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  cooking,
  itemInProgress,
  buildingId,
  queue,
  readyRecipes,
}) => {
  const kitchenRecipes = Object.values(KITCHEN_COOKABLES).sort(
    (a, b) => a.experience - b.experience, // Sorts Foods based on their cooking time
  );
  const [selected, setSelected] = useState<Cookable>(
    kitchenRecipes.find((recipe) => recipe.name === itemInProgress) ||
      kitchenRecipes[0],
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
          container={OuterPanel}
        >
          <Recipes
            selected={selected}
            setSelected={setSelected}
            recipes={kitchenRecipes}
            onCook={onCook}
            onClose={onClose}
            cooking={cooking}
            buildingName="Kitchen"
            buildingId={buildingId}
            queue={queue}
            readyRecipes={readyRecipes}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
