import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import goblin from "assets/npcs/goblin_jump.gif";
import goblinDig from "assets/npcs/goblin_dig.gif";
import goblinHead from "assets/npcs/goblin_head.png";
import cauliflowerRice from "assets/nfts/roasted_cauliflower.png";
import close from "assets/icons/close.png";

import { Field } from "./Field";

export const CropZoneFour: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const isUnlocked = state.inventory["Roasted Cauliflower"];
  return (
    <>
      {!isUnlocked ? (
        <>
          <img
            src={goblinDig}
            className="absolute z-20 hover:img-highlight cursor-pointer -scale-x-100"
            onClick={() => setShowModal(true)}
            style={{
              width: `${GRID_WIDTH_PX * 5}px`,
              left: `${GRID_WIDTH_PX * 4.8}px`,
              top: `${GRID_WIDTH_PX * 3}px`,
            }}
          />
        </>
      ) : (
        <>
          <img
            src={goblin}
            className="absolute z-10 -scale-x-100"
            style={{
              width: `${GRID_WIDTH_PX * 5}px`,
              left: `${GRID_WIDTH_PX * 4}px`,
              top: `${GRID_WIDTH_PX * -3.25}px`,
            }}
          />
          <img
            src={cauliflowerRice}
            className="absolute "
            style={{
              width: `${GRID_WIDTH_PX * 0.8}px`,
              left: `${GRID_WIDTH_PX * 5.3}px`,
              top: `${GRID_WIDTH_PX * -1.5}px`,
            }}
          />
        </>
      )}

      <div
        className="absolute flex justify-between flex-col"
        onClick={!isUnlocked ? () => setShowModal(true) : undefined}
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
          height: `${GRID_WIDTH_PX * 2.3}px`,
          left: `${GRID_WIDTH_PX * 3}px`,
          top: `${GRID_WIDTH_PX * 3}px`,
        }}
      >
        <div className="flex justify-between items-center">
          <Field selectedItem={selectedItem} fieldIndex={16} />
          <Field selectedItem={selectedItem} fieldIndex={17} />
          <Field selectedItem={selectedItem} fieldIndex={18} />
        </div>
        <div className="flex justify-between items-center z-10">
          <Field selectedItem={selectedItem} fieldIndex={19} />
          <Field selectedItem={selectedItem} fieldIndex={20} />
          <Field selectedItem={selectedItem} fieldIndex={21} />
        </div>
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={() => setShowModal(false)}
          />
          <div className="flex items-start">
            <img src={goblinHead} className="w-16 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">
                I will keep digging until I find some Cauliflowers to roast!
              </span>
              <img
                src={cauliflowerRice}
                className="w-8 img-highlight float-right mr-1"
              />
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
