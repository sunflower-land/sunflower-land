import React, { FC, useState } from "react";

import { createContext } from "react";
import { Modal } from "react-bootstrap";
import { BlockBucksModal } from "./components/BlockBucksModal";
import { StoreOnChainModal } from "./components/StoreOnChainModal";
import { GoldPassModal } from "features/game/expansion/components/GoldPass";
import { SpeakingModal } from "../SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";

type GlobalModal =
  | "BUY_BLOCK_BUCKS"
  | "STORE_ON_CHAIN"
  | "GOLD_PASS"
  | "FIRST_EXPANSION";

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

      <Modal centered show={opened === "FIRST_EXPANSION"} onHide={handleClose}>
        <SpeakingModal
          message={[
            {
              text: "You've done a mighty fine job expandin' the land, Bumpkin! Every time you clear new space, there's a whole heap of new resources just waitin' to be uncovered.",
            },
            {
              text: "To start farming, you will need to become stronger. You can level up by eating food!",
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.otis}
        />
      </Modal>
    </ModalContext.Provider>
  );
};
