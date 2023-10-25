import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DecorationShopItems } from "features/helios/components/decorations/component/DecorationShopItems";
import { DeliveryPanel } from "./deliveries/DeliveryPanel";
import { Stylist } from "./stylist/Stylist";
import { SceneId } from "../mmoMachine";

import { Luna } from "./npcs/Luna";
import { Pete } from "./npcs/Pete";
import { Birdie } from "./npcs/Birdie";
import { HayseedHankV2 } from "features/helios/components/hayseedHank/HayseedHankV2";
import { Grubnuk } from "./npcs/Grubnuk";
import { Blacksmith } from "./npcs/Blacksmith";
import { PotionHouseShopItems } from "features/helios/components/potions/component/PotionHouseShopItems";
import { Bert } from "./npcs/Bert";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Donations } from "./donations/Donations";

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
  onNavigate: (sceneId: SceneId) => void;
}
export const NPCModals: React.FC<Props> = ({ onNavigate }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [npc, setNpc] = useState<NPCName>();

  const { openModal } = useContext(ModalContext);

  const inventory = gameState.context.state.inventory;

  useEffect(() => {
    npcModalManager.listen((npc, open) => {
      setNpc(npc);
    });
  }, []);

  const closeModal = () => {
    setNpc(undefined);
  };

  return (
    <>
      <Modal
        // dialogClassName="npc-dialog"
        show={!!npc}
        centered
        onHide={closeModal}
      >
        {npc === "phantom face" && (
          <CloseButtonPanel
            title="Enjoying Halloween?"
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["phantom face"]}
          >
            <Donations />
          </CloseButtonPanel>
        )}

        {npc === "frankie" && <DecorationShopItems onClose={closeModal} />}
        {npc === "stella" && <Stylist onClose={closeModal} />}
        {npc === "grubnuk" && <Grubnuk onClose={closeModal} />}

        {npc === "garth" && <PotionHouseShopItems onClose={closeModal} />}
        {npc === "hammerin harry" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["hammerin harry"]}
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
        {npc === "billy" && (
          <SpeakingModal
            bumpkinParts={NPC_WEARABLES.billy}
            onClose={closeModal}
            message={[
              {
                text: "Howdy, y'all! Name's Billy.",
              },
              {
                text: "I found these baby seedlings but for the life of me I cannot figure out what to do with them.",
              },
              {
                text: "I bet they have something to do with the worm buds that have been appearing around the plaza.",
                actions: [
                  {
                    text: "Read more",
                    cb: () => {
                      window.open(
                        "https://docs.sunflower-land.com/player-guides/bud-nfts",
                        "_blank"
                      );
                    },
                  },
                ],
              },
            ]}
          />
        )}
        {npc === "hank" && <HayseedHankV2 onClose={closeModal} />}
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
        {npc === "birdie" && <Birdie onClose={closeModal} />}
        {/* Delivery NPC's */}
        {npc === "pumpkin' pete" && <Pete onClose={closeModal} />}
        {npc === "blacksmith" && <Blacksmith onClose={closeModal} />}
        {npc === "raven" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "tywin" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "grimbly" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "grimtooth" && (
          <DeliveryPanel npc={npc} onClose={closeModal} />
        )}
        {npc === "bert" && <Bert onClose={closeModal} />}
        {npc === "timmy" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "old salty" && (
          <DeliveryPanel npc={npc} onClose={closeModal} />
        )}
        {npc === "betty" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "cornwell" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "luna" && (
          <Luna
            onNavigate={() => {
              onNavigate("corn_maze");
            }}
            onClose={closeModal}
          />
        )}
      </Modal>
    </>
  );
};
