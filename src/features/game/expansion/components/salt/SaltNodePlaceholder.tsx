import React, { useState } from "react";
import classNames from "classnames";
import { Modal } from "components/ui/Modal";
import { Box } from "components/ui/Box";
import add from "assets/icons/plus.png";
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
        )}
      >
        <Box
          image={add}
          disabled={visiting}
          onClick={() => setShowModal(true)}
          className="cursor-pointer hover:img-highlight"
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <UpgradeSaltFarmModalPanel onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
