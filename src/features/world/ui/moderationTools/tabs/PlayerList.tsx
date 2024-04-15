import React, { useState } from "react";
import { Player } from "../ModerationTools";
import { Button } from "components/ui/Button";

import { KickModal } from "../components/Kick";
import { MuteModal } from "../components/Mute";
import { UnMuteModal } from "../components/Unmute";

import { calculateMuteTime } from "../components/Muted";

import { mutePlayer } from "features/world/lib/moderationAction";

import { NPCRelative } from "features/island/bumpkin/components/NPC";
import { OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authState: any;
  moderatorFarmId: number;
  players: Player[];
};

export const PlayerList: React.FC<Props> = ({
  scene,
  players,
  authState,
  moderatorFarmId,
}) => {
  const [step, setStep] = useState<"MAIN" | "MUTE" | "KICK" | "UNMUTE">("MAIN");

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
    if (!player.username) player.username = "";

    if (search.length === 0) {
      return true;
    } else {
      return (
        player.farmId.toString().includes(search.toLowerCase()) ||
        player?.username.toLowerCase().includes(search.toLowerCase())
      );
    }
  });

  const unMutePlayer = async (player: Player) => {
    setStep("UNMUTE");
    await mutePlayer({
      token: authState.rawToken as string,
      farmId: moderatorFarmId,
      mutedId: player.farmId,
      mutedUntil: new Date().getTime() + 1000,
      reason: "UNMUTE",
    }).then((r) => {
      if (r.success) {
        setSelectedPlayer(player);
        setUnMuteStatus("success");
      } else {
        setUnMuteStatus("error");
        // eslint-disable-next-line no-console
        console.log(r);
      }
    });
  };

  return (
    <>
      {step === "MAIN" && (
        <>
          <div className="flex flex-col items-start gap-2 ml-1 mt-2 h-96 overflow-y-auto scrollable">
            {Players.map((player) => {
              const latestMute = player.moderation?.muted.sort(
                (a, b) => a.mutedUntil - b.mutedUntil
              )[0];

              const isMuted = latestMute && latestMute.mutedUntil > Date.now();

              return (
                <OuterPanel className="w-full" key={player.playerId}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center w-[45px] h-[50px]">
                        <NPCRelative parts={player.clothing} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="flex items-center gap-3 text-sm">
                          {player.username || "No Username"}
                          {isModerator(player) && (
                            <Label type="warning">{"Moderator"}</Label>
                          )}
                          {isMuted && (
                            <Label type="danger" icon={SUNNYSIDE.icons.timer}>
                              {"Muted for "}
                              {calculateMuteTime(
                                latestMute.mutedUntil,
                                "remaining"
                              )}
                            </Label>
                          )}
                        </span>
                        <span className="text-xs">{"#" + player.farmId}</span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 justify-end w-full">
                      <Button
                        onClick={() => {
                          scene.teleportModerator(player.x, player.y);
                        }}
                      >
                        {"TP"}
                      </Button>
                      <Button
                        disabled={isModerator(player)}
                        onClick={() => {
                          setStep("KICK");
                          setSelectedPlayer(player);
                        }}
                      >
                        {"Kick"}
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
                  </div>
                </OuterPanel>
              );
            })}
          </div>
          <div className="flex items-center justify-between m-1">
            <div className="flex items-center gap-1">
              <span className="text-xs">{"Search"}</span>
              <input
                className="w-1/2 text-xs text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs">{players.length + " / 150 Players"}</span>
          </div>
        </>
      )}

      {step === "KICK" && (
        <KickModal
          onClose={() => setStep("MAIN")}
          player={selectedPlayer}
          authState={authState}
          moderatorFarmId={moderatorFarmId}
          scene={scene}
        />
      )}

      {step === "MUTE" && (
        <MuteModal
          onClose={() => setStep("MAIN")}
          player={selectedPlayer}
          authState={authState}
          moderatorFarmId={moderatorFarmId}
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
