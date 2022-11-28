import { Panel } from "components/ui/Panel";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

import { Reward } from "features/game/types/game";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";

import token from "assets/icons/token_2.png";
import { StopTheGoblins } from "features/farming/crops/components/StopTheGoblins";
import { ChestCaptcha } from "features/farming/crops/components/ChestCaptcha";

interface Props {
  reward: Reward | null;
  onCollected: (success: boolean) => void;
  onOpen: () => void;
}

type Challenge = "goblins" | "chest";

export const ChestReward: React.FC<Props> = ({
  reward,
  onCollected,
  onOpen,
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
    onOpen();
  };

  const fail = () => {
    close(false);
    gameService.send("bot.detected");
    gameService.send("REFRESH");
  };

  const close = (success: boolean) => {
    onCollected(success);
    setOpened(false);
  };

  const { items, sfl } = reward;

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
              {items &&
                items.map((item) => {
                  const name = `${item.amount} ${item.name}${
                    item.name === "Gold" ? "" : "s"
                  }`;

                  return (
                    <div key={item.name} className="flex items-center my-2">
                      <img
                        className="w-8 img-highlight mr-2"
                        src={ITEM_DETAILS[item.name].image}
                      />
                      <span className="text-center">{name}</span>
                    </div>
                  );
                })}
              {sfl && (
                <div key="sfl" className="flex items-center my-2">
                  <img className="w-8 img-highlight mr-2" src={token} />
                  <span className="text-center">{`${sfl} SFL`}</span>
                </div>
              )}
              <Button onClick={() => close(true)} className="w-full">
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
