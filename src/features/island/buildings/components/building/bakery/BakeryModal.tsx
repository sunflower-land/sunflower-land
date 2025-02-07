import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  BAKERY_COOKABLES,
  Cookable,
  CookableName,
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
}
export const BakeryModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  cooking,
  itemInProgress,
  buildingId,
  queue,
}) => {
  const cakeRecipes = Object.values(BAKERY_COOKABLES).sort(
    (a, b) => a.experience - b.experience, // Sorts Foods based on their cooking time
  );
  const [selected, setSelected] = useState<Cookable>(
    cakeRecipes.find((recipe) => recipe.name === itemInProgress) ||
      cakeRecipes[0],
  );

  return (
    <Modal show={isOpen} onHide={onClose}>
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
        container={OuterPanel}
      >
        <Recipes
          selected={selected}
          setSelected={setSelected}
          recipes={cakeRecipes}
          onCook={onCook}
          onClose={onClose}
          cooking={cooking}
          buildingName="Bakery"
          buildingId={buildingId}
          queue={queue}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
