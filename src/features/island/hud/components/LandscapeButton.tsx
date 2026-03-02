import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import React, { useContext } from "react";
import { RoundButton } from "components/ui/RoundButton";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

const needsHelp = (state: MachineState) => {
  const missingScarecrow =
    !state.context.state.inventory["Basic Scarecrow"] &&
    (state.context.state.farmActivity?.["Sunflower Planted"] ?? 0) >= 6;

  return missingScarecrow;
};

export const LandscapeButton: React.FC = () => {
  const button = useSound("button");
  const { gameService } = useContext(Context);

  const showHelper = useSelector(gameService, needsHelp);

  return (
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

      {showHelper && (
        <div
          className="absolute z-40"
          style={{
            left: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * 20}px`,
            transform: "scaleX(-1)",
          }}
        >
          <img
            className="cursor-pointer group-hover:img-highlight animate-pulsate"
            src={SUNNYSIDE.icons.click_icon}
            style={{ width: `${PIXEL_SCALE * 18}px`, display: "block" }}
          />
        </div>
      )}
    </RoundButton>
  );
};
