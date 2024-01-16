import React from "react";
import { Button } from "components/ui/Button";
import { Player } from "../ModerationTools";
import { translate } from "lib/i18n/translate";

interface Props {
  player?: Player;
  status: "loading" | "success" | "error";
  onClose: () => void;
}

export const UnMuteModal: React.FC<Props> = ({ player, status, onClose }) => {
  return (
    <>
      {status === "success" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {translate("mute.unmute.farm")}{player?.farmId}
          </span>
          <span className="text-xs text-center">{translate("mute.unmute.player")}{" "}</span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>{translate("close")}</Button>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {translate("mute.unmute.farm")}{player?.farmId}
          </span>
          <span className="text-xs text-center">{translate("mute.unmute.failed")}{" "}</span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>{translate("close")} </Button>
          </div>
        </div>
      )}
      {status === "loading" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-lg text-center">{translate("mute.unmuting.player")}{" "}</span>
          <span className="text-xs text-center mt-2">{translate("mute.unmute.wait")}{" "}</span>
        </div>
      )}
    </>
  );
};
