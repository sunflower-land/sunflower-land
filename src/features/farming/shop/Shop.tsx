import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import shop from "assets/buildings/shop_building.png";
import plant from "assets/icons/plant.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import { ShopItems } from "./ShopItems";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { shopAudio } from "lib/utils/sfx";

export const Shop: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const handleShopClick = () => {
    setIsOpen(true);
    shopAudio.play();
  };

  return (
    <div
      id={Section.Shop}
      className={classNames("absolute", {
        "cursor-pointer": isNotReadOnly,
        "hover:img-highlight": isNotReadOnly,
      })}
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * 3}px`,
        top: `${GRID_WIDTH_PX * 5}px`,
      }}
    >
      <img
        src={shop}
        alt="shop"
        onClick={isNotReadOnly ? handleShopClick : undefined}
        className="w-full"
      />
      {isNotReadOnly && (
        <Action
          className="absolute top-5 left-4"
          text="Shop"
          icon={plant}
          onClick={handleShopClick}
        />
      )}
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <ShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
