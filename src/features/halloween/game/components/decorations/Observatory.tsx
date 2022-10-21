import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX } from "../../lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { observatoryAnimationAudio } from "lib/utils/sfx";

import close from "assets/icons/close.png";
import observatory from "assets/nfts/mom/observatory.gif";
import observatoryAnimation from "assets/nfts/mom/mom_observatory_animation.gif";

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
              className="h-6 top-4 right-4 absolute cursor-pointer"
              onClick={handleCloseTelescope}
            />

            <img
              src={`${observatoryAnimation}?rand=${playRand}`} // Breaks cache and force replays the gif animation.
              alt="Telescope Animation"
              className="p-4"
            />
          </InnerPanel>
        </OuterPanel>
      </Modal>
    </>
  );
};
