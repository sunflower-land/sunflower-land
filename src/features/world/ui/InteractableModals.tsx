import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TEST_FARM } from "features/game/lib/constants";
import { AuctioneerModal } from "features/retreat/components/auctioneer/AuctioneerModal";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

type InteractableName =
  | "welcome_sign"
  | "plaza_statue"
  | "fan_art"
  | "auction_item";

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

export const InteractableModals: React.FC = () => {
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

  return (
    <>
      <AuctioneerModal
        isOpen={interactable === "auction_item"}
        onClose={() => setInteractable(undefined)}
        gameState={state} // TODO
        onUpdate={(state) => {
          console.log("Update hit!");
          gameService.send("UPDATE", { state });
        }}
      />
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
      </Modal> */}
    </>
  );
};
