import React, { useContext, useState } from "react";
import {
  BumpkinSkillRevamp,
  BumpkinRevampSkillTree,
  getRevampSkills,
} from "features/game/types/bumpkinSkills";

import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

import { SkillCategoryList } from "./SkillCategoryList";
import { SkillPathDetails } from "./SkillPathDetails";
import { Label } from "components/ui/Label";
import { findLevelRequiredForNextSkillPoint } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  readonly: boolean;
}

export const Skills: React.FC<Props> = ({ readonly }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const [selectedSkillPath, setSelectedSkillPath] =
    useState<BumpkinRevampSkillTree | null>(null);
  const [skillsInPath, setSkillsInTree] = useState<BumpkinSkillRevamp[]>([]);

  const onSkillCategoryClickHandler = (category: BumpkinRevampSkillTree) => {
    setSelectedSkillPath(category);

    const skillsInCategory: BumpkinSkillRevamp[] = getRevampSkills(category);

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
  };
  const { t } = useAppTranslation();
  const { bumpkin } = state;
  const experience = bumpkin?.experience || 0;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

  const skillPointsInfo = () => {
    const nextLevelWithSkillPoint =
      findLevelRequiredForNextSkillPoint(experience);

    return (
      <div className="flex flex-wrap gap-1">
        <Label type="default">
          {t("skillPts")} {availableSkillPoints}
        </Label>
        {nextLevelWithSkillPoint && (
          <Label type="default" className="text-xxs px-1 whitespace-nowrap">
            {t("nextSkillPtLvl")} {nextLevelWithSkillPoint}
          </Label>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-fit">
      {!selectedSkillPath && (
        <SkillCategoryList
          onClick={(category) => onSkillCategoryClickHandler(category)}
          skillPointsInfo={skillPointsInfo}
        />
      )}
      {selectedSkillPath && (
        <SkillPathDetails
          selectedSkillPath={selectedSkillPath}
          skillsInPath={skillsInPath}
          readonly={readonly}
          onBack={handleBackToSkillList}
        />
      )}
    </div>
  );
};
