import React, { FC, useState } from "react";

import { createContext } from "react";
import { Modal } from "react-bootstrap";
import { BlockBucksModal } from "./components/BlockBucksModal";
import { StoreOnChainModal } from "./components/StoreOnChainModal";
import { GoldPassModal } from "features/game/expansion/components/GoldPass";
import { SpeakingModal } from "../SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { useNavigate } from "react-router-dom";
import { translate } from "lib/i18n/translate";

type GlobalModal =
  | "BUY_BLOCK_BUCKS"
  | "STORE_ON_CHAIN"
  | "GOLD_PASS"
  | "FIRST_EXPANSION"
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

  const navigate = useNavigate();
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

      <BlockBucksModal
        show={opened === "BUY_BLOCK_BUCKS"}
        onClose={handleClose}
        closeable={closeable}
        setCloseable={setCloseable}
      />

      <Modal centered show={opened === "STORE_ON_CHAIN"} onHide={handleClose}>
        <StoreOnChainModal onClose={handleClose} />
      </Modal>

      <Modal centered show={opened === "GOLD_PASS"} onHide={handleClose}>
        <GoldPassModal onClose={handleClose} />
      </Modal>

      <Modal centered show={opened === "FIRST_EXPANSION"}>
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
      <Modal centered show={opened === "BETTY"}>
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
      <Modal centered show={opened === "BLACKSMITH"}>
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
      <Modal centered show={opened === "THIRD_LEVEL"}>
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
