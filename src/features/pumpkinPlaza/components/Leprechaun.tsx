import { Quest } from "features/game/expansion/components/Quest";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const ModalDescription = () => {
  return (
    <>
      <div className="flex justify-center mb-3"></div>
      <p className="mb-2 text-sm">
        {`Tis my stomach that's been growling, and me pot of gold ain't gonna fill
        it up, that's for sure.`}
      </p>
    </>
  );
};

const QuestCompletion = () => {
  return (
    <div className="p-2">
      <p className="mb-2">
        {`You'll now don a lucky green hat and venture through the rolling hills
        and lush valleys of Ireland, collecting pots o' gold and dodging
        mischievous fairies along the way`}
      </p>
    </div>
  );
};

interface Props {
  x: number;
  y: number;
}

export const Leprechaun: React.FC<Props> = ({ x, y }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Quest
          quests={["Leprechaun Quest 1"]}
          onClose={() => setShowModal(false)}
          questTitle="Top o' the mornin'"
          questDescription={ModalDescription()}
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hat: "St Patricks Hat",
            shirt: "SFL T-Shirt",
            pants: "Brown Suspenders",
            hair: "Fire Hair",
          }}
          questCompletionScreen={QuestCompletion()}
        />
      </Modal>

      <div
        className="absolute"
        style={{
          left: `${GRID_WIDTH_PX * x}px`,
          top: `${GRID_WIDTH_PX * y}px`,
        }}
      >
        <NPC
          body="Beige Farmer Potion"
          hat="St Patricks Hat"
          shirt="SFL T-Shirt"
          pants="Brown Suspenders"
          hair="Fire Hair"
          onClick={() => setShowModal(true)}
        />
      </div>
    </>
  );
};
