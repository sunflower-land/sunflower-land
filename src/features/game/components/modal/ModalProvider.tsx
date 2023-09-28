import React, { FC, useState } from "react";

import { createContext } from "react";
import { Modal } from "react-bootstrap";
import { BlockBucksModal } from "./components/BlockBucksModal";
import { StoreOnChainModal } from "./components/StoreOnChainModal";
import { GoldPassModal } from "features/game/expansion/components/GoldPass";
import { BudModal } from "./components/BudModal";

type GlobalModal =
  | "BUY_BLOCK_BUCKS"
  | "STORE_ON_CHAIN"
  | "GOLD_PASS"
  | "BUD_ANNOUNCEMENT";

export const ModalContext = createContext<{
  openModal: (type: GlobalModal) => void;
}>({ openModal: console.log });

export const ModalProvider: FC = ({ children }) => {
  const [opened, setOpened] = useState<GlobalModal>();
  const [closeable, setCloseable] = useState(true);

  const openModal = (type: GlobalModal) => {
    console.log({ override: type });
    setOpened(type);
  };

  const handleClose = () => {
    if (!closeable) return;
    setOpened(undefined);
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <Modal centered show={opened === "BUY_BLOCK_BUCKS"} onHide={handleClose}>
        <BlockBucksModal
          onClose={handleClose}
          closeable={closeable}
          setCloseable={setCloseable}
        />
      </Modal>

      <Modal centered show={opened === "STORE_ON_CHAIN"} onHide={handleClose}>
        <StoreOnChainModal onClose={handleClose} />
      </Modal>

      <Modal centered show={opened === "GOLD_PASS"} onHide={handleClose}>
        <GoldPassModal onClose={handleClose} />
      </Modal>

      <Modal centered show={opened === "BUD_ANNOUNCEMENT"} onHide={handleClose}>
        <BudModal onClose={handleClose} />
      </Modal>
    </ModalContext.Provider>
  );
};
