import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import React, { useContext } from "react";
import { RoundButton } from "components/ui/RoundButton";

export const LandscapeButton: React.FC = () => {
  const button = useSound("button");
  const { gameService } = useContext(Context);

  return (
    <div
      className="absolute sm:-mt-8"
      style={{
        marginLeft: `${PIXEL_SCALE * 2}px`,
        marginBottom: `${PIXEL_SCALE * 25}px`,
        right: `${PIXEL_SCALE * 3}px`,
        top: `${PIXEL_SCALE * 43}px`,
      }}
    >
      <RoundButton
        onClick={() => {
          button.play();
          gameService.send("LANDSCAPE");
        }}
      >
        <img
          src={SUNNYSIDE.icons.drag}
          className="absolute group-active:translate-y-[2px]"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 4}px`,
            width: `${PIXEL_SCALE * 14}px`,
          }}
        />
      </RoundButton>
    </div>
  );
};
