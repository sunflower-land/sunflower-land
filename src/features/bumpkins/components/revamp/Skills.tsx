import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import type { BumpkinRevampSkillTree } from "features/game/types/bumpkinSkills";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getAvailableRevampSkills } from "features/game/lib/skillAccess";
import { useNow } from "lib/utils/hooks/useNow";
import { TIME_BASED_FEATURE_FLAG_WINDOWS } from "lib/flags";

import { SkillCategoryList } from "./SkillCategoryList";
import { SkillPathDetails } from "./SkillPathDetails";

interface Props {
  readonly: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const Skills: React.FC<Props> = ({ readonly }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  // Pig and Cave skills open to everyone at the Chapter 16 launch.
  const now = useNow({
    live: true,
    autoEndAt: TIME_BASED_FEATURE_FLAG_WINDOWS.CAVE.start.getTime(),
    intervalMs: 60 * 1000,
  });
  const [selectedSkillPath, setSelectedSkillPath] =
    useState<BumpkinRevampSkillTree | null>(null);
  // Derived each render so a path left open across the launch picks up the
  // newly available skills.
  const skillsInPath = selectedSkillPath
    ? getAvailableRevampSkills(selectedSkillPath, state, now)
    : [];

  const onSkillCategoryClickHandler = (category: BumpkinRevampSkillTree) => {
    setSelectedSkillPath(category);
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
          now={now}
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
