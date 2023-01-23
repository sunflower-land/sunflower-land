import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import manekiNekoShaking from "assets/sfts/maneki_neko.gif";
import manekiNeko from "assets/sfts/maneki_neko_idle.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { COLLECTIBLE_PLACE_SECONDS } from "features/game/events/landExpansion/placeCollectible";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

interface Props {
  id: string;
}

export const ManekiNeko: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  useUiRefresher();

  const manekiNekos = gameState.context.state.collectibles["Maneki Neko"] ?? [];
  const shakeableAt = Math.max(
    ...manekiNekos.map(
      (maneki) =>
        (maneki.shakenAt ?? 0) +
        (COLLECTIBLE_PLACE_SECONDS["Maneki Neko"] ?? 0) * 1000
    )
  );
  const readyInSeconds = (shakeableAt - Date.now()) / 1000;
  const hasShakenRecently = manekiNekos.some(
    (maneki) => Date.now() < shakeableAt
  );

  const [isShaking, setIsShaking] = useState(hasShakenRecently);
  const [showWaitModal, setShowWaitModal] = useState(false);

  const shake = () => {
    if (hasShakenRecently) {
      setShowWaitModal(true);
      return;
    }

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
    if (!hasShakenRecently) {
      setShowWaitModal(false);
    }
  }, [hasShakenRecently]);

  const waitingModal = () => {
    return (
      <Modal
        show={showWaitModal}
        centered
        onHide={() => setShowWaitModal(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowWaitModal(false)}
          title={"Maneki Neko"}
        >
          <div className="flex flex-col justify-center items-center">
            <span className="text-center mb-2">
              {`Your reward will be ready in ${secondsToString(readyInSeconds, {
                length: "full",
              })}`}
            </span>
            <img
              src={manekiNekoShaking}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
          </div>
        </CloseButtonPanel>
      </Modal>
    );
  };

  return (
    <>
      <div
        className="absolute w-full h-full cursor-pointer hover:img-highlight"
        onClick={shake}
      >
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${-PIXEL_SCALE * 0}px`,
            left: `${-PIXEL_SCALE * 0}px`,
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
      {waitingModal()}
    </>
  );
};
