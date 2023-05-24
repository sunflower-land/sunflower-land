import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { HeliosBlacksmithItems } from "features/helios/components/blacksmith/component/HeliosBlacksmithItems";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

class NpcModalManager {
  private listener?: (npc: NPCName, isOpen: boolean) => void;

  public open(npc: NPCName) {
    if (this.listener) {
      this.listener(npc, true);
    }
  }

  public listen(cb: (npc: NPCName, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const npcModalManager = new NpcModalManager();

type NpcModals = Partial<Record<NPCName, boolean>>;
export const NPCModals: React.FC = () => {
  const [npc, setNpc] = useState<NPCName>();

  useEffect(() => {
    npcModalManager.listen((npc, open) => {
      setNpc(npc);
    });
  }, []);

  return (
    <>
      <Modal centered show={!!npc} onHide={() => setNpc(undefined)}>
        {npc === "adam" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.adam}
          >
            <div className="p-2">
              <p className="mb-2">Howdy farmer!</p>
              <p className="mb-2">Welcome to the Pumpkin Plaza.</p>
              <p className="mb-2">
                Here you can explore, trade & compete with other Bumpkins.
              </p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "boujee" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.boujee}
          >
            <div className="p-2">
              <p className="mb-2">I am opening </p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "billy" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.billy}
          >
            <div className="p-2">
              <p className="mb-2">Howdy Stranger!</p>
              <p className="mb-2">
                Whaaaaat....you've been to Sunflower Land?!?
              </p>
              <p className="mb-2">You don't look that old..</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "bobby" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.bobby}
          >
            <div className="p-2">
              <p className="mb-2">Mum told me not to talk to the Goblins...</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "blacksmith" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.blacksmith}
            tabs={[{ icon: SUNNYSIDE.icons.hammer, name: "Craft" }]}
          >
            <HeliosBlacksmithItems />
          </CloseButtonPanel>
        )}
        {npc === "alice" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.alice}
          >
            <div className="p-2">
              <p className="mb-2">
                Gather round Bumpkins, an auction is about to begin!
              </p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "grimbly" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.alice}
          >
            <div className="p-2">
              <p className="mb-2">Aaccckkkk!</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "grimtooth" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.alice}
          >
            <div className="p-2">
              <p className="mb-2">Aaaa</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "dulce" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.dulce}
          >
            <div className="p-2">
              <p className="mb-2">Why are you looking at me strange?</p>
              <p className="mb-2">Is there something in my teeth...</p>
            </div>
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
