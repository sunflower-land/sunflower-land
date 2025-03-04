import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { BeanName, BEANS } from "features/game/types/beans";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { setImageWidth } from "lib/images";
import { InventoryItemName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

export const getBeanStates = (name: InventoryItemName, createdAt: number) => {
  const plantSeconds = BEANS()[name as BeanName].plantSeconds;

  const secondsPassed = (Date.now() - createdAt) / 1000;

  const timeLeft = plantSeconds - secondsPassed;
  const isReady = timeLeft <= 0;
  return { isReady, timeLeft, plantSeconds };
};

const _beanRevealing = (state: MachineState) => state.matches("revealing");
const _beanRevealed = (state: MachineState) => state.matches("beanRevealed");

export const Bean: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  name = "Magic Bean",
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const beanRevealing = useSelector(gameService, _beanRevealing);
  const beanRevealed = useSelector(gameService, _beanRevealed);
  const [showModal, setShowModal] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  useUiRefresher();

  const { isReady, timeLeft, plantSeconds } = getBeanStates(name, createdAt);

  const harvest = () => {
    setIsRevealing(true);
    gameService.send("REVEAL", {
      event: {
        type: "bean.harvested",
        id,
        name,
        createdAt: new Date(),
      },
    });
  };

  if (isReady) {
    return (
      <>
        <div
          className="absolute w-full h-full hover:img-highlight cursor-pointer"
          onClick={harvest}
        >
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={
              "z-10 absolute" + (showAnimations ? " animate-float" : "")
            }
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              left: `${PIXEL_SCALE * 14}px`,
              bottom: `${PIXEL_SCALE * 26}px`,
            }}
          />
          <img
            src={SUNNYSIDE.crops.magicBeanready}
            style={{
              width: `${PIXEL_SCALE * 30}px`,
              left: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
            }}
            className="absolute pointer-events-none"
            alt="Bean"
          />
        </div>

        {beanRevealing && isRevealing && (
          <Modal show backdrop="static">
            <Panel className="z-10">
              <Revealing icon={SUNNYSIDE.crops.magicBean} />
            </Panel>
          </Modal>
        )}

        {beanRevealed && isRevealing && (
          <Modal show backdrop="static">
            <Panel className="z-10">
              <Revealed id={id} onAcknowledged={() => setIsRevealing(false)} />
            </Panel>
          </Modal>
        )}
      </>
    );
  }

  const image =
    timeLeft <= plantSeconds / 2
      ? SUNNYSIDE.crops.magicBeangrowing
      : SUNNYSIDE.crops.magicBeanplanted;

  return (
    <>
      <div
        className="absolute w-full h-full hover:img-highlight cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            left: `${PIXEL_SCALE * 1}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute pointer-events-none"
          alt="Bean"
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)} title={name}>
          <div className="flex flex-col justify-center items-center">
            <span className="text-center mb-2">
              {`Your mystery prize will be ready in ${secondsToString(
                timeLeft,
                {
                  length: "full",
                },
              )}`}
            </span>
            <img
              src={ITEM_DETAILS[name].image}
              className="mb-2"
              onLoad={(e) => setImageWidth(e.currentTarget)}
              style={{
                opacity: 0,
              }}
            />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
