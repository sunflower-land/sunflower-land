import React from "react";
import classNames from "classnames";
import { SkillName, SKILL_TREE } from "features/game/types/skills";

import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import arrowLeft from "assets/icons/arrow_left.png";

interface Props {
  back: () => void;
}

export const SkillTree: React.FC<Props> = ({ back }) => {
  return (
    <>
      <div className="flex">
        <img className="h-6 mr-3 cursor-pointer" src={arrowLeft} alt="back" onClick={back} />
        <span className="text-base">Skills</span>
      </div>
      <div className="flex flex-wrap justify-around overflow-y-auto scrollable max-h-96 pt-2 pr-1 mt-2">
        {(Object.keys(SKILL_TREE) as SkillName[]).map((skillName) => {
          const skill = SKILL_TREE[skillName];
          return (
            <OuterPanel className="w-full my-2 p-1 relative" key={skillName}>
              <span
                className={classNames(
                  "text-shadow border text-xxs absolute left-0 -top-4 p-1 rounded-md capitalize",
                  {
                    "bg-green-600": skill.profession === "farming",
                    "bg-stone-500": skill.profession === "gathering",
                  }
                )}
              >
                {`${skill.profession} lvl ${skill.level}`}
              </span>
              <div className="flex justify-between h-12 items-center border-b border-white mb-2">
                <span className="text-sm">{skillName}</span>
                <img
                  src={ITEM_DETAILS[skillName].image}
                  alt="farming"
                  className="w-6 mx-2"
                />
              </div>
              <ul className="list-disc">
                {skill.perks.map((perk) => (
                  <li key={perk} className="text-xs block capitalize">
                    {perk}
                  </li>
                ))}
              </ul>
            </OuterPanel>
          );
        })}
      </div>
    </>
  );
};
