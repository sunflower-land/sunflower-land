import React, { useState } from "react";

import { Modal } from "react-bootstrap";
import { getKeys } from "features/game/types/craftables";

import chefHat from "src/assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  COOKABLES,
} from "features/game/types/consumables";
import { MachineInterpreter } from "features/island/buildings/lib/craftingMachine";
import { Equipped } from "features/game/types/bumpkin";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Tutorial } from "./Tutorial";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  crafting: boolean;
  itemInProgress?: CookableName;
  craftingService?: MachineInterpreter;
}
export const FirePitModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  itemInProgress,
  craftingService,
}) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Fire Pit")
  );
  const firePitRecipes = getKeys(COOKABLES).reduce((acc, name) => {
    if (COOKABLES[name].building !== "Fire Pit") {
      return acc;
    }

    return [...acc, COOKABLES[name]];
  }, [] as Cookable[]);
  const [selected, setSelected] = useState<Cookable>(
    firePitRecipes.find((recipe) => recipe.name === itemInProgress) ||
      firePitRecipes[0]
  );

  const bumpkinParts: Partial<Equipped> = {
    body: "Beige Farmer Potion",
    hair: "Buzz Cut",
    pants: "Farmer Pants",
    shirt: "Yellow Farmer Shirt",
    coat: "Chef Apron",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  };

  const acknowledge = () => {
    acknowledgeTutorial("Fire Pit");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <Modal show={isOpen} onHide={acknowledge} centered>
        <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />
      </Modal>
    );
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <CloseButtonPanel
        bumpkinParts={bumpkinParts}
        tabs={[{ icon: chefHat, name: "Fire Pit" }]}
        onClose={onClose}
      >
        <Recipes
          selected={selected}
          setSelected={setSelected}
          recipes={firePitRecipes}
          onCook={onCook}
          onClose={onClose}
          crafting={!!crafting}
          craftingService={craftingService}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
