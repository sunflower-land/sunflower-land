import React from "react";

import goblinLantern from "assets/decorations/lanterns/goblin_lantern.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoblinLantern: React.FC = () => {
  return (
    <SFTDetailPopover name="Goblin Lantern">
      <div className="flex justify-center items-center pointer-events-none">
        <img
          src={goblinLantern}
          style={{
            width: `${PIXEL_SCALE * 17}px`,
          }}
          className="paper-floating"
          alt="Goblin Lantern"
        />
      </div>
    </SFTDetailPopover>
  );
};
