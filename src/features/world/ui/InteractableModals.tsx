import React, { useEffect, useState } from "react";
import { PotionHouse } from "features/game/expansion/components/potions/PotionHouse";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { KrakenIntro } from "./npcs/Shelly";
import { AuctionHouseModal } from "./AuctionHouseModal";
import { BoatModal } from "./BoatModal";
import { PlazaBanner } from "./PlazaBanner";
import { Panel } from "components/ui/Panel";
import { CropBoomFinish } from "features/portal/examples/cropBoom/components/CropBoomFinish";
import { Luna } from "./npcs/Luna";
import { NyeButton } from "./NyeButton";
import { PageFound } from "./PageFound";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BasicTreasureChest } from "./chests/BasicTreasureChest";
import { Donations } from "./donations/Donations";
import { SceneId } from "../mmoMachine";
import { TradingBoard } from "./npcs/TradingBoard";
import { BudBox } from "./chests/BudBox";
import { Raffle } from "./chests/Raffle";
import { FanArt } from "./FanArt";
import { BankModal } from "features/game/components/bank/components/BankModal";
import { GarbageCollectorModal } from "features/helios/components/garbageCollector/components/GarbageCollectorModal";
import { WishingWellModal } from "features/game/components/bank/components/WishingWellModal";
import { GoblinMarket } from "./market/GoblinMarket";
import { PledgeFaction } from "./factions/PledgeFaction";

export type FanArtNPC = "fan_npc_1" | "fan_npc_2" | "fan_npc_3" | "fan_npc_4";

type InteractableName =
  | FanArtNPC
  | "donations"
  | "garbage_collector"
  | "basic_chest"
  | "luxury_chest"
  | "rare_chest"
  | "kraken"
  | "nye_button"
  | "portal"
  | "welcome_sign"
  | "bud"
  | "plaza_statue"
  | "auction_item"
  | "boat_modal"
  | "homeless_man"
  | "potion_table"
  | "dawn_book_1"
  | "bank"
  | "dawn_book_2"
  | "dawn_book_3"
  | "dawn_book_4"
  | "betty_home"
  | "igor_home"
  | "windmill"
  | "guild_house"
  | "timmy_home"
  | "bert_home"
  | "fat_chicken"
  | "woodlands"
  | "castle"
  | "port"
  | "beach"
  | "lazy_bud"
  | "plaza_blue_book"
  | "plaza_orange_book"
  | "plaza_green_book"
  | "potion_house"
  | "clubhouse_reward"
  | "raffle"
  | "beach_green_book"
  | "beach_orange_book"
  | "beach_blue_book"
  | "walrus"
  | "banner"
  | "crop_boom_finish"
  | "christmas_reward"
  | "goblin_hammer"
  | "page_discovered"
  | "trading_board"
  | "wishingWell"
  | "goblin_market"
  | "pledge_bumpkin"
  | "pledge_goblin"
  | "pledge_nightshade"
  | "pledge_sunflorian";

class InteractableModalManager {
  private listener?: (name: InteractableName, isOpen: boolean) => void;

  public open(name: InteractableName) {
    if (this.listener) {
      this.listener(name, true);
    }
  }

  public listen(cb: (name: InteractableName, isOpen: boolean) => void) {
    this.listener = cb;
  }
}

export const interactableModalManager = new InteractableModalManager();

interface Props {
  id: number;
  scene: SceneId;
}

export const InteractableModals: React.FC<Props> = ({ id, scene }) => {
  const [interactable, setInteractable] = useState<InteractableName>();

  useEffect(() => {
    interactableModalManager.listen((interactable, open) => {
      setInteractable(interactable);
    });
  }, []);

  const closeModal = () => {
    setInteractable(undefined);
  };

  const { t } = useAppTranslation();

  return (
    <>
      {/* TODO - make smoother opening */}
      {interactable === "auction_item" && (
        <AuctionHouseModal
          closeModal={closeModal}
          id={id}
          isOpen={interactable === "auction_item"}
        />
      )}
      <Modal show={interactable === "donations"} onHide={closeModal}>
        <CloseButtonPanel title={t("enjoying.event")} onClose={closeModal}>
          <Donations />
        </CloseButtonPanel>
      </Modal>
      {interactable === "potion_table" && <PotionHouse onClose={closeModal} />}
      <Modal show={interactable === "boat_modal"} onHide={closeModal}>
        <BoatModal
          isOpen={interactable === "boat_modal"}
          closeModal={closeModal}
          id={id}
        />
      </Modal>
      <Modal show={interactable === "fat_chicken"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          message={[
            {
              text: t("interactableModals.fatChicken.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "kraken"} onHide={closeModal}>
        <KrakenIntro onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "lazy_bud"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          message={[
            {
              text: t("interactableModals.lazyBud.message"),
            },
          ]}
        />
      </Modal>
      {interactable === "banner" && (
        <PlazaBanner
          isOpen={interactable === "banner"}
          closeModal={closeModal}
        />
      )}
      <Modal show={interactable === "bud"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          message={[
            {
              text: t("interactableModals.bud.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "walrus"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          message={[
            {
              text: t("interactableModals.walrus.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "goblin_hammer"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.grimtooth}
          message={[
            {
              text: "Accckkk...Let me build in peace! Stella won't be happy if the Mega Store is not ready for Spring Blossom.",
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "plaza_blue_book"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.raven}
          message={[
            {
              text: t("interactableModals.plazaBlueBook.message1"),
            },
            {
              text: t("interactableModals.plazaBlueBook.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "basic_chest"}>
        <BasicTreasureChest
          type="Treasure Key"
          onClose={closeModal}
          location={"plaza"}
        />
      </Modal>
      <Modal show={interactable === "rare_chest"}>
        <BasicTreasureChest
          type="Rare Key"
          onClose={closeModal}
          location={"plaza"}
        />
      </Modal>
      <Modal show={interactable === "luxury_chest"}>
        <BasicTreasureChest
          type="Luxury Key"
          onClose={closeModal}
          location={"plaza"}
        />
      </Modal>
      <Modal show={interactable === "plaza_orange_book"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.cornwell}
          message={[
            {
              text: t("interactableModals.plazaOrangeBook.message1"),
            },
            {
              text: t("interactableModals.plazaOrangeBook.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "beach_green_book"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.finley}
          message={[
            {
              text: t("interactableModals.beachGreenBook.message1"),
            },
            {
              text: t("interactableModals.beachGreenBook.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "beach_blue_book"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.finn}
          message={[
            {
              text: t("interactableModals.beachBlueBook.message1"),
            },
            {
              text: t("interactableModals.beachBlueBook.message2"),
            },
            {
              text: t("interactableModals.beachBlueBook.message3"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "beach_orange_book"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.finley}
          message={[
            {
              text: t("interactableModals.beachOrangeBook.message1"),
            },
            {
              text: t("interactableModals.beachOrangeBook.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "plaza_green_book"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.grimbly}
          message={[
            {
              text: t("interactableModals.plazaGreenBook.message1"),
            },
            {
              text: t("interactableModals.plazaGreenBook.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "clubhouse_reward"}>
        <BudBox onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "raffle"} onHide={closeModal}>
        <Raffle onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "bank"} onHide={closeModal}>
        <BankModal onClose={closeModal} farmAddress="?" />
      </Modal>
      <Modal show={interactable === "garbage_collector"} onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.garbo}
        >
          <GarbageCollectorModal />
        </CloseButtonPanel>
      </Modal>
      {interactable === "wishingWell" && (
        <WishingWellModal onClose={closeModal} />
      )}
      <Modal show={interactable === "plaza_statue"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          message={[
            {
              text: t("interactableModals.plazaStatue.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "dawn_book_1"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["marcus"]}
          message={[
            {
              text: t("interactableModals.dawnBook1.message1"),
            },
            {
              text: t("interactableModals.dawnBook1.message2"),
            },
            {
              text: t("interactableModals.dawnBook1.message3"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "portal"} onHide={closeModal}>
        <Luna onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "dawn_book_2"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["bella"]}
          message={[
            {
              text: t("interactableModals.dawnBook2.message1"),
            },
            {
              text: t("interactableModals.dawnBook2.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "dawn_book_3"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["sofia"]}
          message={[
            {
              text: t("interactableModals.dawnBook3.message1"),
            },
            {
              text: t("interactableModals.dawnBook3.message2"),
            },
            {
              text: t("interactableModals.dawnBook3.message3"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "dawn_book_4"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["marcus"]}
          message={[
            { text: t("interactableModals.dawnBook4.message1") },
            {
              text: t("interactableModals.dawnBook4.message2"),
            },
            {
              text: t("interactableModals.dawnBook4.message3"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "timmy_home"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["timmy"]}
          message={[
            {
              text: t("interactableModals.timmyHome.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "windmill"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["cornwell"]}
          message={[
            {
              text: t("interactableModals.windmill.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "igor_home"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["igor"]}
          message={[
            {
              text: t("interactableModals.igorHome.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "potion_house"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          message={[
            {
              text: t("interactableModals.potionHouse.message1"),
            },
            {
              text: t("interactableModals.potionHouse.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "guild_house"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          message={[
            {
              text: t("interactableModals.guildHouse.message"),
              actions: [
                {
                  text: t("read.more"),
                  cb: () => {
                    window.open(
                      "https://docs.sunflower-land.com/player-guides/bud-nfts",
                      "_blank"
                    );
                  },
                },
                {
                  text: t("interactableModals.guildHouse.budsCollection"),
                  cb: () => {
                    window.open(
                      "https://opensea.io/collection/sunflower-land-buds",
                      "_blank"
                    );
                  },
                },
              ],
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "betty_home"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["betty"]}
          message={[
            {
              text: t("interactableModals.bettyHome.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "bert_home"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["bert"]}
          message={[
            {
              text: t("interactableModals.bertHome.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "beach"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["old salty"]}
          message={[
            {
              text: t("interactableModals.beach.message1"),
            },
            {
              text: t("interactableModals.beach.message2"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "castle"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["tywin"]}
          message={[
            {
              text: t("interactableModals.castle.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "woodlands"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["bert"]}
          message={[
            {
              text: t("interactableModals.woodlands.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "port"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["grubnuk"]}
          message={[
            {
              text: t("interactableModals.port.message"),
            },
          ]}
        />
      </Modal>
      <Modal show={interactable === "nye_button"} onHide={closeModal}>
        <NyeButton onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "crop_boom_finish"} onHide={closeModal}>
        <Panel bumpkinParts={NPC_WEARABLES.wizard}>
          <CropBoomFinish onClose={closeModal} />
        </Panel>
      </Modal>

      <Modal
        show={
          interactable === "fan_npc_1" ||
          interactable === "fan_npc_2" ||
          interactable === "fan_npc_3" ||
          interactable === "fan_npc_4"
        }
        onHide={closeModal}
      >
        <FanArt name={interactable as FanArtNPC} onClose={closeModal} />
      </Modal>

      <Modal show={interactable === "page_discovered"} onHide={closeModal}>
        <PageFound onClose={closeModal} />
      </Modal>
      <Modal
        show={interactable === "trading_board"}
        dialogClassName="md:max-w-3xl"
        onHide={closeModal}
      >
        <TradingBoard onClose={closeModal} />
      </Modal>
      <Modal
        show={interactable === "goblin_market"}
        dialogClassName="md:max-w-3xl"
        onHide={closeModal}
      >
        <GoblinMarket onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "pledge_sunflorian"} onHide={closeModal}>
        <PledgeFaction faction="sunflorians" onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "pledge_bumpkin"} onHide={closeModal}>
        <PledgeFaction faction="bumpkins" onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "pledge_goblin"} onHide={closeModal}>
        <PledgeFaction faction="goblins" onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "pledge_nightshade"} onHide={closeModal}>
        <PledgeFaction faction="nightshades" onClose={closeModal} />
      </Modal>
    </>
  );

  {
    /* 

      {/* <Modal
        
        show={!!interactable}
        onHide={closeModal}
      >
        <CloseButtonPanel onClose={closeModal}>
          {interactable === "fan_art" && (
            <div className="p-2">
              <p className="mb-2">Have you submitted your fan art?</p>
              <p className="mb-2">1000 SFL in prizes to be won!</p>
              <a
                href="https://github.com/sunflower-land/sunflower-land/discussions/2553"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </a>
            </div>
          )}
        </CloseButtonPanel>
      </Modal> */
  }
};
