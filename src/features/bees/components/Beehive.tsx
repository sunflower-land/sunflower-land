import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GameProvider";

import bee from "assets/buildings/hive.png";
import { beesAudio } from "lib/utils/sfx";
import beehive from "assets/buildings/beehive.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { BeeSale } from "./BeeSale";
import classNames from "classnames";
import { Inventory } from "features/game/types/game";

export const Beehive: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const isNotReadOnly = !gameState.matches("readonly");

  //function to open the modal and play hive sound
  const openHive = () => {
    setIsOpen(true);
    beesAudio.play();
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        left: `${-GRID_WIDTH_PX * 1}px`,
        top: `${-GRID_WIDTH_PX * 5.7}px`,
      }}
    >
      <img src={beehive} className="w-full " />
      <div
        className={classNames({
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      >
        {isNotReadOnly && state.inventory["Bee Hive"] && (
          <Action
            className="absolute left-4"
            text="Hive"
            icon={bee}
            onClick={openHive}
          />
        )}
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <BeeSale onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
