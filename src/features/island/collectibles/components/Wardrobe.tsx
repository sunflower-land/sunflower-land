import React, { useState } from "react";

import { INITIAL_FARM, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { WardrobeWearables } from "features/home/components/WardrobeWearables";
import { OuterPanel } from "components/ui/Panel";
import { hasFeatureAccess } from "lib/flags";
function hasOpened() {
  return !!localStorage.getItem("hasOpenedNewWardrobe");
}
function acknowledge() {
  localStorage.setItem("hasOpenedNewWardrobe", "true");
}
export const Wardrobe: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const hasAccess = hasFeatureAccess(INITIAL_FARM, "WARDROBE");
  const open = () => {
    acknowledge();
    setShowModal(true);
  };
  return (
    <>
      {!hasOpened() && hasAccess && (
        <img
          src={SUNNYSIDE.icons.click_icon}
          className="absolute bottom-0 right-0 z-20 cursor-pointer animate-pulsate"
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
        className={`absolute ${
          hasAccess ? "cursor-pointer hover:img-highlight" : ""
        }`}
        alt="Wardrobe"
        onClick={() => hasAccess && open()}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          container={OuterPanel}
          tabs={[
            {
              icon: SUNNYSIDE.decorations.wardrobe,
              name: "Wardrobe",
            },
          ]}
        >
          <WardrobeWearables />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
