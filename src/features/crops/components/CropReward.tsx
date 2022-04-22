import { Panel } from "components/ui/Panel";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

import { Reward } from "features/game/types/game";

import secure from "assets/npcs/synced.gif";
import idle from "assets/npcs/idle.gif";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { addNoise, RandomID } from "lib/images";

interface Props {
  reward: Reward | null;
  fieldIndex: number;
  onCollected: () => void;
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const CropReward: React.FC<Props> = ({
  reward,
  onCollected,
  fieldIndex,
}) => {
  const { gameService } = useContext(Context);
  const [opened, setOpened] = useState(false);

  const offset = useRef(randomIntFromInterval(30, 100));
  const id = useRef(RandomID());

  useEffect(() => {
    if (reward) {
      addNoise(id.current);
    }
  }, [reward]);

  if (!reward) {
    return null;
  }

  const open = () => {
    setOpened(true);
    gameService.send("reward.opened", { fieldIndex });
  };

  const close = () => {
    onCollected();
    setOpened(false);
  };

  return (
    <Modal centered show={true}>
      <Panel>
        <div className="flex flex-col items-center justify-between h-52">
          <span className="text-center mb-2">Woohoo! You found a reward</span>

          {opened ? (
            <>
              {reward.items.map((item) => (
                <div key={item.name} className="flex items-center">
                  <img
                    className="w-8 img-highlight mr-2"
                    src={ITEM_DETAILS[item.name].image}
                  />
                  <span className="text-center mb-2">
                    {`${item.amount} ${item.name}s`}
                  </span>
                </div>
              ))}
              <Button onClick={close} className="mt-4 w-28">
                Close
              </Button>
            </>
          ) : (
            <>
              <div
                className="flex items-center justify-between"
                style={{
                  width: `${offset.current}%`,
                  // Randomly flip the side it is on
                  transform: `scaleX(${offset.current % 2 === 0 ? 1 : -1})`,
                }}
              >
                <img src={idle} className="w-16" />
                <img
                  src={secure}
                  id={id.current}
                  className="w-16 hover:img-highlight cursor-pointer"
                  onClick={open}
                />
              </div>

              <span className="text-sm">Tap the chest to open it</span>
            </>
          )}
        </div>
      </Panel>
    </Modal>
  );
};
