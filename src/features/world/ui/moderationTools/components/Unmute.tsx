import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Player } from "../ModerationTools";
import { mutePlayer } from "features/world/lib/moderationAction";

interface Props {
  player?: Player;
  authState: any;
  moderatorFarmId: number;
  scene: any;
  onClose: () => void;
}

export const UnMuteModal: React.FC<Props> = ({
  player,
  authState,
  moderatorFarmId,
  scene,
  onClose,
}) => {
  const [unmuteStatus, setUnMuteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [farmId, setFarmId] = useState<number | undefined>(
    player?.farmId || undefined,
  );

  const handleUnmuteAction = async () => {
    if (!authState || !farmId) return;
    setUnMuteStatus("loading");

    await mutePlayer({
      token: authState.rawToken as string,
      farmId: moderatorFarmId,
      mutedId: farmId,
      mutedUntil: new Date().getTime() + 1000,
      reason: "UNMUTE",
    })
      .then((r) => {
        if (r.success) {
          setUnMuteStatus("success");

          scene.mmoService.state.context.server?.send("moderation:event", {
            type: "unmute",
            farmId: farmId,
            arg: "You have been unmuted",
            mutedUntil: new Date().getTime() + 1000,
          });
        } else {
          setUnMuteStatus("error");
        }
      })
      .catch(() => setUnMuteStatus("error"));
  };

  const handleClose = () => {
    setFarmId(undefined);
    onClose();
  };

  return (
    <>
      {unmuteStatus === "idle" && (
        <div className="flex flex-col w-full p-1">
          <span className="text-lg text-center">{"Unmute a Player"}</span>
          <span className="text-xxs text-left mt-2 mb-1">
            {"Player Farm ID"}
          </span>
          <input
            className="w-full text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
            value={farmId}
            onChange={(e) => setFarmId(Number(e.target.value))}
          />
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={handleClose}>{"Cancel"}</Button>
            <Button onClick={handleUnmuteAction} disabled={!farmId}>
              {"Confirm"}
            </Button>
          </div>
        </div>
      )}
      {unmuteStatus === "success" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {"Mute Player of Farm " + farmId}
          </span>
          <span className="text-xs text-center">
            {"Player has been unmuted"}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={handleClose}>{"Close"}</Button>
          </div>
        </div>
      )}
      {unmuteStatus === "error" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {"Mute Player of Farm " + farmId}
          </span>
          <span className="text-xs text-center">
            {"Failed to unmute player"}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={handleClose}>{"Close"}</Button>
          </div>
        </div>
      )}
      {unmuteStatus === "loading" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-lg text-center">{"Unmuting player..."}</span>
          <span className="text-xs text-center mt-2">{"Please wait"}</span>
        </div>
      )}
    </>
  );
};
