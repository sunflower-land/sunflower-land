import React, { useContext, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { Player } from "../ModerationTools";
import { Button } from "components/ui/Button";

import { KickPopUp } from "./Kick";
import { MutePopUp } from "./Mute";

import HaloIcon from "assets/sfts/halo.png";

type Props = {
  scene?: any;
  players: Player[];
};

export const PlayerList: React.FC<Props> = ({ scene, players }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const [showKickPopUp, setShowKickPopUp] = useState(false);
  const [showMutePopUp, setShowMutePopUp] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const toggleKickPopUp = (player: Player) => {
    setSelectedPlayer(player);
    setShowKickPopUp(!showKickPopUp);
  };

  const toggleMutePopUp = (player: Player) => {
    setSelectedPlayer(player);
    setShowMutePopUp(!showMutePopUp);
  };

  const isModerator = (player: Player) => {
    if (player.clothing.hat === "Halo") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <KickPopUp
        show={showKickPopUp}
        onClose={() => setShowKickPopUp(false)}
        player={selectedPlayer}
        authState={authState.context.user}
      />
      <MutePopUp
        show={showMutePopUp}
        onClose={() => setShowMutePopUp(false)}
        player={selectedPlayer}
        authState={authState.context.user}
      />

      <div className="flex items-start gap-2 ml-1 mt-2 h-96 overflow-y-scroll scrollable">
        <table className="w-full text-xs table-fixed">
          <thead className="text-sm">
            <tr>
              <th className="w-1/4">Player ID</th>
              <th className="w-1/4">Farm ID</th>
              <th className="w-1/4">Status</th>
              <th className="w-1/2">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              return (
                <tr key={player.playerId}>
                  <td className="w-1/4">
                    <div className="flex items-center gap-1">
                      <span>{player.playerId}</span>
                      {isModerator(player) && (
                        <img src={HaloIcon} className="h-4" />
                      )}
                    </div>
                  </td>
                  <td className="w-1/4">{player.farmId}</td>
                  <td className="w-1/4">Not Muted</td>
                  {/* TODO: Once Mute is out, display if a player in the is muted and their time left */}
                  <td className="w-1/2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          scene.teleportModerator(player.x, player.y);
                        }}
                      >
                        TP
                      </Button>
                      <Button
                        disabled={isModerator(player)}
                        onClick={() => {
                          toggleKickPopUp(player);
                        }}
                      >
                        Kick
                      </Button>
                      <Button
                        disabled={isModerator(player)}
                        onClick={() => {
                          toggleMutePopUp(player);
                        }}
                      >
                        Mute
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end m-1">
        <span className="text-xs">{players.length}/150 Players Connected</span>
      </div>
    </>
  );
};
