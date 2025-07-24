import React, { useContext } from "react";
import { useState } from "react";
import { NPCPlaceable, NPCProps } from "./NPC";
import { NPCModal } from "./NPCModal";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { PlayerModals } from "features/world/ui/player/PlayerModals";
import { useVisiting } from "lib/utils/visitUtils";
import { Context as AuthContext } from "features/auth/lib/Provider";
import {
  playerModalManager,
  PlayerModalPlayer,
} from "features/social/lib/playerModalManager";
import { hasFeatureAccess } from "lib/flags";
import { PlayerModal } from "features/social/PlayerModal";
import { AuthMachineState } from "features/auth/lib/authMachine";

const _showHelper = (state: MachineState) =>
  // First Mashed Potato
  (state.context.state.bumpkin?.experience === 0 &&
    state.context.state.inventory["Mashed Potato"]?.gte(1)) ||
  // First Pumpkin Soup
  (getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) <= 3 &&
    state.context.state.inventory["Pumpkin Soup"]?.gte(1));
const _token = (state: AuthMachineState) => state.context.user.rawToken ?? "";

export const PlayerNPC: React.FC<NPCProps> = ({ parts: bumpkinParts }) => {
  const [open, setOpen] = useState(false);
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const showHelper = useSelector(gameService, _showHelper);
  const token = useSelector(authService, _token);

  const { isVisiting } = useVisiting();
  const context = gameService.getSnapshot().context;

  const handleClick = () => {
    if (isVisiting) {
      const playerData: PlayerModalPlayer = {
        farmId: context.farmId,
        username: context.state.username ?? "",
        clothing: context.state.bumpkin?.equipped ?? bumpkinParts,
        experience: context.state.bumpkin?.experience ?? 0,
        faction: context.state.faction?.name,
      };
      playerModalManager.open(playerData);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <NPCPlaceable
        key={JSON.stringify(bumpkinParts)}
        parts={bumpkinParts}
        onClick={handleClick}
      />

      {showHelper && (
        <img
          className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
          src={SUNNYSIDE.icons.click_icon}
          onClick={handleClick}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * 20}px`,
          }}
        />
      )}

      <NPCModal isOpen={open} onClose={() => setOpen(false)} />
      {hasFeatureAccess(context.state, "SOCIAL_FARMING") ? (
        <PlayerModal
          game={context.state}
          farmId={context.farmId}
          token={token}
        />
      ) : (
        <PlayerModals
          game={context.state}
          farmId={context.farmId}
          isOpen={open}
        />
      )}
    </>
  );
};
