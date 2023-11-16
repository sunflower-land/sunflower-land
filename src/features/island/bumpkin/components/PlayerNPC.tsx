import React, { useContext } from "react";
import { useState } from "react";
import { NPC, NPCProps } from "./NPC";
import { NPCModal } from "./NPCModal";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";

const _showHelper = (state: MachineState) =>
  // First Mashed Potato
  (state.context.state.bumpkin?.experience === 0 &&
    state.context.state.inventory["Mashed Potato"]?.gte(1)) ||
  // First Pumpkin Soup
  (getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) <= 3 &&
    state.context.state.inventory["Pumpkin Soup"]?.gte(1));

export const PlayerNPC: React.FC<NPCProps> = ({ parts: bumpkinParts }) => {
  const [open, setOpen] = useState(false);
  const { gameService } = useContext(Context);

  const showHelper = useSelector(gameService, _showHelper);

  return (
    <>
      <NPC
        key={JSON.stringify(bumpkinParts)}
        parts={bumpkinParts}
        onClick={() => setOpen(true)}
      />

      {showHelper && (
        <img
          className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
          src={SUNNYSIDE.icons.click_icon}
          onClick={() => setOpen(true)}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * 20}px`,
          }}
        />
      )}

      <NPCModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};
