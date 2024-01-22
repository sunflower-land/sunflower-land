import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { FlowerBedModal } from "./FlowerBedModal";
import flowerBedImage from "assets/flowers/flower_bed.webp";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { useActor } from "@xstate/react";
import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import { TimerPopover } from "../common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

interface Props {
  id: string;
}

export const FlowerBed: React.FC<Props> = ({ id }) => {
  const { showTimers, gameService } = useContext(Context);
  const [
    {
      context: {
        state: { flowers },
      },
    },
  ] = useActor(gameService);

  const flowerBed = flowers.flowerBeds[id];

  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useUiRefresher();

  if (!flowerBed.flower) {
    return (
      <>
        <div
          className="relative w-full h-full hover:img-highlight cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={flowerBedImage}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 48}px`,
              height: `${PIXEL_SCALE * 16}px`,
            }}
          />
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <FlowerBedModal id={id} onClose={() => setShowModal(false)} />
        </Modal>
      </>
    );
  }

  const flower = flowerBed.flower;

  const growTime =
    FLOWER_SEEDS()[FLOWERS[flower.name].seed].plantSeconds * 1000;
  const timeLeft = (flowerBed.flower?.plantedAt ?? 0) + growTime - Date.now();
  const timeLeftSeconds = Math.round(timeLeft / 1000);

  const growPercentage = Math.max(timeLeft, 0) / growTime;

  const isGrowing = timeLeft > 0;

  const handlePlotClick = () => {
    gameService.send({
      type: "flower.harvested",
      id,
    });
  };

  return (
    <>
      <div
        className={classNames("relative w-full h-full  hover:img-highlight", {
          "cursor-pointer": !isGrowing,
        })}
        onClick={handlePlotClick}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
      >
        <img
          src={flowerBedImage}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            height: `${PIXEL_SCALE * 16}px`,
          }}
        />
        {flowerBed.flower && isGrowing && (
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * -18}px`,
            }}
          >
            <TimerPopover
              image={ITEM_DETAILS[flowerBed.flower.name].image}
              description={flowerBed.flower.name}
              showPopover={showPopover}
              timeLeft={timeLeftSeconds}
            />
          </div>
        )}

        {showTimers && isGrowing && (
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
              seconds={timeLeftSeconds}
              type="progress"
              formatLength="short"
            />
          </div>
        )}
      </div>
    </>
  );
};
