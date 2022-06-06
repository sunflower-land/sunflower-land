import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { AncientTreeModal } from "./AncientTreeModal";
import { Context } from "features/game/GoblinProvider";

import whiteTree from "assets/quest/white_tree.png";
import stump from "assets/resources/tree/stump.png";

export const AncientTree: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);

  const [showModal, setShowModal] = useState(false);

  const isChopped =
    context.state.inventory["Ancient Goblin Sword"] ||
    context.state.inventory["Ancient Human Warhammer"] ||
    context.state.inventory["Goblin Key"];

  return (
    <div
      className="absolute flex justify-center items-baseline"
      style={{
        left: `${GRID_WIDTH_PX * -5.52}px`,
        width: `${GRID_WIDTH_PX * 2}px`,
        bottom: `${GRID_WIDTH_PX * 6.06}px`,
      }}
    >
      {!isChopped ? (
        <>
          <img
            src={whiteTree}
            className="hover:img-highlight cursor-pointer"
            style={{
              width: `${GRID_WIDTH_PX * 2}px`,
            }}
            onClick={() => setShowModal(true)}
          />
          <Modal centered show={showModal} onHide={() => setShowModal(false)}>
            <AncientTreeModal onClose={() => setShowModal(false)} />
          </Modal>
        </>
      ) : (
        <img
          src={stump}
          style={{
            width: `${GRID_WIDTH_PX}px`,
          }}
        />
      )}
    </div>
  );
};
