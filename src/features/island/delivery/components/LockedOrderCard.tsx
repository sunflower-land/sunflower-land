import React from "react";
import { ButtonPanel } from "components/ui/Panel";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { NPCName } from "lib/npcs";
import { DeliveryNpcName, NPC_DELIVERY_LEVELS } from "../lib/delivery";

export const LockedOrderCard: React.FC<{ npc: NPCName }> = ({ npc }) => {
  return (
    <div className="py-1 px-1">
      <ButtonPanel
        disabled
        className={classNames(
          "w-full !py-2 relative h-full flex items-center justify-center cursor-not-allowed",
        )}
        style={{ paddingBottom: "20px" }}
      >
        <div className="flex flex-col pb-2">
          <div className="flex items-center my-1">
            <div className="relative mb-2 mr-0.5 -ml-1">
              <NPCIcon parts={NPC_WEARABLES[npc]} />
            </div>
            <div className="flex-1 flex justify-center h-8 items-center w-6 ">
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="h-6 img-highlight"
              />
            </div>
          </div>
        </div>

        <Label
          type="formula"
          icon={SUNNYSIDE.icons.lock}
          className="absolute -bottom-2 text-center p-1"
          style={{
            left: `${PIXEL_SCALE * -3}px`,
            right: `${PIXEL_SCALE * -3}px`,
            width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
            height: "25px",
          }}
        >
          {`Lvl ${NPC_DELIVERY_LEVELS[npc as DeliveryNpcName]}`}
        </Label>
      </ButtonPanel>
    </div>
  );
};
