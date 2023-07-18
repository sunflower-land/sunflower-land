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

interface Props {
  mmoService: MachineInterpreter;
}

// If colyseus does not return one of the servers, it means its empty

export const PickServer: React.FC<Props> = ({ mmoService }) => {
  const serverMaxCapacity = MAX_PLAYERS;

  const servers = mmoService.state.context.availableServers;

  const progressBar = (progress: number, max: number, server: number) => {
    const random = Math.random() * 20;
    const adjustedProgress = progress + (5 - server) * 10;

    return (
      <div
        className="flex relative mx-auto mt-1"
        style={{ width: "fit-content" }}
      >
        <ResizableBar
          percentage={((adjustedProgress + random) / max) * 100}
          type="progress"
          outerDimensions={{
            width: 40,
            height: 8,
          }}
        />
      </div>
    );
  };

  return (
    <div className="p-2">
      <p className="text-lg mb-1">Pick a server to join Sunflorea</p>
      <p className="text-xxs mb-3">Current populations</p>
      <>
        {servers.map((server) => {
          return (
            <OuterPanel
              className={classNames(
                "flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200",
                {
                  "cursor-not-allowed": isServerFull(servers, server.id),
                }
              )}
              key={server.id}
              onClick={() =>
                mmoService.send("PICK_SERVER", { serverId: server.id })
              }
            >
              <div className="flex">
                <p className="text-sm">{server.name}</p>
              </div>
              <div className="flex gap-2 mt-2 mb-1">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex gap-2  ml-5 ">
                    {progressBar(
                      serverCurrentPopulation(servers, server.id),
                      serverMaxCapacity,
                      servers.findIndex((s) => s.id === server.id) + 1
                    )}
                    {isServerFull(servers, server.id) && (
                      <Label type="danger" className="flex gap-2 items-center">
                        FULL
                      </Label>
                    )}
                  </div>
                </div>
              </div>
            </OuterPanel>
          );
        })}
      </>
    </div>
  );
};
