import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { OrderCards } from "./DeliveryPanelContent";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Bumpkin } from "features/game/types/game";
import { Button } from "components/ui/Button";

import giftIcon from "assets/icons/gift.png";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { TypingMessage } from "../TypingMessage";

export const Dialogue: React.FC<{
  message: string;
  trail?: number;
}> = ({ message, trail = 30 }) => {
  const [displayedMessage, setDisplayedMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        const newDisplayedMessage = message.substring(0, currentIndex + 1);
        setDisplayedMessage(newDisplayedMessage);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, trail);

    return () => {
      clearInterval(interval);
    };
  }, [message, trail, currentIndex]);

  return <div className="leading-[1] text-xs">{displayedMessage}</div>;
};

export const BumpkinDelivery: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const name: NPCName = "pumpkin' pete";

  return (
    <CloseButtonPanel
      onClose={console.log}
      bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
    >
      <div className="p-2">
        <div className="flex justify-between">
          <Label type="default" className="mb-2" icon={SUNNYSIDE.icons.player}>
            {name}
          </Label>
        </div>

        <div className="h-16">
          <Dialogue
            trail={25}
            message="Howdy Bumpkin, how about dem taters and pumpkins today? Great day for it."
          />
        </div>

        <div>
          <Label type="chill" className="mb-2" icon={SUNNYSIDE.icons.heart}>
            Deliveries
          </Label>
        </div>

        <OrderCards
          balance={gameState.context.state.balance}
          bumpkin={gameState.context.state.bumpkin as Bumpkin}
          inventory={gameState.context.state.inventory}
          orders={[
            {
              createdAt: 0,
              from: "pumpkin' pete",
              id: "1",
              items: {
                Carrot: 2,
              },
              readyAt: 0,
              reward: {
                tickets: 3,
              },
            },
          ]}
          onSelectOrder={console.log}
          hasRequirementsCheck={() => true}
        />
        <div className="flex mt-1">
          <Button className="mr-1">
            <div className="flex items-center">
              <img src={giftIcon} className="h-6 mr-2" />
              Gift
            </div>
          </Button>
          <Button>Deliver</Button>
        </div>
      </div>
    </CloseButtonPanel>
  );
};
