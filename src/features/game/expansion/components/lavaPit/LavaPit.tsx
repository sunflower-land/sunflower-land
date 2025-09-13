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
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { LiveProgressBar } from "components/ui/ProgressBar";

const _lavaPit = (id: string) => (state: MachineState) =>
  state.context.state.lavaPits[id];

interface Props {
  id: string;
}

export const LavaPit: React.FC<Props> = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [renderKey, setRender] = useState<number>(0);
  const { gameService, showAnimations, showTimers } = useContext(Context);
  const lavaPit = useSelector(gameService, _lavaPit(id));

  useUiRefresher({ active: !!lavaPit?.startedAt });

  const width = 36;
  const lavaPitStartedAt = lavaPit?.startedAt ?? 0;
  const lavaPitEndAt = lavaPit?.readyAt ?? 0;

  const lavaPitRunning = lavaPitEndAt > Date.now();

  const lavaPitReady = lavaPitEndAt < Date.now() && !lavaPit?.collectedAt;
  const isReadyWithinADay = lavaPitEndAt < Date.now() + 24 * 60 * 60 * 1000;

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
            className="flex justify-center absolute bg-red-500"
            style={{
              bottom: "12px",
              width: `${width * PIXEL_SCALE}px`,
              left: `${PIXEL_SCALE * ((32 - width) / 2)}px`,
            }}
          >
            <LiveProgressBar
              key={renderKey}
              startAt={lavaPitStartedAt}
              endAt={lavaPitEndAt}
              formatLength={isReadyWithinADay ? "short" : "medium"}
              className="relative"
              style={{
                width: `${PIXEL_SCALE * 14}px`,
              }}
              onComplete={() => setRender((r) => r + 1)}
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
