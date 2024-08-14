import React, { useContext } from "react";
import { TicketsLeaderboard } from "./TicketsLeaderboard";
import { TicketLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { InnerPanel } from "components/ui/Panel";
import {
  getCurrentSeason,
  secondsLeftInSeason,
} from "features/game/types/seasons";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

import factions from "assets/icons/factions.webp";
import chores from "assets/icons/chores.webp";
import trophy from "assets/icons/trophy.png";
import { MegaStoreContent } from "features/world/ui/megastore/MegaStore";
import { AuctionSummary } from "../components/AuctionSummary";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

interface Props {
  id: string;
  isLoading: boolean;
  data: TicketLeaderboard | null;
}

export const Season: React.FC<Props> = ({ id, isLoading, data }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { state, farmId } = gameState.context;
  return (
    <>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2">
            <Label className="-ml-1" type="default">
              {getCurrentSeason()}
            </Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`${secondsToString(secondsLeftInSeason(), { length: "short" })} left`}
            </Label>
          </div>
          <p className="text-xs">
            Earn Amber Fossils to craft limited edition collectibles & wearables
            for your farm! Hurry before time runs out!
          </p>
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div
          style={{
            backgroundImage: `url(${SUNNYSIDE.announcement.desertSeason})`,
            imageRendering: "pixelated",
            height: "125px",
            backgroundSize: "600px",
            backgroundPosition: "center",
            margin: "-3px",
          }}
        ></div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2">
            <Label className="-ml-1" type="default">
              How to earn Amber Fossils?
            </Label>
          </div>
          <NoticeboardItems
            iconWidth={8}
            items={[
              {
                text: "Deliver resources to Bumpkins",
                icon: SUNNYSIDE.icons.player,
              },
              {
                text: "Complete Hank's chores",
                icon: chores,
              },
              {
                text: "Compete in the faction competition",
                icon: factions,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <MegaStoreContent readonly />
      </InnerPanel>

      <AuctionSummary gameState={state} farmId={farmId} />

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2">
            <Label className="-ml-1" type="default">
              Mutants
            </Label>
          </div>
          <p className="text-xs">Discover the following seasonal rares:</p>
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <TicketsLeaderboard id={id} isLoading={isLoading} data={data} />
      </InnerPanel>
    </>
  );
};
