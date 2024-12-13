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
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { SquareIcon } from "components/ui/SquareIcon";
import { ConfirmationModal } from "components/ui/ConfirmationModal";

// Function imports
import {
  getAvailableBumpkinSkillPoints,
  getUnlockedTierForTree,
} from "features/game/events/landExpansion/choseSkill";
import { gameAnalytics } from "lib/gameAnalytics";

// Icon imports
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { isMobile } from "mobile-device-detect";
import { millisecondsToString } from "lib/utils/time";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { MachineState } from "features/game/lib/gameMachine";

interface Props {
  selectedSkillPath: BumpkinRevampSkillTree;
  skillsInPath: BumpkinSkillRevamp[];
  readonly: boolean;
  onBack: () => void;
}

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const SkillPathDetails: React.FC<Props> = ({
  selectedSkillPath,
  skillsInPath,
  readonly,
  onBack,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const bumpkin = useSelector(gameService, _bumpkin);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<BumpkinSkillRevamp>(
    skillsInPath[0],
  );

  const { tree, requirements, name, image, boosts, disabled, power } =
    selectedSkill;
  const { cooldown, points, tier } = requirements;
  const { buff, debuff } = boosts;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const { availableTier, pointsToNextTier } = getUnlockedTierForTree(
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
    setShowConfirmationModal(false);
    const state = gameService.send("skill.chosen", { skill: name });

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
      wideModal
      panel={
        <div className="flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex flex-col h-full px-1 py-0">
            <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 sm:py-0 py-2">
              {isMobile && (
                <img
                  src={SUNNYSIDE.icons.arrow_left}
                  className="cursor-pointer"
                  alt="back"
                  style={{
                    width: `${PIXEL_SCALE * 11}px`,
                    marginRight: `${PIXEL_SCALE * 1}px`,
                  }}
                  onClick={onBack}
                />
              )}
              <div className="sm:mt-2">
                <SquareIcon icon={image} width={14} />
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
                {!!power && !!cooldown && (
                  <Label
                    type="info"
                    icon={SUNNYSIDE.icons.stopwatch}
                    className="mb-2"
                  >
                    {t("skill.cooldown", {
                      cooldown: millisecondsToString(cooldown ?? 0, {
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
            <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
              <Button
                disabled={isClaimDisabled}
                onClick={() => setShowConfirmationModal(true)}
              >
                {t(hasSelectedSkill ? "skill.claimed" : "skill.claim")}
              </Button>
            </div>
          )}

          {/* Confirmation Modal */}
          <ConfirmationModal
            show={showConfirmationModal}
            onHide={() => setShowConfirmationModal(false)}
            messages={[
              t("skill.confirmationMessage", { skillName: name }),
              t("skill.costMessage", { points }),
            ]}
            onCancel={() => setShowConfirmationModal(false)}
            onConfirm={handleClaim}
            confirmButtonLabel={t("skill.claimSkill")}
            disabled={isClaimDisabled}
          />
        </div>
      }
      content={
        <div className="pl-1">
          {/* Header */}
          <div
            className="flex flex-row my-2 items-center"
            style={{ margin: `${PIXEL_SCALE * 2}px` }}
          >
            {!isMobile && (
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
            )}
            <Label type="default">
              {t("skillPath.skills", { skillPath: selectedSkillPath })}
            </Label>
          </div>

          {/* Skills */}
          {Object.entries(createRevampSkillPath(skillsInPath)).map(
            ([tier, skills]) => {
              const { tier: tierRequirement } = skills[0].requirements;
              const tierUnlocked = tierRequirement <= availableTier;
              const availableSkills = skills.filter((skill) => !skill.disabled);

              return (
                <div key={tier} className="flex flex-col">
                  <div className="flex flex-row items-center">
                    <Label
                      type={tierUnlocked ? "default" : "warning"}
                      className={tierUnlocked ? "ml-1" : "ml-2"}
                      icon={tierUnlocked ? undefined : SUNNYSIDE.icons.lock}
                    >
                      {t("skillTier.number", { number: tier })}
                    </Label>
                    {!tierUnlocked && Number(tier) === availableTier + 1 && (
                      <Label type="default" className="ml-1">
                        {t("skillTier.pointsToUnlock", {
                          points: pointsToNextTier,
                        })}
                      </Label>
                    )}
                  </div>
                  <div className="flex flex-wrap mb-2">
                    {availableSkills.map((skill) => {
                      const hasSkill =
                        !!bumpkin.skills[skill.name as BumpkinRevampSkillName];

                      return (
                        <Box
                          key={skill.name}
                          className="mb-1"
                          image={skill.image}
                          isSelected={selectedSkill === skill}
                          onClick={() => setSelectedSkill(skill)}
                          showOverlay={hasSkill}
                          overlayIcon={
                            <img
                              src={SUNNYSIDE.icons.confirm}
                              alt="claimed"
                              className="relative object-contain"
                              style={{
                                width: `${PIXEL_SCALE * 12}px`,
                              }}
                            />
                          }
                        >
                          {skill.name}
                        </Box>
                      );
                    })}
                  </div>
                </div>
              );
            },
          )}
        </div>
      }
    />
  );
};
