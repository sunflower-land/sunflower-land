import React, { useState } from "react";

import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { getKeys } from "features/game/types/craftables";

import { Recipes } from "../../ui/Recipes";
import {
  Consumable,
  ConsumableName,
  CONSUMABLES,
} from "features/game/types/consumables";
import { MachineInterpreter } from "features/island/buildings/lib/craftingMachine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: ConsumableName) => void;
  crafting: boolean;
  craftingService?: MachineInterpreter;
}
export const DeliModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  craftingService,
}) => {
  const deliRecipes = getKeys(CONSUMABLES).reduce((acc, name) => {
    if (CONSUMABLES[name].building !== "Deli") {
      return acc;
    }

    return [...acc, CONSUMABLES[name]];
  }, [] as Consumable[]);
  const [selected, setSelected] = useState<Consumable>(deliRecipes[0]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel
        bumpkinParts={{
          body: "Beige Farmer Potion",
          hair: "Parlour Hair",
          pants: "Farmer Overalls",
          shirt: "Bumpkin Art Competition Merch",
          tool: "Farmer Pitchfork",
          background: "Farm Background",
          shoes: "Black Farmer Boots",
        }}
      >
        <Recipes
          selected={selected}
          setSelected={setSelected}
          recipes={deliRecipes}
          onCook={onCook}
          onClose={onClose}
          crafting={crafting}
          craftingService={craftingService}
        />
      </Panel>
    </Modal>
  );
};
