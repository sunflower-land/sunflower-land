import React, { useContext, useEffect, useState } from "react";
import PubSub from "pubsub-js";
import { Modal } from "components/ui/Modal";

import { NPC_WEARABLES } from "lib/npcs";

import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";

import { FishermanModal } from "features/island/fisherman/FishermanModal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { FishCaught } from "features/island/fisherman/FishCaught";
import { Panel } from "components/ui/Panel";
import { FishingChallenge } from "features/island/fisherman/FishingChallenge";
import { FISH, FISH_DIFFICULTY, FishName } from "features/game/types/fishing";
import { getKeys } from "features/game/types/craftables";
import { MachineState } from "features/game/lib/gameMachine";

const _fishing = (state: MachineState) => state.context.state.fishing;
const _farmActivity = (state: MachineState) => state.context.state.farmActivity;

export const FishingModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const [fish, setFish] = useState<FishName | null>(null);
  const fishing = useSelector(gameService, _fishing);
  const farmActivity = useSelector(gameService, _farmActivity);

  const [showCaughtModal, setShowCaughtModal] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeDifficulty, setChallengeDifficulty] = useState(1);

  useEffect(() => {
    // Subscribe to the event
    const eventSubscription = PubSub.subscribe("OPEN_BEACH_FISHERMAN", () => {
      setShowModal(true);
    });

    const reelSubscription = PubSub.subscribe("BEACH_FISHERMAN_REEL", () => {
      const fish = getKeys(
        gameService.state.context.state.fishing.beach?.caught ?? {},
      ).find((fish) => fish in FISH);

      reelIn(fish as FishName);
    });

    return () => {
      PubSub.unsubscribe(eventSubscription);
      PubSub.unsubscribe(reelSubscription);
    };
  }, []);

  useEffect(() => {
    gameService.onTransition((state) => {
      if (state.context.state.fishing.beach?.caught) {
        PubSub.publish("BEACH_FISHERMAN_CAUGHT");
      }

      if (state.context.state.catchTheKraken.hunger) {
        PubSub.publish("KRAKEN_HUNGRY", {
          hunger: state.context.state.catchTheKraken.hunger,
        });
      }
    });
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setShowCaughtModal(false);
  };

  const reelIn = (fish: FishName) => {
    setFish(fish);

    const fishDifficulty = FISH_DIFFICULTY[fish as FishName];

    // Show fishing challenge
    if (fishDifficulty) {
      setChallengeDifficulty(fishDifficulty);
      setShowChallenge(true);
    } else {
      setShowCaughtModal(true);
    }
  };

  const onChallengeWon = () => {
    setShowChallenge(false);
    setShowCaughtModal(true);
  };

  const onChallengeLost = () => {
    setShowChallenge(false);

    gameService.send("fish.missed", { location: "beach" });
    gameService.send("SAVE");

    setShowCaughtModal(true);
  };

  const claim = () => {
    if (fishing.beach.caught) {
      gameService.send("rod.reeled", { location: "beach" });
      gameService.send("SAVE");
    }

    setFish(null);
    closeModal();

    PubSub.publish("BEACH_FISHERMAN_REELED");
  };

  return (
    <>
      <Modal show={showCaughtModal} onHide={claim} onExited={claim}>
        <CloseButtonPanel onClose={claim} bumpkinParts={NPC_WEARABLES["misty"]}>
          <FishCaught
            caught={fishing.beach.caught ?? {}}
            onClaim={claim}
            farmActivity={farmActivity}
          />
        </CloseButtonPanel>
      </Modal>

      <Modal show={showChallenge}>
        <Panel>
          <FishingChallenge
            difficulty={challengeDifficulty}
            onCatch={onChallengeWon}
            onMiss={onChallengeLost}
            fishName={fish as FishName}
          />
        </Panel>
      </Modal>

      <Modal show={showModal} onHide={closeModal}>
        <FishermanModal
          npc="misty"
          onCast={(bait, chum) => {
            PubSub.publish("BEACH_FISHERMAN_CAST");
            closeModal();

            gameService.send("rod.casted", {
              bait,
              chum,
              location: "beach",
            });
            gameService.send("SAVE");

            setTimeout(() => {
              gameState.context.state.fishing.beach = {
                castedAt: 10000,
                caught: { "Kraken Tentacle": 1 },
              };
            }, 1000);
          }}
          onClose={closeModal}
        />
      </Modal>
    </>
  );
};
