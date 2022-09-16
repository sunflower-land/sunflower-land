import React, { useContext } from "react";

import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { getEntries } from "features/game/types/craftables";

import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Feed } from "./Feed";
import { DynamicNFT } from "./DynamicNFT";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFeed: (name: ConsumableName) => void;
}
export const FeedModal: React.FC<Props> = ({ isOpen, onFeed, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const availableFood = getEntries(CONSUMABLES)
    .filter(([name, _]) => !!state.inventory[name])
    .map(([_, consumable]) => consumable);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel>
        <div className="absolute w-1/3 left-2 -top-28 -z-10">
          {state.bumpkin && (
            <DynamicNFT bumpkinParts={state.bumpkin.equipped} />
          )}
        </div>
        {availableFood.length ? (
          <Feed food={availableFood} onFeed={onFeed} onClose={onClose} />
        ) : (
          <>TODO</>
        )}
      </Panel>
    </Modal>
  );
};
