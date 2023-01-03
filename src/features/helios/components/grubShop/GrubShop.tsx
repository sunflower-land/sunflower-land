import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import stall from "assets/buildings/grub_shop.png";
import closeSign from "assets/buildings/close_sign_2.png";
import goblinChef from "assets/npcs/goblin_chef.gif";
import shadow from "assets/npcs/shadow.png";
import goblin from "assets/npcs/goblin.gif";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { GrubShopModal } from "./components/GrubShopModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { ConsumableName } from "features/game/types/consumables";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { setImageWidth } from "lib/images";

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
    <MapPlacement x={2} y={1} height={5} width={5}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openModal}
      >
        <img
          src={stall}
          style={{
            width: `${PIXEL_SCALE * 59}px`,
            bottom: `${PIXEL_SCALE * 12}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          alt="bakery"
          className="absolute"
        />
        {isClosed && (
          <img
            src={closeSign}
            style={{
              width: `${PIXEL_SCALE * 29}px`,
              bottom: `${PIXEL_SCALE * 40}px`,
              left: `${PIXEL_SCALE * 23}px`,
            }}
            alt="closed"
            className="absolute"
          />
        )}

        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 60}px`,
            bottom: `${PIXEL_SCALE * 30}px`,
          }}
        />
        <img
          src={goblinChef}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            left: `${PIXEL_SCALE * 59}px`,
            bottom: `${PIXEL_SCALE * 32}px`,
            transform: "scaleX(-1)",
          }}
        />

        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 52}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        />
        <img
          src={goblin}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            left: `${PIXEL_SCALE * 51}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            transform: "scaleX(-1)",
          }}
        />

        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 5.5}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
        />
        <img
          src={goblin}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            left: `${PIXEL_SCALE * 4}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
          }}
        />

        {lastFulfilledItemName && (
          <img
            src={ITEM_DETAILS[lastFulfilledItemName].image}
            className="absolute"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (
                !img ||
                !img.complete ||
                !img.naturalWidth ||
                !img.naturalHeight
              ) {
                return;
              }

              const left = Math.floor((76 - img.naturalWidth) / 2);
              const bottom = Math.floor((50 - img.naturalHeight) / 2);
              img.style.left = `${PIXEL_SCALE * left}px`;
              img.style.bottom = `${PIXEL_SCALE * bottom}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
            }}
          />
        )}
      </div>
      <Modal centered show={showModal} onHide={closeModal}>
        <GrubShopModal onClose={closeModal} />
      </Modal>
    </MapPlacement>
  );
};
