import React, { useState } from "react";
import { Button } from "components/ui/Button";

import { OfflineMute } from "./OfflineMute";

import SoundOffIcon from "assets/icons/sound_off.png";

type Props = {
  scene?: any;
  authState: any;
};

export const Actions: React.FC<Props> = ({ scene, authState }) => {
  const [step, setStep] = useState<"MAIN" | "MUTE" | "LOADING">("MAIN");

  return (
    <>
      <div className="flex flex-col justify-between items-start gap-2 ml-1 mt-2 h-96 overflow-y-scroll scrollable">
        {step === "MAIN" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={SoundOffIcon} className="w-8 h-8" />
              <p className="text-sm">Mute a Player</p>
            </div>
            <p className="text-xs">
              In case you need to mute a player that is not online, you can do
              so here. On their next login, they will be muted.
            </p>
            <Button
              onClick={() => {
                setStep("MUTE");
              }}
            >
              Mute a Player
            </Button>
          </div>
        )}

        {step === "MUTE" && (
          <OfflineMute
            scene={scene}
            authState={authState}
            onClose={() => setStep("MAIN")}
          />
        )}

        {step !== "MAIN" && step !== "LOADING" && (
          <div className="flex items-center justify-between m-1">
            <span
              className="text-xs cursor-pointer underline"
              onClick={() => setStep("MAIN")}
            >
              Go Back
            </span>
          </div>
        )}
      </div>
    </>
  );
};
