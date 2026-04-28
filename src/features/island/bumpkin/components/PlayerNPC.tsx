import React, { useContext } from "react";
import { useState } from "react";
import { NPCPlaceable, NPCProps } from "./NPC";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { useVisiting } from "lib/utils/visitUtils";
import { Context as AuthContext } from "features/auth/lib/Provider";
import {
  playerModalManager,
  PlayerModalPlayer,
} from "features/social/lib/playerModalManager";
import { hasFeatureAccess } from "lib/flags";
import { PlayerModal } from "features/social/PlayerModal";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { Discovery } from "features/social/Discovery";
import { Modal } from "components/ui/Modal";
import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { Bumpkin } from "features/game/types/game";

const _showHelper = (state: MachineState) =>
  // First Rhubarb Tart
  (state.context.state.bumpkin?.experience === 0 &&
    state.context.state.inventory["Rhubarb Tart"]?.gte(1)) ||
  // First Pumpkin Soup
  (getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) <= 3 &&
    state.context.state.inventory["Pumpkin Soup"]?.gte(1));
const _token = (state: AuthMachineState) => state.context.user.rawToken ?? "";
const _isLandscaping = (state: MachineState) => state.matches("landscaping");
const _gameState = (state: MachineState) => state.context.state;

export const PlayerNPC: React.FC<NPCProps> = ({ parts: bumpkinParts }) => {
  const [open, setOpen] = useState(false);
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const showHelper = useSelector(gameService, _showHelper);
  const token = useSelector(authService, _token);
  const isLandscaping = useSelector(gameService, _isLandscaping);
  const gameState = useSelector(gameService, _gameState);
  const { isVisiting } = useVisiting();
  const context = gameService.getSnapshot().context;
  const loggedInFarmId = context.visitorId ?? context.farmId;

  const hasAirdropAccess = hasFeatureAccess(
    context.visitorState ?? context.state,
    "AIRDROP_PLAYER",
  );

  const handleClick = () => {
    if (isLandscaping) return;

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

      <Modal show={open} onHide={() => setOpen(false)} size="lg">
        <BumpkinModal
          initialTab="feed"
          onClose={() => setOpen(false)}
          bumpkin={gameState.bumpkin as Bumpkin}
          inventory={gameState.inventory}
          readonly={false}
          gameState={gameState}
        />
      </Modal>
      <PlayerModal
        loggedInFarmId={loggedInFarmId}
        token={token}
        hasAirdropAccess={hasAirdropAccess}
      />
      <Discovery />
    </>
  );
};
