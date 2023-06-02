import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

type InteractableName = "welcome_sign" | "plaza_statue" | "fan_art";

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
  const [interactable, setInteractable] = useState<InteractableName>();

  useEffect(() => {
    interactableModalManager.listen((interactable, open) => {
      setInteractable(interactable);
    });
  }, []);

  return (
    <>
      <Modal
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
      </Modal>
    </>
  );
};
