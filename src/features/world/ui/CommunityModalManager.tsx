import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { Button } from "components/ui/Button";

type ButtonInfo = {
  text: string;
  cb: () => void;
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
    this.id = Date.now();
  }
  public open = (modal: CommunityModal) => {
    if (this.listener) {
      this.listener(modal, true);
    }
  };

  public listen(cb: (npc: CommunityModal, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const communityModalManager = new CommunityModalManager();

export const CommunityModals: React.FC = () => {
  const [modal, setModal] = useState<CommunityModal>();

  useEffect(() => {
    communityModalManager.listen((modal, open) => {
      setModal(modal);
    });
  }, []);

  const closeModal = () => {
    if (modal && modal.onClose) {
      modal.onClose();
    }
    setModal(undefined);
  };

  console.log({ modal });
  return (
    <>
      <Modal show={!!modal} centered onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={modal?.npc?.clothing}
        >
          <div className="p-2">{modal?.jsx}</div>
          <div className="p-2 grid grid-cols-2 gap-2">
            {modal?.buttons?.map((button, index) => (
              <Button
                key={index}
                onClick={() => {
                  button.cb();

                  if (button.closeModal) {
                    setModal(undefined);
                  }
                }}
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
