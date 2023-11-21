import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Quest } from "./Quest";
import { Equipped } from "features/game/types/bumpkin";
import { NPC } from "features/island/bumpkin/components/NPC";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { MapPlacement } from "./MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const ModalDescription = () => {
  const { t } = useAppTranslation();
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
        href="https://docs.sunflower-land.com/player-guides/islands/treasure-island"
        target="_blank"
        rel="noreferrer"
      >
        {t("readMore")}
      </a>
    </>
  );
};

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

  const openQuest = () => {
    setShowModal(true);
    acknowledgeTutorial("Pirate Quest");
  };
  const bumpkin: Equipped = {
    body: "Pirate Potion",
    hair: "Teal Mohawk",
    pants: "Pirate Pants",
    shirt: "Striped Blue Shirt",
    tool: "Sword",
    shoes: "Peg Leg",
    background: "Farm Background",
    hat: "Pirate Hat",
  };

  return (
    <>
      <MapPlacement x={9} y={8} height={1} width={1}>
        {!hasShownTutorial("Pirate Quest") && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="w-2 absolute animate-float"
            style={{
              top: `${PIXEL_SCALE * -8}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}
        <div className="-scale-x-100">
          <NPC onClick={openQuest} parts={bumpkin} />
        </div>
      </MapPlacement>

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
