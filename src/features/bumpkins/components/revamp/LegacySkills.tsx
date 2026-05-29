import React, { useState } from "react";
import {
  type BumpkinSkillRevamp,
  type BumpkinRevampSkillTree,
  getRevampSkills,
} from "features/game/types/bumpkinSkills";

import { LegacySkillCategoryList } from "./LegacySkillCategoryList";
import { LegacySkillPathDetails } from "./LegacySkillPathDetails";

// Legacy entry point for the non-EDIT_SKILLSET cohort. Restored verbatim
// from origin/main; routed from BumpkinModal when the flag is off.
// Delete this file when the EDIT_SKILLSET flag is removed.

interface Props {
  readonly: boolean;
}

export const LegacySkills: React.FC<Props> = ({ readonly }) => {
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

  return (
    <div
      style={{
        minHeight: "200px",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
      {!selectedSkillPath && (
        <LegacySkillCategoryList
          onClick={(category) => onSkillCategoryClickHandler(category)}
        />
      )}
      {selectedSkillPath && (
        <LegacySkillPathDetails
          selectedSkillPath={selectedSkillPath}
          skillsInPath={skillsInPath}
          readonly={readonly}
          onBack={handleBackToSkillList}
        />
      )}
    </div>
  );
};
