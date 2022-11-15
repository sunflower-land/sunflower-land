import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import stall from "assets/buildings/grub_shop.png";
import closeSign from "assets/buildings/close_sign_2.png";
import goblinChef from "assets/npcs/goblin_chef.gif";
import shadow from "assets/npcs/shadow.png";
import goblin from "assets/npcs/goblin.gif";
import heart from "assets/icons/heart.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { GrubShopModal } from "./components/GrubShopModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { ConsumableName } from "features/game/types/consumables";

export const GrubShop: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showModal, setShowModal] = React.useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const isClosed = !state.grubShop || state.grubShop.closesAt < Date.now();

  const ordersFulfilled = state.grubOrdersFulfilled ?? [];
  let lastFulfilledItemName: ConsumableName | undefined;
  if (ordersFulfilled.length > 0) {
    lastFulfilledItemName = state.grubShop?.orders.find(
      (order) => order.id === ordersFulfilled[ordersFulfilled.length - 1].id
    )?.name;
  }

  return (
    <div
      className="absolute"
      // TODO some sort of coordinate system
      style={{
        // width: `${GRID_WIDTH_PX * 6}px`,
        right: `${GRID_WIDTH_PX * 13}px`,
        top: `${GRID_WIDTH_PX * 20}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={stall}
          style={{
            width: `${PIXEL_SCALE * 59}px`,
          }}
          alt="bakery"
          onClick={openModal}
        />
        {isClosed && (
          <img
            src={closeSign}
            style={{
              width: `${PIXEL_SCALE * 29}px`,
              top: `${PIXEL_SCALE * 19}px`,
              left: `${PIXEL_SCALE * 23}px`,
            }}
            alt="closed"
            className="absolute pointer-events-none"
          />
        )}
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 60}px`,
            bottom: `${PIXEL_SCALE * 20}px`,
          }}
        />
        <img
          src={goblinChef}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            left: `${PIXEL_SCALE * 59}px`,
            bottom: `${PIXEL_SCALE * 22}px`,
            transform: "scaleX(-1)",
          }}
        />

        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 52}px`,
            bottom: `${PIXEL_SCALE * -10}px`,
          }}
        />
        <img
          src={goblin}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            left: `${PIXEL_SCALE * 51}px`,
            bottom: `${PIXEL_SCALE * -8}px`,
            transform: "scaleX(-1)",
          }}
        />

        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 5.5}px`,
            bottom: `${PIXEL_SCALE * -6}px`,
          }}
        />
        <img
          src={goblin}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            left: `${PIXEL_SCALE * 4}px`,
            bottom: `${PIXEL_SCALE * -4}px`,
          }}
        />

        <img
          src={heart}
          className="absolute animate-float"
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            left: `${PIXEL_SCALE * 9}px`,
            top: `${PIXEL_SCALE * 36.59}px`,
          }}
        />
        {lastFulfilledItemName && (
          <img
            src={ITEM_DETAILS[lastFulfilledItemName].image}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              right: `${PIXEL_SCALE * 15.5}px`,
              top: `${PIXEL_SCALE * 39.59}px`,
            }}
          />
        )}
      </div>
      <Modal centered show={showModal} onHide={closeModal}>
        <GrubShopModal onClose={closeModal} />
      </Modal>
    </div>
  );
};
