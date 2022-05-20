import React, { useContext } from "react";
import { GatheringName, Gathering, woodyTheBeaverBuff, apprenticeBeaverBuff, foremanBeaverBuff, lumberjackBuff, prospectorBuff, loggerBuff, goldRushBuff, artistBuff, discordModBuff } from "features/farming/house/components/Buff List/buffs";

import { OuterPanel } from "components/ui/Panel";
import arrowLeft from "assets/icons/arrow_left.png";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

interface Props {
  back: () => void;
}

export const BuffListGathering: React.FC<Props> = ({ back }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  lumberjackBuff(state.inventory)
  prospectorBuff(state.inventory)
  artistBuff(state.inventory)
  discordModBuff(state.inventory)
  loggerBuff(state.inventory)
  goldRushBuff(state.inventory)
  woodyTheBeaverBuff(state.inventory)
  apprenticeBeaverBuff(state.inventory)
  foremanBeaverBuff(state.inventory)

  return (
    <>
      <div className="flex">
        <img
          className="h-6 mr-3 cursor-pointer"
          src={arrowLeft}
          alt="back"
          onClick={back}
        />
        <span className="text-base">Gathering buffs</span>
      </div>
      <div className="flex flex-wrap justify-around overflow-y-auto scrollable max-h-96 pt-2 pr-1 mt-2">
        {(Object.keys(Gathering) as GatheringName[]).map((GatheringName) => {
          const gathering = Gathering[GatheringName];

          return (
            <OuterPanel className="w-full my-2 p-1 relative" key={GatheringName}>
              <div className="flex justify-between h-12 items-center border-b border-white mb-2">
                <span className="text-sm">{GatheringName}</span>
                <img src={gathering.icon} className="w-8" />
              </div>
              <ul className="list-disc">
                {gathering.key.map((key) => (
                  <li key={key} className="text-xs block capitalize">
                    Tool Price: {Math.round((gathering.toolPrice + Number.EPSILON) * 1000) / 1000}X<br/>
                    Harvesting price: {Math.round((gathering.harvestingPrice + Number.EPSILON) * 1000) / 1000}X<br/>
                    Growth time: {Math.round((gathering.growthTime + Number.EPSILON) * 1000) / 1000}X<br/>
                    Harvest multplier: {Math.round((gathering.harvestMult + Number.EPSILON) * 1000) / 1000}X
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
