import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "components/ui/Modal";
import { useActor } from "@xstate/react";

import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import {
  getBumpkinLevel,
  getExperienceToNextLevel,
  isMaxLevel,
} from "features/game/lib/level";
import {
  acknowledgeSkillPoints,
  hasUnacknowledgedSkillPoints,
} from "features/island/bumpkin/lib/skillPointStorage";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { Bumpkin } from "features/game/types/game";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { SpringValue } from "@react-spring/web";
import { useSound } from "lib/utils/hooks/useSound";
import {
  BumpkinRevampSkillName,
  BumpkinSkillRevamp,
  getPowerSkills,
} from "features/game/types/bumpkinSkills";
import { getSkillCooldown } from "features/game/events/landExpansion/skillUsed";

const DIMENSIONS = {
  original: 80,
  scaled: 160,
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
    marginLeft: 109,
    marginTop: 82.5,
  },
  username: {
    width: 200,
    height: 12,
    marginLeft: -20,
    marginTop: 106,
  },
  skillsMark: {
    width: 10,
    marginLeft: 116,
    marginTop: 45,
  },
};

const SPRITE_STEPS = 51;

interface AvatarProps {
  bumpkin?: Bumpkin;
  showSkillPointAlert?: boolean;
  onClick?: () => void;
  powerSkillsReady: boolean;
}

export const BumpkinAvatar: React.FC<AvatarProps> = ({
  bumpkin,
  showSkillPointAlert,
  onClick,
  powerSkillsReady,
}) => {
  const { showAnimations } = useContext(Context);

  const progressBarEl = useRef<SpriteSheetInstance>(undefined);

  const experience = bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);

  useEffect(() => {
    goToProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, experience]);

  const goToProgress = () => {
    if (progressBarEl.current) {
      const experience = bumpkin?.experience ?? 0;
      const { currentExperienceProgress, experienceToNextLevel } =
        getExperienceToNextLevel(experience);

      let percent = currentExperienceProgress / experienceToNextLevel;
      // Progress bar cant go further than 100%
      if (isMaxLevel(experience)) {
        percent = 1;
      }

      const scaledToProgress = percent * (SPRITE_STEPS - 1);
      progressBarEl.current.goToAndPause(Math.floor(scaledToProgress));
    }
  };

  if (!bumpkin) return null;

  return (
    <>
      {/* Bumpkin profile */}
      <div
        className={classNames(`grid absolute -left-4 z-40 top-0`, {
          "cursor-pointer hover:img-highlight": !!onClick,
        })}
        style={{
          height: "70px",
        }}
        onClick={onClick}
      >
        <img
          src={SUNNYSIDE.ui.whiteBg}
          className="col-start-1 row-start-1 opacity-40"
          style={{
            width: `${DIMENSIONS.scaled}px`,
            height: `${DIMENSIONS.scaled}px`,
          }}
        />
        <div
          className="col-start-1 row-start-1 overflow-hidden z-0"
          style={{
            width: `${DIMENSIONS.bumpkinContainer.width}px`,
            height: `${DIMENSIONS.bumpkinContainer.height}px`,
            borderBottomLeftRadius: `${DIMENSIONS.bumpkinContainer.radiusBottomLeft}px`,
            borderBottomRightRadius: `${DIMENSIONS.bumpkinContainer.radiusBottomRight}px`,
          }}
        >
          {bumpkin && (
            <div
              style={{
                width: `${DIMENSIONS.bumpkin.width}px`,
                marginLeft: `${DIMENSIONS.bumpkin.marginLeft}px`,
              }}
            >
              <DynamicNFT
                key={JSON.stringify(bumpkin.equipped)}
                bumpkinParts={bumpkin.equipped}
                showTools={false}
              />
            </div>
          )}
        </div>
        <Spritesheet
          className="col-start-1 row-start-1 z-10"
          style={{
            width: `${DIMENSIONS.scaled}px`,
            imageRendering: "pixelated",
          }}
          image={SUNNYSIDE.ui.progressBarSprite}
          widthFrame={DIMENSIONS.original}
          heightFrame={DIMENSIONS.original}
          zoomScale={new SpringValue(0.7)}
          fps={10}
          steps={SPRITE_STEPS}
          autoplay={false}
          getInstance={(spritesheet) => {
            progressBarEl.current = spritesheet;
            goToProgress();
          }}
        />
        <div
          id="progress-bar"
          className={`col-start-1 row-start-1 flex justify-center   z-20 text-xs`}
          style={{
            width: `${DIMENSIONS.level.width}px`,
            height: `${DIMENSIONS.level.height}px`,
            marginLeft: `${DIMENSIONS.level.marginLeft}px`,
            marginTop: `${DIMENSIONS.level.marginTop}px`,
          }}
        >
          {level}
        </div>

        {(showSkillPointAlert || powerSkillsReady) && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={
              "col-start-1 row-start-1 z-30" +
              (showAnimations ? " animate-float" : "")
            }
            style={{
              width: `${DIMENSIONS.skillsMark.width}px`,
              marginLeft: `${DIMENSIONS.skillsMark.marginLeft}px`,
              marginTop: `${DIMENSIONS.skillsMark.marginTop}px`,
            }}
          />
        )}
      </div>
    </>
  );
};

export const BumpkinProfile: React.FC = () => {
  const progressBarEl = useRef<SpriteSheetInstance>(undefined);
  const [viewSkillsTab, setViewSkillsTab] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const profile = useSound("profile");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, experience]);

  const handleShowHomeModal = () => {
    profile.play();
    setViewSkillsTab(showSkillPointAlert);
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
      // Progress bar cant go further than 100%
      if (percent > 1) {
        percent = 1;
      }

      const scaledToProgress = percent * (SPRITE_STEPS - 1);
      progressBarEl.current.goToAndPause(Math.floor(scaledToProgress));
    }
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const powerSkills = getPowerSkills();
  const { skills, previousPowerUseAt } = state.bumpkin;

  const powerSkillsUnlocked = powerSkills.filter(
    (skill) => !!skills[skill.name as BumpkinRevampSkillName],
  );

  const hasPowerSkills = powerSkillsUnlocked.length > 0;

  const powerSkillsReady = powerSkillsUnlocked
    .filter((skill: BumpkinSkillRevamp) => {
      const fertiliserSkill: BumpkinRevampSkillName[] = [
        "Sprout Surge",
        "Root Rocket",
        "Blend-tastic",
      ];
      return !fertiliserSkill.includes(skill.name as BumpkinRevampSkillName);
    })
    .some((skill: BumpkinSkillRevamp) => {
      const boostedCooldown = getSkillCooldown({
        cooldown: skill.requirements.cooldown ?? 0,
        state,
      });
      const nextSkillUse =
        (previousPowerUseAt?.[skill.name as BumpkinRevampSkillName] ?? 0) +
        boostedCooldown;
      return nextSkillUse < Date.now();
    });

  return (
    <>
      {/* Bumpkin modal */}
      <Modal show={showModal} onHide={handleHideModal} size="lg">
        <BumpkinModal
          initialTab={viewSkillsTab ? 2 : 0}
          onClose={handleHideModal}
          readonly={gameState.matches("visiting")}
          bumpkin={gameState.context.state.bumpkin as Bumpkin}
          inventory={gameState.context.state.inventory}
          gameState={gameState.context.state}
          powerSkillsReady={powerSkillsReady}
          hasPowerSkills={hasPowerSkills}
        />
      </Modal>

      {/* Bumpkin profile */}
      {/* Mobile */}
      <div className="scale-[0.7] absolute left-0 top-0">
        <BumpkinAvatar
          bumpkin={state.bumpkin}
          onClick={handleShowHomeModal}
          showSkillPointAlert={
            showSkillPointAlert && !gameState.matches("visiting")
          }
          powerSkillsReady={powerSkillsReady}
        />
      </div>
    </>
  );
};
