import React from "react";

import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { getKeys } from "features/game/types/craftables";

import { Recipes } from "../../ui/Recipes";
import { Consumable, ConsumableName } from "features/game/types";
import { CONSUMABLES } from "features/game/data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: ConsumableName) => void;
}
export const FirePitModal: React.FC<Props> = ({ isOpen, onCook, onClose }) => {
  const firePitRecipes = getKeys(CONSUMABLES).reduce((acc, name) => {
    if (CONSUMABLES[name].building !== "Fire Pit") {
      return acc;
    }

    return [...acc, CONSUMABLES[name]];
  }, [] as Consumable[]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel>
        <Recipes recipes={firePitRecipes} onCook={onCook} onClose={onClose} />
      </Panel>
    </Modal>
  );
};
