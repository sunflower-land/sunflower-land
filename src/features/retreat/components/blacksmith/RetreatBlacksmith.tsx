import React from "react";
import blacksmith from "assets/buildings/goblin_blacksmith.gif";
import icon from "assets/icons/hammer.png";

import { Action } from "components/ui/Action";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { blacksmithAudio } from "lib/utils/sfx";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { hasFeatureAccess } from "lib/flags";
import { Inventory } from "features/game/types/game";
import { GoblinBlacksmithItems } from "./components/GoblinBlacksmithItems";

interface Props {
  inventory: Inventory;
}

export const RetreatBlacksmith: React.FC<Props> = ({ inventory }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBlacksmith = () => {
    setIsOpen(true);
    //Checks if blacksmithAudio is playing, if false, plays the sound
    if (!blacksmithAudio.playing()) {
      blacksmithAudio.play();
    }
  };

  return (
    <MapPlacement x={3} y={-2} height={5} width={8}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openBlacksmith}
      >
        <img
          src={blacksmith}
          alt="market"
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 121}px`,
            right: `${PIXEL_SCALE * 1}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action className="pointer-events-none" text="Craft" icon={icon} />
        </div>
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        {hasFeatureAccess(inventory, "FRUIT") ? (
          <CloseButtonPanel
            bumpkinParts={{
              body: "Goblin Potion",
              hair: "Blacksmith Hair",
              pants: "Brown Suspenders",
              shirt: "Yellow Farmer Shirt",
              tool: "Hammer",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
            tabs={[{ name: "Craft", icon }]}
            onClose={() => setIsOpen(false)}
          >
            <GoblinBlacksmithItems onClose={() => setIsOpen(false)} />
          </CloseButtonPanel>
        ) : (
          <CloseButtonPanel>
            <div className="mx-2 mt-1 mb-2">Coming soon...</div>
          </CloseButtonPanel>
        )}
      </Modal>
    </MapPlacement>
  );
};
