import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/valentin_farmer.gif";
import loveLetter from "src/assets/icons/love_letter.webp";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getValentineFood } from "features/game/types/valentine";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

export const ValentinFarmer: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { bumpkin, inventory } = state;
  const [showModal, setShowModal] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const { setToast } = useContext(ToastContext);
  const foodToRequest = getValentineFood(bumpkin);

  const consumeFood = () => {
    gameService.send("valentineFood.feed", {
      food: foodToRequest,
    });

    setToast({
      icon: ITEM_DETAILS[foodToRequest].image,
      content: `-1`,
    });

    setToast({
      icon: loveLetter,
      content: `+1`,
    });
    setShowFinalScreen(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowFinalScreen(false);
  };

  const QuestDescription = () => {
    return (
      <div>
        <p>Do you know what&apos;s the most sweet and romantic gesture?</p>
        <p className="mt-1">
          Offering someone the gift of food, which is cooked with love.
        </p>
        <p className="mt-4">
          If you offer me the following food, I would give you a Love Letter in
          return, which would contain the heartfelt expression of my feelings.
        </p>
        <div className="my-6 flex flex-col items-center">
          <img
            src={ITEM_DETAILS[foodToRequest].image}
            className="img-highlight mb-1"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />
          <p className="text-xs">{foodToRequest}</p>
        </div>
        <Button
          disabled={!(inventory[foodToRequest]?.toNumber() ?? 0)}
          onClick={consumeFood}
          className="mb-2"
        >
          Give Food Love
        </Button>
      </div>
    );
  };

  const QuestFinalScreen = () => {
    return (
      <div className="text-center">
        Here is your Love Letter.
        <img
          src={ITEM_DETAILS["Love Letter"].image}
          className="img-highlight mt-4 mb-3 mx-auto"
          style={{
            width: `${PIXEL_SCALE * 37}px`,
          }}
        />
      </div>
    );
  };

  return (
    <>
      <MapPlacement x={3.2} y={2} width={3}>
        <div className="relative w-full h-full">
          <img
            src={npc}
            onClick={() => setShowModal(true)}
            className="absolute cursor-pointer hover:img-highlight"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
            }}
          />
        </div>
      </MapPlacement>
      <Modal show={showModal} onHide={closeModal} centered>
        <CloseButtonPanel
          title={showFinalScreen ? "Thank you!" : "Love Is in the Air"}
          onClose={closeModal}
        >
          {showFinalScreen ? <QuestFinalScreen /> : <QuestDescription />}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
