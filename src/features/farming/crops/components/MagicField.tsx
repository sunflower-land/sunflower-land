import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import growing from "assets/crops/sunflower/almost.png";

import magicSeeds from "assets/icons/seeds.png";
import questionMark from "assets/icons/expression_confused.png";
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

interface Props {
  fieldIndex: number;
  className?: string;
}

export const MagicField: React.FC<Props> = ({ className, fieldIndex }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);

  const [showModal, setShowModal] = useState(true);

  const field = game.context.state.fields[fieldIndex];

  const onClick = () => {};

  const remove = () => {};

  const prune = () => {};

  const Content = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center mt-4">
          <img src={happy} className="w-12 mr-4" />
        </div>
        <span className="text-sm text-center mt-4 mb-4">
          Time to prune your magic crop and ensure it will survive.
        </span>
        <Button onClick={remove}>Prune</Button>
      </div>
    );

    return (
      <div className="flex flex-col items-center">
        <span className="">Your plant died</span>
        <div className="flex items-center mt-4">
          <img src={unhappy} className="w-12 mr-4" />
        </div>
        <span className="text-sm text-center mt-4 mb-4">
          Next time make sure you tend to your plant every day
        </span>
        <Button onClick={remove}>Continue</Button>
      </div>
    );

    return (
      <div className="flex flex-col items-center">
        <span className="">3 days left</span>
        <div className="flex items-center mt-4">
          <img src={heart} className="w-6  mr-4" />
          <img src={dot} className="w-4  mr-4" />
          <img src={dot} className="w-4  mr-4" />
          <img src={dot} className="w-4" />
        </div>
        <span className=" text-sm  mt-4">Your plant is looking healthy!</span>
        <span className="text-sm text-center mt-4">
          Come back in 12 hours to tend to you plant
        </span>
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
      <img src={growing} className="w-full absolute bottom-0" />

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
