import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import goblinSnorkling from "assets/npcs/goblin_snorkling.gif";
import bumpkin from "assets/npcs/snorkel_bumpkin.png";

import { MapPlacement } from "../MapPlacement";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";

interface Props {
  x: number;
  y: number;
}

export const Snorkler: React.FC<Props> = ({ x, y }) => {
  const [showModal, setShowModal] = useState(false);

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
              src={SUNNYSIDE.icons.close}
              className="absolute cursor-pointer z-20"
              onClick={() => setShowModal(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <p>{translate("snorkler.vastOcean")}</p>
            <p className="mt-2">
              <p>{translate("snorkler.goldBeneath")}</p>
            </p>
          </div>
        </Panel>
      </Modal>
      <MapPlacement x={x} y={y} width={2}>
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
