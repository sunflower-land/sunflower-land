import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../Recipes";
import {
  Cookable,
  CookableName,
  DELI_COOKABLES,
  isFishCookable,
} from "features/game/types/consumables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { BuildingProduct } from "features/game/types/game";
import { CHAPTERS, getCurrentChapter } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";

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
export const DeliModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  cooking,
  itemInProgress,
  buildingId,
  queue,
  readyRecipes,
}) => {
  const now = useNow({
    live: true,
    autoEndAt: CHAPTERS["Paw Prints"].endDate.getTime(),
  });
  const deliRecipes = Object.values(DELI_COOKABLES)
    .filter((recipe) => {
      if (getCurrentChapter(now) === "Paw Prints") return true;

      return !isFishCookable(recipe.name);
    })
    .sort(
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
        tabs={[{ id: "deli", icon: chefHat, name: "Deli" }]}
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
          readyRecipes={readyRecipes}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
