import React from "react";

import magicSeeds from "assets/icons/seeds.png";
import questionMark from "assets/icons/expression_confused.png";
import indicator from "assets/icons/indicator.png";
import close from "assets/icons/close.png";

import { Button } from "components/ui/Button";

interface Props {
  onClose: () => void;
}

export const MagicSeed: React.FC<Props> = ({ onClose }) => {
  return (
    <>
      <img src={close} className="w-6 cursor-pointer absolute top-4 right-4" />
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
    </>
  );
};
