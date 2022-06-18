import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import close from "assets/icons/close.png";

import traderImage from "assets/npcs/trader.gif";
import { canTrade } from "features/game/events/trade";
import { Offer } from "./component/Offer";
import { TradeOffer } from "features/game/types/game";

export const Trader: React.FC = () => {
  const [state, setState] = useState<
    "closed" | "alreadyTraded" | "noOffer" | "offer" | "trade" | "traded"
  >("closed");
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const open = () => {
    // Decide what content to show?

    if (!gameState.context.state.tradeOffer) {
      setState("noOffer");
    } else if (!canTrade(gameState.context.state)) {
      setState("alreadyTraded");
    } else {
      setState("trade");
    }
  };

  const handleTrade = () => {
    gameService.send("item.traded");
    setState("traded");
  };

  const handleCloseModal = () => {
    setState("closed");
  };

  const ModalContent = () => {
    if (state === "noOffer") {
      return (
        <div className="px-2 mb-2">
          <p className="mb-4">
            Nothing is on offer at the moment, check again soon to see if I have
            something else for you.
          </p>
        </div>
      );
    }

    if (state === "traded") {
      return (
        <div className="px-2 mb-2">
          <p className="mb-4">Thanks for doing business</p>
        </div>
      );
    }

    if (state === "alreadyTraded") {
      return (
        <div className="px-2 mb-2">
          <p className="mb-4">
            You have already traded with me for this period, check again soon to
            see if I have something else for you.
          </p>
        </div>
      );
    }

    if (state === "offer") {
      return (
        <Offer
          inventory={gameState.context.state.inventory}
          offer={gameState.context.state.tradeOffer as TradeOffer}
          onCraft={handleTrade}
        />
      );
    }

    // state === 'trade'
    return (
      <div className="flex flex-col mt-2 items-center">
        {/* Show nomad image */}
        <img src={traderImage}></img>
        {/* this are limited offers... This offer ends on "date".*/}
        <p className="mb-4">
          {`I'm a nomad, I'm here and there. 
              I bring items from my travellings to trade with farmers.`}
        </p>
        <p>Have a look at my current offers.</p>
        <Button
          onClick={() => setState("offer")}
          className="flex flex-row  mx-2"
        >
          Check Offer
        </Button>
      </div>
    );
  };

  return (
    <div
      className="z-100 absolute"
      id="trader"
      style={{
        width: `${GRID_WIDTH_PX * 1}px`,
        left: `${GRID_WIDTH_PX * 12.95}px`,
        top: `${GRID_WIDTH_PX * 2.8}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight z-10">
        <img src={traderImage} alt="trader" onClick={open} className="w-full" />
      </div>

      {/* Intro Modal */}
      <Modal centered show={state !== "closed"} onHide={handleCloseModal}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={handleCloseModal}
          />
          {ModalContent()}
        </Panel>
      </Modal>
    </div>
  );
};
