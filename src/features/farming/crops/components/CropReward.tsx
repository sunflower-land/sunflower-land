import { Panel } from "components/ui/Panel";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

import { CropReward as Reward } from "features/game/types/game";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { StopTheGoblins } from "./StopTheGoblins";
import { ChestCaptcha } from "./ChestCaptcha";

interface Props {
  reward: Reward | null;
  fieldIndex: number;
  onCollected: () => void;
}

type Challenge = "goblins" | "chest";

export const CropReward: React.FC<Props> = ({
  reward,
  onCollected,
  fieldIndex,
}) => {
  const { gameService } = useContext(Context);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const challenge = useRef<Challenge>(
    Math.random() > 0.3 ? "chest" : "goblins"
  );

  useEffect(() => {
    if (reward) {
      setLoading(true);
      setTimeout(() => setLoading(false), 750);
    }
  }, [reward]);

  if (!reward) {
    return null;
  }

  const open = () => {
    setOpened(true);
    gameService.send("reward.opened", { fieldIndex });
  };

  const fail = () => {
    close();
    gameService.send("bot.detected");
    gameService.send("REFRESH");
  };

  const close = () => {
    onCollected();
    setOpened(false);
  };

  return (
    <Modal centered show={true}>
      <Panel>
        {loading && (
          <div className="flex flex-col items-center justify-between">
            Loading...
          </div>
        )}
        <div
          hidden={loading} // render and hide captchas so images have time to load
          className="flex flex-col items-center justify-between"
        >
          {opened ? (
            <>
              <span className="text-center mb-2">
                Woohoo! Here is your reward
              </span>
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
              <Button onClick={close} className="mt-4 w-full">
                Close
              </Button>
            </>
          ) : (
            <>
              {challenge.current === "goblins" && (
                <StopTheGoblins onFail={fail} onOpen={open} />
              )}
              {challenge.current === "chest" && (
                <ChestCaptcha onFail={fail} onOpen={open} />
              )}
            </>
          )}
        </div>
      </Panel>
    </Modal>
  );
};
