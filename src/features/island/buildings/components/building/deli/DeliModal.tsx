import React from "react";

import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { getKeys } from "features/game/types/craftables";

import { Recipes } from "../../ui/Recipes";
import {
  Consumable,
  ConsumableName,
  CONSUMABLES,
} from "features/game/types/consumables";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: ConsumableName) => void;
}
export const DeliModal: React.FC<Props> = ({ isOpen, onCook, onClose }) => {
  const deliRecipes = getKeys(CONSUMABLES).reduce((acc, name) => {
    if (CONSUMABLES[name].building !== "Deli") {
      return acc;
    }

    return [...acc, CONSUMABLES[name]];
  }, [] as Consumable[]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <div className="absolute w-48 -left-4 -top-32 -z-10">
        <DynamicNFT
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Parlour Hair",
            pants: "Farmer Overalls",
            shirt: "Bumpkin Art Competition Merch",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        />
      </div>
      <Panel>
        <Recipes recipes={deliRecipes} onCook={onCook} onClose={onClose} />
      </Panel>
    </Modal>
  );
};
