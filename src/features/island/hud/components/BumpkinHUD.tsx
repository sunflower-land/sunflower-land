import React, { useContext, useState } from "react";

import discTop from "assets/icons/empty_disc_top.png";
import discBottom from "assets/icons/empty_disc_bottom.png";
import discBackground from "assets/icons/empty_disc_background.png";
import heart from "assets/icons/heart.png";
import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";
import alert from "assets/icons/expression_alerted.png";
import { Modal } from "react-bootstrap";
import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { BumpkinParts } from "features/game/types/bumpkin";
import { getBumpkinLevel, LEVEL_BRACKETS } from "features/game/lib/level";
import {
  acknowledgeSkillPoints,
  hasUnacknowledgedSkillPoints,
} from "features/island/bumpkin/lib/skillPointStorage";
import { Skills } from "features/bumpkins/components/Skills";

export const BumpkinHUD: React.FC = () => {
  const [showBumpkinModal, setShowBumpkinModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const handleShowSkillModal = () => {
    setShowSkillModal(true);
    acknowledgeSkillPoints(state.bumpkin);
  };

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const nextLevelExperience = LEVEL_BRACKETS[level];

  const showSkillPointAlert = hasUnacknowledgedSkillPoints(state.bumpkin);

  const handleHideModal = () => {
    if (showBumpkinModal) setShowBumpkinModal(false);
    if (showSkillModal) setShowSkillModal(false);
  };

  return (
    <>
      <Modal
        show={showBumpkinModal || showSkillModal}
        centered
        onHide={handleHideModal}
      >
        {showBumpkinModal ? (
          <BumpkinModal onClose={handleHideModal} />
        ) : (
          <Skills onClose={handleHideModal} />
        )}
      </Modal>
      <div className="fixed top-2 left-2 z-50 flex">
        <div
          className="w-16 h-16 relative cursor-pointer hover:img-highlight"
          onClick={() => setShowBumpkinModal(true)}
        >
          <img src={discTop} className="absolute inset-0 w-full h-full z-10" />
          <img
            src={discBottom}
            className="absolute inset-0 w-full h-full z-30"
          />
          <img
            src={discBackground}
            className="absolute inset-0 w-full h-full z-0"
          />
          <div
            className="absolute inset-0 z-20 overflow-hidden"
            style={{
              height: "85%",
              width: "88%",
            }}
          >
            <div
              className="z-20"
              style={{
                width: "200%",
                position: "relative",
                left: "-35%",
                top: "-4%",
              }}
            >
              <DynamicNFT
                bumpkinParts={state.bumpkin?.equipped as BumpkinParts}
              />
            </div>
          </div>
        </div>
        {showSkillPointAlert && (
          <div
            id="alert"
            className="absolute top-[155px] left-6 ready cursor-pointer hover:img-highlight"
            onClick={handleShowSkillModal}
          >
            <img src={alert} alt="Skill point available" className="w-4" />
          </div>
        )}
        <div>
          <div className="flex ml-4 mt-1 items-center relative">
            <img
              src={heart}
              className="h-9 object-contain mr-1 absolute"
              style={{
                width: "30px",
                left: "-10px",
              }}
            />
            <img src={progressBarSmall} className="w-28" />
            <div
              className="w-full h-full bg-[#193c3e] absolute -z-20"
              style={{
                borderRadius: "10px",
              }}
            />
            <div
              className="h-full bg-[#63c74d] absolute -z-10"
              style={{
                borderRadius: "10px 0 0 10px",
                width: `${(experience / nextLevelExperience) * 100}%`,
                maxWidth: "100%",
              }}
            />
            <span className="text-xs absolute left-0 text-white">{level}</span>
          </div>
        </div>
      </div>
    </>
  );
};
