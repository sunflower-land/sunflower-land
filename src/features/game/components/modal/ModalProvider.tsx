import React, { type FC, useState } from "react";
import { createContext } from "react";
import { Modal } from "components/ui/Modal";
import { SpeakingModal } from "../SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { translate } from "lib/i18n/translate";
import { CurrenciesModal } from "features/island/hud/components/CurrenciesModal";
import { VIPItems } from "./components/VIPItems";
import { VIPSavings } from "./components/VIPSavings";
import { OuterPanel, Panel } from "components/ui/Panel";
import { ReputationSystem } from "features/island/hud/components/reputation/Reputation";
import { Telegram } from "features/auth/components/Telegram/Telegram";
import { Twitter } from "features/auth/components/Twitter/Twitter";
import { ReferralContent } from "features/island/hud/components/referral/Referral";
import { CloseButtonPanel } from "../CloseablePanel";
import { DiscordBonus } from "features/game/expansion/components/DiscordBoat";
import { DailyRewardChest } from "features/game/expansion/components/dailyReward/DailyReward";
import { ChapterTracks } from "features/world/ui/tracks/ChapterTracks";
import { MarketplaceTutorialModal } from "./MarketplaceTutorialModal";
type GlobalModal =
  | "BUY_GEMS"
  | "DISCORD"
  | "BUY_BANNER"
  | "FIRST_EXPANSION"
  | "CHAPTER_TRACKS"
  | "NEXT_EXPANSION"
  | "SECOND_LEVEL"
  | "FIREPIT"
  | "BETTY"
  | "BETTY_SELL"
  | "BETTY_BUY"
  | "BETTY_PLANT"
  | "FIREPIT_RHUBARB"
  | "FIREPIT_SPEEDUP"
  | "FIREPIT_EAT"
  | "BLACKSMITH"
  | "BLACKSMITH_PLACE"
  | "NATIVE_BONUS"
  | "PETE_CHOP"
  | "PETE_EXPAND"
  | "EXPAND_LAND"
  | "VIP_ITEMS"
  | "VIP_SAVINGS"
  | "REPUTATION"
  | "TELEGRAM"
  | "TWITTER"
  | "REFERRAL"
  | "DEPOSIT"
  | "DAILY_REWARD"
  | "MARKETPLACE_TUTORIAL";

export const ModalContext = createContext<{
  openModal: (type: GlobalModal) => void;
  // eslint-disable-next-line no-console
}>({ openModal: console.log });

export const ModalProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const [opened, setOpened] = useState<GlobalModal>();

  const openModal = (type: GlobalModal) => {
    setOpened(type);
  };

  const handleClose = () => setOpened(undefined);

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}

      <CurrenciesModal
        show={opened === "BUY_GEMS"}
        onClose={handleClose}
        initialPage="gems"
      />

      <CurrenciesModal
        show={opened === "BUY_BANNER"}
        onClose={handleClose}
        initialPage="vip"
      />

      <CurrenciesModal
        show={opened === "DEPOSIT"}
        onClose={handleClose}
        initialPage="deposit"
      />

      <Modal show={opened === "DISCORD"} onHide={handleClose}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES.wobble}
          onClose={handleClose}
        >
          <DiscordBonus onClose={handleClose} />
        </CloseButtonPanel>
      </Modal>

      <Modal show={opened === "VIP_ITEMS"} onHide={handleClose}>
        <Panel>
          <VIPItems />
        </Panel>
      </Modal>

      <Modal show={opened === "VIP_SAVINGS"} onHide={handleClose}>
        <CloseButtonPanel onClose={handleClose}>
          <VIPSavings showBuyButton />
        </CloseButtonPanel>
      </Modal>

      <Modal show={opened === "CHAPTER_TRACKS"} onHide={handleClose}>
        <OuterPanel>
          <ChapterTracks />
        </OuterPanel>
      </Modal>

      <Modal show={opened === "REPUTATION"} onHide={handleClose}>
        <ReputationSystem onClose={handleClose} />
      </Modal>

      <Modal show={opened === "TELEGRAM"} onHide={handleClose}>
        <Telegram onClose={handleClose} />
      </Modal>

      <Modal show={opened === "TWITTER"} onHide={handleClose}>
        <Twitter onClose={handleClose} />
      </Modal>

      <Modal show={opened === "REFERRAL"} onHide={handleClose}>
        <ReferralContent onHide={handleClose} />
      </Modal>

      <Modal show={opened === "FIRST_EXPANSION"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.first-expansion.one"),
            },
            {
              text: translate("pete.first-expansion.two"),
            },
            {
              text: translate("pete.first-expansion.three"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>

      <Modal show={opened === "NEXT_EXPANSION"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.first-expansion.four"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal show={opened === "BETTY"}>
        <SpeakingModal
          message={[
            {
              text: translate("betty.market-intro.one"),
            },
            {
              text: translate("betty.market-intro.harvest"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
        />
      </Modal>

      <Modal show={opened === "BETTY_SELL"}>
        <SpeakingModal
          message={[
            {
              text: translate("betty.market-intro.sell"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
        />
      </Modal>

      <Modal show={opened === "BETTY_BUY"}>
        <SpeakingModal
          message={[
            {
              text: translate("betty.market-intro.buy"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
        />
      </Modal>

      <Modal show={opened === "BETTY_PLANT"}>
        <SpeakingModal
          message={[
            {
              text: translate("betty.market-intro.plant"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
        />
      </Modal>

      <Modal show={opened === "FIREPIT_RHUBARB"}>
        <SpeakingModal
          message={[
            {
              text: translate("firepit-intro.rhubarb"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.bruce}
        />
      </Modal>

      <Modal show={opened === "FIREPIT_SPEEDUP"}>
        <SpeakingModal
          message={[
            {
              text: translate("firepit-intro.speedUp"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.bruce}
        />
      </Modal>

      <Modal show={opened === "FIREPIT_EAT"}>
        <SpeakingModal
          message={[
            {
              text: translate("firepit-intro.eat"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.bruce}
        />
      </Modal>

      <Modal show={opened === "FIREPIT"}>
        <SpeakingModal
          message={[
            {
              text: translate("firepit-intro.cook"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.bruce}
        />
      </Modal>

      <Modal show={opened === "BLACKSMITH"}>
        <SpeakingModal
          message={[
            {
              text: translate("blacksmith.scarecrow.craft"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.blacksmith}
        />
      </Modal>
      <Modal show={opened === "BLACKSMITH_PLACE"}>
        <SpeakingModal
          message={[
            {
              text: translate("blacksmith.scarecrow.place"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.blacksmith}
        />
      </Modal>
      <Modal show={opened === "PETE_CHOP"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.chopTrees"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal show={opened === "PETE_EXPAND"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.expandAgain"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal show={opened === "EXPAND_LAND"}>
        <SpeakingModal
          message={[
            {
              text: translate("grimbly.expandLand.one"),
            },
            {
              text: translate("grimbly.expandLand.two"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.grimbly}
        />
      </Modal>
      <Modal show={opened === "NATIVE_BONUS"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.nativeBonus.one"),
            },
            {
              text: translate("pete.nativeBonus.two"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal show={opened === "SECOND_LEVEL"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.levelTwo.codex"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>

      <Modal show={opened === "MARKETPLACE_TUTORIAL"}>
        <MarketplaceTutorialModal onClose={handleClose} />
      </Modal>

      <DailyRewardChest show={opened === "DAILY_REWARD"} onHide={handleClose} />
    </ModalContext.Provider>
  );
};
