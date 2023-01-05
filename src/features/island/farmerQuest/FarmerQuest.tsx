import React, { useState } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import farmerNpc from "assets/npcs/idle.gif";
import shadow from "assets/npcs/shadow.png";
import island from "assets/land/islands/farmer_island.webp";
import { Modal } from "react-bootstrap";
import { Quest } from "features/game/expansion/components/Quest";
import appleTree from "assets/fruit/apple/apple_tree.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";

export const FarmerQuest: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const ModalDescription = () => {
    return (
      <>
        <p className="mb-3">
          {`Hey there friend! Are you looking to earn yourself some bumpkin items?
          I've got a tip for ya.`}
        </p>
        <p className="mb-3">
          {`See, by harvesting fruit from the trees around here, you can earn
          yourself some pretty neat bumpkin items. Just grab a basket and get to
          work! It's as simple as that.`}
        </p>
        <p className="mb-3">
          And who knows, you might just learn a thing or two about the different
          types of fruit we have in these parts.
        </p>
        <p className="mb-3">Happy harvesting!</p>
        <div className="flex justify-center mb-2">
          <img
            src={appleTree}
            className="mr-2 img-highlight"
            style={{
              height: `${PIXEL_SCALE * 20}px`,
            }}
          />
          <img
            src={orangeTree}
            className="img-highlight mr-2"
            style={{
              height: `${PIXEL_SCALE * 20}px`,
            }}
          />
          <img
            src={blueberryBush}
            className="img-highlight self-end"
            style={{
              height: `${PIXEL_SCALE * 15}px`,
            }}
          />
        </div>
      </>
    );
  };

  const QuestCompletion = () => {
    return (
      <div className="pr-4 pl-2 py-2">
        <p className="mb-3">Wow, you really do love Fruits as much as I do!</p>
        <p>
          {`I have no more gifts for you. Don't forget to wear your new
            items!`}
        </p>
      </div>
    );
  };
  return (
    <>
      <img
        src={island}
        className="absolute"
        style={{
          left: `${GRID_WIDTH_PX * -4}px`,
          top: `${GRID_WIDTH_PX * -4}px`,
          width: `${PIXEL_SCALE * 94}px`,
        }}
      />
      <div
        className="absolute cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
        style={{
          left: `${GRID_WIDTH_PX * -1.5}px`,
          top: `${GRID_WIDTH_PX * -2}px`,
          width: `${PIXEL_SCALE * 15}px`,
        }}
      >
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 0}px`,
            top: `${PIXEL_SCALE * -4}px`,
          }}
        />
        <img
          src={farmerNpc}
          className="absolute left-0 bottom-0"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
          }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Quest
          quests={[
            "Fruit Quest 1",
            "Fruit Quest 2",
            "Fruit Quest 3",
            "Fruit Quest 4",
          ]}
          onClose={() => setShowModal(false)}
          questDescription={ModalDescription()}
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Basic Hair",
            pants: "Blue Suspenders",
            shirt: "Red Farmer Shirt",
            tool: "Farmer Pitchfork",
          }}
          questCompletionScreen={QuestCompletion()}
        />
      </Modal>
    </>
  );
};
