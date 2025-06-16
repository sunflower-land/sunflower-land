import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PlayerModalPlayer } from "features/world/ui/player/PlayerModals";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import vipIcon from "assets/icons/vip.webp";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getLevel } from "features/game/types/skills";
import Decimal from "decimal.js-light";
import { capitalize } from "lib/utils/capitalize";

type Props = {
  player: PlayerModalPlayer;
};

export const PlayerDetails: React.FC<Props> = ({ player }) => {
  const [tab, setTab] = useState(0);
  const { t } = useTranslation();

  const startDate = new Date(player.createdAt).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="flex w-full gap-1">
        <InnerPanel className="flex flex-col gap-1 flex-1">
          <div className="flex items-center">
            <Label type="default">{player.username}</Label>
            {player.isVip && <img src={vipIcon} className="w-5 ml-2" />}
          </div>
          <div className="flex">
            <div>
              <NPCIcon parts={player.clothing} width={PIXEL_SCALE * 14} />
            </div>
            <div className="flex flex-col gap-1 text-xxs mt-1 ml-2 w-full">
              <div>{`Lvl ${getLevel(new Decimal(player.experience))}${player.faction ? ` - ${capitalize(player.faction)}` : ""}`}</div>
              <div className="flex items-center justify-between">
                <span>{`#${player.id}`}</span>
                <span>{`Player since ${startDate}`}</span>
              </div>
            </div>
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col w-2/5">
          <div>
            <Label type="default">{`Player Details`}</Label>
            <div></div>
          </div>
        </InnerPanel>
      </div>
    </>
  );
};
