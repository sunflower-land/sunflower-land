import React, { useContext } from "react";
import classNames from "classnames";
import { SkillName, SKILL_TREE } from "features/game/types/skills";

import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import arrowLeft from "assets/icons/arrow_left.png";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import lock from "assets/skills/lock.png";

interface Props {
  back: () => void;
}

export const SkillTree: React.FC<Props> = ({ back }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <>
      <div className="flex">
        <img
          className="h-6 mr-3 cursor-pointer"
          src={arrowLeft}
          alt="back"
          onClick={back}
        />
        <span className="text-base">Skills</span>
      </div>
      <div className="flex flex-wrap justify-around overflow-y-auto scrollable max-h-96 pt-2 pr-1 mt-2">
        {(Object.keys(SKILL_TREE) as SkillName[]).map((skillName) => {
          const skill = SKILL_TREE[skillName];
          const skillAcquired = state.inventory[skillName]?.equals(1);

          return (
            <OuterPanel className="w-full my-2 p-1 relative" key={skillName}>
              <span
                className={classNames(
                  "text-shadow border text-xxs absolute left-0 -top-4 p-1 rounded-md capitalize",
                  {
                    "bg-green-600": skill.profession === "farming",
                    "bg-[#7C4700]": skill.profession === "gathering",
                    "bg-blue-600": skill.profession === "contributor",
                  }
                )}
              >
                {`${skill.profession} lvl ${skill.level}`}
              </span>
              <div className="flex justify-between h-12 items-center border-b border-white mb-2">
                <span className="text-sm">{skillName}</span>
                <div className="flex">
                  <div className="w-10 flex justify-center">
                    <img
                      src={ITEM_DETAILS[skillName].image}
                      alt="farming"
                      className={classNames("h-6 mx-2", {
                        "opacity-50": !skillAcquired,
                      })}
                    />
                  </div>
                  <img src={lock} alt="farming" className="h-6 mx-2" />
                </div>
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
