import React, { useState, useContext, useEffect } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { NPC_WEARABLES } from "lib/npcs";

// Components
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "../../../game/components/CloseablePanel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { OuterPanel, Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PORTAL_MAPS } from "features/world/lib/portal";
import { Label } from "components/ui/Label";

import sflIcon from "assets/icons/sfl.webp";
import Decimal from "decimal.js-light";

interface LucasProps {
  onClose: () => void;
}

export const Lucas: React.FC<LucasProps> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [step, setStep] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);

  const [username] = useState<string>(
    gameState.context.state.username ?? "Bumpkin"
  );
  const [sflBalance] = useState<number>(
    new Decimal(gameState.context.state.balance).toNumber()
  );

  const setHasSeenIntroduction = () => {
    localStorage.setItem("lucas-intro", "true");
  };

  useEffect(() => {
    const hasSeenIntroduction = localStorage.getItem("lucas-intro") === "true";

    if (hasSeenIntroduction) {
      setStep(1);
    }
  }, []);

  const IslandsTab: React.FC = () => {
    return (
      <div className="flex flex-col gap-1 w-full h-96 overflow-y-auto scrollable">
        {PORTAL_MAPS.map((map) => {
          return (
            <OuterPanel key={map.name} className="flex items-center gap-2">
              <img
                src={map.metadata.image}
                alt="Island"
                className="w-32 h-28 object-cover rounded-lg"
              />
              <div className="flex flex-col items-start h-fit ml-1">
                <h2 className="flex items-center justify-between w-full mb-2">
                  {map.name}
                  <Label type="warning" icon={sflIcon}>
                    {map.price + " SFL"}
                  </Label>
                </h2>
                <p className="text-xs">{map.metadata.description}</p>
                <div className="flex justify-between w-full mt-2">
                  <Button
                    onClick={() => {
                      // eslint-disable-next-line no-console
                      console.log("Buy island", map.name);
                    }}
                    className="w-fit px-4 py-0"
                    disabled={sflBalance < map.price}
                  >
                    {sflBalance >= map.price ? "Buy" : "Not enough SFL"}
                  </Button>
                </div>
              </div>
            </OuterPanel>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {step === 0 && (
        <Panel bumpkinParts={NPC_WEARABLES.lucas}>
          <SpeakingText
            onClose={onClose}
            message={[
              {
                text: `Hello, ${username}! I'm Lucas, the local architect, I got some lands for sale if you're interested.`,
              },
              {
                text: "These lands are perfect for building your dream place, invite your friends and have fun!",
              },
              {
                text: "Would you like to see the available lands?",
                actions: [
                  {
                    text: "Yes please!",
                    cb: () => {
                      setStep(1);
                      setHasSeenIntroduction();
                    },
                  },
                  {
                    text: "No thanks",
                    cb: onClose,
                  },
                ],
              },
            ]}
          />
        </Panel>
      )}

      {step === 1 && (
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES.lucas}
          onClose={onClose}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.tools.gold_pickaxe,
              name: "Islands",
            },
            {
              icon: SUNNYSIDE.icons.search,
              name: "Browse",
            },
            {
              icon: SUNNYSIDE.icons.player,
              name: "My Lands",
            },
          ]}
        >
          {tab === 0 && <IslandsTab />}
        </CloseButtonPanel>
      )}
    </>
  );
};
