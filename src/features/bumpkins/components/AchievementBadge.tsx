import React, { useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { InnerPanel } from "components/ui/Panel";
import { AchievementName } from "features/game/types/achievements";
import { Box } from "components/ui/Box";
import { detectMobile } from "lib/utils/hooks/useIsMobile";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const AchievementBadge: React.FC<{
  achievement: AchievementName;
}> = ({ achievement }) => {
  const image = ITEM_DETAILS[achievement].image;
  const name = achievement;
  const description = ITEM_DETAILS[achievement].description;

  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = detectMobile();

  return (
    <div key={achievement} className="relative">
      <div
        className="flex justify-center m-1"
        style={{
          height: `${PIXEL_SCALE * 19}px`,
          width: `${PIXEL_SCALE * 18}px`,
          margin: `${PIXEL_SCALE * 1.5}px`,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Box image={image} />
      </div>
      {!isMobile && showTooltip && (
        <InnerPanel
          className={"absolute top-100 w-64 left-0 z-50 pointer-events-none"}
        >
          <div className="mx-1 p-1">
            <h2 className="text-xs text-amber-400">{name}</h2>
            <p className="text-xxs">{description}</p>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
