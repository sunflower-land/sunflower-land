import React, { FC, useState } from "react";

import { createContext } from "react";
import { Modal } from "react-bootstrap";
import { BlockBucksModal } from "./components/BlockBucksModal";
import { StoreOnChainModal } from "./components/StoreOnChainModal";
import { GoldPassModal } from "features/game/expansion/components/GoldPass";
import { SpeakingModal } from "../SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { useNavigate } from "react-router-dom";

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

      <Modal centered show={opened === "FIRST_EXPANSION"} onHide={handleClose}>
        <SpeakingModal
          message={[
            {
              text: "Congratulations, Bumpkin! Your farm is growing faster than a beanstalk in a rainstorm!",
            },
            {
              text: "With each expansion, you'll find cool stuff like special resources, new trees, and more to collect!",
            },
            {
              text: "Keep an eye out for surprise gifts from the generous goblins as you explore—they're not just expert builders, but crafty secret givers!",
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal centered show={opened === "BETTY"} onHide={handleClose}>
        <SpeakingModal
          message={[
            {
              text: "Hey there, Bumpkin! It's Betty from the farmer's market. I travel between islands to buy Crops and sell fresh seeds.",
            },
            {
              text: "Good news: you just stumbled upon a shiny new shovel! Bad news: we've hit a bit of a crop shortage.",
            },
            {
              text: "For a limited time I am offering newcomers double the money for any crops you bring to me.",
            },
            {
              text: "Harvest those Sunflowers and let's start your farming empire.",
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
        />
      </Modal>
      <Modal centered show={opened === "BLACKSMITH"} onHide={handleClose}>
        <SpeakingModal
          message={[
            {
              text: "Hmm, those crops are growing slow.",
            },
            {
              text: "Sunflower Land is full of magical items you can craft to enhance your farming abilities.",
            },
            {
              text: "Head over to the work bench and craft a scarecrow to speed up those Sunflowers.",
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal centered show={opened === "THIRD_LEVEL"} onHide={handleClose}>
        <SpeakingModal
          message={[
            {
              text: "Congratulations, your green thumb is truly shining!",
            },
            {
              text: "It's high time we head to the Plaza, where your farming prowess can shine even brighter",
            },
            {
              text: "At the plaza you can deliver your resources for rewards, craft magical items & trade with other players.",
              actions: [
                {
                  text: "Let's go!",
                  cb: () => navigate("/world/plaza"),
                },
              ],
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
    </ModalContext.Provider>
  );
};
