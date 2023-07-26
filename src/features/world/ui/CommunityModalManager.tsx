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

export const CommunityModals: React.FC = () => {
  const [modal, setModal] = useState<CommunityModal>();

  useEffect(() => {
    communityModalManager.listen((modal, open) => {
      console.log("OPENED", { modal });
      setModal(modal);
    });
  }, []);

  const closeModal = () => {
    setModal(undefined);
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
