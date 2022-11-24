import React, { useContext } from "react";

import { Panel } from "components/ui/Panel";
import { getEntries } from "features/game/types/craftables";

import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Feed } from "./Feed";
import { Modal } from "react-bootstrap";
import { PIXEL_SCALE } from "features/game/lib/constants";
import foodIcon from "src/assets/food/chicken_drumstick.png";
import close from "assets/icons/close.png";
import { Tab } from "components/ui/Tab";

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
    .filter(([name, _]) => !!state.inventory[name]?.gt(0))
    .map(([_, consumable]) => consumable);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel
        className="relative"
        bumpkinParts={state.bumpkin?.equipped}
        hasTabs
      >
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
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
          <Tab isActive>
            <img src={foodIcon} className="h-5 mr-2" />
            <span className="text-sm">Feed Bumpkin</span>
          </Tab>
        </div>
        <Feed food={availableFood} onFeed={onFeed} onClose={onClose} />
      </Panel>
    </Modal>
  );
};
