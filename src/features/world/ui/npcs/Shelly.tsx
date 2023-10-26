import React, { useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import tentacle from "assets/ui/tentacle.png";
import lock from "assets/skills/lock.png";
import lightning from "assets/icons/lightning.png";

import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";

interface Props {
  onClose: () => void;
}
export const Shelly: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(!isNPCAcknowledged("shelly"));

  useEffect(() => {
    acknowledgeNPC("shelly");
  }, []);

  if (showIntro) {
    return (
      <SpeakingModal
        key="feathers"
        onClose={() => {
          setShowIntro(false);
        }}
        bumpkinParts={NPC_WEARABLES.shelly}
        message={[
          {
            text: "Howdy, Bumpkin! Welcome to the beach!",
          },
          {
            text: "After a hard day's work on your farm, there's no better place to kick back and enjoy the waves.",
          },
          {
            text: "But we've got a bit of a situation. A massive kraken has emerged and taken control of our beloved beach.",
          },
          {
            text: "We could really use your help, dear. Grab your bait and fishing rods, and together, we'll tackle this colossal problem!",
            actions: [
              {
                text: "Let's do it!",
                cb: () => setShowIntro(false),
              },
            ],
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.shelly} onClose={onClose}>
      <div className="p-2">
        <p className="mb-3">{`What's happening?`}</p>

        <div className="flex mb-2">
          <img
            src={SUNNYSIDE.icons.player}
            className="w-6 mr-3 object-contain"
          />
          <p className="text-sm">Deliver resources to Bumpkins for rewards</p>
        </div>

        <div className="flex mb-2">
          <img src={tentacle} className="w-6 mr-3  object-contain" />
          <div>
            <p className="text-sm mb-0.5">Defeat the kraken!</p>
            <Label icon={lightning} type="vibrant">
              Special Event
            </Label>
          </div>
        </div>

        <div className="flex mb-2">
          <img
            src={SUNNYSIDE.tools.shovel}
            className="w-6 mr-3 object-contain"
          />
          <div>
            <p className="text-sm mb-0.5">
              Join the pirates and dig for treasure
            </p>
            <Label icon={lock} type="danger">
              Coming soon
            </Label>
          </div>
        </div>

        <div className="flex mb-2">
          <img src={SUNNYSIDE.icons.fish} className="w-6 mr-3 object-contain" />
          <div className="mt-1">
            <p className="text-sm mb-0.5">Fish for legendary fish</p>
            <Label icon={lock} type="danger">
              Coming soon
            </Label>
          </div>
        </div>
      </div>
      <Button onClick={onClose}>Ok</Button>
    </CloseButtonPanel>
  );
};
