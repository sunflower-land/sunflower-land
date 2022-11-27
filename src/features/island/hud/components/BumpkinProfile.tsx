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
  getBumpkinLevel,
  getExperienceToNextLevel,
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
  original: 80,
  scaled: 60,
  bumpkin: {
    containerSize: 47,
    size: 75,
    marginLeft: -5,
    radius: {
      bottomLeft: "100%",
      bottomRight: "30%",
    },
  },
  level: {
    width: 10,
    height: 5,
    marginTop: 40,
    marginLeft: 25,
  },
  skillsMark: {
    width: 4,
    height: 9,
    marginTop: 14,
    marginLeft: 46,
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
        onClick={handleShowHomeModal}
      >
        <img
          src={profileBg}
          className="col-start-1 row-start-1"
          style={{
            width: `${PIXEL_SCALE * dimensions.scaled}px`,
            height: `${PIXEL_SCALE * dimensions.scaled}px`,
          }}
        />
        <div
          className="col-start-1 row-start-1 overflow-hidden z-0"
          style={{
            width: `${PIXEL_SCALE * dimensions.bumpkin.containerSize}px`,
            height: `${PIXEL_SCALE * dimensions.bumpkin.containerSize}px`,
            borderBottomLeftRadius: dimensions.bumpkin.radius.bottomLeft,
            borderBottomRightRadius: dimensions.bumpkin.radius.bottomRight,
          }}
        >
          {state.bumpkin ? (
            <div
              style={{
                width: `${PIXEL_SCALE * dimensions.bumpkin.size}px`,
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
            width: `${PIXEL_SCALE * dimensions.scaled}px`,
            imageRendering: "pixelated",
          }}
          image={progressBarSprite}
          widthFrame={DIMENSIONS.original}
          heightFrame={DIMENSIONS.original}
          fps={10}
          steps={SPRITE_STEPS}
          autoplay={false}
          getInstance={(spritesheet) => {
            progressBarEl.current = spritesheet;
            goToProgress();
          }}
        />
        <div
          className={`col-start-1 row-start-1 flex justify-center text-white text-xxs z-20`}
          style={{
            marginLeft: `${PIXEL_SCALE * dimensions.level.marginLeft}px`,
            marginTop: `${PIXEL_SCALE * dimensions.level.marginTop}px`,
            width: `${PIXEL_SCALE * dimensions.level.width}px`,
            height: `${PIXEL_SCALE * dimensions.level.height}px`,
            lineHeight: "0.5rem",
          }}
        >
          {level}
        </div>
        {showSkillPointAlert && !gameState.matches("visiting") && (
          <img
            src={lvlUp}
            className="col-start-1 row-start-1 animate-float z-30"
            style={{
              width: `${PIXEL_SCALE * dimensions.skillsMark.width}px`,
              height: `${PIXEL_SCALE * dimensions.skillsMark.height}px`,
              marginLeft: `${PIXEL_SCALE * dimensions.skillsMark.marginLeft}px`,
              marginTop: `${PIXEL_SCALE * dimensions.skillsMark.marginTop}px`,
            }}
          />
        )}
      </div>
    </>
  );
};
