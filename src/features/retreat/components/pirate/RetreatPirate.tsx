import React, { useEffect } from "react";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { blacksmithAudio, loadAudio } from "lib/utils/sfx";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { GoblinPirateItems } from "./components/GoblinPirateItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC } from "features/island/bumpkin/components/NPC";
import { Equipped } from "features/game/types/bumpkin";

const bumpkin: Equipped = {
  body: "Goblin Potion",
  hair: "White Long Hair",
  hat: "Pirate Hat",
  shirt: "Fancy Top",
  pants: "Pirate Pants",
  tool: "Pirate Scimitar",
  background: "Seashore Background",
  shoes: "Black Farmer Boots",
};

export const RetreatPirate: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    loadAudio([blacksmithAudio]);
  }, []);

  const openPirate = () => {
    setIsOpen(true);
    //Checks if blacksmithAudio is playing, if false, plays the sound
    if (!blacksmithAudio.playing()) {
      blacksmithAudio.play();
    }
  };

  return (
    <>
      <MapPlacement x={8} y={-13} height={3} width={2}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={openPirate}
        >
          <NPC parts={bumpkin} />
          <img
            src={SUNNYSIDE.decorations.treasure_chest}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              left: `${GRID_WIDTH_PX * 1}px`,
              top: `${GRID_WIDTH_PX * 1}px`,
            }}
          />
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              bottom: `${PIXEL_SCALE * -3}px`,
            }}
          >
            <Action
              className="pointer-events-none"
              text="Pirate"
              icon={SUNNYSIDE.icons.basket}
            />
          </div>
        </div>
      </MapPlacement>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <CloseButtonPanel
          bumpkinParts={bumpkin}
          tabs={[{ name: "Craft", icon: SUNNYSIDE.icons.hammer }]}
          onClose={() => setIsOpen(false)}
        >
          <GoblinPirateItems onClose={() => setIsOpen(false)} />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
