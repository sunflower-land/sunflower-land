import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React from "react";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onClose: () => void;
}

export const WorldIntroduction: React.FC<Props> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
      onClose={onClose}
    >
      <div className="p-2">
        <p className="text-sm mb-2">
          Howdy traveller! A few quick rules before you begin your adventure:
        </p>
        <div className="flex mb-2">
          <div className="w-8">
            <img src={SUNNYSIDE.icons.happy} className="h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              This is a beta feature - we appreciate your patience and feedback.
            </p>
          </div>
        </div>
        <div className="flex mb-2">
          <div className="w-8">
            <img src={SUNNYSIDE.icons.player} className="h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              To move your Bumpkin, use the keyboard arrow keys
            </p>
            <p className="text-xs italic">
              (On touch screen, use the joystick.)
            </p>
          </div>
        </div>
        <div className="flex mb-2">
          <div className="w-8">
            <img src={SUNNYSIDE.ui.cursor} className="h-6" />
          </div>
          <p className="text-sm flex-1">
            To interact with a Bumpkin or an object, walk near it and click it
          </p>
        </div>
        <div className="flex mb-1">
          <div className="w-8">
            <img src={SUNNYSIDE.icons.heart} className="h-6" />
          </div>
          <p className="text-sm flex-1">
            No harrasment, swearing or bullying. Thank you for respecting
            others.
          </p>
        </div>
      </div>
      <Button onClick={onClose}>Continue</Button>
      <div className="w-full flex justify-center">
        <a
          href="https://docs.sunflower-land.com/support/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white text-xs text-center"
        >
          Terms of service
        </a>
      </div>
    </CloseButtonPanel>
  );
};
