import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Modal } from "components/ui/Modal";
import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../Recipes";
import {
  BAKERY_COOKABLES,
  type Cookable,
  type CookableName,
  isTruffleRecipe,
} from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { hasFeatureAccess } from "lib/flags";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import type { BuildingProduct } from "features/game/types/game";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  cooking?: BuildingProduct;
  itemInProgress?: CookableName;
  buildingId: string;
  readyRecipes: BuildingProduct[];
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
  readyRecipes,
}) => {
  const { gameService } = useContext(Context);
  // Truffle recipes ride on the Pigs' flag (Truffle only exists behind it)
  const hasTruffleRecipes = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "PIGPEN"),
  );
  const cakeRecipes = Object.values(BAKERY_COOKABLES)
    .filter((recipe) => !isTruffleRecipe(recipe.name) || hasTruffleRecipes)
    .sort(
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
        tabs={[{ id: "bakery", icon: chefHat, name: "Bakery" }]}
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
          readyRecipes={readyRecipes}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
