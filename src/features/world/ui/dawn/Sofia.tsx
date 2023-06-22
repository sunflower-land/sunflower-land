import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsToString } from "lib/utils/time";
import React, { useContext } from "react";

interface Props {
  onClose: () => void;
}
export const Sofia: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  if (gameState.context.state.bumpkin?.equipped.onesie !== "Eggplant Onesie") {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["sofia"]}
        message={[
          {
            text: "Wow, new friends! Oh no, I only play with Bumpkins that are dressed like me.",
          },
        ]}
      />
    );
  }

  const flower = gameState.context.state.dawnBreaker?.dawnFlower;
  if (!flower) {
    return (
      <>
        <SpeakingModal
          onClose={onClose}
          bumpkinParts={NPC_WEARABLES["sofia"]}
          message={[
            {
              text: "Hey friend, I love your outfit!",
            },
            {
              text: `Those Eggplant soliders left some magical seeds when they escaped. Do you want to grow a special plant with me?`,
              actions: [
                {
                  text: "No",
                  cb: onClose,
                },
                {
                  text: "Sure, let's do it",
                  cb: () => {
                    gameService.send("dawnFlower.tended");
                    onClose();
                  },
                },
              ],
            },
          ]}
        />
      </>
    );
  }

  if (flower.tendedCount >= 10) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["sofia"]}
        message={[
          {
            text: "Wow, we did it! We grew a Dawn Flower, what a beautiful collectible!",
          },
        ]}
      />
    );
  }

  const timeLeft = Date.now() - flower.tendedAt + 24 * 60 * 60 * 1000;
  if (timeLeft > 0) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["sofia"]}
        message={[
          {
            text: "Patience friend! Dawn Flowers take a long time to grow.",
          },
          {
            text: `Come back in ${secondsToString(timeLeft / 1000, {
              length: "full",
            })}`,
          },
        ]}
      />
    );
  }

  return (
    <SpeakingModal
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["sofia"]}
      message={[
        {
          text: "I thought you'd never come back! It is time to water our plant!",
          actions: [
            {
              text: "No",
              cb: onClose,
            },
            {
              text: "Sure, let's do it",
              cb: () => {
                gameService.send("dawnFlower.tended");
                onClose();
              },
            },
          ],
        },
      ]}
    />
  );
};
