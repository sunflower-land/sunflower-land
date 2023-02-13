import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/cupid.gif";
import loveLetter from "src/assets/icons/love_letter.png";
import shadow from "assets/npcs/shadow.png";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { Quest } from "features/game/expansion/components/Quest";

export const Cupid: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const ModalDescription = () => {
    return (
      <>
        <p className="mb-4">
          {`I've been designing limited edition wearables that can enhance your love life.`}
        </p>
        <p className="mb-4">
          {`In this cupid quest, participants have the opportunity to mint free wearables.`}
        </p>
        <div className="flex justify-center mb-4">
          <img
            src={loveLetter}
            className="mr-2 img-highlight"
            style={{
              width: `${PIXEL_SCALE * 34}px`,
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
      <MapPlacement x={-7.5} y={2} height={1} width={3}>
        <div className="relative w-full h-full">
          <img
            src={npc}
            onClick={() => setShowModal(true)}
            className="absolute hover:img-highlight cursor-pointer z-10"
            style={{
              width: `${PIXEL_SCALE * 30}px`,
            }}
          />
          <img
            src={shadow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              top: `${PIXEL_SCALE * 19}px`,
              left: `${PIXEL_SCALE * 8}px`,
            }}
          />
        </div>
      </MapPlacement>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Quest
          quests={[
            "Cupid Quest 1",
            "Cupid Quest 2",
            "Cupid Quest 3",
            "Cupid Quest 4",
          ]}
          questTitle="Hello, gorgeous!"
          onClose={() => setShowModal(false)}
          questDescription={ModalDescription()}
          questCompletionScreen={QuestCompletion()}
          bumpkinParts={{
            dress: "Cupid Dress",
            tool: "Farmer Pitchfork",
            wings: "Love Quiver",
            hair: "Cupid Hair",
            body: "Beige Farmer Potion",
          }}
        />
      </Modal>
    </>
  );
};
