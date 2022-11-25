import React, { useContext, useState } from "react";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import {
  BumpkinSkill,
  BumpkinSkillTree,
  getSkills,
} from "features/game/types/bumpkinSkills";

import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SkillPointsLabel } from "./SkillPointsLabel";
import { SkillCategoryList } from "./SkillCategoryList";

import close from "assets/icons/close.png";
import seedSpecialist from "assets/skills/seed_specialist.png";
import { SkillPathDetails } from "./SkillPathDetails";
import arrowLeft from "assets/icons/arrow_left.png";
import { Label } from "components/ui/Label";
import { findLevelRequiredForNextSkillPoint } from "features/game/lib/level";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onBack: () => void;
  onClose: () => void;
}

export const Skills: React.FC<Props> = ({ onBack, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const [selectedSkillPath, setSelectedSkillPath] =
    useState<BumpkinSkillTree | null>(null);
  const [skillsInPath, setSkillsInTree] = useState<BumpkinSkill[]>([]);

  const onSkillCategoryClickHandler = (category: BumpkinSkillTree) => {
    setSelectedSkillPath(category);

    const skillsInCategory: BumpkinSkill[] = getSkills(category);

    setSkillsInTree(skillsInCategory);
  };

  const handleBackToSkillList = () => {
    setSelectedSkillPath(null);
  };

  const handleBack = () => {
    if (selectedSkillPath) {
      handleBackToSkillList();
      return;
    }

    onBack();
  };

  const { bumpkin } = state;
  const experience = bumpkin?.experience || 0;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

  const skillPointsInfo = () => {
    const levelRequired = findLevelRequiredForNextSkillPoint(experience);

    return (
      <>
        {availableSkillPoints > 0 && (
          <SkillPointsLabel points={availableSkillPoints} />
        )}
        {!availableSkillPoints && levelRequired && (
          <Label type="default">
            <p className="text-xxs px-1">{`Unlock skill point: level ${findLevelRequiredForNextSkillPoint(
              experience
            )}`}</p>
          </Label>
        )}
      </>
    );
  };

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive>
          <img src={seedSpecialist} className="h-5 mr-2" />
          <span className="text-sm">Skills</span>
        </Tab>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      <div
        style={{
          minHeight: "200px",
        }}
      >
        <div
          className="flex flex-row my-2 items-center"
          style={{
            margin: `${PIXEL_SCALE * 2}px`,
          }}
        >
          <img
            src={arrowLeft}
            className="cursor-pointer"
            alt="back"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              marginRight: `${PIXEL_SCALE * 4}px`,
            }}
            onClick={handleBack}
          />
          {!gameState.matches("visiting") && skillPointsInfo()}
        </div>
        {!selectedSkillPath && (
          <SkillCategoryList
            onClick={(category) => onSkillCategoryClickHandler(category)}
          />
        )}
        {selectedSkillPath && (
          <SkillPathDetails
            selectedSkillPath={selectedSkillPath}
            skillsInPath={skillsInPath}
          />
        )}
      </div>
    </Panel>
  );
};
