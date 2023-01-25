import React, { useContext, useState } from "react";

import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

export const GoblinDigging: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  return (
    <MapPlacement x={3} y={2} height={1} width={2}>
      <img
        src={SUNNYSIDE.soil.sand_dug}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          right: `${PIXEL_SCALE * 2}px`,
          bottom: `${PIXEL_SCALE * -4}px`,
        }}
      />
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          left: `0px`,
          bottom: `0px`,
        }}
      />
      <div className="w-max h-full relative">
        <img
          src={SUNNYSIDE.npcs.goblin_treasure}
          className={classNames("relative cursor-pointer hover:img-highlight", {
            "pointer-events-none": !gameState.matches("playing"),
          })}
          style={{
            width: `${PIXEL_SCALE * 33}px`,
            left: `${PIXEL_SCALE * -7}px`,
            bottom: `${PIXEL_SCALE * 13}px`,
          }}
          onClick={() => setShowModal(true)}
        />
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Sun Spots",
            pants: "Lumberjack Overalls",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={() => setShowModal(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="p-2">
            <p className="mb-4">
              My uncle found a diamond ring digging at this beach.
            </p>
            <p>All I keep finding is boring SFL coins.</p>
          </div>
        </Panel>
      </Modal>
    </MapPlacement>
  );
};
