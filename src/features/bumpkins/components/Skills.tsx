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
import { SkillCategoryList } from "./SkillCategoryList";

import seedSpecialist from "assets/skills/seed_specialist.png";
import { SkillPathDetails } from "./SkillPathDetails";
import { Label } from "components/ui/Label";
import { findLevelRequiredForNextSkillPoint } from "features/game/lib/level";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onBack: () => void;
  onClose: () => void;
  readonly: boolean;
}

export const Skills: React.FC<Props> = ({ onBack, readonly }) => {
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
  const { t } = useAppTranslation();
  const { bumpkin } = state;
  const experience = bumpkin?.experience || 0;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const skillPointsInfo = () => {
    const nextLevelWithSkillPoint =
      findLevelRequiredForNextSkillPoint(experience);

    return (
      <div className="flex flex-wrap gap-1">
        {availableSkillPoints > 0 && (
          <Label type="default">
            {t("skillPts")} {availableSkillPoints}
          </Label>
        )}
        {nextLevelWithSkillPoint && (
          <Label type="default" className="text-xxs px-1 whitespace-nowrap">
            {t("nextSkillPtLvl")} {nextLevelWithSkillPoint}
          </Label>
        )}
      </div>
    );
  };

  return (
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
          src={SUNNYSIDE.icons.arrow_left}
          className="cursor-pointer"
          alt="back"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            marginRight: `${PIXEL_SCALE * 4}px`,
          }}
          onClick={handleBack}
        />
        {!readonly && skillPointsInfo()}
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
          readonly={readonly}
        />
      )}
    </div>
  );
};

export const SkillsModal: React.FC<Props> = ({ onBack, onClose, readonly }) => {
  const { t } = useAppTranslation();
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
          <span className="text-sm">{t("skills")}</span>
        </Tab>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      <Skills onBack={onBack} onClose={onClose} readonly={readonly} />
    </Panel>
  );
};
