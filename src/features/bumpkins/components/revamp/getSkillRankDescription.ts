import { millisecondsToString } from "lib/utils/time";
import type { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  SKILL_RANKS,
  GOLDEN_SUNFLOWER_DISPLAY,
  type UpgradeableSkillName,
} from "features/game/types/bumpkinSkills";

/**
 * Human-readable boost description for a specific rank of an upgradeable skill.
 * Returns the buff sentence (and a debuff sentence for Acre/Hectare),
 * interpolating the real per-rank value from SKILL_RANKS so the panel can
 * show concrete numbers. `rank` is 1-based (1..maxLevel). `t` is the caller's
 * translation function (passed in rather than using the global singleton so the
 * render stays deterministic from React's / the compiler's perspective).
 */
export const getSkillRankDescription = (
  name: UpgradeableSkillName,
  rank: number,
  t: ReturnType<typeof useAppTranslation>["t"],
): { buff: string; debuff?: string } => {
  const i = rank - 1;

  switch (name) {
    case "Green Thumb":
      return {
        buff: t("skill.greenThumb.ranked", {
          value: SKILL_RANKS["Green Thumb"].ranks[i],
        }),
      };
    case "Strong Roots":
      return {
        buff: t("skill.strongRoots.ranked", {
          value: SKILL_RANKS["Strong Roots"].ranks[i],
        }),
      };
    case "Young Farmer":
      return {
        buff: t("skill.youngFarmer.ranked", {
          value: SKILL_RANKS["Young Farmer"].ranks[i],
        }),
      };
    case "Experienced Farmer":
      return {
        buff: t("skill.experiencedFarmer.ranked", {
          value: SKILL_RANKS["Experienced Farmer"].ranks[i],
        }),
      };
    case "Old Farmer":
      return {
        buff: t("skill.oldFarmer.ranked", {
          value: SKILL_RANKS["Old Farmer"].ranks[i],
        }),
      };
    case "Betty's Friend":
      return {
        buff: t("skill.bettysFriend.ranked", {
          value: SKILL_RANKS["Betty's Friend"].ranks[i] * 100,
        }),
      };
    case "Coin Swindler":
      return {
        buff: t("skill.coinSwindler.ranked", {
          value: SKILL_RANKS["Coin Swindler"].ranks[i] * 100,
        }),
      };
    case "Golden Sunflower":
      return {
        buff: t("skill.goldenSunflower.ranked", {
          value: GOLDEN_SUNFLOWER_DISPLAY[i],
        }),
      };
    case "Chonky Scarecrow": {
      const { depth } = SKILL_RANKS["Chonky Scarecrow"].ranks[i];
      return {
        buff: t("skill.chonkyScarecrow.ranked", {
          size: `${depth}x${depth}`,
        }),
      };
    }
    case "Horror Mike": {
      const { depth } = SKILL_RANKS["Horror Mike"].ranks[i];
      return {
        buff: t("skill.horrorMike.ranked", {
          size: `${depth}x${depth}`,
        }),
      };
    }
    case "Laurie's Gains": {
      const { depth } = SKILL_RANKS["Laurie's Gains"].ranks[i];
      return {
        buff: t("skill.lauriesGains.ranked", {
          size: `${depth}x${depth}`,
        }),
      };
    }
    case "Instant Growth":
      return {
        buff: t("skill.instantGrowth.ranked", {
          value: millisecondsToString(SKILL_RANKS["Instant Growth"].ranks[i], {
            length: "short",
            isShortFormat: true,
            removeTrailingZeros: true,
          }),
        }),
      };
    case "Acre Farm":
      return {
        buff: t("skill.acreFarm.buff.ranked", {
          value: SKILL_RANKS["Acre Farm"].buff[i],
        }),
        debuff: t("skill.acreFarm.debuff.ranked", {
          value: SKILL_RANKS["Acre Farm"].debuff[i],
        }),
      };
    case "Hectare Farm":
      return {
        buff: t("skill.hectareFarm.buff.ranked", {
          value: SKILL_RANKS["Hectare Farm"].buff[i],
        }),
        debuff: t("skill.hectareFarm.debuff.ranked", {
          value: SKILL_RANKS["Hectare Farm"].debuff[i],
        }),
      };
    case "Lumberjack's Extra":
      return {
        buff: t("skill.lumberjacksExtra.ranked", {
          value: SKILL_RANKS["Lumberjack's Extra"].ranks[i],
        }),
      };
    case "Tree Charge":
      return {
        buff: t("skill.treeCharge.ranked", {
          value: SKILL_RANKS["Tree Charge"].ranks[i],
        }),
      };
    case "More Axes":
      return {
        buff: t("skill.moreAxes.ranked", {
          value: SKILL_RANKS["More Axes"].ranks[i],
        }),
      };
    case "Tough Tree":
      return {
        buff: t("skill.toughTree.ranked", {
          value: SKILL_RANKS["Tough Tree"].ranks[i],
        }),
      };
    case "Feller's Discount":
      return {
        buff: t("skill.fellersDiscount.ranked", {
          value: SKILL_RANKS["Feller's Discount"].ranks[i],
        }),
      };
    case "Money Tree":
      return {
        buff: t("skill.moneyTree.ranked", {
          value: SKILL_RANKS["Money Tree"].ranks[i],
        }),
      };
    case "Tree Turnaround":
      return {
        buff: t("skill.treeTurnaround.ranked", {
          value: SKILL_RANKS["Tree Turnaround"].ranks[i],
        }),
      };
    case "Tree Blitz":
      return {
        buff: t("skill.treeBlitz.ranked", {
          value: millisecondsToString(SKILL_RANKS["Tree Blitz"].ranks[i], {
            length: "short",
            isShortFormat: true,
            removeTrailingZeros: true,
          }),
        }),
      };
  }
};
