import React, { useContext, useEffect, useState } from "react";
import { PotionHouse } from "features/game/expansion/components/potions/PotionHouse";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { AuctionHouseModal } from "./AuctionHouseModal";
import { BoatModal } from "./BoatModal";
import { PlazaBanner } from "./PlazaBanner";
import { OuterPanel } from "components/ui/Panel";
import { NyeButton } from "./NyeButton";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BasicTreasureChest } from "./chests/BasicTreasureChest";
import { SceneId } from "../mmoMachine";
import { BudBox } from "./chests/BudBox";
import { Raffle } from "./chests/Raffle";
import { FanArt } from "./FanArt";
import { BankModal } from "features/game/components/bank/components/BankModal";
import { GarbageCollectorModal } from "features/helios/components/garbageCollector/components/GarbageCollectorModal";
import { WishingWellModal } from "features/game/components/bank/components/WishingWellModal";
import { GoblinMarket } from "./market/GoblinMarket";
import { VIPGift } from "./VIPGift";
import { ChickenRescue } from "./portals/ChickenRescue";
import { InlineDialogue } from "./TypingMessage";
import { Label } from "components/ui/Label";
import { FestivalOfColors } from "./portals/FestivalOfColors";
import { FactionWeeklyPrize } from "./factions/weeklyPrize/FactionWeeklyPrize";
import { FactionWelcome, hasReadFactionIntro } from "./factions/FactionWelcome";
import { Champions } from "./factions/Champions";
import { KingdomNoticeboard } from "./kingdom/KingdomNoticeboard";
import { FactionNoticeboard } from "./factions/FactionNoticeboard";
import { CropsAndChickens } from "./portals/CropsAndChickens";
import { FruitDash } from "./portals/FruitDash";
import { DesertNoticeboard } from "./beach/DesertNoticeboard";
import { PirateChestModal } from "./chests/PirateChest";
import { ExampleDonations } from "./donations/ExampleDonations";
import { WorldMap } from "features/island/hud/components/deliveries/WorldMap";
import { Halloween } from "./portals/Halloween";
import { ChristmasPortal } from "./portals/ChristmasPortal";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ChristmasReward } from "./npcs/Santa";
import { MachineState } from "features/game/lib/gameMachine";
import { WeatherShop } from "features/game/expansion/components/temperateSeason/WeatherShop";

type InteractableName =
  | "desert_noticeboard"
  | "faction_noticeboard"
  | "kingdom_noticeboard"
  | "champions"
  | "faction_intro"
  | "vip_chest"
  | "weekly_faction_prize"
  | "donations"
  | "garbage_collector"
  | "basic_chest"
  | "luxury_chest"
  | "rare_chest"
  | "pirate_chest"
  | "kraken"
  | "nye_button"
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
  | "weather_shop"
  | "wishingWell"
  | "goblin_market"
  | "pledge_bumpkin"
  | "pledge_goblin"
  | "pledge_nightshade"
  | "pledge_sunflorian"
  | "bumpkins_faction"
  | "goblins_faction"
  | "nightshades_faction"
  | "sunflorians_faction"
  | "chicken_rescue"
  | "crops_and_chickens"
  | "fruit_dash"
  | "festival_of_colors"
  // to replace pledge factions
  | "join_goblins"
  | "join_sunflorians"
  | "join_bumpkins"
  | "join_nightshades"
  | "kingdom_book_1"
  | "kingdom_book_2"
  | "kingdom_book_3"
  | "kingdom_book_4"
  | "kingdom_book_5"
  | "kingdom_knight"
  | "fan_art"
  | "desert_book_1"
  | "desert_book_2"
  | "desert_book_3"
  | "desert_book_4"
  | "world_map"
  | "halloween"
  | "christmas_portal"
  | "festive_tree";

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

function getInitialModal(scene: SceneId): InteractableName | undefined {
  if (
    !hasReadFactionIntro() &&
    (scene === "goblin_house" ||
      scene === "bumpkin_house" ||
      scene === "nightshade_house" ||
      scene === "sunflorian_house")
  )
    return "faction_intro";

  return undefined;
}

interface Props {
  id: number;
  scene: SceneId;
}

const _state = (state: MachineState) => state.context.state;

export const InteractableModals: React.FC<Props> = ({ id, scene }) => {
  const [interactable, setInteractable] = useState<
    InteractableName | undefined
  >(getInitialModal(scene));
  const [isLoading, setIsLoading] = useState(false);

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  useEffect(() => {
    interactableModalManager.listen((interactable, open) => {
      setInteractable(interactable);
    });
  }, []);

  const closeModal = () => {
    !isLoading && setInteractable(undefined);
  };

  const { t } = useAppTranslation();

  return (
    <>
      <Modal show={interactable === "weekly_faction_prize"} onHide={closeModal}>
        <FactionWeeklyPrize onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "vip_chest"} onHide={closeModal}>
        <VIPGift onClose={closeModal} />
      </Modal>

      {/* TODO - make smoother opening */}
      {interactable === "auction_item" && (
        <AuctionHouseModal
          closeModal={closeModal}
          id={id}
          isOpen={interactable === "auction_item"}
        />
      )}
      <Modal show={interactable === "faction_intro"} onHide={closeModal}>
        <FactionWelcome onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "weather_shop"} onHide={closeModal}>
        <WeatherShop onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "desert_noticeboard"} onHide={closeModal}>
        <DesertNoticeboard onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "kingdom_noticeboard"} onHide={closeModal}>
        <KingdomNoticeboard onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "faction_noticeboard"} onHide={closeModal}>
        <FactionNoticeboard onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "champions"} onHide={closeModal}>
        <Champions onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "donations"} onHide={closeModal}>
        <CloseButtonPanel title={t("enjoying.event")} onClose={closeModal}>
          <ExampleDonations onClose={closeModal} />
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
      <Modal show={interactable === "basic_chest"} onHide={closeModal}>
        <BasicTreasureChest
          type="Treasure Key"
          onClose={closeModal}
          location={"plaza"}
          setIsLoading={setIsLoading}
        />
      </Modal>
      <Modal show={interactable === "rare_chest"} onHide={closeModal}>
        <BasicTreasureChest
          type="Rare Key"
          onClose={closeModal}
          location={"plaza"}
          setIsLoading={setIsLoading}
        />
      </Modal>
      <Modal show={interactable === "luxury_chest"} onHide={closeModal}>
        <BasicTreasureChest
          type="Luxury Key"
          onClose={closeModal}
          location={"plaza"}
          setIsLoading={setIsLoading}
        />
      </Modal>
      {interactable === "pirate_chest" && (
        <PirateChestModal
          show={interactable === "pirate_chest"}
          onClose={closeModal}
          setIsLoading={setIsLoading}
        />
      )}
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
      <Modal show={interactable === "clubhouse_reward"} onHide={closeModal}>
        <BudBox onClose={closeModal} setIsLoading={setIsLoading} />
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
          container={OuterPanel}
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
      <Modal show={interactable === "festive_tree"} onHide={closeModal}>
        <SpeakingModal
          onClose={closeModal}
          message={[
            {
              text: t("interactableModals.festiveTree.message1"),
            },
            {
              text: t("interactableModals.festiveTree.message2"),
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

      <Modal show={interactable === "chicken_rescue"} onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.billy}
        >
          <ChickenRescue onClose={closeModal} />
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "crops_and_chickens"} onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["cluck e cheese"]}
        >
          <CropsAndChickens onClose={closeModal} />
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "fruit_dash"} onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES["felga"]}
        >
          <FruitDash onClose={closeModal} />
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "festival_of_colors"} onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.billy}
        >
          <FestivalOfColors onClose={closeModal} />
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "halloween"} onHide={closeModal}>
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={NPC_WEARABLES.luna}
        >
          <Halloween onClose={closeModal} />
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "christmas_portal"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal} bumpkinParts={NPC_WEARABLES.elf}>
          <ChristmasPortal onClose={closeModal} />
        </CloseButtonPanel>
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
                      "_blank",
                    );
                  },
                },
                {
                  text: t("opensea"),
                  cb: () => {
                    window.open(
                      "https://opensea.io/collection/sunflower-land-buds",
                      "_blank",
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

      <Modal show={interactable === "fan_art"} onHide={closeModal}>
        <FanArt onClose={closeModal} />
      </Modal>

      <Modal show={interactable === "kingdom_knight"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.lostKnight")}
            </Label>
            <InlineDialogue message={t("easterEgg.knight")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "kingdom_book_1"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.queensDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.kingdomBook1")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "kingdom_book_2"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.queensDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.kingdomBook2")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "kingdom_book_3"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.jesterDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.kingdomBook3")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "kingdom_book_4"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.kingDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.kingdomBook4")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "kingdom_book_5"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.tywinDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.kingdomBook5")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "desert_book_1"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.digbysDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.desertBook1")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "desert_book_2"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.digbysDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.desertBook2")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "desert_book_3"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.pharaohsDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.desertBook3")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={interactable === "desert_book_4"} onHide={closeModal}>
        <CloseButtonPanel onClose={closeModal}>
          <div className="p-2">
            <Label type="default" className="mb-2">
              {t("easterEgg.goldtoothsDiary")}
            </Label>
            <InlineDialogue message={t("easterEgg.desertBook4")} />
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal
        show={interactable === "world_map"}
        dialogClassName="md:max-w-3xl"
        onHide={closeModal}
      >
        <WorldMap onClose={closeModal} />
      </Modal>
      <Modal
        show={interactable === "goblin_market"}
        dialogClassName="md:max-w-3xl"
        onHide={closeModal}
      >
        <GoblinMarket onClose={closeModal} />
      </Modal>
      <Modal show={interactable === "christmas_reward"}>
        <ChristmasReward onClose={closeModal} />
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
