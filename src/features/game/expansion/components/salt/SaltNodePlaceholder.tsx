import React, { useState } from "react";
import classNames from "classnames";
import { Modal } from "components/ui/Modal";
import add from "assets/icons/plus.png";
import saltNodeEmpty from "assets/buildings/salt/salt_node_empty.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { UpgradeSaltFarmModalPanel } from "./UpgradeSaltFarmModalPanel";

interface Props {
  visiting: boolean;
}

export const SaltNodePlaceholder: React.FC<Props> = ({ visiting }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={classNames(
          "relative flex h-full w-full items-center justify-center",
          !visiting && "cursor-pointer hover:img-highlight",
        )}
        onClick={() => {
          if (visiting) return;
          setShowModal(true);
        }}
      >
        <img src={saltNodeEmpty} width={PIXEL_SCALE * 18} />
        <img
          src={add}
          className="absolute"
          style={{ width: `${PIXEL_SCALE * 8}px`, top: `${PIXEL_SCALE * 2}px` }}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <UpgradeSaltFarmModalPanel onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
