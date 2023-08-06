import React from "react";

import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import classNames from "classnames";
import {
  MAX_PLAYERS,
  isServerFull,
  serverCurrentPopulation,
} from "../lib/availableRooms";
import { MachineInterpreter } from "../mmoMachine";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import brazilFlag from "assets/sfts/flags/brazil_flag.gif";

interface Props {
  mmoService: MachineInterpreter;
}

// If colyseus does not return one of the servers, it means its empty
const ICONS = [
  CROP_LIFECYCLE.Sunflower.crop,
  SUNNYSIDE.icons.heart,
  SUNNYSIDE.icons.water,
  brazilFlag,
  CROP_LIFECYCLE.Pumpkin.crop,
];

export const PickServer: React.FC<Props> = ({ mmoService }) => {
  const serverMaxCapacity = MAX_PLAYERS;

  const servers = mmoService.state.context.availableServers;

  const progressBar = (progress: number, max: number, server: number) => {
    let percentage = (progress / max) * 100;

    if (percentage < 10) {
      percentage = 10;
    } else if (percentage < 30) {
      percentage = 30;
    } else if (percentage < 60) {
      percentage = 60;
    }

    return (
      <div className="flex relative" style={{ width: "fit-content" }}>
        <ResizableBar
          percentage={percentage}
          type="progress"
          outerDimensions={{
            width: 30,
            height: 8,
          }}
        />
      </div>
    );
  };

  return (
    <div className="p-2">
      <p className="text-sm mb-2">Pick a server to join</p>
      <>
        {servers.map((server, index) => {
          return (
            <OuterPanel
              className={classNames(
                "flex relative items-center justify-between p-2 mb-1 cursor-pointer hover:bg-brown-200",
                {
                  "cursor-not-allowed": isServerFull(servers, server.id),
                }
              )}
              key={server.id}
              onClick={() =>
                mmoService.send("PICK_SERVER", { serverId: server.id })
              }
            >
              <div className="flex items-center">
                <img src={ICONS[index]} className="w-5 mr-2" />
                <div>
                  <p className="text-sm break-words">{server.name}</p>
                  {isServerFull(servers, server.id) && (
                    <Label type="danger" className="flex gap-2 items-center">
                      FULL
                    </Label>
                  )}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-end">
                {progressBar(
                  serverCurrentPopulation(servers, server.id),
                  serverMaxCapacity,
                  servers.findIndex((s) => s.id === server.id) + 1
                )}

                <img src={SUNNYSIDE.icons.chevron_right} className="h-5 ml-2" />
              </div>
            </OuterPanel>
          );
        })}
      </>
    </div>
  );
};
