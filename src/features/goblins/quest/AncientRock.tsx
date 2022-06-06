import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { AncientRockModal } from "./AncientRockModal";
import { Context } from "features/game/GoblinProvider";

import rock from "assets/quest/rock.png";

export const AncientRock: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);

  const [showModal, setShowModal] = useState(false);

  const hasCompleted =
    context.state.inventory["Ancient Goblin Sword"] ||
    context.state.inventory["Ancient Human Warhammer"] ||
    context.state.inventory["Sunflower Key"];

  if (hasCompleted) {
    return null;
  }

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX}px`,
        top: `${GRID_WIDTH_PX * 7.5}px`,
        left: `${GRID_WIDTH_PX * 28.5}px`,
      }}
    >
      <img
        src={rock}
        className="absolute hover:img-highlight cursor-pointer"
        style={{ width: `${GRID_WIDTH_PX}px` }}
        onClick={() => setShowModal(true)}
      />
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <AncientRockModal onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};
