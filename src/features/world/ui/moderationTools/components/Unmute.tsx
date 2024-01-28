import React from "react";
import { Button } from "components/ui/Button";
import { Player } from "../ModerationTools";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  player?: Player;
  status: "loading" | "success" | "error";
  onClose: () => void;
}

export const UnMuteModal: React.FC<Props> = ({ player, status, onClose }) => {
  const { t } = useAppTranslation();
  return (
    <>
      {status === "success" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {t("mute.unmute.farm")}
            {player?.farmId}
          </span>
          <span className="text-xs text-center">
            {t("mute.unmute.player")}{" "}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-sm text-center">
            {t("mute.unmute.farm")}
            {player?.farmId}
          </span>
          <span className="text-xs text-center">
            {t("mute.unmute.failed")}{" "}
          </span>
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={onClose}>{t("close")} </Button>
          </div>
        </div>
      )}
      {status === "loading" && (
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-lg text-center">
            {t("mute.unmuting.player")}{" "}
          </span>
          <span className="text-xs text-center mt-2">
            {t("mute.unmute.wait")}{" "}
          </span>
        </div>
      )}
    </>
  );
};
