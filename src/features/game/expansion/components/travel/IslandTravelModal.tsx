import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import boatIcon from "assets/npcs/island_boat_pirate.png";

import { IslandList } from "./IslandList";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Tutorial } from "./Tutorial";
import { Bumpkin, Inventory } from "features/game/types/game";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

const CONTENT_HEIGHT = 380;

interface IslandTravelModalProps {
  isOpen: boolean;
  bumpkin: Bumpkin | undefined;
  inventory: Inventory;
  isVisiting?: boolean;
  travelAllowed: boolean;
  onShow?: () => void;
  onClose: () => void;
}

export const IslandTravelModal: React.FC<IslandTravelModalProps> = ({
  bumpkin,
  inventory,
  isVisiting = false,
  travelAllowed,
  isOpen,
  onShow,
  onClose,
}) => {
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
  const hasBetaAccess = !!inventory["Beta Pass"];
  return (
    <Modal centered show={isOpen} onHide={onClose} onShow={onShow}>
      <CloseButtonPanel
        tabs={[{ icon: boatIcon, name: "Travel To" }]}
        bumpkinParts={bumpkinParts}
        onClose={onClose}
      >
        <div
          style={{ maxHeight: CONTENT_HEIGHT }}
          className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
        >
          {!travelAllowed && <span className="loading">Saving</span>}
          <IslandList
            bumpkin={bumpkin}
            showVisitList={isVisiting}
            inventory={inventory}
            travelAllowed={travelAllowed}
            hasBetaAccess={hasBetaAccess}
            onClose={onClose}
          />
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
