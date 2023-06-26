import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { AuctioneerModal } from "features/retreat/components/auctioneer/AuctioneerModal";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PotionHouse } from "features/game/expansion/components/potions/PotionHouse";
import { hasFeatureAccess } from "lib/flags";

type InteractableName =
  | "welcome_sign"
  | "plaza_statue"
  | "fan_art"
  | "auction_item"
  | "boat_modal"
  | "homeless_man"
  | "potion_table";

class InteractableModalManager {
  private listener?: (name: InteractableName, isOpen: boolean) => void;

  public open(name: InteractableName) {
    if (this.listener) {
      this.listener(name, true);
    }
  }

  public listen(cb: (name: InteractableName, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const interactableModalManager = new InteractableModalManager();

interface Props {
  id: number;
}
export const InteractableModals: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const [interactable, setInteractable] = useState<InteractableName>();

  useEffect(() => {
    interactableModalManager.listen((interactable, open) => {
      setInteractable(interactable);
    });
  }, []);

  const navigate = useNavigate();

  return (
    <>
      {/* TODO - make smoother opening */}
      {interactable === "auction_item" && (
        <AuctioneerModal
          isOpen={interactable === "auction_item"}
          onClose={() => setInteractable(undefined)}
          gameState={state}
          onUpdate={(state) => {
            console.log("Update hit!");
            gameService.send("UPDATE", { state });
          }}
          onMint={(id) => {
            console.log("Update hit!", gameState.value);
            setInteractable(undefined);
            gameService.send("MINT", { auctionId: id });
          }}
          deviceTrackerId={gameState.context.deviceTrackerId as string}
        />
      )}

      {interactable === "potion_table" &&
        hasFeatureAccess(state.inventory, "POTION_HOUSE") && <PotionHouse />}
    </>
  );

  {
    /* <Modal
        centered
        show={interactable === "boat_modal"}
        onHide={() => setInteractable(undefined)}
      >
        <CloseButtonPanel onClose={() => setInteractable(undefined)}>
          <div className="p-2">
            <p className="mb-3">Would you like to return home?</p>
          </div>
          <Button onClick={() => navigate(`/land/${id}`)}>Go home</Button>
        </CloseButtonPanel>
      </Modal>

      <Modal
        centered
        show={interactable === "homeless_man"}
        onHide={() => setInteractable(undefined)}
      >
        <CloseButtonPanel onClose={() => setInteractable(undefined)}>
          <Donations />
        </CloseButtonPanel>
      </Modal>

      {/* <Modal
        centered
        show={!!interactable}
        onHide={() => setInteractable(undefined)}
      >
        <CloseButtonPanel onClose={() => setInteractable(undefined)}>
          {interactable === "fan_art" && (
            <div className="p-2">
              <p className="mb-2">Have you submitted your fan art?</p>
              <p className="mb-2">1000 SFL in prizes to be won!</p>
              <a
                href="https://github.com/sunflower-land/sunflower-land/discussions/2553"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </a>
            </div>
          )}
        </CloseButtonPanel>
      </Modal> */
  }
};
