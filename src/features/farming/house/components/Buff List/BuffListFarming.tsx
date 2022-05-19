import React, { useContext } from "react";
import classNames from "classnames";
import { artistBuff, coderBuff, CropName, Crops, easterBunnyBuff, goldenCauliflowerBuff, greenThumbBuff, kuebikoBuff, mysteriousParsnipBuff, nancyBuff, scarecrowBuff, seedSpecialistBuff } from "features/farming/house/components/Buff List/buffs";

import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import arrowLeft from "assets/icons/arrow_left.png";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import lock from "assets/skills/lock.png";

interface Props {
  back: () => void;
}

export const BuffListFarming: React.FC<Props> = ({ back }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  greenThumbBuff(state.inventory)
  seedSpecialistBuff(state.inventory)
  artistBuff(state.inventory)
  coderBuff(state.inventory)
  nancyBuff(state.inventory)
  scarecrowBuff(state.inventory)
  kuebikoBuff(state.inventory)
  easterBunnyBuff(state.inventory)
  goldenCauliflowerBuff(state.inventory)
  mysteriousParsnipBuff(state.inventory)

  return (
    <>
      <div className="flex">
        <img
          className="h-6 mr-3 cursor-pointer"
          src={arrowLeft}
          alt="back"
          onClick={back}
        />
        <span className="text-base">Farming buffs</span>
      </div>
      <div className="flex flex-wrap justify-around overflow-y-auto scrollable max-h-96 pt-2 pr-1 mt-2">
        {(Object.keys(Crops) as CropName[]).map((CropName) => {
          const crop = Crops[CropName];

          return (
            <OuterPanel className="w-full my-2 p-1 relative" key={CropName}>
              <div className="flex justify-between h-12 items-center border-b border-white mb-2">
                <span className="text-sm">{CropName}</span>
              </div>
              <ul className="list-disc">
                {crop.key.map((key) => (
                  <li key={key} className="text-xs block capitalize">
                    Seed Price: {Math.round((crop.seedPrice + Number.EPSILON) * 1000) / 1000}X<br/>
                    Sell price: {Math.round((crop.sellPrice + Number.EPSILON) * 1000) / 1000}X<br/>
                    Growth time: {Math.round((crop.growthTime + Number.EPSILON) * 1000) / 1000}X<br/>
                    Harvest multplier: {Math.round((crop.harvestMult + Number.EPSILON) * 1000) / 1000}X
                  </li>
              ))}
              </ul>
            </OuterPanel>
          );
        })}
      </div>
    </>
  );
};