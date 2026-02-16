import React, { useContext } from "react";

import sign from "assets/decorations/woodsign.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { CollectibleProps } from "../Collectible";

const _username = (state: MachineState) => state.context.state.username;
const _nftId = (state: MachineState) => state.context.nftId;
const _farmId = (state: MachineState) => state.context.farmId;

export const Sign: React.FC<CollectibleProps> = ({ index }) => {
  const { gameService } = useContext(Context);

  const username = useSelector(gameService, _username);
  const nftId = useSelector(gameService, _nftId);
  const farmId = useSelector(gameService, _farmId);

  const displayName = (index: number) => {
    if (index === 0 && username) return username;
    if ((index === 0 || index === 1) && nftId) return `#${nftId}`;
    return `#${farmId}`;
  };

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
          <p className="text-xxs mt-2 font-pixel">{displayName(index)}</p>
        </div>
      </div>
    </SFTDetailPopover>
  );
};
