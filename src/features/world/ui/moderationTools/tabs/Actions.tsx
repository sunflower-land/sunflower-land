import React, { useState } from "react";
import { Button } from "components/ui/Button";

import { MuteModal } from "../components/Mute";

import SoundOffIcon from "assets/icons/sound_off.png";
import { translate } from "lib/i18n/translate";

type Props = {
  scene?: any;
  authState: any;
  moderatorFarmId: number;
};

export const Actions: React.FC<Props> = ({
  scene,
  authState,
  moderatorFarmId,
}) => {
  const [step, setStep] = useState<"MAIN" | "MUTE" | "LOADING">("MAIN");

  return (
    <>
      <div className="flex flex-col justify-between items-start gap-2 ml-1 mt-2 overflow-y-scroll scrollable">
        {step === "MAIN" && (
          <div className="flex flex-col gap-2 h-96">
            <div className="flex items-center gap-2">
              <img src={SoundOffIcon} className="w-8 h-8" />
              <p className="text-sm">{translate("mute.playe")}</p>
            </div>
            <p className="text-xs">{translate("mute.online")}</p>
            <Button
              onClick={() => {
                setStep("MUTE");
              }}
            >
              {translate("mute.playe")}
            </Button>
          </div>
        )}

        {step === "MUTE" && (
          <MuteModal
            scene={scene}
            authState={authState}
            onClose={() => setStep("MAIN")}
            moderatorFarmId={moderatorFarmId}
          />
        )}
      </div>
    </>
  );
};
