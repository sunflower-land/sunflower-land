import React, { useContext, useEffect, useState } from "react";

import { Context } from "features/game/GameProvider";

import genieLamp from "assets/sfts/genie_lamp.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import genieImg from "assets/npcs/genie.png";

interface Props {
  id: string;
}

export const GenieLamp: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const lamps = gameState.context.state.collectibles["Genie Lamp"];
  const lamp = lamps?.find((lamp) => lamp.id === id);
  const rubbedCount = lamp?.rubbedCount ?? 0;
  const hasBeenRubbed = rubbedCount > 0;

  const [isRevealing, setIsRevealing] = useState(false);

  // This useEffect is for the case where it is the last genie lamp wish.
  // Genie Lamp will be deleted from the game state, so we need to make sure
  // we do no get stuck in the revealing state.
  useEffect(() => {
    return () => {
      gameService.send("CONTINUE");
    };
  }, []);

  const rub = () => {
    setIsRevealing(true);

    gameService.send("REVEAL", {
      event: {
        type: "genieLamp.rubbed",
        id,
        createdAt: new Date(),
      },
    });
  };

  return (
    <>
      <img
        onClick={rub}
        src={genieLamp}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
        className={classNames("absolute cursor-pointer hover:img-highlight", {
          "saturate-50": hasBeenRubbed,
        })}
        alt="Genie Lamp"
      />
      {gameState.matches("revealing") && isRevealing && (
        <Modal show centered>
          <img
            src={genieImg}
            className="absolute z-0"
            style={{
              width: `${PIXEL_SCALE * 100}px`,
              top: `${PIXEL_SCALE * -55}px`,
              left: `${PIXEL_SCALE * -10}px`,
            }}
          />
          <Panel className="z-10">
            <Revealing icon={genieLamp} />
          </Panel>
        </Modal>
      )}
      {gameState.matches("revealed") && isRevealing && (
        <Modal show centered>
          <img
            src={genieImg}
            className="absolute z-0"
            style={{
              width: `${PIXEL_SCALE * 100}px`,
              top: `${PIXEL_SCALE * -55}px`,
              left: `${PIXEL_SCALE * -10}px`,
            }}
          />
          <Panel className="z-10">
            <Revealed onAcknowledged={() => setIsRevealing(false)} />
          </Panel>
        </Modal>
      )}
    </>
  );
};
