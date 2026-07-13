import React, { useContext, useState } from "react";
import {
  type BumpkinSkillRevamp,
  type BumpkinRevampSkillTree,
  createRevampSkillPath,
  type BumpkinRevampSkillName,
  type UpgradeableSkillName,
  getSkillUpgradeCost,
  SKILL_RANKS,
  isUpgradeableSkillName,
} from "features/game/types/bumpkinSkills";
import { getSkillRankDescription } from "./getSkillRankDescription";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";

// Component imports
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Label, LABEL_STYLES } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SkillBox, INNER_CANVAS_WIDTH } from "./SkillBox";
import { Button } from "components/ui/Button";
import { SkillSquareIcon } from "./SkillSquareIcon";
import {
  pixelGrayBorderStyle,
  pixelGreenBorderStyle,
  pixelOrangeBorderStyle,
} from "features/game/lib/style";

// Function imports
import {
  getAvailableBumpkinSkillPoints,
  getUnlockedTierForTree,
  SKILL_POINTS_PER_TIER,
} from "features/game/events/landExpansion/choseSkill";
import { gameAnalytics } from "lib/gameAnalytics";
import { hasFeatureAccess } from "lib/flags";
import Decimal from "decimal.js-light";

// Icon imports
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { millisecondsToString } from "lib/utils/time";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import type { MachineState } from "features/game/lib/gameMachine";
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

/**
 * A 1·2·3 rank track. `level` is the current rank (0 when the skill is not yet
 * claimed); pips at or below `level` are done, the next pip is highlighted.
 */
const RankTrack: React.FC<{ level: number; maxLevel: number }> = ({
  level,
  maxLevel,
}) => {
  const { t } = useAppTranslation();
  const isMaxed = level >= maxLevel;

  const status = isMaxed
    ? t("skill.max")
    : t("skill.rankProgress", { level, max: maxLevel });

  return (
    <InnerPanel className="w-full mb-2">
      <div className="flex items-center justify-between px-1 pt-0.5 pb-1">
        <span className="text-xxs" style={{ letterSpacing: "1px" }}>
          {t("skill.rank")}
        </span>
        <span className="text-xxs">{status}</span>
      </div>
      <div className="flex gap-1 px-1 pb-1">
        {Array.from({ length: maxLevel }).map((_, i) => {
          const rank = i + 1;
          const done = rank <= level;
          const next = rank === level + 1;
          const borderStyle = done
            ? pixelGreenBorderStyle
            : next
              ? pixelOrangeBorderStyle
              : pixelGrayBorderStyle;

          return (
            <div
              key={rank}
              className="relative flex flex-1 items-center justify-center"
              style={{
                height: `${PIXEL_SCALE * 13}px`,
                ...borderStyle,
                backgroundColor: done
                  ? LABEL_STYLES.success.background
                  : next
                    ? "#fff4df"
                    : undefined,
              }}
            >
              <span
                className="text-sm"
                style={{
                  color: done ? "#ffffff" : next ? "#b8720a" : undefined,
                }}
              >
                {rank}
              </span>
            </div>
          );
        })}
      </div>
    </InnerPanel>
  );
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
  const [showUpgradeConfirmation, setShowUpgradeConfirmation] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<BumpkinSkillRevamp>(
    skillsInPath[0],
  );

  const { tree, requirements, name, image, boosts, disabled, power, npc } =
    selectedSkill;
  const { cooldown, points, tier } = requirements;
  const boostedCooldown = getSkillCooldown({
    cooldown: cooldown ?? 0,
    state,
    skillName: name as BumpkinRevampSkillName,
  });
  const { buff, debuff } = boosts;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(state);
  const { availableTier, totalUsedSkillPoints } = getUnlockedTierForTree(
    tree,
    bumpkin,
  );
  // Skill upgrades (rank stored as the skill value; undefined = not owned).
  const { upgrade } = selectedSkill;
  const level = bumpkin.skills[name as BumpkinRevampSkillName];
  const currentLevel = level ?? 0;
  const maxLevel = upgrade?.maxLevel ?? 1;
  const hasSelectedSkill = level !== undefined;
  const shardBalance = state.inventory["Ascension Shard"] ?? new Decimal(0);
  const upgradeCost = getSkillUpgradeCost(tier);

  // The three panel modes. Upgrades only exist behind ASCENSION_SKILLS, so
  // non-Crops trees and flag-off players resolve to Locked -> Maxed (no ranks).
  const upgradesEnabled = hasFeatureAccess(state, "ASCENSION_SKILLS");
  const canUpgradeHere = upgradesEnabled && !!upgrade;
  const isLocked = !hasSelectedSkill;
  const isUpgradable =
    hasSelectedSkill && canUpgradeHere && currentLevel < maxLevel;
  const isMaxed =
    hasSelectedSkill && (!canUpgradeHere || currentLevel >= maxLevel);
  const boostLabelType = isLocked ? "success" : "info";

  // Real per-rank boost copy (shown behind ASCENSION_SKILLS). The current-rank
  // description replaces the static boost text; the next-rank one previews the
  // upgrade reward. Cooldown skills (Instant Growth) keep their static boost
  // pill because the cooldown pill already shows the scaled number.
  const rankSkillName = isUpgradeableSkillName(name as BumpkinRevampSkillName)
    ? (name as UpgradeableSkillName)
    : undefined;
  const isRankSkill = canUpgradeHere && rankSkillName !== undefined;
  const rankKind = rankSkillName ? SKILL_RANKS[rankSkillName].kind : undefined;
  const currentRankDescription =
    isRankSkill && rankSkillName && rankKind !== "cooldown"
      ? getSkillRankDescription(rankSkillName, Math.max(currentLevel, 1), t)
      : undefined;
  const nextRankDescription =
    isRankSkill && rankSkillName && isUpgradable
      ? getSkillRankDescription(rankSkillName, currentLevel + 1, t)
      : undefined;

  const isUpgradeDisabled =
    shardBalance.lt(upgradeCost.shards) ||
    availableSkillPoints < upgradeCost.points ||
    readonly;
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

  const handleUpgrade = () => {
    setShowUpgradeConfirmation(false);
    gameService.send("skill.upgraded", { skill: name });

    gameAnalytics.trackMilestone({
      event: `Bumpkin:SkillUpgraded:${name}`,
    });
  };

  return (
    <SplitScreenView
      tallDesktopContent
      tallMobileContent
      wideModal
      panel={
        <div className="flex flex-col h-full justify-between">
          {/* Header + adaptive body */}
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
              <div className="flex items-center gap-1 sm:justify-center">
                <span className="sm:text-center">{name}</span>
                {isMaxed && (
                  <img
                    src={SUNNYSIDE.icons.confirm}
                    alt="owned"
                    style={{ width: `${PIXEL_SCALE * 8}px` }}
                  />
                )}
              </div>
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
                  type={boostLabelType}
                  icon={buff.boostTypeIcon}
                  secondaryIcon={buff.boostedItemIcon}
                  className="mb-2"
                >
                  {currentRankDescription?.buff ?? buff.shortDescription}
                </Label>
              )}
              {debuff && (
                <Label
                  type={debuff.labelType}
                  icon={debuff.boostTypeIcon}
                  secondaryIcon={debuff.boostedItemIcon}
                  className="mb-2"
                >
                  {currentRankDescription?.debuff ?? debuff.shortDescription}
                </Label>
              )}
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
              {disabled && (
                <Label type="danger" className="mb-2">
                  {t("skillTier.skillDisabled")}
                </Label>
              )}
            </div>

            {/* Rank track (any upgradable skill, incl. unclaimed) */}
            {canUpgradeHere && (
              <RankTrack level={currentLevel} maxLevel={maxLevel} />
            )}

            {/* Next-rank reward preview */}
            {isUpgradable && (
              <div className="flex flex-col mb-2">
                <Label
                  type="success"
                  icon={SUNNYSIDE.icons.powerup}
                  className="mb-1"
                >
                  {t("skill.rankReward", { rank: currentLevel + 1 })}
                </Label>
                <span className="text-xxs ml-1">
                  {nextRankDescription?.buff ?? t("skill.strengthensBoost")}
                </span>
                {nextRankDescription?.debuff && (
                  <span className="text-xxs ml-1">
                    {nextRankDescription.debuff}
                  </span>
                )}
              </div>
            )}

            {/* Fully-upgraded summary */}
            {isMaxed && canUpgradeHere && (
              <Label
                type="success"
                icon={SUNNYSIDE.icons.confirm}
                className="mb-2"
              >
                {t("skill.fullyUpgraded")}
              </Label>
            )}

            {/* Cost */}
            {isLocked && (
              <div className="flex flex-col items-start">
                <RequirementLabel
                  type="skillPoints"
                  points={availableSkillPoints}
                  requirement={points}
                  className="mb-2"
                  hideIcon={true}
                />
              </div>
            )}
            {isUpgradable && (
              <div className="flex flex-col items-start">
                <RequirementLabel
                  type="item"
                  item="Ascension Shard"
                  balance={shardBalance}
                  requirement={new Decimal(upgradeCost.shards)}
                  className="mb-2"
                />
                <RequirementLabel
                  type="skillPoints"
                  points={availableSkillPoints}
                  requirement={upgradeCost.points}
                  className="mb-2"
                  hideIcon={true}
                />
              </div>
            )}
          </div>

          {/* Claim button (Locked) */}
          {!readonly && isLocked && (
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
                  {t("skill.claim")}
                </Button>
              )}
            </div>
          )}

          {/* Upgrade button (Owned & upgradable) */}
          {!readonly && isUpgradable && (
            <div className="flex sm:flex-col w-full">
              {showUpgradeConfirmation ? (
                <>
                  <Button
                    className="mr-1 sm:mr-0"
                    onClick={() => setShowUpgradeConfirmation(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    className="sm:mt-1"
                    disabled={isUpgradeDisabled}
                    onClick={handleUpgrade}
                  >
                    {t("skill.upgradeToRank", { rank: currentLevel + 1 })}
                  </Button>
                </>
              ) : (
                <Button
                  disabled={isUpgradeDisabled}
                  onClick={() => setShowUpgradeConfirmation(true)}
                >
                  {t("skill.upgradeToRank", { rank: currentLevel + 1 })}
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
                        const skillLevel =
                          bumpkin.skills[
                            skill.name as BumpkinRevampSkillName
                          ] ?? 0;
                        // "Maxed" = at its top rank (upgradeable skills need the
                        // flag on to have ranks; otherwise owning it is maxed).
                        const skillMaxLevel =
                          upgradesEnabled && skill.upgrade
                            ? skill.upgrade.maxLevel
                            : 1;
                        const hasSkill = !!skillLevel;
                        const isSkillMaxed = skillLevel >= skillMaxLevel;
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
                              setShowUpgradeConfirmation(false);
                            }}
                            showOverlay={isSkillMaxed || !tierUnlocked}
                            overlayIcon={
                              <img
                                src={
                                  isSkillMaxed ||
                                  (!hasFeatureAccess(
                                    state,
                                    "ASCENSION_SKILLS",
                                  ) &&
                                    hasSkill)
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
                            count={
                              skill.upgrade && !!skillLevel
                                ? new Decimal(skillLevel)
                                : undefined
                            }
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
