import React from "react";
import { Button } from "components/ui/Button";
import { Player } from "../ModerationTools";

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
            {"Unmute Player of Farm " + player?.farmId}
          </span>
          <span className="text-xs text-center">
            {"Player has been unmuted"}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>{"Close"}</Button>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {"Unmute Player of Farm " + player?.farmId}
          </span>
          <span className="text-xs text-center">
            {"Failed to unmute player"}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>{"Close"}</Button>
          </div>
        </div>
      )}
      {status === "loading" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-lg text-center">{"Unmutting Player..."}</span>
          <span className="text-xs text-center mt-2">{"Please wait"}</span>
        </div>
      )}
    </>
  );
};
