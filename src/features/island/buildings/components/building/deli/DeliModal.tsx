import React from "react";

import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { getKeys } from "features/game/types/craftables";
import close from "assets/icons/close.png";
import chefHat from "src/assets/bumpkins/small/hats/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Consumable,
  ConsumableName,
  CONSUMABLES,
} from "features/game/types/consumables";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Tab } from "components/ui/Tab";
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
        hasTabs
      >
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 3}px`,
            left: `${PIXEL_SCALE * 3}px`,
            right: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Tab isActive>
            <img src={chefHat} className="h-5 mr-2" />
            <span className="text-sm">Deli</span>
          </Tab>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <Recipes
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
