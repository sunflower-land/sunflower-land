import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import type {
  BumpkinSkillRevamp,
  BumpkinRevampSkillTree,
} from "features/game/types/bumpkinSkills";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getAvailableRevampSkills } from "features/game/lib/skillAccess";

import { SkillCategoryList } from "./SkillCategoryList";
import { SkillPathDetails } from "./SkillPathDetails";

interface Props {
  readonly: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const Skills: React.FC<Props> = ({ readonly }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const [selectedSkillPath, setSelectedSkillPath] =
    useState<BumpkinRevampSkillTree | null>(null);
  const [skillsInPath, setSkillsInTree] = useState<BumpkinSkillRevamp[]>([]);

  const onSkillCategoryClickHandler = (category: BumpkinRevampSkillTree) => {
    setSelectedSkillPath(category);

    const skillsInCategory: BumpkinSkillRevamp[] = getAvailableRevampSkills(
      category,
      state,
    );

    setSkillsInTree(skillsInCategory);
  };

  const handleBackToSkillList = () => {
    setSelectedSkillPath(null);
  };

  return (
    <div
      style={{
        minHeight: "200px",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
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
          onBack={handleBackToSkillList}
        />
      )}
    </div>
  );
};
