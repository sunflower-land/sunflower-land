import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import shadow from "assets/npcs/shadow.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Quest } from "./Quest";
import { Equipped } from "features/game/types/bumpkin";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";

const ModalDescription = () => {
  return (
    <>
      <div className="flex justify-center mb-3"></div>
      <p className="mb-2 text-sm">
        Welcome to the high seas of adventure, where ye be tested as a true
        pirate. Set sail on a journey to find the richest pillage and become the
        greatest pirate to ever grace the ocean waves.
      </p>
      <a
        className="mb-4 underline text-sm"
        href="https://docs.sunflower-land.com/player-guides/special-events/pirate-quest"
        target="_blank"
        rel="noreferrer"
      >
        Read more
      </a>
    </>
  );
};

// const acknowledge = () => {
//   acknowledgeTutorial("Treasure Detector");
//   setShowTutorial(false);
// };

const QuestCompletion = () => {
  return (
    <div className="p-2">
      <p className="mb-2">
        Ahoy, ye be the finest pirate on the seven seas with yer loot!!
      </p>
      <p>
        {`I have no more gifts for you. Don't forget to wear your new
          items!`}
      </p>
    </div>
  );
};

export const PirateQuest: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const bumpkin: Partial<Equipped> = {
    body: "Pirate Potion",
    hair: "Basic Hair",
    pants: "Pirate Pants",
    shirt: "Striped Blue Shirt",
    tool: "Pirate Scimitar",
    shoes: "Peg Leg",
    background: "Farm Background",
    hat: "Pirate Hat",
    coat: "Pirate General Coat",
  };

  return (
    <>
      <div
        className="absolute z-20"
        style={{
          top: `${GRID_WIDTH_PX * 18}px`,
          left: `${GRID_WIDTH_PX * 30}px`,
        }}
      >
        <img
          src={shadow}
          className="absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * -2}px`,
            left: `${PIXEL_SCALE * 2.6}px`,
          }}
        />
        <NPC
          onClick={() => setShowModal(true)}
          pants="Pirate Pants"
          body="Pirate Potion"
          hair="Sun Spots"
          shirt="Striped Blue Shirt"
          hat="Pirate Hat"
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Quest
          quests={[
            "Pirate Quest 1",
            "Pirate Quest 2",
            "Pirate Quest 3",
            "Pirate Quest 4",
          ]}
          onClose={() => setShowModal(false)}
          questTitle="Arrr matey!"
          questDescription={ModalDescription()}
          bumpkinParts={bumpkin}
          questCompletionScreen={QuestCompletion()}
        />
      </Modal>
    </>
  );
};
