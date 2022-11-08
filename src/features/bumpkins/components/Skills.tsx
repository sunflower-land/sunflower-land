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

interface Props {
  onBack: () => void;
  onClose: () => void;
}

export const Skills: React.FC<Props> = ({ onBack, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

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

  const { bumpkin } = state;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive>
            <img src={seedSpecialist} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Skills</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      <div
        style={{
          minHeight: "200px",
        }}
      >
        <div className="flex flex-row mb-2">
          <img
            src={arrowLeft}
            className="self-start w-5 cursor-pointer mx-2"
            alt="back"
            onClick={onBack}
          />
          {availableSkillPoints > 0 ? (
            <SkillPointsLabel points={availableSkillPoints} />
          ) : (
            <Label>
              <p className="text-[10px] ml-2 pr-2">{`Unlock skill point: level ${2}`}</p>
            </Label>
          )}
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
            onBack={handleBackToSkillList}
          />
        )}
      </div>
    </Panel>
  );
};
