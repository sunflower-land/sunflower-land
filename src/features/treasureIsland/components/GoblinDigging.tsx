import React, { useContext, useState } from "react";

import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const GoblinDigging: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  return (
    <MapPlacement x={3} y={2} height={1} width={2}>
      <div
        className={classNames(
          "w-max h-full relative cursor-pointer hover:img-highlight",
          {
            "pointer-events-none": !gameState.matches("playing"),
          }
        )}
        onClick={() => setShowModal(true)}
      >
        <img
          src={SUNNYSIDE.soil.sand_dug}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            left: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 2}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.goblin_treasure}
          className="relative pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 33}px`,
            left: `${PIXEL_SCALE * -5}px`,
            bottom: `${PIXEL_SCALE * 19}px`,
          }}
        />
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Sun Spots",
            pants: "Lumberjack Overalls",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
          onClose={() => setShowModal(false)}
        >
          <div className="p-2">
            <p className="mb-3 mr-7">
              My uncle found a diamond ring digging at this beach.
            </p>
            <p>All I keep finding is boring SFL coins.</p>
          </div>
        </CloseButtonPanel>
      </Modal>
    </MapPlacement>
  );
};
