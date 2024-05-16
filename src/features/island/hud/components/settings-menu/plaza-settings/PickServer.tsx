import React, { useState, useEffect } from "react";

import PubSub from "pubsub-js";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import classNames from "classnames";
import {
  MAX_PLAYERS,
  isServerFull,
  serverCurrentPopulation,
} from "../../../../../world/lib/availableRooms";
import {
  fetchAvailableServers,
  ServerId,
  ServerName,
  ServerPurpose,
  getDefaultServer,
  saveDefaultServer,
} from "../../../../../world/mmoMachine";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import brazilFlag from "assets/sfts/flags/brazil_flag.gif";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SettingMenuId } from "../GameOptions";

interface Props {
  onSubMenuClick: (id: SettingMenuId) => void;
  onClose: () => void;
}

type Server = {
  population: number;
  name: ServerName;
  id: ServerId;
  purpose: ServerPurpose;
};

// If colyseus does not return one of the servers, it means its empty
const ICONS = [
  SUNNYSIDE.icons.water,
  CROP_LIFECYCLE.Sunflower.crop,
  SUNNYSIDE.icons.heart,
  brazilFlag,
  CROP_LIFECYCLE.Pumpkin.crop,
];

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

export const PickServer: React.FC<Props> = ({ onSubMenuClick, onClose }) => {
  const { t } = useAppTranslation();

  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [availableServers, setAvailableServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerId | undefined>(
    getDefaultServer()
  );

  useEffect(() => {
    fetchAvailableServers().then((servers) => {
      setAvailableServers(servers);
      setIsLoading(false);
    });
  }, []);

  const handleServerChange = (server: Server) => {
    setSelectedServer(server.id);

    const isSubscribed = PubSub.getSubscriptions("CHANGE_SERVER").length > 0;
    if (isSubscribed) {
      PubSub.publish("CHANGE_SERVER", { server });
      onClose();
    } else {
      saveDefaultServer(server.id);
    }
  };

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={() => {
        onSubMenuClick("plaza");
      }}
      tabs={[
        {
          icon: SUNNYSIDE.icons.player,
          name: "Town",
        },
      ]}
    >
      {tab === 0 && (
        <div className="p-2">
          <p className="text-xs mb-2">
            {isLoading && "Loading servers..."}
            {!isLoading && availableServers.length === 0 && "No servers found"}
            {!isLoading &&
              availableServers.length > 0 &&
              "Select the server you want to join"}
          </p>
          <>
            {availableServers.map((server, index) => {
              return (
                <OuterPanel
                  className={classNames(
                    "flex relative items-center justify-between !p-2 mb-1 cursor-pointer hover:bg-brown-200",
                    {
                      "cursor-not-allowed": isServerFull(
                        availableServers,
                        server.id
                      ),
                    },
                    {
                      // if server is selected as default, highlight it
                      "bg-brown-200": selectedServer === server.id,
                    }
                  )}
                  key={server.id}
                  onClick={() => handleServerChange(server)}
                >
                  <div className="flex items-center">
                    <img src={ICONS[index]} className="w-6 mr-2" />
                    <div>
                      <p className="text-sm break-words">{server.name}</p>
                      <div className="flex items-center gap-2">
                        {isServerFull(availableServers, server.id) && (
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
                      serverCurrentPopulation(availableServers, server.id),
                      MAX_PLAYERS,
                      availableServers.findIndex((s) => s.id === server.id) + 1
                    )}

                    <img
                      src={SUNNYSIDE.icons.chevron_right}
                      className="h-5 ml-2"
                    />
                  </div>
                </OuterPanel>
              );
            })}
          </>
        </div>
      )}
    </CloseButtonPanel>
  );
};
