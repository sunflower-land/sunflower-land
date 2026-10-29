import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Modal } from "components/ui/Modal";
import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../Recipes";
import {
  type Cookable,
  type CookableName,
  isFishCookable,
  KITCHEN_COOKABLES,
  isTruffleRecipe,
} from "features/game/types/consumables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import type { BuildingProduct } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
import { CHAPTERS, getCurrentChapter } from "features/game/types/chapters";
import { Context } from "features/game/GameProvider";
import { hasFeatureAccess } from "lib/flags";

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
  const now = useNow({
    live: true,
    autoEndAt: CHAPTERS["Paw Prints"].endDate.getTime(),
  });
  const { gameService } = useContext(Context);
  // Truffle recipes ride on the Pigs' flag (Truffle only exists behind it)
  const hasTruffleRecipes = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "PIGPEN"),
  );
  const kitchenRecipes = Object.values(KITCHEN_COOKABLES)
    .filter((recipe) => {
      if (isTruffleRecipe(recipe.name)) return hasTruffleRecipes;

      if (getCurrentChapter(now) === "Paw Prints") return true;

      return !isFishCookable(recipe.name);
    })
    .sort(
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
          tabs={[{ id: "kitchen", icon: chefHat, name: "Kitchen" }]}
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
