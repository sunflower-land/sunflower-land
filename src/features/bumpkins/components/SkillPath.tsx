import React, { useContext } from "react";
import { getKeys } from "features/game/types/craftables";
import {
  BumpkinSkill,
  BumpkinSkillName,
  BUMPKIN_SKILL_TREE,
  createSkillPath,
} from "features/game/types/bumpkinSkills";

import { Box } from "components/ui/Box";
import { getAvailableBumpkinOldSkillPoints } from "features/game/events/landExpansion/pickSkill";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

interface SkillPathProps {
  skillsInPath: BumpkinSkill[];
  selectedSkill: BumpkinSkillName;
  onClick: (skill: BumpkinSkillName) => void;
}

export const SkillPath = ({
  onClick,
  selectedSkill,
  skillsInPath,
}: SkillPathProps) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { bumpkin } = state;

  if (!bumpkin) return null;

  const skillPath = createSkillPath(skillsInPath);

  return (
    <div className="mx-auto">
      {skillPath.map((level, index) => (
        <div className="flex justify-center" key={index}>
          {level.map((skill) => {
            const availableSkillPoints = getAvailableBumpkinOldSkillPoints(
              state.bumpkin,
            );
            const hasSkill = !!bumpkin.skills[skill];

            const { points: pointsRequired, skill: skillRequired } =
              BUMPKIN_SKILL_TREE[skill].requirements;

            const missingSkillRequirement = skillRequired
              ? !getKeys({ ...bumpkin.skills }).includes(skillRequired)
              : false;
            const missingPointRequirement =
              availableSkillPoints < pointsRequired;

            return (
              <Box
                key={skill}
                isSelected={selectedSkill === skill}
                count={new Decimal(hasSkill ? 0 : pointsRequired)}
                onClick={() => onClick(skill)}
                image={BUMPKIN_SKILL_TREE[skill]?.image}
                showOverlay={hasSkill}
                overlayIcon={
                  <img
                    src={SUNNYSIDE.icons.confirm}
                    alt="active skill"
                    className="relative object-contain"
                    style={{
                      width: `${PIXEL_SCALE * 12}px`,
                    }}
                  />
                }
                className={classNames({
                  "opacity-75":
                    (!hasSkill && missingPointRequirement) ||
                    missingSkillRequirement,
                })}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
