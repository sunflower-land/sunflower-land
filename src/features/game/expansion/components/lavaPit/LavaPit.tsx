import React, { useContext, useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { LavaPitModalContent } from "./LavaPitModalContent";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { LAVA_PIT_MS } from "features/game/events/landExpansion/collectLavaPit";

import animatedLavaPit from "assets/resources/lava/lava_pit_animation.webp";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

const _lavaPit = (id: string) => (state: MachineState) =>
  state.context.state.lavaPits[id];

interface Props {
  id: string;
}

export const LavaPit: React.FC<Props> = ({ id }) => {
  const [showModal, setShowModal] = useState(false);

  const { gameService, showAnimations } = useContext(Context);
  const lavaPit = useSelector(gameService, _lavaPit(id));

  useUiRefresher({ active: !!lavaPit?.startedAt });

  const lavaPitRunning =
    lavaPit?.startedAt && lavaPit?.startedAt + LAVA_PIT_MS > Date.now();

  const lavaPitReady =
    (lavaPit?.startedAt ?? Infinity) + LAVA_PIT_MS < Date.now() &&
    !lavaPit?.collectedAt;

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
            width={36 * PIXEL_SCALE}
          />
        ) : (
          <img
            id={`lavapit-${id}`}
            src={ITEM_DETAILS["Lava Pit"].image}
            width={36 * PIXEL_SCALE}
          />
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <LavaPitModalContent onClose={() => setShowModal(false)} id={id} />
      </Modal>
    </div>
  );
};
