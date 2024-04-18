import React, { useState, useEffect } from "react";

import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Switch } from "components/ui/Switch";
import { usePlazaSettings } from "lib/utils/hooks/usePlazaSettings";

export const PlazaSettings: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();
  const [plazaSettings, setPlazaSettings] = usePlazaSettings();

  const [step, setStep] = useState<"MAIN" | "MUTED_PLAYERS" | "KEYBINDS">(
    "MAIN"
  );
  const [switchValue, setSwitchValue] = useState<boolean>(true);

  const [mutedPlayers, setMutedPlayers] = useState<string[]>([]);

  useEffect(() => {
    setMutedPlayers(
      JSON.parse(localStorage.getItem("plaza-settings.mutedFarmIds") || "[]")
    );
  }, [isOpen]);

  const removeMutedPlayer = (farmId: string) => {
    const muted = mutedPlayers;
    const index = muted.indexOf(farmId);
    if (index > -1) {
      muted.splice(index, 1);
    }

    localStorage.setItem("plaza-settings.mutedFarmIds", JSON.stringify(muted));

    setMutedPlayers([...muted]);
  };

  const getTitle = () => {
    switch (step) {
      case "MAIN":
        return translate("plazaSettings.title.main");
      case "MUTED_PLAYERS":
        return translate("plazaSettings.title.mutedPlayers");
      case "KEYBINDS":
        return translate("plazaSettings.title.keybinds");
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel title={getTitle()} onClose={onClose}>
        {step === "MAIN" && (
          <div className="flex flex-col items-start gap-2 px-1 py-2 h-min overflow-y-auto scrollable">
            <div className="flex justify-between items-center w-full mb-1">
              <p className="text-sm">{t("plazaSettings.walkAnimation")}</p>
              <Switch
                value={plazaSettings.walkAnimation}
                onChange={(value) => setPlazaSettings("walkAnimation", value)}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-sm">{t("plazaSettings.idleAnimation")}</p>
              <Switch
                value={plazaSettings.idleAnimation}
                onChange={(value) => setPlazaSettings("idleAnimation", value)}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-sm">{t("plazaSettings.frameRate")}</p>
              <Select
                options={[
                  { value: "30", label: "30" },
                  { value: "60", label: "60" },
                  { value: "90", label: "90" },
                  { value: "120", label: "120" },
                  { value: "0", label: "Unlimited" },
                ]}
                value={plazaSettings.framerate.toString()}
                onChange={(value) =>
                  setPlazaSettings("framerate", parseInt(value))
                }
              />
            </div>
            <div className="flex flex-col w-full border-2 mt-2 rounded-md border-black p-2 bg-orange-400 mb-3 text-xs">
              <span>{t("plazaSettings.refreshNotice")}</span>
            </div>
            <div className="flex w-full gap-2">
              <Button onClick={() => setStep("MUTED_PLAYERS")}>
                {t("plazaSettings.title.mutedPlayers")}
              </Button>
              <Button
                onClick={() => {
                  PubSub.publish("CHANGE_SERVER");
                  onClose();
                }}
              >
                {t("plazaSettings.changeServer")}
              </Button>
            </div>
          </div>
        )}

        {step === "MUTED_PLAYERS" && (
          <div className="flex flex-col gap-2 mt-2 max-h-96">
            <div className="overflow-y-auto scrollable min-h-[10vh] px-2">
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
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-sm text-center">
                    {t("plazaSettings.noMutedPlayers")}
                  </p>
                  <p className="text-xs text-center">
                    {t("plazaSettings.noMutedPlayers.description")}
                  </p>
                </div>
              )}
            </div>

            <Button onClick={() => setStep("MAIN")}>{t("back")}</Button>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
