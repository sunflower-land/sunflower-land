import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

type InteractableName = "welcome_sign" | "plaza_statue";

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
          Content
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
