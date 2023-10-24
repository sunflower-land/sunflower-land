import React, { useState } from "react";
import { Player } from "../ModerationTools";
import { Button } from "components/ui/Button";

import { KickModal } from "../components/Kick";
import { MuteModal } from "../components/Mute";
import { UnMuteModal } from "../components/Unmute";

import HaloIcon from "assets/sfts/halo.png";
import { calculateMuteTime } from "../components/Muted";

import { mutePlayer } from "features/world/lib/moderationAction";

type Props = {
  scene?: any;
  authState: any;
  players: Player[];
};

export const PlayerList: React.FC<Props> = ({ scene, players, authState }) => {
  const [step, setStep] = useState<"MAIN" | "MUTE" | "KICK" | "UNMUTE">(
    "UNMUTE"
  );

  const [unMuteStatus, setUnMuteStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [search, setSearch] = useState("");

  const isModerator = (player: Player) => {
    if (player.clothing.hat === "Halo") {
      return true;
    } else {
      return false;
    }
  };

  const Players = players.filter((player) => {
    if (search.length === 0) {
      return true;
    } else {
      return player.farmId.toString().includes(search.toLowerCase());
    }
  });

  const unMutePlayer = async (player: Player) => {
    setStep("UNMUTE");
    await mutePlayer({
      token: authState.rawToken as string,
      farmId: authState.farmId as number,
      mutedId: player.farmId,
      mutedUntil: new Date().getTime() + 1000,
      reason: "UNMUTE",
    }).then((r) => {
      if (r.success) {
        setSelectedPlayer(player);
        setUnMuteStatus("success");
      } else {
        setUnMuteStatus("error");
        console.log(r);
      }
    });
  };

  return (
    <>
      {step === "MAIN" && (
        <>
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
                {Players.map((player) => {
                  const latestMute = player.moderation?.muted.sort(
                    (a, b) => a.mutedUntil - b.mutedUntil
                  )[0];

                  const isMuted =
                    latestMute && latestMute.mutedUntil > Date.now();

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
                      <td className="w-1/4">
                        {!isMuted ? (
                          <span>OK</span>
                        ) : (
                          <span
                            title={`Reason: ${latestMute.reason} - By: ${latestMute.mutedBy}`}
                          >
                            Muted for{" "}
                            {calculateMuteTime(
                              latestMute.mutedUntil,
                              "remaining"
                            )}
                          </span>
                        )}
                      </td>
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
                              setStep("KICK");
                              setSelectedPlayer(player);
                            }}
                          >
                            Kick
                          </Button>
                          <Button
                            disabled={isModerator(player)}
                            onClick={() => {
                              if (isMuted) {
                                unMutePlayer(player);
                              } else {
                                setStep("MUTE");
                                setSelectedPlayer(player);
                              }
                            }}
                          >
                            {isMuted ? "Unmute" : "Mute"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between m-1">
            <div className="flex items-center gap-1">
              <span className="text-xs">Search</span>
              <input
                className="w-1/2 text-xs text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs">
              {players.length}/150 Players Connected
            </span>
          </div>
        </>
      )}

      {step === "KICK" && (
        <KickModal
          onClose={() => setStep("MAIN")}
          player={selectedPlayer}
          authState={authState}
          scene={scene}
        />
      )}

      {step === "MUTE" && (
        <MuteModal
          onClose={() => setStep("MAIN")}
          player={selectedPlayer}
          authState={authState}
          scene={scene}
        />
      )}

      {step === "UNMUTE" && (
        <UnMuteModal
          onClose={() => {
            setStep("MAIN");
            setUnMuteStatus("loading");
          }}
          player={selectedPlayer}
          status={unMuteStatus}
        />
      )}
    </>
  );
};
