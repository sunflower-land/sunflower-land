import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPCName, NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import { DeliveryPanel } from "./deliveries/DeliveryPanel";
import { SceneId } from "../mmoMachine";

import { Birdie } from "./npcs/Birdie";
import { PotionHouseShopItems } from "features/helios/components/potions/component/PotionHouseShopItems";
import { Bert } from "./npcs/Bert";
import { Finn } from "./npcs/Finn";
import { Mayor } from "./npcs/Mayor";
import { DecorationShopItems } from "features/helios/components/decorations/component/DecorationShopItems";
import { Stylist } from "./stylist/Stylist";
import { AuctionHouseModal } from "./AuctionHouseModal";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GarbageCollectorModal } from "features/helios/components/garbageCollector/components/GarbageCollectorModal";
import { Hopper } from "./npcs/Hopper";
import { ChickenRescue } from "./portals/ChickenRescue";
import { JoinFactionModal } from "./factions/JoinFactionModal";
import { EmblemsTrading } from "./factions/emblemTrading/EmblemsTrading";
import { KingdomChoresPanel } from "./factions/chores/KingdomChoresPanel";
import { OuterPanel } from "components/ui/Panel";
import { FactionKitchenPanel } from "./factions/FactionKitchenPanel";
import { PortalNPCExample } from "features/portal/example/components/PortalNPCExample";
import { FactionShop } from "./factionShop/FactionShop";
import { FactionPetPanel } from "./factions/FactionPetPanel";
import { TreasureShop } from "./beach/treasure_shop/TreasureShop";
import { Context } from "features/game/GameProvider";
import { Digby } from "./beach/Digby";
import { CropsAndChickens } from "./portals/CropsAndChickens";
import { ExampleDonations } from "./donations/ExampleDonations";
import { NPCS_WITH_ALERTS } from "../containers/BumpkinContainer";
import { HalloweenNPC } from "./npcs/HalloweenNPC";
import { FlowerBounties } from "./flowerShop/FlowerBounties";

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
  scene: SceneId;
  id: number;
}

function getInitialNPC(scene: SceneId): NPCName | undefined {
  return undefined;
}

export const NPCModals: React.FC<Props> = ({ scene, id }) => {
  const { t } = useAppTranslation();

  const [npc, setNpc] = useState<NPCName | undefined>(getInitialNPC(scene));

  const { gameService } = useContext(Context);

  useEffect(() => {
    npcModalManager.listen((npc) => {
      setNpc(npc);
    });
  }, []);

  const closeModal = () => {
    if (npc && !!NPCS_WITH_ALERTS[npc]) {
      acknowledgeNPC(npc);
    }
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
        {npc === "chase" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["chase"]}
            message={[
              {
                text: t("npcDialogues.chase.intro1"),
              },
              {
                text: t("npcDialogues.chase.intro2"),
              },
            ]}
          />
        )}
        {npc === "flopsy" && (
          <CloseButtonPanel
            title="Enjoying Easter?"
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["flopsy"]}
          >
            <ExampleDonations onClose={closeModal} />
          </CloseButtonPanel>
        )}
        {npc === "luna" && <HalloweenNPC onClose={closeModal} />}
        {npc === "portaller" && <PortalNPCExample onClose={closeModal} />}
        {npc === "poppy" && <FlowerBounties onClose={closeModal} />}
        {npc === "frankie" && <DecorationShopItems onClose={closeModal} />}
        {npc === "stella" && <Stylist onClose={closeModal} />}
        {npc === "grubnuk" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "garth" && <PotionHouseShopItems onClose={closeModal} />}
        {npc === "hopper" && <Hopper onClose={closeModal} />}

        {npc === "digby" && <Digby onClose={closeModal} />}
        {npc === "pharaoh" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "petro" && (
          <SpeakingModal
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["petro"]}
            message={[
              {
                text: translate("npc.Modal.Petro"),
              },
            ]}
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
        {npc === "garbo" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES.garbo}
            container={OuterPanel}
          >
            <GarbageCollectorModal />
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
        {npc === "cluck e cheese" && (
          <CloseButtonPanel
            onClose={closeModal}
            bumpkinParts={NPC_WEARABLES["cluck e cheese"]}
          >
            <CropsAndChickens onClose={closeModal} />
          </CloseButtonPanel>
        )}
        {npc === "jafar" && <TreasureShop onClose={closeModal} />}
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
        {npc === "peggy" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "raven" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "victoria" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "jester" && <DeliveryPanel npc={npc} onClose={closeModal} />}
        {npc === "gambit" && <DeliveryPanel npc={npc} onClose={closeModal} />}
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
        {/* Kingdom NPCs */}
        {npc === "barlow" && (
          <JoinFactionModal npc={npc} onClose={closeModal} />
        )}
        {npc === "graxle" && (
          <JoinFactionModal npc={npc} onClose={closeModal} />
        )}
        {npc === "nyx" && <JoinFactionModal npc={npc} onClose={closeModal} />}
        {npc === "reginald" && (
          <JoinFactionModal npc={npc} onClose={closeModal} />
        )}
        {/* Emblem Traders */}
        {npc === "glinteye" && (
          <EmblemsTrading onClose={closeModal} emblem="Goblin Emblem" />
        )}
        {npc === "solara" && (
          <EmblemsTrading onClose={closeModal} emblem="Sunflorian Emblem" />
        )}
        {npc === "dusk" && (
          <EmblemsTrading onClose={closeModal} emblem="Nightshade Emblem" />
        )}
        {npc === "haymitch" && (
          <EmblemsTrading onClose={closeModal} emblem="Bumpkin Emblem" />
        )}
        {/* Faction Chores */}
        {npc === "grizzle" && (
          <KingdomChoresPanel onClose={closeModal} npc={npc} />
        )}
        {npc === "buttercup" && (
          <KingdomChoresPanel onClose={closeModal} npc={npc} />
        )}
        {npc === "shadow" && (
          <KingdomChoresPanel onClose={closeModal} npc={npc} />
        )}
        {npc === "flora" && (
          <KingdomChoresPanel onClose={closeModal} npc={npc} />
        )}
        {npc === "chef ebon" && (
          <FactionKitchenPanel bumpkinParts={NPC_WEARABLES["chef ebon"]} />
        )}
        {npc === "chef tuck" && (
          <FactionKitchenPanel bumpkinParts={NPC_WEARABLES["chef tuck"]} />
        )}
        {npc === "chef maple" && (
          <FactionKitchenPanel bumpkinParts={NPC_WEARABLES["chef maple"]} />
        )}
        {npc === "chef lumen" && (
          <FactionKitchenPanel bumpkinParts={NPC_WEARABLES["chef lumen"]} />
        )}
        {npc === "eldric" && <FactionShop onClose={closeModal} />}
        {npc === "pet" && <FactionPetPanel onClose={closeModal} />}
      </Modal>

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
