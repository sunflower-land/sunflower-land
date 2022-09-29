import React from "react";
import {
  BumpkinSkill,
  BumpkinSkillName,
  BUMPKIN_SKILL_TREE,
  createSkillPath,
} from "features/game/types/bumpkinSkills";

import { Box } from "components/ui/Box";
import confirm from "assets/icons/confirm.png";

interface SkillPathProps {
  bumpkinSkills: Partial<Record<BumpkinSkillName, number>>;
  skillsInPath: BumpkinSkill[];
  selectedSkill: BumpkinSkillName;
  onClick: (skill: BumpkinSkillName) => void;
}

export const SkillPath = ({
  onClick,
  selectedSkill,
  skillsInPath,
  bumpkinSkills,
}: SkillPathProps) => {
  const skillPath = createSkillPath(skillsInPath);

  return (
    <div className="mx-auto">
      {skillPath.map((level, index) => (
        <div className="flex justify-center" key={index}>
          {level.map((skill) => {
            const hasSkill = !!bumpkinSkills[skill];

            return (
              <Box
                isSelected={selectedSkill === skill}
                key={skill}
                onClick={() => onClick(skill)}
                image={BUMPKIN_SKILL_TREE[skill]?.image}
                showOverlay={hasSkill}
                overlayIcon={
                  <img src={confirm} alt="" className="absolute w-7" />
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
