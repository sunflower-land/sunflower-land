import React, { useState } from "react";
import { Message, Player } from "../ModerationTools";
import { Button } from "components/ui/Button";
import { PlayerModal } from "../components/Player";

import { calculateMuteTime } from "../components/Muted";

import { NPC } from "features/island/bumpkin/components/NPC";
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
  messages: Message[];
};

export const isModerator = (player: Player) => {
  if (player.clothing.hat === "Halo") {
    return true;
  } else {
    return false;
  }
};

export const PlayerList: React.FC<Props> = ({
  scene,
  players,
  messages,
  authState,
  moderatorFarmId,
}) => {
  const [step, setStep] = useState<"MAIN" | "PLAYER">("MAIN");

  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [search, setSearch] = useState("");

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

  const PlayerMessages = () => {
    if (!selectedPlayer) return [];

    return messages.filter(
      (message) => message.farmId === selectedPlayer.farmId
    );
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
                      <div className="flex items-center w-[45px] h-[50px] relative">
                        <NPC parts={player.clothing} />
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
                        <span className="text-xs">
                          {"#" + player.farmId + " - In " + player.sceneId}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 justify-end w-full sm:w-min">
                      <Button
                        disabled={player.farmId === moderatorFarmId}
                        className="px-2"
                        onClick={() => {
                          scene.teleportModerator(
                            player.x,
                            player.y,
                            player.sceneId
                          );
                        }}
                      >
                        {"TP"}
                      </Button>
                      <Button
                        className="px-2"
                        onClick={() => {
                          setStep("PLAYER");
                          setSelectedPlayer(player);
                        }}
                      >
                        {"View"}
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
            <span className="text-xxs">
              {players.length + " / 150 Players"}
            </span>
          </div>
        </>
      )}

      {step === "PLAYER" && (
        <PlayerModal
          player={selectedPlayer}
          messages={PlayerMessages()}
          authState={authState}
          moderatorFarmId={moderatorFarmId}
          scene={scene}
          onClose={() => setStep("MAIN")}
        />
      )}
    </>
  );
};
