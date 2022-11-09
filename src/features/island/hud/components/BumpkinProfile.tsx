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

const PROFILE = {
  width: 52,
  height: 48,
  steps: 50,
};

export const BumpkinProfile: React.FC = () => {
  const progressBarEl = useRef<SpriteSheetInstance>();
  const [viewSkillsPage, setViewSkillsPage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

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

      const percent =
        (experience - previousLevelExperience) / nextLevelExperience;
      const scaledToProgress = percent * (PROFILE.steps - 1);
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
        className="grid cursor-pointer hover:img-highlight fixed top-12 left-2.5 z-50"
        onClick={handleShowHomeModal}
      >
        <img
          src={profileBg}
          className="col-start-1 row-start-1"
          style={{
            width: `${PROFILE.width * PIXEL_SCALE}px`,
            height: `${PROFILE.height * PIXEL_SCALE}px`,
          }}
        />
        <div
          className="col-start-1 row-start-1 overflow-hidden rounded-b-full z-0"
          style={{
            width: `${PROFILE.height * PIXEL_SCALE}px`,
            height: `${PROFILE.height * PIXEL_SCALE * 1.3}px`,
            marginTop: "-45px",
          }}
        >
          {state.bumpkin ? (
            <div
              style={{
                width: `${100 * PIXEL_SCALE}px`,
                marginLeft: "-50%",
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
              className="w-1/2 mx-auto mt-[54px]"
            />
          )}
        </div>
        <Spritesheet
          className="col-start-1 row-start-1 z-10"
          style={{
            width: `${PROFILE.width * PIXEL_SCALE}px`,
            imageRendering: "pixelated",
          }}
          image={progressBarSprite}
          widthFrame={PROFILE.width}
          heightFrame={PROFILE.height}
          fps={10}
          steps={PROFILE.steps}
          autoplay={false}
          getInstance={(spritesheet) => {
            progressBarEl.current = spritesheet;
            goToProgress();
          }}
        />
        <span
          className="col-start-1 row-start-1 text-xs text-white text-center z-20"
          style={{
            marginLeft: "108px",
            marginTop: "74px",
            width: "27px",
          }}
        >
          {level}
        </span>
        {showSkillPointAlert && (
          <img
            src={lvlUp}
            className="col-start-1 row-start-1 animate-float z-30"
            style={{
              width: `${4 * PIXEL_SCALE}px`,
              height: `${9 * PIXEL_SCALE}px`,
              marginLeft: "116px",
              marginTop: "48px",
            }}
          />
        )}
      </div>
    </>
  );
};
