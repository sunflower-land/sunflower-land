import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPCName, NPC_WEARABLES, isNPCAcknowledged } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DecorationShopItems } from "features/helios/components/decorations/component/DecorationShopItems";
import { DeliveryPanel } from "./deliveries/DeliveryPanel";
import { Stylist } from "./stylist/Stylist";
import { SceneId } from "../mmoMachine";

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
import { Shelly } from "./npcs/Shelly";
import { Finn } from "./npcs/Finn";
import { GoldTooth } from "./npcs/GoldTooth";
import { Luna } from "./npcs/Luna";
import { Mayor } from "./npcs/Mayor";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  scene: SceneId;
}

function getInitialNPC(scene: SceneId): NPCName | undefined {
  if (scene === "beach" && !isNPCAcknowledged("shelly")) {
    return "shelly";
  }

  return undefined;
}

export const NPCModals: React.FC<Props> = ({ onNavigate, scene }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [npc, setNpc] = useState<NPCName | undefined>(getInitialNPC(scene));

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
        {npc === "elf" && (
          <CloseButtonPanel
            title="Enjoying Christmas?"
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["elf"]}
          >
            <Donations />
          </CloseButtonPanel>
        )}

        {npc === "shelly" && <Shelly onClose={closeModal} />}

        {npc === "frankie" && <DecorationShopItems onClose={closeModal} />}
        {npc === "stella" && <Stylist onClose={closeModal} />}
        {npc === "grubnuk" && <Grubnuk onClose={closeModal} />}

        {npc === "garth" && <PotionHouseShopItems onClose={closeModal} />}
        {npc === "hammerin harry" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["hammerin harry"]}
            message={[{ text: translate("npc.Modal.Hammer") }]}
          />
        )}
        {npc === "marcus" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["marcus"]}
            message={[
              {
                text: translate("npc.Modal.Marcus"),
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
              <p className="mb-2">{t("npc.Modal.Craig")}</p>
              <p className="mb-2">{t("npc.Modal.Craig.one")}</p>
            </div>
          </CloseButtonPanel>
        )}
        {npc === "billy" && (
          <SpeakingModal
            bumpkinParts={NPC_WEARABLES.billy}
            onClose={closeModal}
            message={[
              {
                text: translate("npc.Modal.Billy"),
              },
              {
                text: translate("npc.Modal.Billy.one"),
              },
              {
                text: translate("npc.Modal.Billy.two"),
                actions: [
                  {
                    text: translate("read.more"),
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
        {npc === "goldtooth" && <GoldTooth onClose={closeModal} />}
        {npc === "hank" && <HayseedHankV2 onClose={closeModal} />}
        {npc === "gabi" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.gabi}
          >
            <div className="p-2">
              <p className="mb-2">{t("npc.Modal.Gabi")}</p>
              <p className="mb-2">{t("npc.Modal.Gabi.one")}</p>
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

        {npc === "corale" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "miranda" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "finn" && <Finn onClose={closeModal} />}
        {npc === "tango" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "finley" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "luna" && <Luna onClose={closeModal} />}
        {npc === "mayor" && <Mayor onClose={closeModal} />}
      </Modal>
    </>
  );
};
