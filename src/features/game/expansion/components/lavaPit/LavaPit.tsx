import React, { useContext, useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { LavaPitModalContent } from "./LavaPitModalContent";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { SUNNYSIDE } from "assets/sunnyside";

import animatedLavaPit from "assets/resources/lava/lava_pit_animation.webp";
import { ProgressBar } from "components/ui/ProgressBar";
import { useCountdown } from "lib/utils/hooks/useCountdown";

const _lavaPit = (id: string) => (state: MachineState) =>
  state.context.state.lavaPits[id];

interface Props {
  id: string;
}

export const LavaPit: React.FC<Props> = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, showAnimations, showTimers } = useContext(Context);
  const lavaPit = useSelector(gameService, _lavaPit(id));
  const { totalSeconds: secondsToReady } = useCountdown(lavaPit?.readyAt ?? 0);

  const width = 36;
  const lavaPitStartedAt = lavaPit?.startedAt ?? 0;
  const lavaPitEndAt = lavaPit?.readyAt ?? 0;
  const totalSecondsRequired = Math.max(
    (lavaPitEndAt - lavaPitStartedAt) / 1000,
    0,
  );
  const percentage =
    totalSecondsRequired > 0
      ? Math.min(
          ((totalSecondsRequired - secondsToReady) / totalSecondsRequired) *
            100,
          100,
        )
      : 0;

  const lavaPitRunning = secondsToReady > 0;

  const lavaPitReady =
    lavaPit?.readyAt && secondsToReady <= 0 && !lavaPit?.collectedAt;
  const isReadyWithinADay = secondsToReady <= 24 * 60 * 60;

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        {lavaPitReady && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className={showAnimations ? " ready" : ""}
              style={{ width: `${PIXEL_SCALE * 4}px` }}
            />
          </div>
        )}

        {lavaPitRunning ? (
          <img
            id={`lavapit-${id}`}
            src={animatedLavaPit}
            width={width * PIXEL_SCALE}
          />
        ) : (
          <img
            id={`lavapit-${id}`}
            src={ITEM_DETAILS["Lava Pit"].image}
            width={width * PIXEL_SCALE}
          />
        )}

        {lavaPitRunning && showTimers && (
          <div
            className="flex justify-center absolute"
            style={{
              bottom: "12px",
              width: `${width * PIXEL_SCALE}px`,
              left: `${PIXEL_SCALE * ((32 - width) / 2)}px`,
            }}
          >
            <ProgressBar
              percentage={percentage}
              type="progress"
              formatLength={isReadyWithinADay ? "short" : "medium"}
              seconds={secondsToReady}
              style={{
                width: `${PIXEL_SCALE * 14}px`,
              }}
            />
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <LavaPitModalContent onClose={() => setShowModal(false)} id={id} />
      </Modal>
    </div>
  );
};
