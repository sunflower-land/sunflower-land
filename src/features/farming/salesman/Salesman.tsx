import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import close from "assets/icons/close.png";

import salesmanImage from "assets/npcs/salesman.gif";
import { hasAlreadyTraded } from "features/game/events/trade";
import { Offer } from "./component/Offer";
import { TradeOffer } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToMidString } from "lib/utils/time";
import stopwatch from "assets/icons/stopwatch.png";

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
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { setToast } = useContext(ToastContext);

  const { state } = gameState.context;

  // Don't show the salesman because there is no trade available
  if (!state.tradeOffer) return null;
  // Don't show the salesman because the trade offer has expired
  if (Date.now() > new Date(state.tradeOffer.endAt as string).getTime())
    return null;

  const handleOpenModal = () => {
    if (hasAlreadyTraded(state)) {
      setModalState("alreadyTraded");
      return;
    }

    setModalState("intro");
  };

  const handleTrade = () => {
    const offer = state.tradeOffer;

    if (offer) {
      offer.ingredients?.map((ingredient) => {
        const item = ITEM_DETAILS[ingredient.name];
        setToast({
          icon: item.image,
          content: `-${ingredient.amount}`,
        });
      });

      setToast({
        icon: ITEM_DETAILS[offer.name].image,
        content: `+${offer.amount}`,
      });
    }

    gameService.send("item.traded");
    setModalState("tradeCompleted");
  };

  const handleCloseModal = () => {
    setModalState("closed");
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
      const endDateLocale = new Date(
        state.tradeOffer?.endAt as string
      ).toLocaleDateString();

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
            <span className="mt-[2px]">{`${secondsToMidString(
              secondsLeft as number
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
        left: `${GRID_WIDTH_PX * 1}px`,
        top: `${GRID_WIDTH_PX * 4.5}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight z-10">
        <img
          src={salesmanImage}
          alt="salesman"
          onClick={handleOpenModal}
          className="w-full"
        />
      </div>

      <Modal centered show={modalState !== "closed"} onHide={handleCloseModal}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer z-10"
            onClick={handleCloseModal}
          />
          {ModalContent()}
        </Panel>
      </Modal>
    </div>
  );
};
