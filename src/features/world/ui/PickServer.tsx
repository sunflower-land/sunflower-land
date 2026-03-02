import React, { useContext, useState } from "react";

import { ButtonPanel } from "components/ui/Panel";
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
import brazilFlag from "assets/sfts/flags/brazil_flag.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useNavigate } from "react-router";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PanelTabs } from "features/game/components/CloseablePanel";

interface Props {
  mmoService: MachineInterpreter;
}

// If colyseus does not return one of the servers, it means its empty
const ICONS = [
  SUNNYSIDE.icons.water,
  CROP_LIFECYCLE["Basic Biome"].Sunflower.crop,
  SUNNYSIDE.icons.heart,
  brazilFlag,
  CROP_LIFECYCLE["Basic Biome"].Pumpkin.crop,
  CROP_LIFECYCLE["Basic Biome"].Kale.crop,
  flowerIcon,
];

export const PickServer: React.FC<Props> = ({ mmoService }) => {
  type Tab = "town";
  const [tab, setTab] = useState<Tab>("town");
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const farmId = gameState.context.farmId;

  const serverMaxCapacity = MAX_PLAYERS;

  const servers = mmoService.getSnapshot().context.availableServers;

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
          outerDimensions={{ width: 30, height: 8 }}
        />
      </div>
    );
  };

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={() => {
        navigate(`/`);
      }}
      tabs={
        [
          { id: "town", icon: SUNNYSIDE.icons.player, name: "Town" },
        ] satisfies PanelTabs<Tab>[]
      }
    >
      {tab === "town" && (
        <div className="p-2">
          <p className="text-xs mb-2">{t("share.chooseServer")}</p>
          <>
            {servers.map((server, index) => {
              return (
                <ButtonPanel
                  className={classNames(
                    "flex relative items-center justify-between !p-2 mb-1 cursor-pointer hover:bg-brown-200",
                    { "cursor-not-allowed": isServerFull(servers, server.id) },
                  )}
                  key={server.id}
                  onClick={() =>
                    mmoService.send({
                      type: "PICK_SERVER",
                      serverId: server.id,
                    })
                  }
                >
                  <div className="flex items-center">
                    <img src={ICONS[index]} className="w-6 mr-2" />
                    <div>
                      <p className="text-sm break-words">{server.name}</p>
                      <div className="flex items-center gap-2">
                        {isServerFull(servers, server.id) && (
                          <Label
                            type="danger"
                            className="flex gap-2 items-center"
                          >
                            {t("share.FULL")}
                          </Label>
                        )}
                        <p className="text-xs break-words">{server.purpose}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    {progressBar(
                      serverCurrentPopulation(servers, server.id),
                      serverMaxCapacity,
                      servers.findIndex((s) => s.id === server.id) + 1,
                    )}

                    <img
                      src={SUNNYSIDE.icons.chevron_right}
                      className="h-5 ml-2"
                    />
                  </div>
                </ButtonPanel>
              );
            })}
          </>
        </div>
      )}
    </CloseButtonPanel>
  );
};
