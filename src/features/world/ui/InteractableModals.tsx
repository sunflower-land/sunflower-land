import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { AuctioneerModal } from "features/retreat/components/auctioneer/AuctioneerModal";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PotionHouse } from "features/game/expansion/components/potions/PotionHouse";
import { hasFeatureAccess } from "lib/flags";
import fanArt from "assets/fanArt/dawn_breaker.png";
import { Donations } from "./donations/Donations";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";

type InteractableName =
  | "welcome_sign"
  | "plaza_statue"
  | "fan_art"
  | "auction_item"
  | "boat_modal"
  | "homeless_man"
  | "potion_table"
  | "fan_art_1";

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
  onClose: () => void;
  onOpen: () => void;
}
export const InteractableModals: React.FC<Props> = ({
  id,
  onOpen,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const [interactable, setInteractable] = useState<InteractableName>();

  useEffect(() => {
    interactableModalManager.listen((interactable, open) => {
      setInteractable(interactable);
      onOpen();
    });
  }, []);

  const closeModal = () => {
    setInteractable(undefined);
    onClose();
  };

  const navigate = useNavigate();

  return (
    <>
      {/* TODO - make smoother opening */}
      {interactable === "auction_item" && (
        <AuctioneerModal
          isOpen={interactable === "auction_item"}
          onClose={closeModal}
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

      <Modal centered show={interactable === "boat_modal"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <p className="mb-3">Would you like to return home?</p>
          </div>
          <Button onClick={() => navigate(`/land/${id}`)}>Go home</Button>
        </CloseButtonPanel>
      </Modal>

      <Modal
        centered
        show={interactable === "homeless_man"}
        onHide={closeModal}
      >
        <CloseButtonPanel
          title="Want to support more events like this?!"
          onClose={closeModal}
        >
          <Donations />
        </CloseButtonPanel>
      </Modal>

      <Modal centered show={interactable === "fan_art_1"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal} title="Congratulations">
          <div className="p-2">
            <p className="text-sm mb-2 text-center">
              Congratulations Palisman, the winner of the first Fan Art
              competition
            </p>
            <img src={fanArt} className="w-2/3 mx-auto rounded-lg" />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );

  {
    /* 

      {/* <Modal
        centered
        show={!!interactable}
        onHide={closeModal}
      >
        <CloseButtonPanel onClose={closeModal}>
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
