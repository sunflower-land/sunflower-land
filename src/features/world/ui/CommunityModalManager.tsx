import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { Button } from "components/ui/Button";

type ButtonInfo = {
  id: string;
  text: string;
  closeModal?: boolean;
};

type CommunityModal = {
  npc: {
    clothing: BumpkinParts;
    name: string;
  };
  jsx: JSX.Element;
  buttons?: ButtonInfo[];
  onClose?: () => void;
  onButtonClick?: (buttonId: string) => void;
};

class CommunityModalManager {
  private listener?: (npc: CommunityModal, isOpen: boolean) => void;

  private id = 0;

  constructor() {
    console.log("CINIT");
    this.id = Date.now();
    console.log({ id: this.id });
  }
  public open = (modal: CommunityModal) => {
    console.log("YEEET", this, this.listener);

    if (this.listener) {
      console.log("INSIDE");
      this.listener(modal, true);
    }
  };

  public listen(cb: (npc: CommunityModal, isOpen: boolean) => void) {
    this.listener = cb;
    console.log("Listn now", this.listener);
  }
}

export const communityModalManager = new CommunityModalManager();

export const CommunityModals: React.FC = () => {
  const [modal, setModal] = useState<CommunityModal>();

  useEffect(() => {
    communityModalManager.listen((modal, open) => {
      console.log("OPENED", { modal });

      if (modal.buttons) {
        const ids = modal.buttons.map((button) => button.id);
        const uniqueIds = [...new Set(ids)];
        if (ids.length !== uniqueIds.length) {
          console.warn(
            "Duplicate button ids detected. To prevent this, please make sure all buttons have unique ids."
          );
          modal.buttons = modal.buttons.filter(
            (button, index) => ids.indexOf(button.id) === index
          );
        }
        modal.buttons = modal.buttons.filter((button) => !!button.id);
      }

      setModal(modal);
    });
  }, []);

  const closeModal = () => {
    if (modal && modal.onClose) {
      modal.onClose();
    }
    setModal(undefined);
  };

  const handleButtonClick = (buttonId: string) => {
    const clickedButton = modal?.buttons?.find(
      (button) => button.id === buttonId
    );
    if (clickedButton) {
      if (clickedButton.closeModal) {
        setModal(undefined);
      }

      if (modal && modal.onButtonClick) {
        modal.onButtonClick(buttonId);
      }
    }
  };

  return (
    <>
      <Modal show={!!modal} centered onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={modal?.npc?.clothing}
        >
          <div className="p-2">{modal?.jsx}</div>
          <div className="p-2 grid grid-cols-2 gap-2">
            {modal?.buttons?.map((button) => (
              <Button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
              >
                {button.text}
              </Button>
            ))}
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
