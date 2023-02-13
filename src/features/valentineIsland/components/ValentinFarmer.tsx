import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/valentin_farmer.gif";
import shadow from "assets/npcs/shadow.png";
import loveLetter from "src/assets/icons/love_letter.png";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getValentineFood } from "features/game/types/valentine";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { SUNNYSIDE } from "assets/sunnyside";

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
        <div className="flex flex-col p-2">
          <p>{`I've got something special for you!`}</p>
          <p className="mt-4">Food is the way to my heart and I am hungry!</p>
          <p className="mt-4">
            Do you want to exchange food for a love letter?
          </p>
          <div className="my-6 flex flex-col items-center">
            <img
              src={ITEM_DETAILS[foodToRequest].image}
              className="img-highlight mb-1"
              style={{
                width: `${PIXEL_SCALE * 20}px`,
              }}
            />
            <p className="text-xs">{foodToRequest}</p>
          </div>
          <Button
            disabled={!(inventory[foodToRequest]?.toNumber() ?? 0)}
            onClick={consumeFood}
            className="mb-2"
          >
            Give Food
          </Button>
        </div>
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
      <MapPlacement x={3.2} y={2} width={3} height={1}>
        <div className="relative w-full h-full">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute animate-float"
            style={{
              width: `${PIXEL_SCALE * 3}px`,
              left: `${PIXEL_SCALE * 6}px`,
              top: `${PIXEL_SCALE * -8}px`,
            }}
          />
          <img
            src={npc}
            onClick={() => setShowModal(true)}
            className="absolute cursor-pointer hover:img-highlight z-20"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
            }}
          />
          <img
            src={shadow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              bottom: `${PIXEL_SCALE * -4}px`,
              left: `${PIXEL_SCALE * 0}px`,
            }}
          />
        </div>
      </MapPlacement>
      <Modal show={showModal} onHide={closeModal} centered>
        <CloseButtonPanel
          title={
            <div className="w-full flex justify-center">
              <img src={SUNNYSIDE.icons.heart} className="h-12" />
            </div>
          }
          onClose={closeModal}
        >
          {showFinalScreen ? <QuestFinalScreen /> : <QuestDescription />}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
