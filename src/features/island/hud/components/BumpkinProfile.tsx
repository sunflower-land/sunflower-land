import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import question from "assets/icons/expression_confused.png";
import progressBarSprite from "assets/ui/profile/progress_bar_sprite.png";
import profileBg from "assets/ui/profile/bg.png";
import lvlUp from "assets/ui/profile/lvl_up.png";

import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import {
  BumpkinLevel,
  getBumpkinLevel,
  getExperienceToNextLevel,
  LEVEL_BRACKETS,
} from "features/game/lib/level";
import {
  acknowledgeSkillPoints,
  hasUnacknowledgedSkillPoints,
} from "features/island/bumpkin/lib/skillPointStorage";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";

const DIMENSIONS = {
  width: 52,
  height: 48,
  top: 1,
  left: 1,
  cutout: {
    width: 56,
    height: 57,
  },
  frame: {
    marginTop: 14,
    marginLeft: 4,
  },
  bumpkin: {
    width: 100,
    marginTop: -36,
    marginLeft: -20,
  },
  level: {
    marginTop: 39,
    marginLeft: 44,
    width: 12,
    height: 11,
  },
  skillsMark: {
    marginTop: 30,
    marginLeft: 48,
  },
};

const SPRITE_STEPS = 50;

export const BumpkinProfile: React.FC = () => {
  const progressBarEl = useRef<SpriteSheetInstance>();
  const [viewSkillsPage, setViewSkillsPage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dimensions = DIMENSIONS;

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const showSkillPointAlert = hasUnacknowledgedSkillPoints(state.bumpkin);

  useEffect(() => {
    goToProgress();
  }, [level, experience]);

  const handleShowHomeModal = () => {
    setViewSkillsPage(showSkillPointAlert);
    setShowModal(true);
    if (showSkillPointAlert) {
      acknowledgeSkillPoints(state.bumpkin);
    }
  };

  const goToProgress = () => {
    if (progressBarEl.current) {
      const nextLevelExperience = LEVEL_BRACKETS[level];
      const previousLevelExperience =
        LEVEL_BRACKETS[(level - 1) as BumpkinLevel] || 0;

      const experience = state.bumpkin?.experience ?? 0;
      const { currentExperienceProgress, experienceToNextLevel } =
        getExperienceToNextLevel(experience);

      let percent = currentExperienceProgress / experienceToNextLevel;
      // Progress bar cant go futher than 100%
      if (percent > 1) {
        percent = 1;
      }

      const scaledToProgress = percent * (SPRITE_STEPS - 1);
      progressBarEl.current.goToAndPause(Math.round(scaledToProgress));
    }
  };

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

      {/* Bumpkin profile */}
      <div
        className={`grid cursor-pointer hover:img-highlight fixed z-50`}
        style={{
          top: `${PIXEL_SCALE * dimensions.top}px`,
          left: `${PIXEL_SCALE * dimensions.left}px`,
        }}
        onClick={handleShowHomeModal}
      >
        <img
          src={profileBg}
          className="col-start-1 row-start-1 opacity-40"
          style={{
            width: `${PIXEL_SCALE * dimensions.width}px`,
            marginTop: `${PIXEL_SCALE * dimensions.frame.marginTop}px`,
            marginLeft: `${PIXEL_SCALE * dimensions.frame.marginLeft}px`,
          }}
        />
        <div
          className="col-start-1 row-start-1 overflow-hidden rounded-b-full z-0"
          style={{
            width: `${PIXEL_SCALE * dimensions.cutout.width}px`,
            height: `${PIXEL_SCALE * dimensions.cutout.height}px`,
          }}
        >
          {state.bumpkin ? (
            <div
              style={{
                width: `${PIXEL_SCALE * dimensions.bumpkin.width}px`,
                marginLeft: `${PIXEL_SCALE * dimensions.bumpkin.marginLeft}px`,
              }}
            >
              <DynamicNFT
                bumpkinParts={state.bumpkin.equipped as BumpkinParts}
                showTool={false}
              />
            </div>
          ) : (
            <img
              id="no-bumpkin"
              src={question}
              alt="No Bumpkin Found"
              className="w-1/2 mx-auto"
              style={{ marginTop: "40px" }}
            />
          )}
        </div>
        <Spritesheet
          className="col-start-1 row-start-1 z-10"
          style={{
            width: `${PIXEL_SCALE * dimensions.width}px`,
            marginTop: `${PIXEL_SCALE * dimensions.frame.marginTop}px`,
            marginLeft: `${PIXEL_SCALE * dimensions.frame.marginLeft}px`,
            imageRendering: "pixelated",
          }}
          image={progressBarSprite}
          widthFrame={DIMENSIONS.width}
          heightFrame={DIMENSIONS.height}
          fps={10}
          steps={SPRITE_STEPS}
          autoplay={false}
          getInstance={(spritesheet) => {
            progressBarEl.current = spritesheet;
            goToProgress();
          }}
        />
        <div
          className={`col-start-1 row-start-1 flex justify-center items-center text-white z-20 text-xxs`}
          style={{
            marginLeft: `${PIXEL_SCALE * dimensions.level.marginLeft}px`,
            marginTop: `${PIXEL_SCALE * dimensions.level.marginTop}px`,
            width: `${PIXEL_SCALE * dimensions.level.width}px`,
            height: `${PIXEL_SCALE * dimensions.level.height}px`,
          }}
        >
          {level}
        </div>
        {showSkillPointAlert && !gameState.matches("visiting") && (
          <img
            src={lvlUp}
            className="col-start-1 row-start-1 animate-float z-30"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              height: `${PIXEL_SCALE * 9}px`,
              marginLeft: `${PIXEL_SCALE * dimensions.skillsMark.marginLeft}px`,
              marginTop: `${PIXEL_SCALE * dimensions.skillsMark.marginTop}px`,
            }}
          />
        )}
      </div>
    </>
  );
};
