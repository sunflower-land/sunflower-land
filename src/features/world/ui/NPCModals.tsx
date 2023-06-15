import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
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
      <Modal
        dialogClassName="npc-dialog"
        show={!!npc}
        size="xl"
        onHide={() => setNpc(undefined)}
      >
        {npc === "pumpkin'pete" && (
          <SpeakingModal
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES["pumpkin'pete"]}
            text={[
              "Howdy Bumpkin",
              `Welcome to the Plaza, I'm Pumpkin Pete.`,
              "Here you can explore, trade & compete with other Bumpkins.",
            ]}
            npc="pumpkin'pete"
          />
        )}
        {npc === "stella" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.stella}
          >
            <div className="p-2">
              <p className="mb-2">I am opening </p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "timmy" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.timmy}
          >
            <div className="p-2">
              <p className="mb-2">Howdy Stranger!</p>
              <p className="mb-2">
                {`Whaaaaat....you've been to Sunflower Land?!?`}
              </p>
              <p className="mb-2">{`Huh, you don't look that old...`}</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "lily" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.lily}
          >
            <div className="p-2">
              <p className="mb-2">Mum told me not to talk to the Goblins...</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "igor" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.igor}
            tabs={[{ icon: SUNNYSIDE.icons.hammer, name: "Craft" }]}
          >
            <HeliosBlacksmithItems />
          </CloseButtonPanel>
        )}
        {npc === "hammerin' harry" && (
          <SpeakingModal
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES["hammerin' harry"]}
            text={["Gather round Bumpkins, an auction is about to begin."]}
            npc="hammerin' harry"
          />
        )}
        {npc === "grimbly" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.grimbly}
          >
            <div className="p-2">
              <p className="mb-2">Aaccckkkk!</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "grimtooth" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.grimtooth}
          >
            <div className="p-2">
              <p className="mb-2">Aaaa</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "craig" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.craig}
          >
            <div className="p-2">
              <p className="mb-2">Why are you looking at me strange?</p>
              <p className="mb-2">Is there something in my teeth...</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "gabi" && (
          <CloseButtonPanel
            onClose={() => setNpc(undefined)}
            bumpkinParts={NPC_WEARABLES.gabi}
          >
            <div className="p-2">
              <p className="mb-2">Oi Bumpkin!</p>
              <p className="mb-2">
                You look creative, have you ever thought about contributing art
                to the game?
              </p>
            </div>
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
