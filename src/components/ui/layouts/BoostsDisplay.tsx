import { SUNNYSIDE } from "assets/sunnyside";
import { KNOWN_IDS, BuffLabel } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinSkillRevamp,
} from "features/game/types/bumpkinSkills";
import { BoostName, InventoryItemName } from "features/game/types/game";
import { GameState } from "features/game/types/game";
import { getItemBuffs } from "features/game/types/getItemBuffs";
import { LEGACY_BADGE_TREE, LegacyBadgeName } from "features/game/types/skills";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { AnimatedPanel } from "features/world/ui/AnimatedPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { Label } from "../Label";

export const BoostsDisplay: React.FC<{
  boosts: BoostName[];
  show: boolean;
  state: GameState;
  onClick: () => void;
}> = ({ boosts, show, state, onClick }) => {
  const { t } = useAppTranslation();
  const isBumpkinSkill = (
    boost: BoostName,
  ): boost is BumpkinRevampSkillName => {
    return boost in BUMPKIN_REVAMP_SKILL_TREE;
  };

  const isCollectible = (boost: BoostName): boost is InventoryItemName => {
    return boost in KNOWN_IDS;
  };
  const isWearable = (boost: BoostName): boost is BumpkinItem => {
    return boost in ITEM_IDS;
  };

  const buffs: (BuffLabel & { boost: BoostName })[] = boosts.flatMap(
    (boost): (BuffLabel & { boost: BoostName })[] => {
      if (isBumpkinSkill(boost)) {
        return [
          {
            ...BUMPKIN_REVAMP_SKILL_TREE[boost].boosts.buff,
            boost,
          },
        ];
      }

      if (boost in LEGACY_BADGE_TREE) {
        return (
          (LEGACY_BADGE_TREE[boost as LegacyBadgeName].buff ??
            []) as BuffLabel[]
        ).map((buff) => ({
          ...buff,
          boost,
        }));
      }

      const collection = isCollectible(boost)
        ? "collectibles"
        : isWearable(boost)
          ? "wearables"
          : "buds";

      return getItemBuffs({
        state,
        item: boost,
        collection,
      }).map((buff) => ({
        ...buff,
        boost,
      }));
    },
  );

  const getBoostIcon = (boost: BoostName) => {
    if (isBumpkinSkill(boost)) {
      return (BUMPKIN_REVAMP_SKILL_TREE[boost] as BumpkinSkillRevamp).image;
    }

    if (isCollectible(boost)) {
      return getTradeableDisplay({
        id: KNOWN_IDS[boost],
        type: "collectibles",
        state,
      }).image;
    }

    if (isWearable(boost)) {
      return getTradeableDisplay({
        id: ITEM_IDS[boost],
        type: "wearables",
        state,
      }).image;
    }

    return getTradeableDisplay({
      id: Number(boost.split("#")[1]),
      type: "buds",
      state,
    }).image;
  };

  return (
    <AnimatedPanel show={show} onClick={onClick}>
      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto scrollable">
        <div className="flex space-x-1 mb-1">
          <img src={SUNNYSIDE.icons.lightning} alt="Boost" className="w-3" />
          <span className="text-xs whitespace-nowrap">
            {t("faction.boostsApplied")}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-1 gap-y-0">
          {buffs.map((buff) => (
            <Label
              key={buff.shortDescription}
              type={"transparent"}
              icon={getBoostIcon(buff.boost)}
              className="ml-3"
            >
              {buff.shortDescription}
            </Label>
          ))}
        </div>
      </div>
    </AnimatedPanel>
  );
};
