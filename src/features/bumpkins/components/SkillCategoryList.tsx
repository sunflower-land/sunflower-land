import React, { useContext } from "react";
import { ButtonPanel } from "components/ui/Panel";
import {
  BumpkinSkillTree,
  getSkills,
  SKILL_TREE_CATEGORIES,
} from "features/game/types/bumpkinSkills";

import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { setImageWidth } from "lib/images";
import { PIXEL_SCALE } from "features/game/lib/constants";

import animals from "assets/skills/land/skill-tree-icon/animals.png";
import cooking from "assets/skills/land/skill-tree-icon/cooking.png";
import crops from "assets/skills/land/skill-tree-icon/crops.png";
import rocks from "assets/skills/land/skill-tree-icon/rocks.png";
import trees from "assets/skills/land/skill-tree-icon/trees.png";

const iconList = {
  Crops: crops,
  Trees: trees,
  Rocks: rocks,
  Cooking: cooking,
  Animals: animals,
};

export const SkillCategoryList = ({
  onClick,
}: {
  onClick: (category: BumpkinSkillTree) => void;
}) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { bumpkin } = state;
  return (
    <>
      {SKILL_TREE_CATEGORIES.map((category) => {
        const skills = getSkills(category);
        const icon = iconList[skills[0].tree];
        const skillsAcquiredInCategoryCount = getKeys({
          ...bumpkin?.skills,
        }).filter((acquiredSkillName) =>
          skills.find((skill) => skill.name === acquiredSkillName)
        ).length;

        return (
          <div key={category} onClick={() => onClick(category)}>
            <ButtonPanel className="flex relative items-center !py-2 mb-1 cursor-pointer hover:bg-brown-200">
              <Label
                type="default"
                className="px-1 text-xxs absolute -top-3 -right-1"
              >
                {`${skillsAcquiredInCategoryCount}/${skills.length}`}
              </Label>
              <div className="flex justify-center items-center">
                <img
                  src={icon}
                  style={{ opacity: 0, marginRight: `${PIXEL_SCALE * 4}px` }}
                  onLoad={(e) => setImageWidth(e.currentTarget)}
                />
                <span className="text-sm">{category}</span>
              </div>
            </ButtonPanel>
          </div>
        );
      })}
    </>
  );
};
