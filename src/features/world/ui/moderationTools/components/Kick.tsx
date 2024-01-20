import React, { useState } from "react";
import { Player } from "../ModerationTools";
import { Button } from "components/ui/Button";

import { kickPlayer } from "features/world/lib/moderationAction";
import { translate } from "lib/i18n/translate";

type Props = {
  scene: any;
  authState: any;
  moderatorFarmId: number;
  player?: Player;
  onClose: () => void;
};

export const KickModal: React.FC<Props> = ({
  scene,
  authState,
  moderatorFarmId,
  player,
  onClose,
}) => {
  const [kickStatus, setKickStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [farmId, setFarmId] = useState<number | undefined>(player?.farmId);
  const [reason, setReason] = useState("");

  const handleKickAction = async () => {
    if (!authState || !farmId) return;
    setKickStatus("loading");

    await kickPlayer({
      token: authState.rawToken as string,
      farmId: moderatorFarmId,
      kickedId: farmId,
      reason: reason,
    })
      .then((r) => {
        r.success ? setKickStatus("success") : setKickStatus("error");

        scene.mmoService.state.context.server?.send("moderation_event", {
          type: "kick",
          farmId: farmId as number,
          reason: reason,
        });
      })
      .catch((e) => setKickStatus("error"));
  };

  const handleClose = () => {
    setKickStatus("idle");
    setReason("");
    setFarmId(undefined);
    onClose();
  };

  return (
    <>
      {kickStatus === "idle" && (
        <div className="flex flex-col w-full p-1">
          <span className="text-lg text-center">
            {translate("kick.player")}
          </span>
          <span className="text-xxs text-left mt-2 mb-1">
            {translate("kick.player.id")}
          </span>
          <input
            className="w-full text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
            value={farmId}
            onChange={(e) => setFarmId(Number(e.target.value))}
          />
          <span className="text-xxs text-left mt-2 mb-1">
            {translate("kick.Reason")}
          </span>
          <textarea
            className="w-full h-20 text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={handleClose}>{translate("cancel")}</Button>
            <Button
              onClick={handleKickAction}
              disabled={reason.length === 0 || !farmId}
            >
              {translate("confirm")}
            </Button>
          </div>
        </div>
      )}
      {kickStatus === "success" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {translate("kick.player.farm")}
            {farmId}
          </span>
          <span className="text-xs text-center">
            {translate("kick.player.kick")}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={handleClose}>{translate("close")}</Button>
          </div>
        </div>
      )}
      {kickStatus === "error" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {translate("kick.player.farm")} {farmId}
          </span>
          <span className="text-xs text-center">
            {translate("kick.player.failed")}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={handleClose}>{translate("close")}</Button>
          </div>
        </div>
      )}
      {kickStatus === "loading" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-lg text-center">
            {translate("kick.player.kicking")}
          </span>
          <span className="text-xs text-center mt-2">
            {translate("kick.please")}
          </span>
        </div>
      )}
    </>
  );
};
