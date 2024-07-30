import React, { useContext, useState } from "react";
import {
  BumpkinSkill,
  BumpkinSkillTree,
  getSkills,
} from "features/game/types/bumpkinSkills";

import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SkillCategoryList } from "./SkillCategoryList";

import { SkillPathDetails } from "./SkillPathDetails";
import { Label } from "components/ui/Label";
import { findLevelRequiredForNextSkillPoint } from "features/game/lib/level";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
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
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[{ icon: SUNNYSIDE.badges.seedSpecialist, name: t("skills") }]}
      onClose={onClose}
    >
      {/* @note: There is only one tab, no extra judgment is needed. */}
      <Skills onBack={onBack} onClose={onClose} readonly={readonly} />
    </CloseButtonPanel>
  );
};
