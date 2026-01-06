import React, { type JSX } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import tradeOffs from "src/assets/icons/tradeOffs.png";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { getRemainingReels } from "features/game/events/landExpansion/castRod";
import { BuffLabel } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillName,
  BumpkinSkillRevamp,
} from "features/game/types/bumpkinSkills";
import { getImageUrl } from "lib/utils/getImageURLS";
import {
  INNER_CANVAS_WIDTH,
  SkillBox,
} from "features/bumpkins/components/revamp/SkillBox";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";

interface BoostReelItem {
  location: string;
  buff: BuffLabel[];
}

const BoostReelItems: (
  state: GameState,
) => Partial<
  Record<BumpkinItem | CollectibleName | BumpkinRevampSkillName, BoostReelItem>
> = (state) => ({
  "Reelmaster's Chair": {
    buff: COLLECTIBLE_BUFF_LABELS["Reelmaster's Chair"]?.({
      skills: state.bumpkin.skills,
      collectibles: state.collectibles,
    }) as BuffLabel[],
    location: "Marketplace",
  },
  "Angler Waders": {
    buff: BUMPKIN_ITEM_BUFF_LABELS["Angler Waders"] as BuffLabel[],
    location: "Expert Angler Achievement",
  },
  "Fisherman's 5 Fold": {
    buff: [BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 5 Fold"].boosts.buff],
    location: "Fishing Skill Tree",
  },
  "Fisherman's 10 Fold": {
    buff: [BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 10 Fold"].boosts.buff],
    location: "Fishing Skill Tree",
  },
  "More With Less": {
    buff: Object.values(BUMPKIN_REVAMP_SKILL_TREE["More With Less"].boosts),
    location: "Fishing Skill Tree",
  },
  "Saw Fish": {
    buff: BUMPKIN_ITEM_BUFF_LABELS["Saw Fish"] as BuffLabel[],
    location: "Stella's Megastore",
  },
});

const isWearable = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): item is BumpkinItem => {
  return getKeys(ITEM_IDS).includes(item as BumpkinItem);
};

const isSkill = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): item is BumpkinRevampSkillName =>
  getKeys(BUMPKIN_REVAMP_SKILL_TREE).includes(item as BumpkinRevampSkillName);

const getItemImage = (item: BumpkinItem | CollectibleName): string => {
  if (!item) return "";

  if (isWearable(item)) {
    return getImageUrl(ITEM_IDS[item]);
  }

  return ITEM_DETAILS[item].image;
};

const getItemIcon = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): JSX.Element => {
  if (isSkill(item)) {
    const { tree, image, boosts, requirements, npc, power } =
      BUMPKIN_REVAMP_SKILL_TREE[item] as BumpkinSkillRevamp;
    const { tier } = requirements;
    const { boostedItemIcon, boostTypeIcon } = boosts.buff;
    return (
      <SkillBox
        className="mb-1"
        image={getSkillImage(image, boostedItemIcon, tree)}
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
        tier={tier}
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
  } else {
    return (
      <div
        className={"bg-brown-600 relative"}
        style={{
          width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          ...pixelDarkBorderStyle,
        }}
      >
        {isCollectible(item) && (
          <img
            src={SUNNYSIDE.ui.grey_background}
            className="w-full h-full absolute inset-0 rounded-md"
          />
        )}
        <SquareIcon icon={getItemImage(item)} width={INNER_CANVAS_WIDTH} />
      </div>
    );
  }
};

export const FishermanExtras: React.FC<{
  state: GameState;
}> = ({ state }) => {
  const { t } = useAppTranslation();

  const reelsLeft = getRemainingReels(state);
  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between space-x-1 mb-1">
          <Label type="default">{t("fishing.extraReels")}</Label>
          <Label
            type={reelsLeft <= 0 ? "danger" : "default"}
            icon={SUNNYSIDE.tools.fishing_rod}
          >
            {reelsLeft === 1
              ? t("fishing.oneReelLeft")
              : t("fishing.reelsLeft", { reelsLeft })}
          </Label>
        </div>
        <span className="flex text-xs ml-1 my-2">
          {t("fishing.lookingMoreReels")}
        </span>
      </InnerPanel>
      <InnerPanel className="flex flex-col mb-1 overflow-y-scroll overflow-x-hidden scrollable max-h-[330px]">
        {Object.entries(BoostReelItems(state)).map(([name, item]) => (
          <div key={name} className="flex -ml-1">
            {getItemIcon(
              name as BumpkinItem | CollectibleName | BumpkinRevampSkillName,
            )}
            <div className="flex flex-col justify-center space-y-1">
              <div className="flex flex-col space-y-0.5">
                <span className="text-xs">{name}</span>
                <span className="text-xxs italic">{item.location}</span>
              </div>
              <div className="flex flex-col gap-1 mr-2">
                {item.buff.map((buff, index) => (
                  <Label
                    key={index}
                    type={buff.labelType}
                    icon={buff.boostTypeIcon}
                    secondaryIcon={buff.boostedItemIcon}
                  >
                    {buff.shortDescription}
                  </Label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </InnerPanel>
    </>
  );
};
