import React, { FC, useState } from "react";

import { createContext } from "react";
import { Modal } from "components/ui/Modal";
import { StoreOnChainModal } from "./components/StoreOnChainModal";
import { SpeakingModal } from "../SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { translate } from "lib/i18n/translate";
import { CurrenciesModal } from "features/island/hud/components/CurrenciesModal";
import { VIPItems } from "./components/VIPItems";
import { Panel } from "components/ui/Panel";
import { ReputationSystem } from "features/island/hud/components/reputation/Reputation";
import { Telegram } from "features/auth/components/Telegram/Telegram";
import { Twitter } from "features/auth/components/Twitter/Twitter";
import { ReferralContent } from "features/island/hud/components/referral/Referral";
import { CloseButtonPanel } from "../CloseablePanel";
import { DiscordBonus } from "features/game/expansion/components/DiscordBoat";
import { Streams } from "./components/Streams";
import { Merkl } from "./components/Merkl";
import { Rewards } from "features/island/hud/components/referral/Rewards";
type GlobalModal =
  | "BUY_GEMS"
  | "DISCORD"
  | "BUY_BANNER"
  | "STORE_ON_CHAIN"
  | "FIRST_EXPANSION"
  | "NEXT_EXPANSION"
  | "SECOND_LEVEL"
  | "FIREPIT"
  | "BETTY"
  | "BLACKSMITH"
  | "VIP_ITEMS"
  | "REPUTATION"
  | "TELEGRAM"
  | "TWITTER"
  | "REFERRAL"
  | "STREAMS"
  | "MERKL"
  | "DEPOSIT"
  | "DAILY_REWARD"
  | "EARN";

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

      <Modal show={opened === "STORE_ON_CHAIN"} onHide={handleClose}>
        <StoreOnChainModal onClose={handleClose} />
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

      <Modal show={opened === "STREAMS"} onHide={handleClose}>
        <Streams onClose={handleClose} />
      </Modal>

      <Modal show={opened === "MERKL"} onHide={handleClose}>
        <Merkl onClose={handleClose} />
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
              text: translate("betty.market-intro.two"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
        />
      </Modal>

      <Modal show={opened === "FIREPIT"}>
        <SpeakingModal
          message={[
            {
              text: translate("firepit-intro.one"),
            },
            {
              text: translate("firepit-intro.two"),
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
              text: translate("pete.craftScarecrow.one"),
            },
            {
              text: translate("pete.craftScarecrow.two"),
            },
            {
              text: translate("pete.craftScarecrow.three"),
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
              text: translate("pete.levelthree.one"),
            },
            {
              text: translate("pete.levelthree.two"),
            },
            {
              text: translate("pete.levelthree.three"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>

      <Rewards show={opened === "EARN"} onHide={handleClose} tab={"Earn"} />
    </ModalContext.Provider>
  );
};
