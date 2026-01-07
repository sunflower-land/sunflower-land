import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { WaterTrapModal } from "./WaterTrapModal";
import { useNow } from "lib/utils/hooks/useNow";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { ProgressBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { CrustaceanChum, WaterTrapName } from "features/game/types/crustaceans";
import { useAuth } from "features/auth/lib/Provider";

const _crabTraps = (state: MachineState) => state.context.state.crabTraps;
const _isVisiting = (state: MachineState) => state.matches("visiting");

interface Props {
  id: string;
}

export const WaterTrapSpot: React.FC<Props> = ({ id }) => {
  const { gameService, showTimers } = useContext(Context);
  const { authState } = useAuth();
  const crabTraps = useSelector(gameService, _crabTraps);
  const isVisiting = useSelector(gameService, _isVisiting);
  const [showModal, setShowModal] = useState(false);

  const waterTrap = crabTraps.trapSpots?.[id]?.waterTrap;

  const now = useNow({
    live: !!waterTrap,
    autoEndAt: waterTrap?.readyAt,
  });
  const isReady = waterTrap && waterTrap.readyAt <= now;
  const isPlaced = waterTrap && !isReady;

  const startedAt = waterTrap?.placedAt ?? 0;
  const readyAt = waterTrap?.readyAt ?? 0;
  const { totalSeconds: secondsLeft } = useCountdown(readyAt);
  const totalRunningSeconds = Math.max((readyAt - startedAt) / 1000, 1);
  const elapsedSeconds = Math.max(totalRunningSeconds - secondsLeft, 0);
  const percentage = Math.min(
    (elapsedSeconds / totalRunningSeconds) * 100,
    100,
  );

  const handleClick = () => {
    if (isVisiting) return;
    setShowModal(true);
  };

  const place = (waterTrap: WaterTrapName, chum?: CrustaceanChum) => {
    gameService.send({
      trapId: id,
      type: "waterTrap.placed",
      waterTrap,
      chum,
    });
    gameService.send("SAVE");
    setShowModal(false);
  };

  const pickup = () => {
    gameService.send("waterTrap.pickedUp", {
      effect: {
        type: "waterTrap.pickedUp",
        trapId: id,
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  const collect = () => {
    if (waterTrap) {
      gameService.send({
        type: "waterTrap.collected",
        trapId: id,
      });
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        className={classNames("relative w-full h-full cursor-pointer", {
          "pointer-events-none": isVisiting,
        })}
        onClick={handleClick}
      >
        <>
          <div
            className="absolute inset-0 bg-brown-600 border-2 border-brown-800"
            style={{
              borderRadius: `${2 * PIXEL_SCALE}px`,
            }}
          >
            {isReady ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={SUNNYSIDE.icons.happy}
                  className="w-4 h-4"
                  alt="Ready"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={SUNNYSIDE.resource.crab}
                  className="w-4 h-4"
                  alt="In Progress"
                />
              </div>
            )}
            {showTimers && isPlaced && readyAt && (
              <div
                className="flex justify-center absolute pointer-events-none"
                style={{
                  bottom: `${PIXEL_SCALE * 4}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <ProgressBar
                  percentage={percentage}
                  type="progress"
                  formatLength="short"
                  seconds={secondsLeft}
                  style={{
                    width: `${PIXEL_SCALE * 14}px`,
                  }}
                />
              </div>
            )}
          </div>
        </>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <WaterTrapModal
          waterTrap={waterTrap}
          onPlace={place}
          onPickup={pickup}
          onCollect={collect}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};
