import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Sofia } from "./dawn/Sofia";
import { Bella } from "./dawn/Bella";
import { CommunityIslands } from "./community/CommunityIslands";
import { DecorationShopItems } from "features/helios/components/decorations/component/DecorationShopItems";
import { WanderLeaf } from "./dawn/WanderLeaf";
import { DeliveryModal } from "./deliveries/DeliveryModal";

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

interface Props {
  onClose: () => void;
  onOpen: () => void;
}

export const NPCModals: React.FC<Props> = ({ onClose, onOpen }) => {
  const [npc, setNpc] = useState<NPCName>();

  useEffect(() => {
    npcModalManager.listen((npc, open) => {
      setNpc(npc);
      setTimeout(onOpen, 100); // Lag the pause of movement to give natural effect
    });
  }, []);

  const closeModal = () => {
    setNpc(undefined);
    onClose();
  };

  return (
    <>
      <Modal
        // dialogClassName="npc-dialog"
        show={!!npc}
        centered
        onHide={closeModal}
      >
        {npc === "sofia" && <Sofia onClose={closeModal} />}
        {npc === "bella" && <Bella onClose={closeModal} />}
        {npc === "wanderleaf" && <WanderLeaf onClose={closeModal} />}
        {npc === "frankie" && <DecorationShopItems onClose={closeModal} />}
        {npc === "stella" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.stella}
          >
            <div className="p-2">
              <p className="mb-2">Coming soon... </p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "grubnuk" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.grubnuk}
          >
            <CommunityIslands />
          </CloseButtonPanel>
        )}
        {npc === "lily" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.lily}
          >
            <div className="p-2">
              <p className="mb-2">Mum told me not to talk to the Goblins...</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "hammerin' harry" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["hammerin' harry"]}
            message={[
              { text: "Gather round Bumpkins, an auction is about to begin." },
            ]}
          />
        )}
        {npc === "marcus" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["marcus"]}
            message={[
              {
                text: "Hey! You are not allowed to go in my house. Don't you dare touch my things!",
              },
            ]}
          />
        )}
        {npc === "craig" && (
          <CloseButtonPanel
            onClose={closeModal}
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
            onClose={closeModal}
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
        {/* Delivery NPC's */}
        {npc === "pumpkin'pete" && (
          <DeliveryModal npc={npc} onClose={closeModal} />
        )}
        {/* Change to Blacksmith */}
        {npc === "igor" && <DeliveryModal npc={npc} onClose={closeModal} />}
        {/* Add to map */}
        {npc === "raven" && <DeliveryModal npc={npc} onClose={closeModal} />}
        {/* Add to map */}
        {npc === "tywin" && <DeliveryModal npc={npc} onClose={closeModal} />}
        {npc === "grimbly" && <DeliveryModal npc={npc} onClose={closeModal} />}
        {npc === "grimtooth" && (
          <DeliveryModal npc={npc} onClose={closeModal} />
        )}
        {npc === "bert" && <DeliveryModal npc={npc} onClose={closeModal} />}
        {npc === "timmy" && <DeliveryModal npc={npc} onClose={closeModal} />}
        {npc === "old salty" && (
          <DeliveryModal npc={npc} onClose={closeModal} />
        )}
        {npc === "betty" && <DeliveryModal npc={npc} onClose={closeModal} />}
      </Modal>
    </>
  );
};
