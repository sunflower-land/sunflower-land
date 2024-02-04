import classNames from "classnames";
import { OuterPanel } from "components/ui/Panel";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import React from "react";

export const Bumpkins: React.FC = () => {
  return (
    <div>
      <OuterPanel
        onClick={console.log}
        className={classNames(
          "flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200"
        )}
      >
        <div className="relative bottom-4 h-14 w-12 mr-2 ml-0.5">
          <NPC parts={NPC_WEARABLES["pumpkin' pete"]} preventZoom={true} />
        </div>
        <div>
          <p className="text-xs">Pumpkin Pete</p>
        </div>
      </OuterPanel>
    </div>
  );
};
