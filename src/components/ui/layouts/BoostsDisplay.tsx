import { SUNNYSIDE } from "assets/sunnyside";
import { KNOWN_IDS } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinSkillRevamp,
} from "features/game/types/bumpkinSkills";
import { BoostName, InventoryItemName } from "features/game/types/game";
import { GameState } from "features/game/types/game";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { AnimatedPanel } from "features/world/ui/AnimatedPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { Label } from "../Label";
import { CALENDAR_EVENT_ICONS } from "features/game/types/calendar";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";

export const BoostsDisplay: React.FC<{
  boosts: { name: BoostName; value: string }[];
  show: boolean;
  state: GameState;
  onClick: () => void;
  leadingRow?: { label: string };
}> = ({ boosts, show, state, onClick, leadingRow }) => {
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

  const getBoostIcon = (boost: BoostName) => {
    if (boost === "Power hour") {
      return SUNNYSIDE.icons.lightning;
    }

    if (boost === "sunshower") {
      return CALENDAR_EVENT_ICONS.sunshower;
    }

    if (boost === "VIP Access" || boost === "Faction Pet") {
      return SUNNYSIDE.icons.lightning;
    }

    if (isBumpkinSkill(boost)) {
      const {
        image,
        tree,
        boosts: {
          buff: { boostedItemIcon },
        },
      } = BUMPKIN_REVAMP_SKILL_TREE[boost] as BumpkinSkillRevamp;

      return getSkillImage(image, boostedItemIcon, tree);
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

    const budId = Number(boost.split("#")[1]);
    if (isNaN(budId)) return undefined;

    return `https://${budImageDomain}.sunflower-land.com/images/${budId}.webp`;
  };

  return (
    <AnimatedPanel
      show={show}
      onClick={onClick}
      onBackdropClick={onClick}
      className="flex flex-col gap-1 max-h-5"
    >
      <div className="overflow-y-auto scrollable max-h-[200px]">
        <div className="flex space-x-1 mb-1">
          <img src={SUNNYSIDE.icons.lightning} alt="Boost" className="w-3" />
          <span className="text-xs whitespace-nowrap">
            {t("faction.boostsApplied")}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {leadingRow && (
            <Label
              type="transparent"
              icon={SUNNYSIDE.icons.stopwatch}
              className="ml-3"
            >
              {leadingRow.label}
            </Label>
          )}
          {boosts.map((buff) => (
            <Label
              key={`${buff.name}-${buff.value}`}
              type="transparent"
              icon={getBoostIcon(buff.name)}
              className="ml-3"
            >
              {`${buff.value} ${buff.name}`}
            </Label>
          ))}
        </div>
      </div>
    </AnimatedPanel>
  );
};
