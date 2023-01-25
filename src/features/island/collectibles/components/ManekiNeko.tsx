import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import manekiNekoShaking from "assets/sfts/maneki_neko.gif";
import manekiNeko from "assets/sfts/maneki_neko_idle.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { COLLECTIBLE_PLACE_SECONDS } from "features/game/events/landExpansion/placeCollectible";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import Modal from "react-bootstrap/esm/Modal";

interface Props {
  id: string;
}

export const ManekiNeko: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const manekiNekos = gameState.context.state.collectibles["Maneki Neko"] ?? [];
  const hasShakenRecently = manekiNekos.some(
    (maneki) =>
      Date.now() <
      (maneki.shakenAt ?? 0) +
        (COLLECTIBLE_PLACE_SECONDS["Maneki Neko"] ?? 0) * 1000
  );

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
    if (hasShakenRecently) {
      setIsShaking(true);
    }
  }, [hasShakenRecently]);

  if (gameState.matches("revealing")) {
    return (
      <Modal show centered>
        <Panel>
          <Revealing />
        </Panel>
      </Modal>
    );
  }

  if (gameState.matches("revealed")) {
    return (
      <Modal show centered>
        <Panel>
          <Revealed />
        </Panel>
      </Modal>
    );
  }

  if (isShaking) {
    return (
      <>
        <img
          src={manekiNekoShaking}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute z-10"
          alt="Maneki Neko"
        />
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${-PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
        />
      </>
    );
  }

  return (
    <>
      <img
        src={manekiNeko}
        onClick={shake}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute z-10 cursor-pointer hover:img-highlight"
        alt="Maneki Neko"
      />
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${-PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
      />
    </>
  );
};
