import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { OuterPanel } from "components/ui/Panel";
import {
  BumpkinSkill,
  BumpkinSkillName,
  BumpkinSkillTree,
  BUMPKIN_SKILL_TREE,
} from "features/game/types/bumpkinSkills";

import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/craftables";
import { acknowledgeSkillPoints } from "../../island/bumpkin/lib/skillPointStorage";
import { SkillPath } from "./SkillPath";
import { Button } from "components/ui/Button";

import arrowLeft from "assets/icons/arrow_left.png";

interface Props {
  selectedSkillPath: BumpkinSkillTree;
  skillsInPath: BumpkinSkill[];
  onBack: () => void;
}

export const SkillPathDetails: React.FC<Props> = ({
  onBack,
  selectedSkillPath,
  skillsInPath,
}) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [selectedSkill, setSelectedSkill] =
    useState<BumpkinSkillName>("Green Thumb");

  useEffect(() => {
    const nextAvailableSkillInTree =
      skillsInPath.find((skill) => {
        return !(`${skill.name}` in { ...state.bumpkin?.skills });
      }) ?? skillsInPath[0];

    const defaultSkill = nextAvailableSkillInTree ?? skillsInPath[0];

    setSelectedSkill(defaultSkill.name);
  }, []);

  const { bumpkin } = state;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const hasSelectedSkill = !!bumpkin?.skills[selectedSkill];

  const { points: pointsRequired, skill: skillRequired } =
    BUMPKIN_SKILL_TREE[selectedSkill].requirements;

  const requiredSkillImage = skillRequired
    ? BUMPKIN_SKILL_TREE?.[skillRequired].image
    : undefined;

  const missingSkillRequirement = skillRequired
    ? !getKeys({ ...bumpkin?.skills }).includes(skillRequired)
    : false;

  const missingPointRequirement = availableSkillPoints < pointsRequired;

  const handleClaim = () => {
    setShowConfirmButton(false);
    gameService.send("skill.picked", { skill: selectedSkill });
    acknowledgeSkillPoints(gameService.state.context.state.bumpkin);
  };

  return (
    <div className="flex flex-col">
      <OuterPanel className="relative flex-1 min-w-[42%] flex flex-col justify-between items-center shadow-none">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img
            src={arrowLeft}
            className="absolute top-1 left-1 self-start w-5 cursor-pointer right-96"
            alt="back"
            onClick={onBack}
          />
          {showConfirmButton && (
            <div className="flex flex-col">
              <p className="mx-4 text-center">{`Are you sure you want to claim the ${selectedSkill} skill?`}</p>
              <div className="flex space-x-1">
                <Button
                  onClick={() => setShowConfirmButton(false)}
                  className="text-xs mt-2"
                >
                  Cancel
                </Button>
                <Button onClick={handleClaim} className="text-xs mt-2">
                  Claim
                </Button>
              </div>
            </div>
          )}
          {!showConfirmButton && (
            <>
              <div className="flex mb-1 items-center">
                <span className="text-shadow text-center text-sm sm:text-base mr-2">
                  {selectedSkill}
                </span>
                <img
                  src={BUMPKIN_SKILL_TREE[selectedSkill].image}
                  className="object-scale-down"
                />
              </div>

              <span className="text-shadow text-center mt-1 text-xxs sm:text-xs mb-1">
                {BUMPKIN_SKILL_TREE[selectedSkill].boosts}
              </span>

              {!hasSelectedSkill && (
                <>
                  <div className="border-t border-white w-full pt-1 text-center">
                    <div
                      className={classNames(
                        "flex justify-center flex-wrap items-end mt-2",
                        {
                          "text-error": missingPointRequirement,
                        }
                      )}
                    >
                      <span className="text-shadow text-center text-xxs sm:text-xs">
                        Required Skill Points:
                      </span>
                      <span className="text-xxs sm:text-xs text-shadow text-center">
                        {`${availableSkillPoints}/${pointsRequired}`}
                      </span>
                    </div>
                    {skillRequired && (
                      <div
                        className={classNames(
                          "flex justify-center flex-wrap items-center mt-2",
                          {
                            "text-error": missingSkillRequirement,
                          }
                        )}
                      >
                        <span className="text-shadow text-center text-xxs sm:text-xs">
                          Required Skills:
                        </span>
                        <img src={requiredSkillImage} />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => setShowConfirmButton(true)}
                    disabled={
                      missingPointRequirement || missingSkillRequirement
                    }
                    className="text-xs mt-2"
                  >
                    Claim skill
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </OuterPanel>
      <span className="text-center my-2 text-sm">{`${selectedSkillPath} Skill Path`}</span>
      <SkillPath
        skillsInPath={skillsInPath}
        onClick={(skillName) => setSelectedSkill(skillName)}
        selectedSkill={selectedSkill}
      />
    </div>
  );
};
