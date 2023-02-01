import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import manekiNekoShaking from "assets/sfts/maneki_neko.gif";
import manekiNeko from "assets/sfts/maneki_neko_idle.gif";
import shadow from "assets/npcs/shadow16px.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { COLLECTIBLE_PLACE_SECONDS } from "features/game/events/landExpansion/placeCollectible";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import Modal from "react-bootstrap/esm/Modal";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import classNames from "classnames";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

interface Props {
  id: string;
}

export const ManekiNeko: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showTooltip, setShowTooltip] = useState(false);
  const manekiNekos = gameState.context.state.collectibles["Maneki Neko"] ?? [];

  useUiRefresher();

  const shakeableAt = Math.max(
    ...manekiNekos.map(
      (maneki) =>
        (maneki.shakenAt ?? 0) +
        (COLLECTIBLE_PLACE_SECONDS["Maneki Neko"] ?? 0) * 1000
    )
  );
  const readyInSeconds = (shakeableAt - Date.now()) / 1000;
  const hasShakenRecently = Date.now() < shakeableAt;

  const [isShaking, setIsShaking] = useState(hasShakenRecently);

  const shake = () => {
    setIsShaking(true);

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
            timeLeft={readyInSeconds}
            showTimeLeft={showTooltip}
          />
        </div>
      )}
      {gameState.matches("revealing") && (
        <Modal show centered>
          <Panel>
            <Revealing icon={manekiNekoShaking} />
          </Panel>
        </Modal>
      )}
      {gameState.matches("revealed") && (
        <Modal show centered>
          <Panel>
            <Revealed />
          </Panel>
        </Modal>
      )}
    </>
  );
};
