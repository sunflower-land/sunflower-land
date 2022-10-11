import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import stall from "assets/buildings/grub_shop.png";
import closeSign from "assets/buildings/close_sign_2.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { GrubShopModal } from "./components/GrubShopModal";

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

  return (
    <div
      className="z-10 absolute"
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

        {/* {specialCake && (
          <>
            <img
              src={ITEM_DETAILS[specialCake.name].image}
              className="absolute"
              style={{
                width: `${GRID_WIDTH_PX * 0.71}px`,
                right: `${GRID_WIDTH_PX * 3.07}px`,
                top: `${GRID_WIDTH_PX * 2.59}px`,
              }}
              onClick={openCakeModal}
            />

            {state.inventory["Chef Hat"] ? (
              <img
                src={chef}
                className="absolute"
                style={{
                  width: `${GRID_WIDTH_PX * 1.22222222222}px`,
                  right: `${GRID_WIDTH_PX * 1.71}px`,
                  top: `${GRID_WIDTH_PX * 2}px`,
                  transform: "scaleX(-1)",
                }}
                onClick={openCakeModal}
              />
            ) : (
              <img
                src={goblin}
                className="absolute"
                style={{
                  width: `${GRID_WIDTH_PX}px`,
                  right: `${GRID_WIDTH_PX * 1.95}px`,
                  top: `${GRID_WIDTH_PX * 2.5}px`,
                  transform: "scaleX(-1)",
                }}
                onClick={openCakeModal}
              />
            )}
          </>
        )} */}
      </div>
      <Modal centered show={showModal} onHide={closeModal}>
        <GrubShopModal onClose={closeModal} />
      </Modal>
    </div>
  );
};
