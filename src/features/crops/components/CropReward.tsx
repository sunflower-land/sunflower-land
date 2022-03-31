import { Panel } from "components/ui/Panel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { Reward } from "features/game/types/game";

import secure from "assets/npcs/synced.gif";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";

interface Props {
  reward: Reward | null;
  fieldIndex: number;
  onCollected: () => void;
}

export const CropReward: React.FC<Props> = ({
  reward,
  onCollected,
  fieldIndex,
}) => {
  const { gameService } = useContext(Context);
  const [opened, setOpened] = useState(false);
  if (!reward) {
    return null;
  }

  const open = () => {
    setOpened(true);
    gameService.send("reward.opened", { fieldIndex });
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
              <Button onClick={onCollected} className="mt-4 w-28">
                Close
              </Button>
            </>
          ) : (
            <>
              <img
                src={secure}
                className="w-1/2 hover:img-highlight cursor-pointer"
                onClick={open}
              />

              <span className="text-sm">Tap the chest to open it</span>
            </>
          )}
        </div>
      </Panel>
    </Modal>
  );
};
