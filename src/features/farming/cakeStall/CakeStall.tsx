import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import stall from "assets/buildings/cake_stall.png";
import goblin from "assets/npcs/goblin.gif";
import chef from "assets/npcs/goblin_chef.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CAKES } from "features/game/types/craftables";
import { isExpired } from "features/game/lib/stock";
import { ITEM_DETAILS } from "features/game/types/images";
import { CakeSale } from "./components/CakeSale";

export const CakeStall: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showModal, setShowModal] = React.useState(false);

  const openCakeModal = () => {
    setShowModal(true);
  };

  const closeCakeModal = () => {
    setShowModal(false);
  };

  const specialCake = Object.values(CAKES()).find(
    (item) => !isExpired({ name: item.name, stockExpiry: state.stockExpiry })
  );

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 6}px`,
        right: `${GRID_WIDTH_PX * 11}px`,
        top: `${GRID_WIDTH_PX * 4}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={stall}
          alt="bakery"
          onClick={openCakeModal}
          className="w-full"
        />
        {specialCake && (
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
        )}
      </div>
      <Modal centered show={showModal} onHide={closeCakeModal}>
        <CakeSale onClose={closeCakeModal} />
      </Modal>
    </div>
  );
};
