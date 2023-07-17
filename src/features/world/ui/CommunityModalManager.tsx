import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

type CommunityModal = {
  npc: {
    clothing: BumpkinParts;
    name: string;
  };
  jsx: JSX.Element;
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

interface Props {
  onClose: () => void;
  onOpen: () => void;
}
export const CommunityModals: React.FC<Props> = ({ onClose, onOpen }) => {
  const [modal, setModal] = useState<CommunityModal>();

  useEffect(() => {
    communityModalManager.listen((modal) => {
      console.log("OPENED", { modal });
      setModal(modal);
      setTimeout(onOpen, 100); // Lag the pause of movement to give natural effect
    });
  }, []);

  const closeModal = () => {
    setModal(undefined);
    onClose();
  };

  return (
    <>
      <Modal show={!!modal} centered onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={modal?.npc?.clothing}
        >
          {modal?.jsx}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
