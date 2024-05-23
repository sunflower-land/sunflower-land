import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { StylistWearables } from "features/world/ui/stylist/StylistWearables";
import { BASIC_WEARABLES } from "features/game/types/stylist";
import { OuterPanel } from "components/ui/Panel";

function hasOpened() {
  return !!localStorage.getItem("hasOpenedWardrobe");
}

function acknowledge() {
  localStorage.setItem("hasOpenedWardrobe", "true");
}
export const Wardrobe: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const open = () => {
    setShowModal(true);
    acknowledge();
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel container={OuterPanel}>
          <StylistWearables wearables={BASIC_WEARABLES} />
        </CloseButtonPanel>
      </Modal>

      {!hasOpened() && (
        <img
          src={SUNNYSIDE.icons.click_icon}
          className="absolute bottom-0 right-0 z-20 cursor-pointer"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
          }}
          onClick={open}
        />
      )}

      <img
        src={SUNNYSIDE.decorations.wardrobe}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 6}px`,
          left: `${PIXEL_SCALE * 1.5}px`,
        }}
        className="absolute cursor-pointer hover:img-highlight"
        alt="Wardrobe"
        onClick={open}
      />
    </>
  );
};
