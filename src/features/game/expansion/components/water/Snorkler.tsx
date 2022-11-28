import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import goblinSnorkling from "assets/npcs/goblin_snorkling.gif";
import bumpkin from "assets/npcs/snorkel_bumpkin.png";
import close from "assets/icons/close.png";

import { MapPlacement } from "../MapPlacement";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const LAND_WIDTH = 6;

interface Props {
  level: number;
}

export const Snorkler: React.FC<Props> = ({ level }) => {
  const [showModal, setShowModal] = useState(false);
  // As the land gets bigger, push the water decorations out
  const offset = Math.floor(Math.sqrt(level)) * LAND_WIDTH;

  return (
    <div
      style={{
        width: `${24 * PIXEL_SCALE}px`,
      }}
    >
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <img className="absolute w-48 left-4 -top-32 -z-10" src={bumpkin} />

        <Panel>
          <div className="p-2">
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              onClick={() => setShowModal(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <p>It is a vast ocean!</p>
            <p className="mt-2">
              There must be gold somewhere beneath the surface.
            </p>
          </div>
        </Panel>
      </Modal>
      <MapPlacement x={-2} y={offset + 2} width={2}>
        <img
          src={goblinSnorkling}
          onClick={() => setShowModal(true)}
          className="cursor-pointer hover:img-highlight"
          style={{
            width: `${24 * PIXEL_SCALE}px`,
          }}
        />
      </MapPlacement>
    </div>
  );
};
