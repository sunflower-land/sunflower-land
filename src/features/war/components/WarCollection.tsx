import React, { useState } from "react";

import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import maleHuman from "assets/npcs/idle.gif";
import maleGoblin from "assets/npcs/goblin.gif";
import humanBase from "assets/buildings/human_recruiter_base.png";
import goblinBase from "assets/buildings/goblin_recruiter_base.png";
import goblinFlags from "assets/decorations/goblin_flags.png";
import humanFlags from "assets/decorations/human_flags.png";
import weapons from "assets/decorations/weapons.png";
import sword from "assets/icons/sword.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { WarCollectors } from "./WarCollectors";
import { WarSide } from "features/game/events/pickSide";
import { Action } from "components/ui/Action";

export const WarCollection: React.FC<{ side: WarSide }> = ({ side }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel>
          <WarCollectors side={side} onClose={() => setShowModal(false)} />
        </Panel>
      </Modal>
      <div>
        {side === WarSide.Goblin && (
          <>
            <div
              className="absolute z-10"
              style={{
                left: `${GRID_WIDTH_PX * 51.57}px`,
                top: `${GRID_WIDTH_PX * 32.8}px`,
              }}
            >
              <img
                src={goblinBase}
                style={{
                  width: `${PIXEL_SCALE * 86}px`,
                }}
                onClick={() => setShowModal(true)}
              />
              <img
                src={femaleGoblin}
                className="absolute left-20 -bottom-2 cursor-pointer hover:img-highlight"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                }}
                onClick={() => setShowModal(true)}
              />
              <img
                src={maleGoblin}
                className="absolute right-12 -bottom-2 cursor-pointer hover:img-highlight"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                  transform: "scaleX(-1)",
                }}
                onClick={() => setShowModal(true)}
              />
            </div>
            <div
              className="absolute z-10"
              style={{
                left: `${GRID_WIDTH_PX * 61}px`,
                top: `${GRID_WIDTH_PX * 30.5}px`,
              }}
            >
              <img
                src={goblinFlags}
                style={{
                  width: `${PIXEL_SCALE * 60}px`,
                }}
              />
            </div>
            <div
              className="absolute z-10"
              style={{
                left: `${GRID_WIDTH_PX * 56.9}px`,
                top: `${GRID_WIDTH_PX * 34.6}px`,
              }}
            >
              <img
                src={weapons}
                style={{
                  width: `${PIXEL_SCALE * 29}px`,
                }}
              />
            </div>
          </>
        )}
        {side === WarSide.Human && (
          <>
            <div
              className="absolute z-10"
              style={{
                left: `${GRID_WIDTH_PX * 51.57}px`,
                top: `${GRID_WIDTH_PX * 32.8}px`,
              }}
            >
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
            </div>

            <div
              className="absolute z-10"
              style={{
                left: `${GRID_WIDTH_PX * 61}px`,
                top: `${GRID_WIDTH_PX * 30.5}px`,
              }}
            >
              <img
                src={humanFlags}
                style={{
                  width: `${PIXEL_SCALE * 60}px`,
                }}
              />
            </div>
            <div
              className="absolute z-10"
              style={{
                left: `${GRID_WIDTH_PX * 56.9}px`,
                top: `${GRID_WIDTH_PX * 34.6}px`,
              }}
            >
              <img
                src={weapons}
                style={{
                  width: `${PIXEL_SCALE * 29}px`,
                }}
              />
            </div>
          </>
        )}
        <div
          className="absolute cursor-pointer hover:img-highlight"
          style={{
            left: `${GRID_WIDTH_PX * 53.57}px`,
            top: `${GRID_WIDTH_PX * 36.8}px`,
          }}
        >
          <Action
            className=""
            text="War"
            icon={sword}
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>
    </>
  );
};
