import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import React, { useContext } from "react";
import { RoundButton } from "components/ui/RoundButton";
import type { PlaceableLocation } from "features/game/types/collectibles";

/**
 * `location` keys the landscaping draft to this surface. Without it the
 * sandbox never engages: every edit goes live and Cancel has nothing to
 * revert - which is exactly what players reported.
 */
export const LandscapeButton: React.FC<{ location: PlaceableLocation }> = ({
  location,
}) => {
  const button = useSound("button");
  const { gameService } = useContext(Context);

  return (
    <RoundButton
      onClick={() => {
        button.play();
        gameService.send({ type: "LANDSCAPE", location });
      }}
    >
      <img
        src={SUNNYSIDE.tools.hammer}
        className="absolute group-active:translate-y-[2px]"
        style={{
          top: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 4}px`,
          width: `${PIXEL_SCALE * 14}px`,
        }}
      />
    </RoundButton>
  );
};
