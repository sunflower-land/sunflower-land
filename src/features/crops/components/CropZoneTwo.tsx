import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import goblin from "assets/npcs/goblin.gif";
import goblinHead from "assets/npcs/goblin_head.png";
import pumpkinSoup from "assets/nfts/pumpkin_soup.png";

import { Field } from "./Field";

interface Props {}

export const CropZoneTwo: React.FC<Props> = () => {
  const [showModal, setShowModal] = useState(false);
  const { state, selectedItem } = useContext(Context);

  return (
    <>
      {!state.inventory["Pumpkin Soup"] && (
        <img
          src={goblin}
          className="absolute z-10 hover:img-highlight cursor-pointer"
          onClick={() => setShowModal(true)}
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            left: `${GRID_WIDTH_PX * 1}px`,
            bottom: `${GRID_WIDTH_PX * 0.25}px`,
          }}
        />
      )}

      <div
        className="absolute flex justify-center flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          height: `${GRID_WIDTH_PX * 3}px`,
          left: `${GRID_WIDTH_PX * 1}px`,
          bottom: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[5]} />
          <Field selectedItem={selectedItem} field={state.fields[6]} />
        </div>
        {/* Middle row */}
        <div className="flex justify-center">
          <Field selectedItem={selectedItem} field={state.fields[7]} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[8]} />
          <Field selectedItem={selectedItem} field={state.fields[9]} />
        </div>
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex items-start">
            <img src={goblinHead} className="w-16 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">This is Goblin land!</span>
              <span className="text-shadow block mt-4">
                Have you got any of that spicy pumpkin soup?
              </span>
              <img
                src={pumpkinSoup}
                className="w-8 img-highlight float-right mr-1"
              />
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
