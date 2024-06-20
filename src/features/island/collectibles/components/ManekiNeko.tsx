import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import manekiNekoShaking from "assets/sfts/maneki_neko.gif";
import manekiNeko from "assets/sfts/maneki_neko_idle.gif";
import shadow from "assets/npcs/shadow16px.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import classNames from "classnames";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { canShake } from "features/game/types/removeables";

interface Props {
  id: string;
}

export const ManekiNeko: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showTooltip, setShowTooltip] = useState(false);
  const manekiNekos =
    gameState.context.state.collectibles["Maneki Neko"] ??
    gameState.context.state.home.collectibles["Maneki Neko"] ??
    [];

  useUiRefresher();

  const date = new Date();

  const nextRefreshInSeconds =
    24 * 60 * 60 -
    (date.getUTCHours() * 60 * 60 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds());

  const hasShakenRecently = manekiNekos.some((maneki) => {
    const shakenAt = maneki.shakenAt || 0;

    return !canShake(shakenAt);
  });

  const [isShaking, setIsShaking] = useState(hasShakenRecently);
  const [isRevealing, setIsRevealing] = useState(false);

  const shake = () => {
    setIsShaking(true);
    setIsRevealing(true);

    // Can only shake a Maneki every 24 hours (even if you have multiple)
    if (hasShakenRecently) {
      return;
    }

    gameService.send("REVEAL", {
      event: {
        type: "maneki.shook",
        id,
        createdAt: new Date(),
      },
    });
  };

  useEffect(() => {
    setIsShaking(hasShakenRecently);
  }, [hasShakenRecently]);

  return (
    <>
      <div
        onMouseEnter={isShaking ? () => setShowTooltip(true) : undefined}
        onMouseLeave={() => setShowTooltip(false)}
        className={classNames("absolute w-full h-full", {
          "cursor-pointer hover:img-highlight": !isShaking,
        })}
        onClick={shake}
      >
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute pointer-events-none"
        />
        <img
          src={isShaking ? manekiNekoShaking : manekiNeko}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute pointer-events-none"
          alt="Maneki Neko"
        />
      </div>
      {isShaking && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -24}px`,
          }}
        >
          <TimeLeftPanel
            text="Ready in:"
            timeLeft={nextRefreshInSeconds}
            showTimeLeft={showTooltip}
          />
        </div>
      )}
      {gameState.matches("revealing") && isRevealing && (
        <Modal show>
          <Panel>
            <Revealing icon={manekiNekoShaking} />
          </Panel>
        </Modal>
      )}
      {gameState.matches("revealed") && isRevealing && (
        <Modal show>
          <Panel>
            <Revealed onAcknowledged={() => setIsRevealing(false)} />
          </Panel>
        </Modal>
      )}
    </>
  );
};
