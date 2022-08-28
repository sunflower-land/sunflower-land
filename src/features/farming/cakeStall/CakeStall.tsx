import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import stall from "assets/buildings/cake_stall.png";
import goblin from "assets/npcs/goblin.gif";
import chefHat from "assets/bumpkins/small/hats/chef_hat.png";

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
    (item) =>
      !isExpired({ name: item.name, stockExpiry: state.stockExpiry }) &&
      state.inventory[item.name]
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
            {state.inventory["Chef Hat"] && (
              <img
                src={chefHat}
                className="absolute pointer-events-none"
                style={{
                  // TODO - just a placeholder
                  width: "31.5px",
                  right: "87.9px",
                  top: "99px",
                  transform: "scaleX(-1)",
                }}
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
