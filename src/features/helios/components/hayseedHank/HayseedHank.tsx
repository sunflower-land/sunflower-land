import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { HayseedHankModal } from "./components/HayseedHankModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { hasShownTutorial } from "lib/tutorial";

export const HayseedHank: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(
    !hasShownTutorial("Chore Master")
      ? "Howdy! I'm Hayseed Hank"
      : "Ready to work?"
  );

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <MapPlacement x={-8} y={-9} height={3} width={4}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${PIXEL_SCALE * 19}px`,
            bottom: `${PIXEL_SCALE * 27}px`,
          }}
        >
          <NPC
            body="Beige Farmer Potion"
            shirt="Red Farmer Shirt"
            pants="Brown Suspenders"
            hair="Sun Spots"
          />
          {!gameState.context.state.hayseedHank.progress && (
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className="absolute animate-float"
              style={{
                width: `${PIXEL_SCALE * 3}px`,
                bottom: `${PIXEL_SCALE * -4}px`,
                left: `${PIXEL_SCALE * 7}px`,
              }}
            />
          )}
        </div>
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <CloseButtonPanel
          title={title}
          bumpkinParts={{
            body: "Beige Farmer Potion",
            shirt: "Red Farmer Shirt",
            pants: "Brown Suspenders",
            hair: "Sun Spots",
            tool: "Parsnip",
          }}
          onClose={() => setIsOpen(false)}
        >
          <HayseedHankModal
            onTutorialComplete={() => setTitle("Ready to work?")}
            onClose={() => setIsOpen(false)}
          />
        </CloseButtonPanel>
      </Modal>
    </MapPlacement>
  );
};
