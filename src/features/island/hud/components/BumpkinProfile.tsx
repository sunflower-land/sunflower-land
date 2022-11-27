import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import question from "assets/icons/expression_confused.png";
import progressBarSprite from "assets/ui/profile/progress_bar_sprite.png";
import whiteBg from "assets/ui/profile/bg.png";
import lvlUp from "assets/icons/expression_alerted.png";

import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import {
  DynamicNFT,
  getImageUrl as getBumpkinLayerUrl,
} from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { ITEM_IDS as BUMPKIN_ITEMS } from "features/game/types/bumpkin";
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
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

const DIMENSIONS = {
  original: 80,
  scaled: 160,
  bgMargin: 34,
  bumpkinContainer: {
    width: 130,
    height: 125,
    radiusBottomLeft: 85,
    radiusBottomRight: 45,
  },
  bumpkin: {
    width: 200,
    marginLeft: -10,
  },
  noBumpkin: {
    marginLeft: 48,
    marginTop: 20,
  },
  level: {
    width: 24,
    height: 12,
    marginLeft: 68,
    marginTop: 104,
  },
  skillsMark: {
    width: 12,
    marginLeft: 119,
    marginTop: 35,
  },
};

const MOBILE_DIMENSIONS = {
  original: 80,
  scaled: 120,
  bgMargin: 25,
  bumpkinContainer: {
    width: 96,
    height: 93,
    radiusBottomLeft: 70,
    radiusBottomRight: 35,
  },
  bumpkin: {
    width: 160,
    marginLeft: -14,
  },
  noBumpkin: {
    marginLeft: 36,
    marginTop: 17,
  },
  level: {
    width: 22,
    height: 14,
    marginLeft: 49,
    marginTop: 76,
  },
  skillsMark: {
    width: 10,
    marginLeft: 88,
    marginTop: 22,
  },
};

const SPRITE_STEPS = 50;

export const BumpkinProfile: React.FC = () => {
  const [isMobile] = useIsMobile();
  const progressBarEl = useRef<SpriteSheetInstance>();
  const [viewSkillsPage, setViewSkillsPage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dimensions, setDimensions] = useState(DIMENSIONS);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const showSkillPointAlert = hasUnacknowledgedSkillPoints(state.bumpkin);
  const bgUrl =
    state.bumpkin &&
    getBumpkinLayerUrl(BUMPKIN_ITEMS[state.bumpkin.equipped.background]);

  useEffect(() => {
    goToProgress();
  }, [level, experience]);

  useEffect(() => {
    setDimensions(isMobile ? MOBILE_DIMENSIONS : DIMENSIONS);
  }, [isMobile]);

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
        <div className="col-start-1 row-start-1">
          {state.bumpkin ? (
            <img
              src={bgUrl}
              style={{
                width: `${dimensions.scaled - 2 * dimensions.bgMargin}px`,
                height: `${dimensions.scaled - 2 * dimensions.bgMargin}px`,
                margin: `${dimensions.bgMargin}px`,
                borderRadius: `45%`,
              }}
            />
          ) : (
            <img
              src={whiteBg}
              style={{
                width: `${dimensions.scaled}px`,
                height: `${dimensions.scaled}px`,
              }}
            />
          )}
        </div>
        <div
          className="col-start-1 row-start-1 overflow-hidden z-0"
          style={{
            width: `${dimensions.bumpkinContainer.width}px`,
            height: `${dimensions.bumpkinContainer.height}px`,
            borderBottomLeftRadius: `${dimensions.bumpkinContainer.radiusBottomLeft}px`,
            borderBottomRightRadius: `${dimensions.bumpkinContainer.radiusBottomRight}px`,
          }}
        >
          {state.bumpkin ? (
            <div
              style={{
                width: `${dimensions.bumpkin.width}px`,
                marginLeft: `${dimensions.bumpkin.marginLeft}px`,
              }}
            >
              <DynamicNFT
                bumpkinParts={state.bumpkin.equipped}
                showTool={false}
              />
            </div>
          ) : (
            <img
              id="no-bumpkin"
              src={question}
              alt="No Bumpkin Found"
              className="w-1/2"
              style={{
                marginLeft: `${dimensions.noBumpkin.marginLeft}px`,
                marginTop: `${dimensions.noBumpkin.marginTop}px`,
              }}
            />
          )}
        </div>
        <Spritesheet
          className="col-start-1 row-start-1 z-10"
          style={{
            width: `${dimensions.scaled}px`,
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
            width: `${dimensions.level.width}px`,
            height: `${dimensions.level.height}px`,
            marginLeft: `${dimensions.level.marginLeft}px`,
            marginTop: `${dimensions.level.marginTop}px`,
          }}
        >
          {level}
        </div>
        {showSkillPointAlert && !gameState.matches("visiting") && (
          <img
            src={lvlUp}
            className="col-start-1 row-start-1 animate-float z-30"
            style={{
              width: `${dimensions.skillsMark.width}px`,
              marginLeft: `${dimensions.skillsMark.marginLeft}px`,
              marginTop: `${dimensions.skillsMark.marginTop}px`,
            }}
          />
        )}
      </div>
    </>
  );
};
