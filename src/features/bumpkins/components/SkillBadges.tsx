import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SKILL_TREE } from "features/game/types/skills";
import { setImageWidth } from "lib/images";

export const SkillBadges: React.FC<{ inventory: Inventory }> = ({
  inventory,
}) => {
  const BADGES: InventoryItemName[] = Object.keys(SKILL_TREE).map(
    (badge) => badge as InventoryItemName
  );

  const badges = BADGES.map((badge) => {
    if (inventory[badge]) {
      return (
        <img
          key={badge}
          src={ITEM_DETAILS[badge].image}
          alt={badge}
          style={{
            opacity: 0,
            marginRight: `${PIXEL_SCALE * 2}px`,
            marginBottom: `${PIXEL_SCALE * 2}px`,
          }}
          onLoad={(e) => setImageWidth(e.currentTarget)}
        />
      );
    }

    return null;
  }).filter(Boolean);

  if (badges.length === 0) {
    return null;
  }

  return <div className="flex flex-wrap items-center">{badges}</div>;
};
