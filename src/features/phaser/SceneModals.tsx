import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName } from "lib/npcs";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

class NpcModalManager {
  private listener: (npc: NPCName, isOpen: boolean) => void;

  public open(npc: NPCName) {
    this.listener(npc, true);
  }

  public listen(cb: (npc: NPCName, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const npcModalManager = new NpcModalManager();

type NpcModals = Partial<Record<NPCName, boolean>>;
export const NPCModals: React.FC = () => {
  const [modals, setModals] = useState<NpcModals>({
    betty: false,
  });

  useEffect(() => {
    npcModalManager.listen((npc, open) => {
      setModals((prev) => ({
        ...prev,
        [npc]: open,
      }));
    });
  }, []);

  return (
    <>
      <Modal
        centered
        show={!!modals.betty}
        onHide={() =>
          setModals((prev) => ({
            ...prev,
            betty: false,
          }))
        }
      >
        <CloseButtonPanel
          onClose={() =>
            setModals((prev) => ({
              ...prev,
              betty: false,
            }))
          }
        >
          Hello!
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
