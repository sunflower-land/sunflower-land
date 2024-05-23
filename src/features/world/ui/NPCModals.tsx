import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import { DeliveryPanel } from "./deliveries/DeliveryPanel";
import { SceneId } from "../mmoMachine";

import { Birdie } from "./npcs/Birdie";
import { HayseedHankV2 } from "features/helios/components/hayseedHank/HayseedHankV2";
import { PotionHouseShopItems } from "features/helios/components/potions/component/PotionHouseShopItems";
import { Bert } from "./npcs/Bert";
import {
  CommunityDonations,
  SpecialEventDonations,
} from "./donations/Donations";
import { Finn } from "./npcs/Finn";
import { GoldTooth } from "./npcs/GoldTooth";
import { Mayor } from "./npcs/Mayor";
import { FlowerShop } from "./flowerShop/FlowerShop";
import { DecorationShopItems } from "features/helios/components/decorations/component/DecorationShopItems";
import { Stylist } from "./stylist/Stylist";
import { AuctionHouseModal } from "./AuctionHouseModal";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SpecialEventModal } from "./SpecialEventModal";
import { GarbageCollectorModal } from "features/helios/components/garbageCollector/components/GarbageCollectorModal";
import { Hopper } from "./npcs/Hopper";
import { FactionModalContent } from "./factions/FactionModalContent";
import { ChickenRescue } from "./portals/ChickenRescue";

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
  id: number;
}

function getInitialNPC(scene: SceneId): NPCName | undefined {
  return undefined;
}

export const NPCModals: React.FC<Props> = ({ scene, id }) => {
  const { t } = useAppTranslation();

  const [npc, setNpc] = useState<NPCName | undefined>(getInitialNPC(scene));

  useEffect(() => {
    npcModalManager.listen((npc) => {
      setNpc(npc);
    });
  }, []);

  const closeModal = () => {
    setNpc(undefined);
  };

  const isSeparateModal = npc === "Chun Long" || npc === "hammerin harry";

  return (
    <>
      <Modal
        // dialogClassName="npc-dialog"
        show={!!npc && !isSeparateModal}
        onHide={closeModal}
      >
        {npc === "flopsy" && (
          <CloseButtonPanel
            title="Enjoying Easter?"
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["flopsy"]}
          >
            <CommunityDonations />
          </CloseButtonPanel>
        )}

        {npc === "shelly" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "poppy" && <FlowerShop onClose={closeModal} />}
        {npc === "frankie" && <DecorationShopItems onClose={closeModal} />}
        {npc === "stella" && <Stylist onClose={closeModal} />}
        {npc === "grubnuk" && <DeliveryPanel npc={npc} onClose={closeModal} />}

        {npc === "garth" && <PotionHouseShopItems onClose={closeModal} />}
        {npc === "hopper" && <Hopper onClose={closeModal} />}

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
        {npc === "garbo" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.garbo}
          >
            <GarbageCollectorModal />
          </CloseButtonPanel>
        )}

        {npc === "gaucho" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.gaucho}
          >
            <SpecialEventDonations />
          </CloseButtonPanel>
        )}

        {npc === "billy" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.billy}
          >
            <ChickenRescue onClose={closeModal} />
          </CloseButtonPanel>
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
        {npc === "pumpkin' pete" && (
          <DeliveryPanel npc={npc} onClose={closeModal} />
        )}
        {npc === "blacksmith" && (
          <DeliveryPanel npc={npc} onClose={closeModal} />
        )}
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
        {npc === "mayor" && <Mayor onClose={closeModal} />}

        {npc === "guria" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "goblet" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "gordo" && <DeliveryPanel npc={npc} onClose={closeModal} />}

        {/* faction npcs */}
        {npc === "lady day" && <FactionModalContent onClose={closeModal} />}
        {npc === "robert" && <FactionModalContent onClose={closeModal} />}
        {npc === "grommy" && <FactionModalContent onClose={closeModal} />}
      </Modal>
      {npc === "Chun Long" && (
        <SpecialEventModal
          onClose={closeModal}
          show={npc === "Chun Long"}
          npc={npc}
          eventName="Lunar New Year"
        />
      )}

      {npc === "hammerin harry" && (
        <AuctionHouseModal
          closeModal={closeModal}
          id={id}
          isOpen={npc === "hammerin harry"}
        />
      )}
    </>
  );
};
