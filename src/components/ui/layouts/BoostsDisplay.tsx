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
import { translate } from "lib/i18n/translate";
import {
  CALENDAR_EVENT_ICONS,
  getActiveGuardian,
} from "features/game/types/calendar";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import { AdditionalBoostInfoBuffLabel } from "features/game/types/collectibleItemBuffs";
import { getFactionPetBoostMultiplier } from "features/game/lib/factions";

export const BoostsDisplay: React.FC<{
  boosts: BoostName[];
  show: boolean;
  state: GameState;
  onClick: () => void;
  searchBoostInfo: {
    boostType: "time" | "yield" | "other" | "xp";
    boostOn?: (
      | "crops"
      | "flowers"
      | "fruits"
      | "greenhouse"
      | "crop machine"
      | "food"
      | undefined
    )[];
  };
  /** Optional row rendered inside the panel before the boost list (e.g. building oil) */
  leadingRow?: { label: string };
}> = ({
  boosts,
  show,
  state,
  onClick,
  searchBoostInfo: { boostType, boostOn },
  leadingRow,
}) => {
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

  const buffs: (AdditionalBoostInfoBuffLabel & { boost: BoostName })[] =
    boosts.flatMap(
      (boost): (AdditionalBoostInfoBuffLabel & { boost: BoostName })[] => {
        if (boost === "Power hour") {
          return [
            {
              shortDescription: translate("description.powerHour.boost"),
              labelType: "info",
              boostTypeIcon: SUNNYSIDE.icons.stopwatch,
              boost,
              boostType: "time",
              boostValue: "-50%",
              boostOn: "crops",
            },
          ];
        }

        if (boost === "Sunshower") {
          const { activeGuardian } = getActiveGuardian({
            game: state,
          });

          if (activeGuardian && boosts.includes(activeGuardian)) {
            return [
              {
                shortDescription: translate(
                  "description.sunshower.guardianBoost",
                  {
                    guardian: activeGuardian,
                  },
                ),
                labelType: "success",
                boostTypeIcon: SUNNYSIDE.icons.lightning,
                boost,
                boostType: "time",
                boostValue: "-75%",
                boostOn: "crops",
              },
            ];
          }

          return [
            {
              shortDescription: translate("description.sunshower.boost"),
              labelType: "success",
              boostTypeIcon: SUNNYSIDE.icons.lightning,
              boost,
              boostType: "time",
              boostValue: "-50%",
              boostOn: "crops",
            },
          ];
        }

        if (boost === "VIP Access") {
          return [
            {
              shortDescription: translate("description.vipAccess.foodXpBoost"),
              labelType: "success",
              boostTypeIcon: SUNNYSIDE.icons.lightning,
              boost,
              boostType: "xp",
              boostValue: "+10%",
              boostOn: "food",
            },
          ];
        }

        if (boost === "Faction Pet") {
          const multiplier = getFactionPetBoostMultiplier(state);
          const percent = Math.round((multiplier - 1) * 100);
          return [
            {
              shortDescription: translate("description.factionPet.foodXpBoost"),
              labelType: "success",
              boostTypeIcon: SUNNYSIDE.icons.lightning,
              boost,
              boostType: "xp",
              boostValue: `+${percent}%`,
              boostOn: "food",
            },
          ];
        }

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
    if (boost === "Power hour") {
      return SUNNYSIDE.icons.lightning;
    }

    if (boost === "Sunshower") {
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
      <div className="overflow-y-auto scrollable min-w-36 max-h-52 py-1 px-0.5">
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
          {buffs
            .filter((buff) => {
              const matchesBoostOn = boostOn
                ? boostOn.includes(buff.boostOn)
                : true;
              return buff.boostType === boostType && matchesBoostOn;
            })
            .map((buff) => (
              <Label
                key={`${buff.boost}-${buff.shortDescription}`}
                type="transparent"
                icon={getBoostIcon(buff.boost)}
                className="ml-3"
              >
                {buff.boostValue
                  ? `${buff.boostValue} ${buff.boost}`
                  : buff.shortDescription}
              </Label>
            ))}
        </div>
      </div>
    </AnimatedPanel>
  );
};
