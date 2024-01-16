import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { FlowerBedModal } from "./FlowerBedModal";
import flowerBed from "assets/flowers/flower_bed.webp";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";

interface Props {
  id: string;
}

export const FlowerBed: React.FC<Props> = (props) => {
  const { showTimers } = useContext(Context);

  const [showModal, setShowModal] = useState(false);

  const isGrowing = true;
  const growPercentage = 50;
  const timeLeft = 3;

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={flowerBed}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            height: `${PIXEL_SCALE * 16}px`,
          }}
        />
        {isGrowing && (
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * -18}px`,
            }}
          >
            {/* <TimerPopover
              image={ITEM_DETAILS[cropName].image}
              description={cropName}
              showPopover={showTimerPopover}
              timeLeft={timeLeft}
            /> */}
          </div>
        )}

        {showTimers && (
          <div
            className="absolute"
            style={{
              bottom: `${PIXEL_SCALE * 3}px`,
              left: `${PIXEL_SCALE * 16}px`,
              width: `${PIXEL_SCALE * 16}px`,
            }}
          >
            <ProgressBar
              percentage={growPercentage}
              seconds={timeLeft}
              type="progress"
              formatLength="short"
            />
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <FlowerBedModal onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
