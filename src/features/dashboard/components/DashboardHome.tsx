import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { News } from "features/farming/mail/components/News";
import { DashboardWhatsOn } from "./DashboardWhatsOn";
import chapterIcon from "assets/icons/chapter_icon_1.webp";
import tradeIcon from "assets/icons/trade.png";
import { DashboardAuction } from "./DashboardAuction";
import { DashboardProposals } from "./DashboardProposals";
import { EstimatedPrice } from "features/marketplace/components/MarketplaceHome";
import { TicketsLeaderboard } from "features/island/hud/components/codex/pages/TicketsLeaderboard";
import { DashboardLeaderboard } from "./DashboardLeaderboard";
import { NPC_WEARABLES } from "lib/npcs";
import { DashboardMarketplace } from "./DashboardMarketplace";

export const DashboardHome: React.FC = () => {
  return (
    <div className="flex  h-full">
      <div className="flex flex-col h-full flex-1 mr-1">
        <InnerPanel className="mb-1">
          <div className="flex items-center mb-1">
            <img className="h-6 mr-2" src={chapterIcon} />
            <p className="text-sm">What's on?</p>
          </div>
          <div className="flex flex-col flex-wrap">
            <DashboardWhatsOn />
          </div>
        </InnerPanel>

        <InnerPanel className="mb-1">
          <div className="flex items-center mb-1">
            <img className="h-6 mr-2" src={chapterIcon} />
            <p className="text-sm">NFTs & Drops</p>
          </div>
          <div className="flex flex-col flex-wrap">
            <DashboardAuction />
          </div>
        </InnerPanel>

        <InnerPanel className="mb-1">
          <div className="flex items-center mb-1">
            <img className="h-6 mr-2" src={chapterIcon} />
            <p className="text-sm">Upcoming</p>
          </div>
          <div className="flex flex-col flex-wrap">
            <DashboardProposals />
          </div>
        </InnerPanel>

        <InnerPanel className="mb-1">
          <div className="flex items-center mb-1">
            <img className="h-6 mr-2" src={tradeIcon} />
            <p className="text-sm">Marketplace Trades</p>
          </div>
          <div className="flex flex-col flex-wrap">
            <DashboardMarketplace />
          </div>
        </InnerPanel>
      </div>
      <div className="flex flex-col h-full w-[250px]">
        <EstimatedPrice price={100} />
        <InnerPanel className="mb-1">
          <DashboardLeaderboard
            id={"adam"}
            isLoading={false}
            data={{
              topTen: [
                {
                  bumpkin: NPC_WEARABLES["worried pete"],
                  count: 120,
                  id: "adam",
                  rank: 1,
                },
                {
                  bumpkin: NPC_WEARABLES["adam"],
                  count: 113,
                  id: "adam",
                  rank: 2,
                },
              ],
              lastUpdated: 0,
            }}
          />
        </InnerPanel>
      </div>
    </div>
  );
};
