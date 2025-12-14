import React from "react";

import sign from "assets/decorations/woodsign.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { useUsername, useFarmId } from "features/game/hooks";
import { useSelector } from "@xstate/react";
import { useGameService } from "features/game/hooks";
import { MachineState } from "features/game/lib/gameMachine";

const _nftId = (state: MachineState) => state.context.nftId;

export const Sign: React.FC = () => {
  const gameService = useGameService();
  const username = useUsername();
  const farmId = useFarmId();
  const nftId = useSelector(gameService, _nftId);

  return (
    <SFTDetailPopover name="Town Sign">
      <div
        style={{
          width: `${PIXEL_SCALE * 34}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1}px`,
        }}
        className="absolute"
      >
        <img src={sign} className="w-full" />
        <div
          className="flex flex-col absolute text-xxs w-full"
          style={{
            color: "#ead4aa",
            left: 0,
            top: "2px",
            textAlign: "center",
            textShadow: "1px 1px #723e39",
          }}
        >
          <p className="text-xxs mt-2 font-pixel">
            {username ?? `#${nftId}` ?? `#${farmId}`}
          </p>
        </div>
      </div>
    </SFTDetailPopover>
  );
};
