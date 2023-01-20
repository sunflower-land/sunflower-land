import classNames from "classnames";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { GoblinState } from "features/game/lib/goblinMachine";
import {
  BumpkinSkillName,
  BUMPKIN_SKILL_TREE,
} from "features/game/types/bumpkinSkills";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import React from "react";
import { Label } from "../Label";
import { SquareIcon } from "../SquareIcon";

/**
 * The props for the component.
 * @param gameState The game state.
 * @param details The skill details.
 * @param requirements The skill requirements.
 * @param actionView The view for displaying the skill action.
 */
interface Props {
  gameState: GameState | GoblinState;
  details: SkillDetailsProps;
  requirements?: RequirementsProps;
  actionView?: JSX.Element;
}

/**
 * The props for the details for skills.
 * @param skill The skill.
 */
interface SkillDetailsProps {
  skill: BumpkinSkillName;
}

/**
 * The props for the skill requirements.
 * @param skillPoints The skillpoint resources requirements.
 * @param skill Which skill the player needs to obtain before getting this current skill.
 */
interface RequirementsProps {
  skillPoints: number;
  skill?: BumpkinSkillName;
}

/**
 * The view for displaying skill name, details, skill requirements and action.
 * @props The component props.
 */
export const SkillDetails: React.FC<Props> = ({
  gameState,
  details,
  requirements,
  actionView,
}: Props) => {
  const getSkillDetail = () => {
    const skill = BUMPKIN_SKILL_TREE[details.skill];
    const icon = skill.image;
    const title = details.skill;
    const description = skill.boosts;

    return (
      <div className="mb-2">
        <div className="flex space-x-2 justify-start mb-1 items-center sm:flex-col-reverse md:space-x-0">
          {icon && (
            <div className="sm:mt-2">
              <SquareIcon icon={icon} width={14} />
            </div>
          )}
          <span className="sm:text-center">{title}</span>
        </div>
        <span className="text-xs mt-1 whitespace-pre-line sm:text-center">
          {description}
        </span>
      </div>
    );
  };

  const getSkillPointRequirement = () => {
    if (!requirements?.skillPoints) {
      return <></>;
    }

    const availableSkillPoints = getAvailableBumpkinSkillPoints(
      gameState.bumpkin
    );
    const missingPointRequirement =
      availableSkillPoints < requirements.skillPoints;

    return (
      <div className="flex justify-between">
        <Label
          type={missingPointRequirement ? "danger" : "transparent"}
          className={classNames("", {
            "pl-0": !missingPointRequirement,
          })}
        >
          {`Skill Points: ${availableSkillPoints}/${requirements.skillPoints}`}
        </Label>
      </div>
    );
  };

  const getRequiredSkill = () => {
    if (!requirements?.skill) {
      return <></>;
    }

    const missingSkillRequirement = !getKeys({
      ...gameState.bumpkin?.skills,
    }).includes(requirements.skill);

    return (
      <div className="flex items-center">
        <Label
          type={missingSkillRequirement ? "danger" : "transparent"}
          className={classNames("", {
            "mr-1": missingSkillRequirement,
            "pl-0": !missingSkillRequirement,
          })}
        >
          Skill:
        </Label>
        <SquareIcon
          icon={BUMPKIN_SKILL_TREE[requirements.skill].image}
          width={7}
        />
      </div>
    );
  };

  const getRequirements = () => {
    if (!requirements) return <></>;

    return (
      <div className="border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
        {getSkillPointRequirement()}
        {getRequiredSkill()}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center p-2 pb-0">
        {getSkillDetail()}
        {getRequirements()}
      </div>
      {actionView}
    </div>
  );
};
