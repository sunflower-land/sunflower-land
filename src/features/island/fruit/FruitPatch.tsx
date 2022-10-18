import React, { useState } from "react";

import appleTree from "assets/fruit/apple/apple_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";

import fruitPatch from "assets/fruit/grass_patch.png";
import basket from "assets/fruit/fruit_basket.png";
import close from "assets/icons/close.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export type FruitName = "Apple" | "Orange" | "Blueberry";

const fruits: Record<FruitName, React.FC> = {
  Apple: () => (
    <img
      src={appleTree}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
  Blueberry: () => (
    <img
      src={blueberryBush}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 8}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
  Orange: () => (
    <img
      src={orangeTree}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 8}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
};

interface Props {
  fruit?: FruitName;
}
export const FruitPatch: React.FC<Props> = ({ fruit }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={fruitPatch}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            left: `${PIXEL_SCALE * 1}px`,
            top: `${PIXEL_SCALE * 1}px`,
          }}
        />
        {fruit && fruits[fruit]({})}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1 absolute right-4 top-4"
            onClick={() => setShowModal(false)}
          />
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg">Missing Basket</p>
            <img src={basket} className="w-1/4 mt-2" />
            <p className="text-sm text-center mt-2">
              {`You can't pick fruit without a basket.`}
            </p>
            <p className="mt-2">Coming soon!</p>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
