import React, { useState } from "react";

import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import maleHuman from "assets/npcs/idle.gif";
import maleGoblin from "assets/npcs/goblin.gif";
import humanBase from "assets/buildings/human_recruiter_base_alt.png";
import goblinBase from "assets/buildings/goblin_recruiter_base_alt.png";
import weapons from "assets/decorations/weapons.png";
import sword from "assets/icons/sword.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { WarSide } from "features/game/events/pickSide";
import { Action } from "components/ui/Action";
import { MapPlacement } from "../../components/MapPlacement";
import { WarCollectors } from "features/war/components/WarCollectors";

export const WarCollection: React.FC<{ side: WarSide }> = ({ side }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel>
          <WarCollectors side={side} onClose={() => setShowModal(false)} />
        </Panel>
      </Modal>
      <>
        <MapPlacement x={-2} y={-11}>
          {side === WarSide.Goblin && (
            <>
              <img
                src={goblinBase}
                style={{
                  width: `${PIXEL_SCALE * 86}px`,
                }}
              />
              <img
                src={femaleGoblin}
                className="absolute left-20 -bottom-2 cursor-pointer hover:img-highlight"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                }}
                onClick={() => setShowModal(true)}
              />
              <img
                src={maleGoblin}
                className="absolute right-12 -bottom-2 cursor-pointer hover:img-highlight"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  transform: "scaleX(-1)",
                }}
                onClick={() => setShowModal(true)}
              />
            </>
          )}
          {side === WarSide.Human && (
            <>
              <img
                src={humanBase}
                style={{
                  width: `${PIXEL_SCALE * 86}px`,
                }}
              />
              <img
                src={femaleHuman}
                className="absolute left-20 -bottom-2 cursor-pointer hover:img-highlight"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                }}
                onClick={() => setShowModal(true)}
              />
              <img
                src={maleHuman}
                className="absolute right-12 -bottom-2 cursor-pointer hover:img-highlight"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  transform: "scaleX(-1)",
                }}
                onClick={() => setShowModal(true)}
              />
            </>
          )}
        </MapPlacement>
        <MapPlacement x={3.5} y={-12.5}>
          <img
            src={weapons}
            style={{
              width: `${PIXEL_SCALE * 29}px`,
            }}
          />
        </MapPlacement>
        <MapPlacement x={0} y={-15}>
          <Action
            className="cursor-pointer hover:img-highlight"
            text="War"
            icon={sword}
            onClick={() => setShowModal(true)}
          />
        </MapPlacement>
      </>
    </>
  );
};
