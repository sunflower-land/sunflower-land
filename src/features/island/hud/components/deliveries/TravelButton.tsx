import React, { useState, useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import world from "assets/icons/world.png";
import { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "components/ui/Modal";
import { WorldMap } from "./WorldMap";

const _chores = (state: MachineState) => state.context.state.chores;

export const Travel: React.FC<{ isVisiting?: boolean }> = ({
  isVisiting = false,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="relative">
        <div
          id="deliveries"
          className="flex relative z-50 justify-center cursor-pointer hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 23}px`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={world}
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 5}px`,
              top: `${PIXEL_SCALE * 4}px`,
            }}
            className="absolute"
          />
        </div>
      </div>

      <Modal
        show={showModal}
        dialogClassName="md:max-w-3xl"
        onHide={() => setShowModal(false)}
      >
        <WorldMap onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};

export const TravelButton = React.memo(Travel);
