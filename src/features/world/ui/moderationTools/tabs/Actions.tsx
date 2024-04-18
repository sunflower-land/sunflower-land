import React, { useState } from "react";
import { Button } from "components/ui/Button";

import { MuteModal } from "../components/Mute";

import SoundOffIcon from "assets/icons/sound_off.png";
import { UnMuteModal } from "../components/Unmute";

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
  const [step, setStep] = useState<"MAIN" | "MUTE" | "UNMUTE" | "LOADING">(
    "MAIN"
  );

  return (
    <>
      <div className="flex flex-col justify-between items-start gap-2 ml-1 mt-2 overflow-y-auto scrollable">
        {step === "MAIN" && (
          <div className="flex flex-col gap-2 h-96">
            <div className="flex items-center gap-2">
              <img src={SoundOffIcon} className="w-8 h-8" />
              <p className="text-sm">{"Mute/Unmute"}</p>
            </div>
            <p className="text-xs">
              {
                "In case you need to mute or unmute a player that is not online, you can do so here. On their next login, they will be muted/unmuted."
              }
            </p>
            <div className="flex flex-row gap-2">
              <Button
                onClick={() => {
                  setStep("MUTE");
                }}
              >
                {"Mute a Player"}
              </Button>
              <Button
                onClick={() => {
                  setStep("UNMUTE");
                }}
              >
                {"Unmute a Player"}
              </Button>
            </div>
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

        {step === "UNMUTE" && (
          <UnMuteModal
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
