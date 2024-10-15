import React, { useContext, useState } from "react";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  BumpkinRevampSkillTree,
  getRevampSkills,
  REVAMP_SKILL_TREE_CATEGORIES,
} from "features/game/types/bumpkinSkills";

import { Modal } from "components/ui/Modal";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { setImageWidth } from "lib/images";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import sflIcon from "assets/icons/sfl.webp";
import { Button } from "components/ui/Button";
import { gameAnalytics } from "lib/gameAnalytics";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  findLevelRequiredForNextSkillPoint,
  isMaxLevel,
} from "features/game/lib/level";
const iconList = {
  Crops: SUNNYSIDE.skills.crops,
  Trees: SUNNYSIDE.skills.trees,
  Rocks: SUNNYSIDE.skills.rocks,
  Cooking: SUNNYSIDE.skills.cooking,
  Animals: SUNNYSIDE.skills.animals,
  Fruit: SUNNYSIDE.skills.animals,
  Fishing: SUNNYSIDE.skills.animals,
  Greenhouse: SUNNYSIDE.skills.animals,
  Mining: SUNNYSIDE.skills.animals,
  "Bees & Flowers": SUNNYSIDE.skills.animals,
  Oil: SUNNYSIDE.skills.animals,
  Machinery: SUNNYSIDE.skills.animals,
};

export const SkillCategoryList = ({
  onClick,
  onBack,
}: {
  onClick: (category: BumpkinRevampSkillTree) => void;
  onBack: () => void;
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [showSkillsResetModal, setShowSkillsResetModal] =
    useState<boolean>(false);

  const { bumpkin } = state;
  const experience = bumpkin?.experience || 0;
  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

  // Functions
  const hasSkills = bumpkin?.skills
    ? Object.keys(bumpkin.skills).length > 0
    : false;
  const threeMonthsSinceLastReset = bumpkin?.previousSkillsResetAt
    ? new Date(bumpkin.previousSkillsResetAt).getTime() + 7776000000 <
      Date.now()
    : true; // 90 days in milliseconds, yeah I know..
  const enoughSfl = state.balance.toNumber() >= 10;

  const handleSkillsReset = () => {
    setShowSkillsResetModal(false);
    gameService.send("skills.reset");

    // can be useful later?
    gameAnalytics.trackMilestone({
      event: "Bumpkin:SkillReset",
    });
  };

  const nextLevelWithSkillPoint =
    findLevelRequiredForNextSkillPoint(experience);
  return (
    <>
      <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable max-h-96">
        <div
          className="flex flex-row my-2 items-center"
          style={{ margin: `${PIXEL_SCALE * 2}px` }}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="cursor-pointer"
            alt="back"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              marginRight: `${PIXEL_SCALE * 4}px`,
            }}
            onClick={onBack}
          />
          <div className="flex flex-wrap gap-1">
            {availableSkillPoints > 0 && (
              <Label type="default">
                {t("skillPts")} {availableSkillPoints}
              </Label>
            )}
            {nextLevelWithSkillPoint && !isMaxLevel(experience) && (
              <Label type="default" className="text-xxs px-1 whitespace-nowrap">
                {t("nextSkillPtLvl")} {nextLevelWithSkillPoint}
              </Label>
            )}
          </div>
        </div>

        {REVAMP_SKILL_TREE_CATEGORIES.map((category) => {
          const skills = getRevampSkills(category);
          const icon = iconList[skills[0].tree];
          const skillsAcquiredInCategoryCount = getKeys({
            ...bumpkin?.skills,
          }).filter((acquiredSkillName) =>
            skills.find((skill) => skill.name === acquiredSkillName),
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

        <div className="flex flex-row items-center">
          <p
            className="text-xs cursor-pointer underline"
            onClick={() => setShowSkillsResetModal(true)}
          >
            {"Reset Skills"}
          </p>
        </div>
      </InnerPanel>

      <Modal
        show={showSkillsResetModal}
        onHide={() => setShowSkillsResetModal(false)}
      >
        <OuterPanel>
          <InnerPanel className="flex flex-col items-center">
            <div className="flex flex-row items-center w-full justify-between">
              <Label type="danger">{"Skills Reset"}</Label>
              <Label type="warning" icon={sflIcon}>
                {"10 SFL"}
              </Label>
            </div>
            <p className="text-xs py-4 px-2 text-center">
              {
                "Are you sure you want to reset all your skills? This action cannot be undone and will cost 10 SFL. You will be able to reset your skills again in 3 months."
              }
            </p>
            {!threeMonthsSinceLastReset && (
              <Label
                type="danger"
                icon={SUNNYSIDE.icons.stopwatch}
                className="mb-2"
              >
                {"Can't reset skills yet"}
              </Label>
            )}
            {!enoughSfl && (
              <Label type="danger" icon={sflIcon} className="mb-2">
                {"You do not have enough SFL"}
              </Label>
            )}
            <Button
              onClick={handleSkillsReset}
              disabled={!hasSkills || !threeMonthsSinceLastReset || !enoughSfl}
            >
              {"Reset Skills"}
            </Button>
          </InnerPanel>
        </OuterPanel>
      </Modal>
    </>
  );
};
