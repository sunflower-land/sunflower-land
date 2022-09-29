import React, { useContext, useState } from "react";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import {
  BumpkinSkill,
  BumpkinSkillName,
  BumpkinSkillTree,
  BUMPKIN_SKILL_TREE,
  getSkills,
  SKILL_TREE_CATEGORIES,
} from "features/game/types/bumpkinSkills";

import close from "assets/icons/close.png";
import seedSpecialist from "assets/skills/seed_specialist.png";
import leftArrow from "assets/icons/arrow_left.png";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/craftables";
import classNames from "classnames";
import { SkillPath } from "./SkillPath";
import { SkillPointsLabel } from "./SkillPointsLabel";
import { acknowledgeSkillPoints } from "../lib/skillPointStorage";
import { Bumpkin } from "features/game/types/game";

const SkillCategoryList = ({
  bumpkin,
  onClick,
}: {
  bumpkin: Bumpkin;
  onClick: (category: BumpkinSkillTree) => void;
}) => {
  return (
    <>
      {SKILL_TREE_CATEGORIES.map((category) => {
        const skills = getSkills(category);
        const icon = skills[0].image;
        const skillsAcquiredInCategoryCount = getKeys({
          ...bumpkin?.skills,
        }).filter((acquiredSkillName) =>
          skills.find((skill) => skill.name === acquiredSkillName)
        ).length;

        return (
          <div key={category} onClick={() => onClick(category)}>
            <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
              <Label className="px-1 text-xxs absolute -top-3 -right-1">
                {`${skillsAcquiredInCategoryCount}/${skills.length}`}
              </Label>
              <div className="flex justify-center">
                <img src={icon} className="h-9 mr-2" />
                <span className="text-sm">{category}</span>
              </div>
            </OuterPanel>
          </div>
        );
      })}
    </>
  );
};

export const BumpkinSkillsModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [selectedSkill, setSelectedSkill] =
    useState<BumpkinSkillName>("Green Thumb");
  const [selectedSkillPath, setSelectedSkillPath] =
    useState<BumpkinSkillTree | null>(null);
  const [skillsInPath, setSkillsInTree] = useState<BumpkinSkill[]>([]);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const onSkillCategoryClickHandler = (category: BumpkinSkillTree) => {
    setSelectedSkillPath(category);

    const skillsInCategory: BumpkinSkill[] = getSkills(category);

    setSkillsInTree(skillsInCategory);

    const nextAvailableSkillInTree =
      skillsInCategory.find((skill) => {
        return !(`${skill.name}` in { ...state.bumpkin?.skills });
      }) ?? skillsInCategory[0];

    const defaultSkill = nextAvailableSkillInTree ?? skillsInCategory[0];

    setSelectedSkill(defaultSkill.name);
  };

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
    <>
      <Panel className="pt-5 relative">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab isActive>
              <img src={seedSpecialist} className="h-5 mr-2" />
              <span className="text-sm text-shadow">Skills</span>
            </Tab>
          </div>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1"
            onClick={onClose}
          />
        </div>

        <div
          style={{
            minHeight: "200px",
          }}
        >
          {availableSkillPoints > 0 && (
            <SkillPointsLabel points={availableSkillPoints} />
          )}
          {!selectedSkillPath ? (
            <SkillCategoryList
              bumpkin={bumpkin as Bumpkin}
              onClick={(category) => onSkillCategoryClickHandler(category)}
            />
          ) : (
            // Skill Path Details
            <div className="flex flex-col">
              <OuterPanel className="relative flex-1 min-w-[42%] flex flex-col justify-between items-center shadow-none">
                <div className="flex flex-col justify-center items-center p-2 relative w-full">
                  <img
                    src={leftArrow}
                    className="absolute top-1 left-1 self-start w-5 cursor-pointer right-96"
                    alt="back"
                    onClick={() => setSelectedSkillPath(null)}
                  />
                  {showConfirmButton ? (
                    // Confirmation panel
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
                  ) : (
                    // Selected Skill Details Panel
                    <>
                      <div className="flex mb-1 items-center">
                        <span className="text-shadow text-center text-sm sm:text-base mr-1">
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
                bumpkin={bumpkin as Bumpkin}
                skillsInPath={skillsInPath}
                onClick={(skillName) => setSelectedSkill(skillName)}
                selectedSkill={selectedSkill}
              />
            </div>
          )}
        </div>
      </Panel>
    </>
  );
};
