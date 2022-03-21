import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GameProvider";

import tailor from "assets/buildings/tailor.gif";
import flag from "assets/nfts/flags/sunflower.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { TailorSale } from "./components/TailorSale";

export const Tailor: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const handleMarketClick = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 3.5}px`,
        right: `${GRID_WIDTH_PX * 6}px`,
        top: `${GRID_WIDTH_PX * 36}px`,
      }}
    >
      <img src={tailor} className="w-full" />
      {isNotReadOnly && (
        <Action
          className="absolute -bottom-7 -left-2"
          text="Tailor"
          icon={flag}
          onClick={() => handleMarketClick()}
        />
      )}
      {isOpen && (
        <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
          <TailorSale onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
};
