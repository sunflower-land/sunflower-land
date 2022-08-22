import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import growing from "assets/crops/magic/growing.png";
import dead from "assets/crops/magic/dead.png";
import token from "assets/icons/token.png";

import magicSeeds from "assets/icons/seeds.png";
import questionMark from "assets/icons/expression_confused.png";
import chest from "assets/npcs/synced.gif";
import alert from "assets/icons/expression_alerted.png";
import indicator from "assets/icons/indicator.png";
import close from "assets/icons/close.png";
import dot from "assets/icons/dot.png";
import unhappy from "assets/icons/unhappy.png";
import happy from "assets/icons/happy.png";
import heart from "assets/icons/heart.png";

import { Context } from "features/game/GameProvider";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import {
  getPruneAt,
  isDead,
  PRUNES_TO_REWARD,
  readyToPrune,
  TIME_TO_PRUNE_MS,
} from "features/game/events/pruneCrop";
import { ProgressBar } from "components/ui/ProgressBar";
import { secondsToMidString } from "lib/utils/time";
import { CropReward } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  fieldIndex: number;
  className?: string;
}

export const MagicField: React.FC<Props> = ({ className, fieldIndex }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);
  const [reward, setReward] = useState<CropReward>();

  const field = game.context.state.fields[fieldIndex];

  const onClick = () => {
    setShowModal(true);
  };

  const remove = () => {};

  const prune = () => {
    gameService.send("item.pruned", {
      fieldIndex,
    });
  };

  const harvest = () => {
    console.log({ set: field.reward });
    setReward(field.reward);
  };

  const claim = () => {
    gameService.send("item.pruned", {
      fieldIndex,
    });

    setShowModal(false);
  };

  const pruneAt = getPruneAt(field);
  const isReady = readyToPrune({ field, createdAt: Date.now() });
  const died = isDead({ field, createdAt: Date.now() });

  const timeLeft = pruneAt - Date.now();
  const secondsLeft = Math.floor(timeLeft / 1000);
  const percentage = (TIME_TO_PRUNE_MS - timeLeft) / TIME_TO_PRUNE_MS;

  const Content = () => {
    if (reward) {
      return (
        <div className="flex flex-col items-center">
          <span className="mb-4">Congratulatons, you found</span>
          {reward.sfl && (
            <div className="flex items-center justify-center mb-2">
              <img src={token} className="w-6 mr-2" />
              <span>{reward.sfl} SFL</span>
            </div>
          )}

          {reward.items.length > 0 &&
            reward.items.map((item) => (
              <div
                className="flex items-center justify-center mb-2"
                key={item.name}
              >
                <img src={ITEM_DETAILS[item.name].image} className="w-6 mr-2" />
                <span>
                  {item.amount} {item.name}
                </span>
              </div>
            ))}
          <Button onClick={claim} className="mt-4">
            Continue
          </Button>
        </div>
      );
    }
    if (died) {
      return (
        <div className="flex flex-col items-center">
          <span className="">Your plant died</span>
          <div className="flex items-center mt-4">
            <img src={unhappy} className="w-12 mr-4" />
          </div>
          <span className="text-sm text-center mt-4 mb-4">
            Magic Crops need love. Make sure you prune your plant every day
          </span>
          <Button onClick={remove}>Continue</Button>
        </div>
      );
    }

    const pruneCount = field.prunedAt?.length || 0;
    const prunesLeft = PRUNES_TO_REWARD - pruneCount;

    console.log({ prunesLeft });
    if (prunesLeft === 1) {
      return (
        <div className="flex flex-col items-center">
          <span className="">Wow, an amazing plant</span>
          <div className="flex items-center mt-4">
            <img src={chest} className="w-16 mr-4" />
          </div>
          <span className="text-sm text-center  my-4">
            Let's see what magical rewards you find
          </span>
          <Button onClick={harvest}>Harvest</Button>
        </div>
      );
    }

    if (isReady) {
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-center mt-4">
            <img src={happy} className="w-12 mr-4" />
          </div>
          <span className="text-sm text-center mt-4 mb-4">
            Time to prune your magic crop and ensure it will survive.
          </span>
          <Button onClick={prune}>Prune</Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <span className="">{`${prunesLeft} days left`}</span>
        <div className="flex items-center mt-4">
          {Array(pruneCount)
            .fill(null)
            .map((_) => (
              <img src={heart} className="w-6  mr-4" />
            ))}
          {Array(prunesLeft)
            .fill(null)
            .map((_) => (
              <img src={dot} className="w-4  mr-4" />
            ))}
        </div>
        <span className=" text-sm  mt-4">Your plant is looking healthy!</span>
        <span className="text-sm text-center mt-4">
          {`Come back in ${secondsToMidString(
            secondsLeft
          )} to prune your plant`}
        </span>
      </div>
    );
  };

  const Plant = () => {
    if (died) {
      return (
        <div className="w-full absolute bottom-0">
          <img src={unhappy} className="absolute bottom-10 right-0 z-10 w-4" />
          <img src={dead} className="w-full absolute bottom-0" />
        </div>
      );
    }

    if (isReady) {
      return (
        <div className="w-full absolute bottom-0">
          <img src={alert} className="absolute bottom-10 right-1 z-10 w-2" />
          <img src={growing} className="w-full absolute bottom-0" />
        </div>
      );
    }

    return (
      <div className="w-full absolute bottom-0">
        <img src={growing} className="w-full absolute bottom-0" />
        <div className="absolute -bottom-4 z-10 -left-1">
          <ProgressBar percentage={percentage} seconds={secondsLeft} />
        </div>
      </div>
    );
  };

  return (
    <div
      className={classNames("relative group", className)}
      style={{
        width: `${GRID_WIDTH_PX}px`,
        height: `${GRID_WIDTH_PX}px`,
      }}
    >
      <Plant />
      <>
        <img
          src={selectBox}
          style={{
            opacity: 0.1,
          }}
          className="absolute block inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-30 cursor-pointer"
          onClick={() => onClick()}
        />
      </>

      <Modal centered show={showModal}>
        <Panel>
          <img
            src={close}
            className="w-6 cursor-pointer absolute top-4 right-4"
            onClick={() => setShowModal(false)}
          />
          <Content />
        </Panel>
      </Modal>
    </div>
  );
};
