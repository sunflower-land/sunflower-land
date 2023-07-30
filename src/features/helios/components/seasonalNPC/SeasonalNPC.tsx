import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/NPC";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SeasonalNPCModal } from "./components/SeasonalNPCModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getCurrentSeason } from "features/game/types/seasons";

export const SeasonalNPC: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <MapPlacement x={-1.75} y={-4} height={3} width={4}>
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
            parts={{
              body: "Light Brown Farmer Potion",
              shirt: "Hawaiian Shirt",
              pants: "Farmer Pants",
              hair: "Brown Long Hair",
            }}
          />
          {!gameState.context.state.chores && (
            <img
              src={SUNNYSIDE.icons.expression_chat}
              className="absolute animate-float"
              style={{
                width: `${PIXEL_SCALE * 8}px`,
                bottom: `${PIXEL_SCALE * -4}px`,
                left: `${PIXEL_SCALE * 7}px`,
              }}
            />
          )}
        </div>
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <CloseButtonPanel
          title={`${getCurrentSeason()} Season`}
          bumpkinParts={{
            body: "Light Brown Farmer Potion",
            shirt: "Hawaiian Shirt",
            pants: "Farmer Pants",
            hair: "Brown Long Hair",
            tool: "Pirate Scimitar",
          }}
          onClose={() => setIsOpen(false)}
        >
          <SeasonalNPCModal />
        </CloseButtonPanel>
      </Modal>
    </MapPlacement>
  );
};
