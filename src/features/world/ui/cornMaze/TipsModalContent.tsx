import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";

import crowWithoutShadow from "assets/decorations/crow_without_shadow.png";
import crowFeather from "assets/decorations/crow_feather_large.png";

interface Props {
  gameActive: boolean;
  onStart: () => void;
  onResume: () => void;
}

export const TipsModalContent: React.FC<Props> = ({
  gameActive,
  onStart,
  onResume,
}) => {
  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      <>
        <div className="p-1 pt-2 space-y-2 mb-2">
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center space-x-2">
              <img src={crowWithoutShadow} alt="Corn" className="w-6" />
              <p>Collect all the missing crows.</p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={SUNNYSIDE.icons.heart} alt="Health" className="w-6" />
              <p>Avoid all the enemies.</p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={SUNNYSIDE.icons.stopwatch}
                alt="timer"
                className="h-6"
              />
              <p>Make it back to the portal before the time runs out!</p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={crowFeather} alt="feather" className="h-6" />
              <p>{`Earn up to 100 feathers each week.`}</p>
            </div>
          </div>
        </div>
        {!gameActive && <Button onClick={onStart}>{`Let's Go!`}</Button>}
        {gameActive && <Button onClick={onResume}>{`Got it`}</Button>}
      </>
    </Panel>
  );
};
