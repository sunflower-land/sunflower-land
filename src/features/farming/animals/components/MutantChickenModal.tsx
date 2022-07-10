import React from "react";
import Modal from "react-bootstrap/esm/Modal";
import { Panel } from "components/ui/Panel";
import { Inventory, MutantChicken } from "features/game/types/game";

import richChicken from "assets/animals/chickens/rich_chicken.png";
import fatChicken from "assets/animals/chickens/fat_chicken.png";
import speedChicken from "assets/animals/chickens/speed_chicken.png";
import { Button } from "components/ui/Button";

const mutants: Record<MutantChicken, Record<string, string>> = {
  "Speed Chicken": {
    description: "Your chickens will now produce eggs 10% faster.",
    image: speedChicken,
  },
  "Fat Chicken": {
    description: "Your chickens will now require 10% less wheat per feed.",
    image: fatChicken,
  },
  "Rich Chicken": {
    description: "Your chickens will now yield 10% more eggs.",
    image: richChicken,
  },
};

interface Props {
  type: MutantChicken;
  show: boolean;
  onContinue: () => void;
  inventory: Inventory;
}

export const MutantChickenModal = ({
  type,
  show,
  onContinue,
  inventory,
}: Props) => {
  // Boosts don't stack so only show boost information if the user doesn't already have the mutant
  const showDescrition = !inventory[type];
  return (
    <Modal show={show} centered>
      <Panel>
        <div className="p-2">
          <h1 className="text-xl text-center">{type}!</h1>
          <div className="flex my-4 justify-center">
            <img src={mutants[type].image} style={{ width: "50px" }} />
          </div>
          <p className="text-sm mb-2">{`Congratulations, your chicken has laid a very rare mutant chicken!`}</p>
          {showDescrition && (
            <p className="text-sm mb-2">{mutants[type].description}</p>
          )}
        </div>

        <div className="flex">
          <Button className="text-sm" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
