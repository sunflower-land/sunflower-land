import React, { useContext, useState } from "react";

import planted from "assets/crops/bean_planted.png";
import ready from "assets/crops/bean_ready.png";
import growing from "assets/crops/bean_growing.png";
import alerted from "assets/icons/expression_alerted.png";
import questionMark from "assets/icons/expression_confused.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { BeanName, BEANS } from "features/game/types/beans";
import { Context } from "features/game/GameProvider";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

export const Bean: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  name = "Magic Bean",
}) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  useUiRefresher();

  const plantSeconds = BEANS()[name as BeanName].plantSeconds;

  const secondsPassed = (Date.now() - createdAt) / 1000;

  const timeLeft = plantSeconds - secondsPassed;

  const harvest = () => {
    gameService.send("REVEAL", {
      event: {
        type: "bean.harvested",
        id,
        name,
        createdAt: new Date(),
      },
    });
  };

  if (timeLeft <= 0) {
    return (
      <>
        <img
          src={alerted}
          className="animate-float z-10 absolute "
          style={{
            width: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 12.8}px`,
            bottom: `${PIXEL_SCALE * 26}px`,
          }}
        />
        <img
          src={ready}
          onClick={harvest}
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute hover:img-highlight cursor-pointer"
          alt="Bean"
        />
      </>
    );
  }

  const image = timeLeft <= plantSeconds / 2 ? growing : planted;

  return (
    <>
      <img
        src={image}
        onClick={() => setShowModal(true)}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute hover:img-highlight"
        alt="Bean"
      />
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex flex-col justify-center items-center">
            <span className="text-center mb-4">
              {`Your mystery prize will be ready in ${secondsToString(
                timeLeft,
                {
                  length: "full",
                }
              )}`}
            </span>
            <img src={questionMark} className="w-1/5 mb-2" />
          </div>
        </Panel>
      </Modal>
    </>
  );
};
