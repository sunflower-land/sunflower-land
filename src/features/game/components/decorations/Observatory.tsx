import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "../../lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { observatoryAnimationAudio } from "lib/utils/sfx";

import close from "assets/icons/close.png";
import observatory from "assets/sfts/mom/observatory.gif";
import observatoryAnimation from "assets/sfts/mom/mom_observatory_animation.gif";

export const Observatory: React.FC = () => {
  // Using rand value helps force-replay gifs.
  // Also, putting this in state ensures the gif doesn't replay during random compontent rerenders.
  const [playRand, setPlayRand] = useState<number | null>(null);
  const [modalTimer, setModalTimer] = useState<number>();

  const handleOpenTelescope = () => {
    if (!observatoryAnimationAudio.playing()) {
      observatoryAnimationAudio.play();
    }

    setPlayRand(Math.random());
    setModalTimer(window.setTimeout(handleCloseTelescope, 26000));
  };

  const handleCloseTelescope = () => {
    observatoryAnimationAudio.stop();

    setPlayRand(null);
    setModalTimer(clearTimeout(modalTimer) as undefined);
  };

  return (
    <>
      <img
        style={{
          width: `${GRID_WIDTH_PX * 2.75}px`,
          left: `${GRID_WIDTH_PX * 47.5}px`,
          top: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        id={Section.Observatory}
        className="absolute hover:img-highlight cursor-pointer"
        src={observatory}
        onClick={handleOpenTelescope}
        alt="Observatory"
      />
      <Modal centered show={!!modalTimer} onHide={handleCloseTelescope}>
        <OuterPanel>
          <InnerPanel style={{ backgroundColor: "#1b1c1b" }}>
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              onClick={handleCloseTelescope}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />

            <img
              src={`${observatoryAnimation}?rand=${playRand}`} // Breaks cache and force replays the gif animation.
              alt="Telescope Animation"
            />
          </InnerPanel>
        </OuterPanel>
      </Modal>
    </>
  );
};
