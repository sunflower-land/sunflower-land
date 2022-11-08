import React, { useContext, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import progressBarSprite from "assets/ui/profile/progress_bar_sprite.png";
import profileBg from "assets/ui/profile/bg.png";

import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import { getBumpkinLevel, LEVEL_BRACKETS } from "features/game/lib/level";
import {
  acknowledgeSkillPoints,
  hasUnacknowledgedSkillPoints,
} from "features/island/bumpkin/lib/skillPointStorage";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";

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

      {/* Bumpkin profile */}
      <div
        className="grid cursor-pointer hover:img-highlight relative top-52"
        onClick={handleShowHomeModal}
      >
        <img
          src={profileBg}
          className="col-start-1 row-start-1"
          style={{
            width: `${45 * PIXEL_SCALE}px`,
            height: `${45 * PIXEL_SCALE}px`,
            maxWidth: "none",
            imageRendering: "pixelated",
            marginLeft: "5px",
          }}
        />
        <div
          className="col-start-1 row-start-1"
          style={{
            width: `${45 * PIXEL_SCALE}px`,
            height: `${45 * PIXEL_SCALE * 1.4}px`,
            overflow: "hidden",
            borderRadius: "100px",
            marginTop: "-47px",
            marginLeft: "5px",
          }}
        >
          <div
            className=""
            style={{
              width: `${100 * PIXEL_SCALE}px`,
              marginLeft: "-50%",
            }}
          >
            <DynamicNFT
              bumpkinParts={state.bumpkin?.equipped as BumpkinParts}
              showTool={false}
            />
          </div>
        </div>
        <Spritesheet
          className="col-start-1 row-start-1 z-20"
          style={{
            width: `${52 * PIXEL_SCALE}px`,
            marginTop: "24px",
            imageRendering: "pixelated",
          }}
          image={progressBarSprite}
          widthFrame={52}
          heightFrame={39}
          fps={10}
          steps={50}
          autoplay={true}
          loop={true}
          getInstance={(spritesheet) => {
            progressBarEl.current = spritesheet;
          }}
        />
        <span
          className="col-start-1 row-start-1 text-xs text-white z-30"
          style={{
            marginLeft: "108px",
            marginTop: "74px",
            width: "27px",
            textAlign: "center",
          }}
        >
          {level}
        </span>
      </div>
    </>
  );
};
