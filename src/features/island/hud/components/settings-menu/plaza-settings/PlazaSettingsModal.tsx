import React, { useState, useEffect } from "react";

import { Button } from "components/ui/Button";

import SoundOffIcon from "assets/icons/sound_off.png";
// import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ContentComponentProps } from "../GameOptions";

export const PlazaSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
  const { t } = useAppTranslation();

  const [step, setStep] = useState<"MAIN" | "MUTED_PLAYERS" | "KEYBINDS">(
    "MAIN"
  );

  const [mutedPlayers, setMutedPlayers] = useState<string[]>([]);

  useEffect(() => {
    setMutedPlayers(
      JSON.parse(localStorage.getItem("plaza-settings.mutedFarmIds") || "[]")
    );
  }, []);

  const mmoLocalSettings = JSON.parse(
    localStorage.getItem("mmo_settings") ?? "{}"
  );

  const removeMutedPlayer = (farmId: string) => {
    const muted = mutedPlayers;
    const index = muted.indexOf(farmId);
    if (index > -1) {
      muted.splice(index, 1);
    }

    localStorage.setItem("plaza-settings.mutedFarmIds", JSON.stringify(muted));

    setMutedPlayers([...muted]);
  };

  const changeServer = () => {
    PubSub.publish("CHANGE_SERVER");
    onSubMenuClick("main");
    onClose();
  };

  {
    /*const getTitle = () => {
    switch (step) {
      case "MAIN":
        return translate("gameOptions.plazaSettings");
      case "MUTED_PLAYERS":
        return translate("gameOptions.plazaSettings.title.mutedPlayers");
      case "KEYBINDS":
        return translate("gameOptions.plazaSettings.title.keybinds");
    }
  };*/
  }

  return (
    <>
      {step === "MAIN" && (
        <div className="flex flex-col items-start gap-2 max-h-96 overflow-y-auto scrollable">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <img src={SoundOffIcon} className="h-8" />
              <p className="text-sm">
                {t("gameOptions.plazaSettings.title.mutedPlayers")}
              </p>
            </div>
            <p className="text-xs px-1">
              {t("gameOptions.plazaSettings.mutedPlayers.description")}
            </p>
            <Button onClick={() => setStep("MUTED_PLAYERS")}>
              {t("gameOptions.plazaSettings.title.mutedPlayers")}
            </Button>
            <Button onClick={changeServer}>
              {t("gameOptions.plazaSettings.changeServer")}
            </Button>
          </div>
          {/* <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img src={SUNNYSIDE.ui.cursor} className="h-8" />
                <p className="text-sm">Keybinds</p>
              </div>
              <p className="text-xs">
                {t"gameOptions.plazaSettings.title.keybinds")}
              </p>
              <Button onClick={() => setStep("KEYBINDS")}>Keybinds</Button>
            </div> */}
        </div>
      )}

      {step === "MUTED_PLAYERS" && (
        <div className="flex flex-col gap-2 mt-2 max-h-96">
          <div className="overflow-y-auto scrollable min-h-[5vh] px-2">
            {mutedPlayers.length > 0 ? (
              <>
                {mutedPlayers.map((farmId: string) => (
                  <div
                    className="flex items-center justify-between w-full gap-2"
                    key={farmId}
                  >
                    <p className="text-sm">{farmId}</p>
                    <Button
                      onClick={() => removeMutedPlayer(farmId)}
                      className="w-1/3 text-xs"
                    >
                      {t("unmute")}
                    </Button>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-center">
                {t("gameOptions.plazaSettings.noMutedPlayers")}
              </p>
            )}
          </div>

          <Button onClick={() => setStep("MAIN")}>{t("back")}</Button>
        </div>
      )}
    </>
  );
};
