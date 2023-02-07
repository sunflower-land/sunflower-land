import React, { useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  BUMPKIN_SKILL_TREE,
  BumpkinSkillName,
} from "features/game/types/bumpkinSkills";
import { InventoryItemName } from "features/game/types/game";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { detectMobile } from "lib/utils/hooks/useIsMobile";
import { Box } from "components/ui/Box";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SkillBadge: React.FC<{
  skill?: BumpkinSkillName | undefined;
  item?: InventoryItemName | undefined;
}> = ({ skill, item }) => {
  let image = null;
  let name = "";
  let description = "";
  let titleColor = "text-white";
  if (skill !== undefined) {
    image = BUMPKIN_SKILL_TREE[skill].image;
    name = BUMPKIN_SKILL_TREE[skill].name;
    description = BUMPKIN_SKILL_TREE[skill].boosts;
  } else if (item !== undefined) {
    image = ITEM_DETAILS[item].image;
    name = item;
    description = ITEM_DETAILS[item].description;
    titleColor = "text-amber-500";
  }

  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = detectMobile();

  return (
    <div
      key={skill}
      className="relative flex justify-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        height: `${PIXEL_SCALE * 19}px`,
        width: `${PIXEL_SCALE * 18}px`,
        margin: `${PIXEL_SCALE * 1.5}px`,
      }}
    >
      <Box image={image} className={"m-0"} />
      {!isMobile && showTooltip && (
        <InnerPanel
          className={"absolute top-100 w-64 left-0 z-50 pointer-events-none"}
        >
          <div className="mx-1 p-1">
            <h2 className={classNames("text-xs", titleColor)}>{name}</h2>
            <p className="text-xxs">{description}</p>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
