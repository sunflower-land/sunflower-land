import React, { useContext, useState } from "react";
import {
  BumpkinSkillRevamp,
  BumpkinRevampSkillTree,
  createRevampSkillPath,
  BumpkinRevampSkillName,
} from "features/game/types/bumpkinSkills";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";

// Component imports
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Label } from "components/ui/Label";
import { SkillBox, INNER_CANVAS_WIDTH } from "./SkillBox";
import { Button } from "components/ui/Button";
import { SkillSquareIcon } from "./SkillSquareIcon";

// Function imports
import {
  getAvailableBumpkinSkillPoints,
  getUnlockedTierForTree,
  SKILL_POINTS_PER_TIER,
} from "features/game/events/landExpansion/choseSkill";
import { gameAnalytics } from "lib/gameAnalytics";

// Icon imports
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { millisecondsToString } from "lib/utils/time";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { MachineState } from "features/game/lib/gameMachine";
import { SKILL_TREE_ICONS } from "./SkillCategoryList";
import tradeOffs from "src/assets/icons/tradeOffs.png";
import { getSkillCooldown } from "features/game/events/landExpansion/skillUsed";

interface Props {
  selectedSkillPath: BumpkinRevampSkillTree;
  skillsInPath: BumpkinSkillRevamp[];
  readonly: boolean;
  onBack: () => void;
}

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _state = (state: MachineState) => state.context.state;

export const getSkillImage = (
  image: string | undefined,
  boostedItemIcon: string | undefined,
  tree: BumpkinRevampSkillTree,
) => {
  return image
    ? image
    : boostedItemIcon
      ? boostedItemIcon
      : SKILL_TREE_ICONS[tree];
};

export const SkillPathDetails: React.FC<Props> = ({
  selectedSkillPath,
  skillsInPath,
  readonly,
  onBack,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const bumpkin = useSelector(gameService, _bumpkin);
  const state = useSelector(gameService, _state);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<BumpkinSkillRevamp>(
    skillsInPath[0],
  );

  const { tree, requirements, name, image, boosts, disabled, power, npc } =
    selectedSkill;
  const { cooldown, points, tier } = requirements;
  const boostedCooldown = getSkillCooldown({ cooldown: cooldown ?? 0, state });
  const { buff, debuff } = boosts;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const { availableTier, totalUsedSkillPoints } = getUnlockedTierForTree(
    tree,
    bumpkin,
  );
  const hasSelectedSkill = !!bumpkin.skills[name as BumpkinRevampSkillName];
  const missingPointRequirement = points > availableSkillPoints;
  const missingSkillsRequirement = tier > availableTier;
  const isClaimDisabled =
    hasSelectedSkill ||
    missingPointRequirement ||
    missingSkillsRequirement ||
    disabled ||
    readonly;

  const handleClaim = () => {
    setShowConfirmation(false);
    const state = gameService.send({ type: "skill.chosen", skill: name });

    gameAnalytics.trackMilestone({
      event: `Bumpkin:SkillUnlocked:${name}`,
    });

    if (Object.keys(state.context.state.bumpkin.skills).length === 1) {
      gameAnalytics.trackMilestone({
        event: `Tutorial:Skill:Completed`,
      });
    }
  };

  return (
    <SplitScreenView
      tallDesktopContent
      tallMobileContent
      wideModal
      panel={
        <div className="flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex flex-col h-full px-1 py-0">
            <div className="flex gap-x-2 justify-start items-center sm:flex-col-reverse sm:py-0 py-2">
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="cursor-pointer block sm:hidden"
                alt="back"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  marginRight: `${PIXEL_SCALE * 1}px`,
                }}
                onClick={onBack}
              />
              <div className="sm:mt-2">
                <SkillSquareIcon
                  icon={getSkillImage(image, buff.boostedItemIcon, tree)}
                  width={INNER_CANVAS_WIDTH}
                  tier={tier}
                  npc={npc}
                />
              </div>
              <span className="sm:text-center">{name}</span>
            </div>
            <div className="flex flex-col items-start mt-2">
              {!!power && (
                <Label
                  type="vibrant"
                  icon={SUNNYSIDE.icons.lightning}
                  className="mb-2"
                >
                  {t("skill.powerSkill")}
                </Label>
              )}
              {buff && (
                <Label
                  type={buff.labelType}
                  icon={buff.boostTypeIcon}
                  secondaryIcon={buff.boostedItemIcon}
                  className="mb-2"
                >
                  {buff.shortDescription}
                </Label>
              )}
              {debuff && (
                <Label
                  type={debuff.labelType}
                  icon={debuff.boostTypeIcon}
                  secondaryIcon={debuff.boostedItemIcon}
                  className="mb-2"
                >
                  {debuff.shortDescription}
                </Label>
              )}
            </div>
            <div className="flex justify-between flex-col flex-wrap">
              <div className="flex flex-row lg:flex-col-reverse items-start justify-between">
                <RequirementLabel
                  type="skillPoints"
                  points={availableSkillPoints}
                  requirement={points}
                  className="mb-2"
                  hideIcon={true} // Hide the div icon
                />
                {!!power && !!boostedCooldown && (
                  <Label
                    type="info"
                    icon={SUNNYSIDE.icons.stopwatch}
                    className="mb-2"
                  >
                    {t("skill.cooldown", {
                      cooldown: millisecondsToString(boostedCooldown, {
                        length: "short",
                        isShortFormat: true,
                        removeTrailingZeros: true,
                      }),
                    })}
                  </Label>
                )}
              </div>
              {disabled && (
                <Label type="danger" className="mb-2">
                  {t("skillTier.skillDisabled")}
                </Label>
              )}
            </div>
          </div>

          {/* Claim/Claimed/Use Button */}
          {!readonly && (
            <div className="flex sm:flex-col w-full">
              {showConfirmation ? (
                <>
                  <Button
                    className="mr-1 sm:mr-0"
                    onClick={() => setShowConfirmation(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    className="sm:mt-1"
                    disabled={isClaimDisabled}
                    onClick={handleClaim}
                  >
                    {t("skill.claimSkill")}
                  </Button>
                </>
              ) : (
                <Button
                  disabled={isClaimDisabled}
                  onClick={() => setShowConfirmation(true)}
                >
                  {t(hasSelectedSkill ? "skill.claimed" : "skill.claim")}
                </Button>
              )}
            </div>
          )}
        </div>
      }
      content={
        <div className="pl-1">
          {/* Header */}
          <div
            className="flex flex-row my-2 items-center"
            style={{ margin: `${PIXEL_SCALE * 2}px` }}
          >
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="cursor-pointer hidden sm:block"
              alt="back"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                marginRight: `${PIXEL_SCALE * 4}px`,
              }}
              onClick={onBack}
            />
            <Label type="default">
              {t("skillPath.skills", { skillPath: selectedSkillPath })}
            </Label>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-1">
            {Object.entries(createRevampSkillPath(skillsInPath)).map(
              ([tier, skills]) => {
                const { requirements, tree } = skills[0];
                const { tier: tierRequirement } = requirements;
                const tierUnlocked = tierRequirement <= availableTier;
                const availableSkills = skills.filter(
                  (skill) => !skill.disabled,
                );
                const pointsRequired =
                  SKILL_POINTS_PER_TIER[tree][tierRequirement];

                return (
                  <div key={tier} className="flex flex-col">
                    <div className="flex flex-row items-center gap-1">
                      <Label
                        type={tierUnlocked ? "default" : "warning"}
                        className={tierUnlocked ? "ml-1" : "ml-2"}
                        icon={tierUnlocked ? undefined : SUNNYSIDE.icons.lock}
                      >
                        {t("skillTier.number", { number: tier })}
                      </Label>
                      {!tierUnlocked && (
                        <Label type="default" className="ml-1">
                          {`Points to unlock: ${totalUsedSkillPoints}/${pointsRequired}`}
                        </Label>
                      )}
                    </div>
                    <div className="flex flex-row flex-wrap gap-0">
                      {availableSkills.map((skill) => {
                        const hasSkill =
                          !!bumpkin.skills[
                            skill.name as BumpkinRevampSkillName
                          ];
                        const { name, image, tree, npc, power, boosts } = skill;
                        const { boostTypeIcon, boostedItemIcon } = boosts.buff;

                        return (
                          <SkillBox
                            key={name}
                            image={getSkillImage(image, boostedItemIcon, tree)}
                            isSelected={selectedSkill === skill}
                            onClick={() => {
                              setSelectedSkill(skill);
                              setShowConfirmation(false);
                            }}
                            showOverlay={hasSkill || !tierUnlocked}
                            overlayIcon={
                              <img
                                src={
                                  hasSkill
                                    ? SUNNYSIDE.icons.confirm
                                    : !tierUnlocked
                                      ? SUNNYSIDE.icons.lock
                                      : undefined
                                }
                                alt="claimed"
                                className="relative object-contain"
                                style={{
                                  width: `${PIXEL_SCALE * 12}px`,
                                }}
                              />
                            }
                            tier={tierRequirement}
                            npc={npc}
                            secondaryImage={
                              boosts.debuff
                                ? tradeOffs
                                : power
                                  ? SUNNYSIDE.icons.lightning
                                  : boostTypeIcon
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      }
    />
  );
};
