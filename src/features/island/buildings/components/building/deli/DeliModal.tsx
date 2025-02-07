import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  DELI_COOKABLES,
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
export const DeliModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  cooking,
  itemInProgress,
  buildingId,
  queue,
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
          cooking={cooking}
          buildingName="Deli"
          buildingId={buildingId}
          queue={queue}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
