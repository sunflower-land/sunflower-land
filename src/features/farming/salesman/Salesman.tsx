import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

import salesmanImage from "assets/npcs/salesman.gif";
import shadow from "assets/npcs/shadow.png";
import { hasAlreadyTraded } from "features/game/events/trade";
import { Offer } from "./component/Offer";
import { TradeOffer } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import stopwatch from "assets/icons/stopwatch.png";
import { SUNNYSIDE } from "assets/sunnyside";

const Content: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="flex flex-col mt-2 items-center">
      <h1 className="mb-3 text-center sm:text-lg">{title}</h1>
      <img className="w-11 mb-2" src={salesmanImage} />
      {children}
    </div>
  );
};

export const Salesman: React.FC = () => {
  const [modalState, setModalState] = useState<
    "closed" | "intro" | "showOffer" | "tradeCompleted" | "alreadyTraded"
  >("closed");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { state } = gameState.context;

  // Don't show the salesman because there is no trade available
  if (!state.tradeOffer) return null;
  // Don't show the salesman because the trade offer has expired
  if (Date.now() > new Date(state.tradeOffer.endAt as string).getTime())
    return null;

  const handleOpenModal = () => {
    setShowModal(true);
    if (hasAlreadyTraded(state)) {
      setModalState("alreadyTraded");
      return;
    }

    setModalState("intro");
  };

  const handleTrade = () => {
    gameService.send("item.traded");
    setModalState("tradeCompleted");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const ModalContent = () => {
    if (modalState === "tradeCompleted") {
      return (
        <Content title="Thanks!">
          <p className="sm:text-sm p-2">
            It was a pleasure doing business with you. I will see you again
            soon!
          </p>
        </Content>
      );
    }

    if (modalState === "alreadyTraded") {
      return (
        <Content title="We've already traded!">
          <p className="sm:text-sm p-2">
            {`I have nothing left to trade. I'm just here catching up with old
            friends!`}
          </p>
        </Content>
      );
    }

    if (modalState === "showOffer") {
      return (
        <Offer
          inventory={state.inventory}
          offer={state.tradeOffer as TradeOffer}
          onCraft={handleTrade}
        />
      );
    }

    if (modalState === "intro") {
      const secondsLeft =
        (new Date(state.tradeOffer?.endAt as string).getTime() - Date.now()) /
        1000;

      return (
        <Content title="Greetings friend!">
          <p className="sm:text-sm p-2">
            I travel all over these lands collecting items to trade.
          </p>
          <p className="sm:text-sm p-2">
            What I have to offer you today is available for a limited time.
          </p>
          <span className="bg-blue-600 border flex text-[8px] sm:text-xxs items-center p-[3px] rounded-md whitespace-nowrap  mb-2">
            <img src={stopwatch} className="w-3 left-0 -top-4 mr-1" />
            <span className="mt-[2px]">{`${secondsToString(
              secondsLeft as number,
              { length: "medium" }
            )} left`}</span>
          </span>
          <Button onClick={() => setModalState("showOffer")}>
            {`Let's trade!`}
          </Button>
        </Content>
      );
    }
  };

  return (
    <div
      className="z-100 absolute"
      id="salesman"
      style={{
        width: `${GRID_WIDTH_PX * 1}px`,
        left: `${GRID_WIDTH_PX * 14.5}px`,
        top: `${GRID_WIDTH_PX * 34}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight z-10">
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * -1}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
        <img
          src={salesmanImage}
          alt="salesman"
          onClick={handleOpenModal}
          className="w-full"
        />
      </div>

      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Panel>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={handleCloseModal}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          {ModalContent()}
        </Panel>
      </Modal>
    </div>
  );
};
