import React from "react";

import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import {
  Consumable,
  CONSUMABLES,
} from "features/game/events/landExpansion/cook";
import { getKeys } from "features/game/types/craftables";

import { Recipes } from "../../ui/Recipes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export const FirePitModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const firePitRecipes = getKeys(CONSUMABLES).reduce((acc, name) => {
    if (CONSUMABLES[name].building !== "Fire Pit") {
      return acc;
    }

    return [...acc, CONSUMABLES[name]];
  }, [] as Consumable[]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel>
        <Recipes recipes={firePitRecipes} onClose={onClose} />
      </Panel>
    </Modal>
  );
};
