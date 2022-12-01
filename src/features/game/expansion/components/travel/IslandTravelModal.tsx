import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import boat from "assets/npcs/island_boat_pirate.png";
import close from "assets/icons/close.png";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { IslandList } from "./IslandList";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Tutorial } from "./Tutorial";
import { Bumpkin } from "features/game/types/game";

interface Props {
  isOpen: boolean;
  bumpkin: Bumpkin | undefined;
  isVisiting?: boolean;
  isTravelAllowed?: boolean;
  onShow?: () => void;
  onClose: () => void;
}

export const IslandTravelModal = ({
  bumpkin,
  isVisiting = false,
  isTravelAllowed = true,
  isOpen,
  onShow,
  onClose,
}: Props) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Boat")
  );

  const bumpkinParts: Partial<Equipped> = {
    body: "Goblin Potion",
    hair: "Sun Spots",
    pants: "Brown Suspenders",
    shirt: "SFL T-Shirt",
    tool: "Sword",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  };

  const acknowledge = () => {
    acknowledgeTutorial("Boat");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <Modal centered show={isOpen} onHide={acknowledge} onShow={onShow}>
        <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />
      </Modal>
    );
  }

  return (
    <Modal centered show={isOpen} onHide={onClose} onShow={onShow}>
      <Panel className="relative" hasTabs bumpkinParts={bumpkinParts}>
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <Tab isActive>
            <img src={boat} className="h-5 mr-2" />
            <span className="text-sm">Travel To</span>
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
        {isTravelAllowed && (
          <IslandList bumpkin={bumpkin} showVisitList={isVisiting} />
        )}
        {!isTravelAllowed && <span className="loading">Loading</span>}
      </Panel>
    </Modal>
  );
};
