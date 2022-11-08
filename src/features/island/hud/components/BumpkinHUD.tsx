import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import discTop from "assets/icons/empty_disc_top.png";
import discBottom from "assets/icons/empty_disc_bottom.png";
import discBackground from "assets/icons/empty_disc_background.png";
import heart from "assets/icons/heart.png";
import question from "assets/icons/expression_confused.png";
import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";
import alert from "assets/icons/expression_alerted.png";

import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import {
  BumpkinLevel,
  getBumpkinLevel,
  LEVEL_BRACKETS,
} from "features/game/lib/level";
import {
  acknowledgeSkillPoints,
  hasUnacknowledgedSkillPoints,
} from "features/island/bumpkin/lib/skillPointStorage";
import { BumpkinProfile } from "./BumpkinProfile";

export const BumpkinHUD: React.FC = () => {
  const [viewSkillsPage, setViewSkillsPage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const handleShowHomeModal = () => {
    setViewSkillsPage(false);
    setShowModal(true);
  };

  const handleShowSkillModal = () => {
    setViewSkillsPage(true);
    setShowModal(true);
    acknowledgeSkillPoints(state.bumpkin);
  };

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const nextLevelExperience = LEVEL_BRACKETS[level];
  const previousLevelExperience =
    LEVEL_BRACKETS[(level - 1) as BumpkinLevel] || 0;

  const currentExperienceProgress = experience - previousLevelExperience;
  const experienceToNextLevel = nextLevelExperience - previousLevelExperience;

  const showSkillPointAlert = hasUnacknowledgedSkillPoints(state.bumpkin);

  const handleHideModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Bumpkin modal */}
      <Modal show={showModal} centered onHide={handleHideModal}>
        <BumpkinModal
          initialView={viewSkillsPage ? "skills" : "home"}
          onClose={handleHideModal}
        />
      </Modal>

      <div className="fixed top-2 left-2 z-50 flex">
        <BumpkinProfile />
        {/* Bumpkin icon */}
        <div
          className="w-16 h-16 relative cursor-pointer hover:img-highlight"
          onClick={handleShowHomeModal}
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
            {state.bumpkin ? (
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
            ) : (
              <div
                style={{
                  width: "21px",
                  position: "absolute",
                  left: "22px",
                  top: "14px",
                }}
              >
                <img
                  id="no-bumpkin"
                  src={question}
                  alt="No Bumpkin Found"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Skill point alert */}
        {showSkillPointAlert && !gameState.matches("visiting") && (
          <div
            id="alert"
            className="absolute top-[150px] px-4 py-3 ready cursor-pointer hover:img-highlight"
            onClick={handleShowSkillModal}
          >
            <img src={alert} alt="Skill point available" className="w-4" />
          </div>
        )}

        {/* Level bar */}
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
                width: `${
                  (currentExperienceProgress / experienceToNextLevel) * 100
                }%`,
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
