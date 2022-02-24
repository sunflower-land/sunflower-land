import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import goblin from "assets/npcs/goblin.gif";
import goblinHead from "assets/npcs/goblin_head.png";
import pumpkinSoup from "assets/nfts/pumpkin_soup.png";
import questionMark from "assets/icons/expression_confused.png";
import heart from "assets/icons/heart.png";

import { Field } from "./Field";

export const CropZoneTwo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <>
      {!state.inventory["Pumpkin Soup"] ? (
        <>
          {" "}
          <img
            src={questionMark}
            className="absolute z-10 animate-float"
            style={{
              width: `${GRID_WIDTH_PX * 0.3}px`,
              left: `${GRID_WIDTH_PX * 3.35}px`,
              bottom: `${GRID_WIDTH_PX * 2.7}px`,
            }}
          />
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
        </>
      ) : (
        <>
          <img
            src={heart}
            className="absolute z-10 animate-float"
            style={{
              width: `${GRID_WIDTH_PX * 0.3}px`,
              left: `${GRID_WIDTH_PX * -0.6}px`,
              bottom: `${GRID_WIDTH_PX * 5.7}px`,
            }}
          />
          <img
            src={goblin}
            className="absolute z-10 pointer-events-none"
            style={{
              width: `${GRID_WIDTH_PX * 5}px`,
              left: `${GRID_WIDTH_PX * -3}px`,
              bottom: `${GRID_WIDTH_PX * 3.25}px`,
            }}
          />
          <img
            src={pumpkinSoup}
            className="absolute "
            style={{
              width: `${GRID_WIDTH_PX * 0.75}px`,
              left: `${GRID_WIDTH_PX * 0.2}px`,
              bottom: `${GRID_WIDTH_PX * 4.4}px`,
            }}
          />
        </>
      )}

      <div
        className="absolute flex justify-center flex-col"
        id="cropzone-two"
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          height: `${GRID_WIDTH_PX * 3}px`,
          left: `${GRID_WIDTH_PX * 1}px`,
          bottom: `${GRID_WIDTH_PX * 0.6}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} fieldIndex={5} />
          <Field selectedItem={selectedItem} fieldIndex={6} />
        </div>
        {/* Middle row */}
        <div className="flex justify-center">
          <Field selectedItem={selectedItem} fieldIndex={7} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} fieldIndex={8} />
          <Field selectedItem={selectedItem} fieldIndex={9} />
        </div>
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex items-start">
            <img src={goblinHead} className="w-16 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">This is Goblin land!</span>
              <span className="text-shadow block mt-4">
                Have you got any of that creamy pumpkin soup?
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
