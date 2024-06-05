import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
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
import { setImageWidth } from "lib/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const RequiredSkillPoints = ({
  missingPointRequirement,
  availableSkillPoints,
  pointsRequired,
}: {
  missingPointRequirement: boolean;
  availableSkillPoints: number;
  pointsRequired: number;
}) => {
  const { t } = useAppTranslation();
  return (
    <div
      className={classNames("flex justify-center flex-wrap items-end mt-2", {
        "text-error": missingPointRequirement,
      })}
    >
      <span className="text-center sm:text-xs">{t("reqSkillPts")}</span>
      <span className="sm:text-xs text-center">
        {" "}
        {`${availableSkillPoints}/${pointsRequired}`}
      </span>
    </div>
  );
};

const RequiredSkill = ({
  missingSkillRequirement,
  requiredSkillImage,
}: {
  missingSkillRequirement: boolean;
  requiredSkillImage?: string;
}) => {
  const { t } = useAppTranslation();
  return (
    <div
      className={classNames("flex justify-center flex-wrap items-center mt-2", {
        "text-error": missingSkillRequirement,
      })}
    >
      <span className="text-center sm:text-xs">{t("reqSkills")} </span>
      <img
        src={requiredSkillImage}
        style={{ opacity: 0, marginLeft: `${PIXEL_SCALE * 4}px` }}
        onLoad={(e) => setImageWidth(e.currentTarget)}
      />
    </div>
  );
};

interface Props {
  selectedSkillPath: BumpkinSkillTree;
  skillsInPath: BumpkinSkill[];
  readonly: boolean;
}

export const SkillPathDetails: React.FC<Props> = ({
  selectedSkillPath,
  skillsInPath,
  readonly,
}) => {
  const { t } = useAppTranslation();
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
  }, [skillsInPath, state.bumpkin?.skills]);

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
  const comingSoon = !!BUMPKIN_SKILL_TREE[selectedSkill].disabled;

  const handleClaim = () => {
    setShowConfirmButton(false);
    const state = gameService.send("skill.picked", { skill: selectedSkill });

    gameAnalytics.trackMilestone({
      event: `Bumpkin:SkillUnlocked:${selectedSkill}`,
    });

    if (Object.keys(state.context.state.bumpkin?.skills ?? {}).length === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:Skill:Completed",
      });
    }

    acknowledgeSkillPoints(gameService.state.context.state.bumpkin);
  };

  return (
    <div className="flex flex-col">
      <InnerPanel className="relative flex-1 min-w-[42%] flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          {showConfirmButton && (
            <div className="flex flex-col">
              <p className="mx-4 text-center text-sm">
                {t("confirm.skillClaim")} {selectedSkill}
              </p>
              <div className="flex space-x-1">
                <Button
                  onClick={() => setShowConfirmButton(false)}
                  className="sm:text-xs mt-1 whitespace-nowrap"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleClaim}
                  className="sm:text-xs mt-1 whitespace-nowrap"
                >
                  {t("claim")}
                </Button>
              </div>
            </div>
          )}
          {!showConfirmButton && (
            <>
              <div className="flex mb-1 items-center">
                <span className="text-center text-sm sm:text-base">
                  {selectedSkill}
                </span>
                <img
                  src={BUMPKIN_SKILL_TREE[selectedSkill].image}
                  style={{ opacity: 0, marginLeft: `${PIXEL_SCALE * 4}px` }}
                  onLoad={(e) => setImageWidth(e.currentTarget)}
                />
              </div>

              <span className="text-center mt-1 sm:text-xs mb-1">
                {BUMPKIN_SKILL_TREE[selectedSkill].boosts}
              </span>
              {comingSoon && <p className="text-xs mt-1">{t("coming.soon")}</p>}

              {!hasSelectedSkill && !readonly && !comingSoon && (
                <>
                  <div className="border-t border-white w-full pt-1 text-center">
                    <RequiredSkillPoints
                      missingPointRequirement={missingPointRequirement}
                      availableSkillPoints={availableSkillPoints}
                      pointsRequired={pointsRequired}
                    />
                    {skillRequired && (
                      <RequiredSkill
                        requiredSkillImage={requiredSkillImage}
                        missingSkillRequirement={missingSkillRequirement}
                      />
                    )}
                  </div>
                  <Button
                    onClick={() => setShowConfirmButton(true)}
                    disabled={
                      missingPointRequirement || missingSkillRequirement
                    }
                    className="sm:text-xs mt-1 whitespace-nowrap"
                  >
                    {t("claim.skill")}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </InnerPanel>
      <span className="text-center my-2 text-sm">{`${selectedSkillPath} Skill Path`}</span>
      <SkillPath
        skillsInPath={skillsInPath}
        onClick={(skillName) => setSelectedSkill(skillName)}
        selectedSkill={selectedSkill}
      />
    </div>
  );
};
