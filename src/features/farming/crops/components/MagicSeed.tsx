import { Panel } from "components/ui/Panel";
import React from "react";
import { Modal } from "react-bootstrap";

import magicSeeds from "assets/icons/seeds.png";
import questionMark from "assets/icons/expression_confused.png";
import indicator from "assets/icons/indicator.png";
import close from "assets/icons/close.png";
import dot from "assets/icons/dot.png";
import unhappy from "assets/icons/unhappy.png";
import heart from "assets/icons/heart.png";

import { Button } from "components/ui/Button";

interface Props {
  onClose: () => void;
}

export const MagicSeed: React.FC<Props> = ({ onClose }) => {
  const Content = () => {
    return (
      <div className="flex flex-col items-center">
        <span className="">Your plant died</span>
        <div className="flex items-center mt-4">
          <img src={unhappy} className="w-12 mr-4" />
        </div>
        <span className="text-sm text-center mt-4 mb-4">
          Next time make sure you tend to your plant every day
        </span>
        <Button>Continue</Button>
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

    return (
      <div className="flex flex-col items-center">
        <span className="">Ready to plant a magic seed?</span>
        <div className="flex items-center mt-4">
          <img src={magicSeeds} className="w-20" />
          <img src={indicator} className="w-6  ml-2 -rotate-[90deg]" />
          <img src={indicator} className="w-6  ml-2 -rotate-[90deg]" />
          <img src={indicator} className="w-6  ml-2 -rotate-[90deg]" />
          <img src={questionMark} className="w-12  ml-2" />
        </div>
        <span className=" text-sm mt-4">
          You must tend to it every day for 3 days straight to produce a reward.
        </span>
        <span className="text-sm  mt-4">
          If you miss a day, the plant will die.
        </span>
        <Button className="mt-4">Plant magic seed</Button>
      </div>
    );
  };

  return (
    <Modal centered show={true}>
      <Panel>
        <img
          src={close}
          className="w-6 cursor-pointer absolute top-4 right-4"
        />
        <Content />
      </Panel>
    </Modal>
  );
};
