import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import goblin from "assets/npcs/goblin.gif";
import goblinWatering from "assets/npcs/goblin_watering.gif";
import goblinHead from "assets/npcs/goblin_head.png";
import cabbageSoup from "assets/nfts/saurekrat_small.png";
import close from "assets/icons/close.png";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import { Field } from "./Field";
import { Button } from "components/ui/Button";

export const CropZoneThree: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [scrollIntoView] = useScrollIntoView();

  const goToKitchen = () => {
    setShowModal(false);
    scrollIntoView(Section.Town);
  };

  const isUnlocked = state.inventory["Sauerkraut"];

  return (
    <>
      {!isUnlocked ? (
        <>
          <img
            src={goblinWatering}
            className="absolute z-20 hover:img-highlight cursor-pointer"
            onClick={() => setShowModal(true)}
            style={{
              width: `${GRID_WIDTH_PX * 5}px`,
              left: `${GRID_WIDTH_PX * 0.2}px`,
              top: `${-GRID_WIDTH_PX * 1.5}px`,
            }}
          />
        </>
      ) : (
        <>
          <img
            src={goblin}
            className="absolute z-10"
            style={{
              width: `${GRID_WIDTH_PX * 1}px`,
              left: `${GRID_WIDTH_PX * 4}px`,
              top: `${GRID_WIDTH_PX * -1.95}px`,
            }}
          />
          <img
            src={cabbageSoup}
            className="absolute "
            style={{
              width: `${GRID_WIDTH_PX * 0.3}px`,
              left: `${GRID_WIDTH_PX * 5}px`,
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
          top: `${GRID_WIDTH_PX * 0.22}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between items-center">
          <Field selectedItem={selectedItem} fieldIndex={10} />
          <Field selectedItem={selectedItem} fieldIndex={11} />
          <Field selectedItem={selectedItem} fieldIndex={12} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between items-center z-10">
          <Field selectedItem={selectedItem} fieldIndex={13} />
          <Field selectedItem={selectedItem} fieldIndex={14} />
          <Field selectedItem={selectedItem} fieldIndex={15} />
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
                The only thing I like more than farming is Sauerkraut
              </span>
              <img
                src={cabbageSoup}
                className="w-4 img-highlight float-right mr-1 mb-2"
              />
              <Button className="text-sm" onClick={goToKitchen}>
                Go to the kitchen
              </Button>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
