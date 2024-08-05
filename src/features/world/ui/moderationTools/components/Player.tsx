import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Message, Player } from "../ModerationTools";
import { isModerator } from "../tabs/PlayerList";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { isMobile } from "mobile-device-detect";

import {
  getBumpkinLevel,
  getExperienceToNextLevel,
  isMaxLevel,
} from "features/game/lib/level";
import { t } from "i18next";
import { ResizableBar } from "components/ui/ProgressBar";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { calculateMuteTime } from "./Muted";
import { KickModal } from "./Kick";
import { MuteModal } from "./Mute";
import { UnMuteModal } from "./Unmute";
import { InnerPanel } from "components/ui/Panel";
import { formatNumber } from "lib/utils/formatNumber";

interface Props {
  player?: Player;
  messages: Message[];
  authState: any;
  moderatorFarmId: number;
  scene: any;
  onClose: () => void;
}

type Event = {
  type: "kick" | "mute";
  at: number;
  by: number;
  reason: string;
};

export const PlayerModal: React.FC<Props> = ({
  player,
  messages,
  authState,
  moderatorFarmId,
  scene,
  onClose,
}) => {
  const [step, setStep] = useState<"MAIN" | "KICK" | "MUTE" | "UNMUTE">("MAIN");

  if (!player)
    return (
      <div className="flex flex-col w-full p-1">
        <h1>{"Player not found"}</h1>
        <Button onClick={onClose}>{"Close"}</Button>
      </div>
    );

  const experience = player.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const maxLevel = isMaxLevel(experience);
  const { currentExperienceProgress, experienceToNextLevel } =
    getExperienceToNextLevel(experience);

  const getProgressPercentage = () => {
    let progressRatio = 1;
    if (!maxLevel) {
      progressRatio = Math.min(
        1,
        currentExperienceProgress / experienceToNextLevel,
      );
    }

    return progressRatio * 100;
  };

  const getModerationEvents = () => {
    const events: Event[] = [];
    player.moderation?.kicked.forEach((kicked) => {
      events.push({
        type: "kick",
        at: kicked.kickedAt,
        by: kicked.kickedBy,
        reason: kicked.reason,
      });
    });
    player.moderation?.muted.forEach((muted) => {
      events.push({
        type: "mute",
        at: muted.mutedAt,
        by: muted.mutedBy,
        reason: muted.reason,
      });
    });

    return events.sort((a, b) => {
      return new Date(b.at).getTime() - new Date(a.at).getTime();
    });
  };

  const latestMute = player.moderation?.muted.sort(
    (a, b) => b.mutedUntil - a.mutedUntil,
  )[0];
  const isMuted = latestMute && latestMute.mutedUntil > Date.now();

  return (
    <>
      {step === "MAIN" && (
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 sm:h-96">
          <div className="w-full sm:w-1/3 z-10">
            {!isMobile && (
              <div className="w-full rounded-md overflow-hidden mb-1">
                <DynamicNFT showBackground bumpkinParts={player.clothing} />
              </div>
            )}

            <div className="flex flex-col items-center justify-center gap-1">
              <Button
                onClick={() => {
                  setStep("KICK");
                }}
              >
                {"Kick"}
              </Button>
              <Button
                onClick={() => {
                  isMuted ? setStep("UNMUTE") : setStep("MUTE");
                }}
              >
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <Button onClick={onClose}>{"Close"}</Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mx-2 mt-1">
              <div className="flex flex-col items-start justify-center gap-2">
                <p className="text-base">{player.username || "No Username"}</p>
                <p className="text-xs">
                  {`#${player.farmId} - In ${player.sceneId}`}
                </p>
              </div>
              <div className="flex flex-col items-end justify-center gap-2">
                <p className="text-base">
                  {t("lvl")} {level}
                  {maxLevel ? " (Max)" : ""}
                </p>
                <div className="flex items-center mt-1">
                  <p className="text-xxs mr-2">
                    {`${formatNumber(currentExperienceProgress, { decimalPlaces: 0 })}/${formatNumber(
                      experienceToNextLevel,
                      { decimalPlaces: 0 },
                    )} XP`}
                  </p>

                  <ResizableBar
                    percentage={getProgressPercentage()}
                    type="progress"
                    outerDimensions={{
                      width: 40,
                      height: 7,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-start mx-2 mt-1 gap-2">
              {isModerator(player) && (
                <Label type="warning">{"Moderator"}</Label>
              )}
              {isMuted && (
                <Label type="danger" icon={SUNNYSIDE.icons.timer}>
                  {"Muted for "}
                  {calculateMuteTime(latestMute.mutedUntil, "remaining")}
                </Label>
              )}
            </div>

            <InnerPanel className="flex flex-col h-36 items-center ml-1 mt-2">
              <h2 className="text-sm w-full mb-2">{"Moderation Events"}</h2>

              <div className="flex flex-col overflow-y-scroll scrollable h-full w-full gap-4">
                {getModerationEvents().map((event, index) => (
                  <>
                    <div
                      key={index}
                      className="flex flex-col w-full items-start"
                    >
                      <div className="flex justify-between w-full items-center mb-1 pr-1">
                        <Label type="danger">{event.type.toUpperCase()}</Label>
                        <p className="text-xs">
                          {new Date(event.at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs px-1">{`By: ${event.by}`}</p>
                      <p className="text-xs px-1">{`Reason: ${event.reason}`}</p>
                    </div>

                    {index < getModerationEvents().length - 1 && (
                      <hr className="w-full" />
                    )}
                  </>
                ))}

                {getModerationEvents().length === 0 && (
                  <p className="text-xs">{"Nothing to show here."}</p>
                )}
              </div>
            </InnerPanel>

            <InnerPanel className="flex flex-col h-36 items-center ml-1 mt-1">
              <h2 className="text-sm w-full mb-2">{"Chat History"}</h2>

              <div className="flex flex-col px-1 overflow-y-scroll scrollable h-full w-full gap-1">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-full items-start gap-2"
                  >
                    <p className="text-xs">
                      {new Date(message.sentAt).toLocaleTimeString() +
                        ": " +
                        message.text}
                    </p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-xs">{"No messages found."}</p>
                )}
              </div>
            </InnerPanel>
          </div>
        </div>
      )}

      {step === "KICK" && (
        <KickModal
          onClose={() => setStep("MAIN")}
          player={player}
          authState={authState}
          moderatorFarmId={moderatorFarmId}
          scene={scene}
        />
      )}

      {step === "MUTE" && (
        <MuteModal
          onClose={() => setStep("MAIN")}
          player={player}
          authState={authState}
          moderatorFarmId={moderatorFarmId}
          scene={scene}
        />
      )}

      {step === "UNMUTE" && (
        <UnMuteModal
          onClose={() => {
            setStep("MAIN");
          }}
          player={player}
          authState={authState}
          moderatorFarmId={moderatorFarmId}
          scene={scene}
        />
      )}
    </>
  );
};
