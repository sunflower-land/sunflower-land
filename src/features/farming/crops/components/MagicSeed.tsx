import React, { useContext } from "react";

import magicSeeds from "assets/icons/seeds.png";
import questionMark from "assets/icons/expression_confused.png";
import indicator from "assets/icons/indicator.png";
import close from "assets/icons/close.png";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

interface Props {
  fieldIndex: number;
  onClose: () => void;
}

export const MagicSeed: React.FC<Props> = ({ onClose, fieldIndex }) => {
  const { gameService } = useContext(Context);

  const plant = () => {
    gameService.send("item.planted", {
      index: fieldIndex,
      item: "Magic Seed",
    });
    onClose();
  };
  return (
    <>
      <img
        src={close}
        onClick={onClose}
        className="w-6 cursor-pointer absolute top-4 right-4"
      />
      <div className="flex flex-col items-center">
        <span className="">Magic Seeds</span>
        <div className="flex items-center mt-4">
          <img src={magicSeeds} className="w-20" />
          <img src={indicator} className="w-6  ml-2 -rotate-[90deg]" />
          <img src={indicator} className="w-6  ml-2 -rotate-[90deg]" />
          <img src={indicator} className="w-6  ml-2 -rotate-[90deg]" />
          <img src={questionMark} className="w-12  ml-2" />
        </div>
        <span className=" text-sm mt-4">
          Do you want to plant a magic seed?
        </span>
        <span className=" text-sm mt-4">
          You must prune it every day for 3 days in a row.
        </span>
        <span className="text-sm  mt-4">
          If you miss a day, the plant will die.
        </span>
        <Button className="mt-4" onClick={plant}>
          Plant magic seed
        </Button>
      </div>
    </>
  );
};
