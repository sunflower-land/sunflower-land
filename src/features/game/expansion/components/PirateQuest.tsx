import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Quest } from "./Quest";
import { Equipped } from "features/game/types/bumpkin";
import { NPC } from "features/island/bumpkin/components/NPC";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { MapPlacement } from "./MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";

const ModalDescription = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="flex justify-center mb-3"></div>
      <p className="mb-2 text-sm">{t("piratequest.welcome")}</p>
      <a
        className="mb-4 underline text-sm"
        href="https://docs.sunflower-land.com/player-guides/islands/treasure-island"
        target="_blank"
        rel="noreferrer"
      >
        {t("read.more")}
      </a>
    </>
  );
};

const QuestCompletion = () => {
  const { t } = useAppTranslation();
  return (
    <div className="p-2">
      <p className="mb-2">{t("piratequest.finestPirate")}</p>
      <p>{`${t("modalDescription.gift")}`}</p>
    </div>
  );
};

export const PirateQuest: React.FC = () => {
  const { showAnimations } = useContext(Context);
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
            className={
              "w-2 absolute" + (showAnimations ? " animate-float" : "")
            }
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
