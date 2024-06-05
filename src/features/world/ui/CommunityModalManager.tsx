import React, { useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { Message, SpeakingModal } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";

type CommunityModal = {
  npc: {
    clothing: BumpkinParts;
    name: string;
  };
  messages: Message[];
  type: "speaking" | "loading";
  onClose?: () => void;
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

  public close = () => {
    if (this.listener) {
      this.listener({} as any, false);
    }
  };

  public listen(cb: (npc: CommunityModal, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const communityModalManager = new CommunityModalManager();

export const CommunityModals: React.FC = () => {
  const { t } = useAppTranslation();

  const [modal, setModal] = useState<CommunityModal>();

  useEffect(() => {
    communityModalManager.listen((modal, open) => {
      if (open) {
        setModal(modal);
      } else {
        setModal(undefined);
      }
    });
  }, []);

  const closeModal = () => {
    if (modal && modal.onClose) {
      modal.onClose();
    }
    setModal(undefined);
  };

  return (
    <>
      <Modal show={!!modal} onHide={closeModal}>
        {modal?.type === "speaking" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={modal?.npc?.clothing}
            message={modal?.messages ?? []}
          />
        )}
        {modal?.type === "loading" && (
          <Panel>
            <Loading />
          </Panel>
        )}
      </Modal>
    </>
  );
};
