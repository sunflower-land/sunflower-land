import React, { FC, useState } from "react";

import { createContext } from "react";
import { Modal } from "components/ui/Modal";
import { StoreOnChainModal } from "./components/StoreOnChainModal";
import { SpeakingModal } from "../SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { translate } from "lib/i18n/translate";
import { BuyCurrenciesModal } from "features/island/hud/components/BuyCurrenciesModal";

type GlobalModal =
  | "BUY_BLOCK_BUCKS"
  | "BUY_BANNER"
  | "STORE_ON_CHAIN"
  | "FIRST_EXPANSION"
  | "NEXT_EXPANSION"
  | "THIRD_LEVEL"
  | "BETTY"
  | "BLACKSMITH";

export const ModalContext = createContext<{
  openModal: (type: GlobalModal) => void;
  // eslint-disable-next-line no-console
}>({ openModal: console.log });

export const ModalProvider: FC = ({ children }) => {
  const [opened, setOpened] = useState<GlobalModal>();
  const [closeable, setCloseable] = useState(true);

  const openModal = (type: GlobalModal) => {
    setOpened(type);
  };

  const handleClose = () => {
    if (!closeable) return;

    setOpened(undefined);
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}

      <BuyCurrenciesModal
        show={opened === "BUY_BLOCK_BUCKS"}
        onClose={handleClose}
        initialTab={0}
      />

      <BuyCurrenciesModal
        show={opened === "BUY_BANNER"}
        onClose={handleClose}
        initialTab={2}
      />

      <Modal show={opened === "STORE_ON_CHAIN"} onHide={handleClose}>
        <StoreOnChainModal onClose={handleClose} />
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
            {
              text: translate("betty.market-intro.three"),
            },
            {
              text: translate("betty.market-intro.four"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
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
      <Modal show={opened === "THIRD_LEVEL"}>
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
            {
              text: translate("pete.levelthree.four"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
    </ModalContext.Provider>
  );
};
