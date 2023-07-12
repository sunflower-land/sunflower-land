import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { TRAVELLER_COOLDOWN } from "features/game/events/landExpansion/findTraveller";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext } from "react";

interface Props {
  onClose: () => void;
}
export const WanderLeaf: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const discoveredAt =
    gameState.context.state.dawnBreaker?.traveller?.discoveredAt ?? 0;
  const discoveredCount =
    gameState.context.state.dawnBreaker?.traveller?.discoveredCount ?? 0;

  if (Date.now() < discoveredAt + TRAVELLER_COOLDOWN) {
    return (
      <>
        <SpeakingModal
          onClose={onClose}
          bumpkinParts={NPC_WEARABLES["wanderleaf"]}
          message={[
            {
              text: "Hey friend, don't be greedy. Come back tomorrow and try find me",
            },
          ]}
        />
      </>
    );
  }
  return (
    <>
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["wanderleaf"]}
        message={[
          {
            text: "Hey friend, you found me! At the end of this season I will be giving away prizes",
          },
          {
            text: `You are a well-travelled Bumpkin! You now have ${
              discoveredCount + 1
            } entries into my prize giveaway`,
            actions: [
              {
                text: "OK",
                cb: () => {
                  gameService.send("traveller.found");
                  gameService.send("SAVE");
                  onClose();
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};
