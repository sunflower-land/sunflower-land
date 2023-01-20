import React, { useContext, useEffect, useState } from "react";
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
import { SkillPath } from "./SkillPath";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SkillDetails } from "components/ui/layouts/SkillDetails";

interface Props {
  selectedSkillPath: BumpkinSkillTree;
  skillsInPath: BumpkinSkill[];
  backNavigationView: JSX.Element;
}

export const SkillPathDetails: React.FC<Props> = ({
  selectedSkillPath,
  skillsInPath,
  backNavigationView,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

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

  const missingSkillRequirement = skillRequired
    ? !getKeys({ ...bumpkin?.skills }).includes(skillRequired)
    : false;

  const missingPointRequirement = availableSkillPoints < pointsRequired;
  const comingSoon = !!BUMPKIN_SKILL_TREE[selectedSkill].disabled;
  const isVisiting = gameState.matches("visiting");

  const handleClaim = () => {
    setShowConfirmButton(false);
    gameService.send("skill.picked", { skill: selectedSkill });
  };

  return (
    <>
      <div className="sm:hidden">{backNavigationView}</div>
      <SplitScreenView
        tallMobileContent={true}
        contentScrollable={false}
        header={
          <SkillDetails
            gameState={gameState.context.state}
            details={{
              skill: selectedSkill,
            }}
            requirements={
              isVisiting || hasSelectedSkill
                ? undefined
                : {
                    skillPoints: pointsRequired,
                    skill: skillRequired
                      ? BUMPKIN_SKILL_TREE?.[skillRequired].name
                      : undefined,
                  }
            }
            actionView={
              <>
                {comingSoon && (
                  <p className="text-xxs text-center my-2">Coming soon</p>
                )}
                {!hasSelectedSkill && !isVisiting && !comingSoon && (
                  <>
                    {!showConfirmButton && (
                      <Button
                        onClick={() => setShowConfirmButton(true)}
                        disabled={
                          missingPointRequirement || missingSkillRequirement
                        }
                        className="whitespace-nowrap"
                      >
                        Claim skill
                      </Button>
                    )}
                    {showConfirmButton && (
                      <div className="flex flex-col">
                        <p className="m-2 text-center text-sm">{`Are you sure you want to claim the ${selectedSkill} skill?`}</p>
                        <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                          <Button
                            onClick={() => setShowConfirmButton(false)}
                            className="whitespace-nowrap"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleClaim}
                            className="whitespace-nowrap"
                          >
                            Claim
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            }
          />
        }
        content={
          <>
            <div className="hidden sm:block -ml-1 -mt-2">
              {backNavigationView}
            </div>
            <span className="text-center mb-2 text-sm">{`${selectedSkillPath} Skill Path`}</span>
            <div className="overflow-y-auto scrollable overflow-x-hidden flex flex-wrap">
              <SkillPath
                skillsInPath={skillsInPath}
                onClick={(skillName) => setSelectedSkill(skillName)}
                selectedSkill={selectedSkill}
              />
            </div>
          </>
        }
      />
    </>
  );
};
