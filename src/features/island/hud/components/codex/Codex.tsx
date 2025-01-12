import React, { useContext, useEffect, useState } from "react";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";

// Section Icons
import { Fish } from "./pages/Fish";
import { CodexCategory, CodexCategoryName } from "features/game/types/codex";
import { MilestoneReached } from "./components/MilestoneReached";
import { MilestoneName } from "features/game/types/milestones";
import { Flowers } from "./pages/Flowers";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Deliveries } from "./pages/Deliveries";
import { Label } from "components/ui/Label";
import classNames from "classnames";
import { useSound } from "lib/utils/hooks/useSound";

import factions from "assets/icons/factions.webp";
import trophyIcon from "assets/icons/trophy.png";
import chores from "assets/icons/chores.webp";
import { Leaderboards } from "features/game/expansion/components/leaderboard/actions/cache";
import { fetchLeaderboardData } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { FactionLeaderboard } from "./pages/FactionLeaderboard";
import { Season } from "./pages/Season";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { hasFeatureAccess } from "lib/flags";
import { ChoreBoard } from "./pages/ChoreBoard";
import { FLOWERS } from "features/game/types/flowers";
import { CompetitionDetails } from "features/competition/CompetitionBoard";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const Codex: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state, farmId },
    },
  ] = useActor(gameService);

  const {
    username,
    bertObsession,
    npcs,
    bounties,
    delivery,
    choreBoard,
    kingdomChores,
    faction,
  } = state;

  const [currentTab, setCurrentTab] = useState<CodexCategoryName>("Deliveries");
  const [showMilestoneReached, setShowMilestoneReached] = useState(false);
  const [milestoneName, setMilestoneName] = useState<MilestoneName>();

  const tab = useSound("tab");

  const [data, setData] = useState<Leaderboards | null | undefined>(undefined);

  useEffect(() => {
    if (!show) return;
    gameService.send("SAVE");

    const fetchLeaderboards = async () => {
      try {
        const data = await fetchLeaderboardData(farmId);
        setData(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error loading leaderboards", e);

        if (!data) setData(null);
      }
    };

    fetchLeaderboards();
  }, [show]);

  const handleTabClick = (index: CodexCategoryName) => {
    tab.play();
    setCurrentTab(index);
  };

  const handleHide = () => {
    onHide();
  };

  const handleMilestoneReached = (milestoneName: MilestoneName) => {
    setMilestoneName(milestoneName);
    setShowMilestoneReached(true);
  };

  const handleCloseMilestoneReached = () => {
    setShowMilestoneReached(false);
    setMilestoneName(undefined);
  };

  const id = username ?? String(farmId);

  const currentObsession = bertObsession;
  const obsessionCompletedAt = npcs?.bert?.questCompletedAt;

  const incompleteObsession =
    !currentObsession ||
    (obsessionCompletedAt &&
      obsessionCompletedAt >= currentObsession.startDate &&
      obsessionCompletedAt <= currentObsession.endDate)
      ? 0
      : 1;

  const incompleteFlowerBounties = bounties.requests.filter(
    (deal) => deal.name in FLOWERS,
  );
  const incompleteFlowerBountiesCount = incompleteFlowerBounties.reduce(
    (count, deal) => {
      const isSold = !!bounties.completed.find(
        (request) => request.id === deal.id,
      );
      return isSold ? count - 1 : count;
    },
    incompleteFlowerBounties.length,
  );

  const incompleteDeliveries = delivery.orders.filter(
    (order) => !order.completedAt,
  ).length;

  const incompleteChores = Object.values(choreBoard?.chores ?? {}).filter(
    (chore) => !chore.completedAt,
  ).length;

  const inCompleteKingdomChores =
    kingdomChores?.chores.filter(
      (chore) => chore.startedAt && !chore.completedAt && !chore.skippedAt,
    ).length ?? 0;

  const categories: CodexCategory[] = [
    {
      name: "Deliveries",
      icon: SUNNYSIDE.icons.player,
      count: incompleteDeliveries,
    },
    {
      name: "Chore Board" as const,
      icon: chores,
      count: incompleteChores,
    },

    {
      name: "Leaderboard" as const,
      icon: ITEM_DETAILS[getSeasonalTicket()].image,
      count: incompleteObsession + incompleteFlowerBountiesCount,
    },
    {
      name: "Fish",
      icon: SUNNYSIDE.icons.fish,
      count: 0,
    },
    {
      name: "Flowers",
      icon: ITEM_DETAILS["Red Pansy"].image,
      count: 0,
    },

    ...(faction
      ? [
          {
            name: "Marks" as const,
            icon: factions,
            count: inCompleteKingdomChores,
          },
        ]
      : []),

    ...(hasFeatureAccess(state, "ANIMAL_COMPETITION")
      ? [
          {
            name: "Competition" as const,
            icon: trophyIcon,
            count: 0,
          },
        ]
      : []),
  ];

  return (
    // TODO feat/marks-leaderboard ADD SHOW
    <Modal show={show} onHide={handleHide} dialogClassName="md:max-w-3xl">
      <div className="h-[500px] relative">
        {/* Header */}
        <OuterPanel className="flex flex-col h-full">
          <div className="flex items-center pl-1 mb-2">
            <div className="flex items-center grow">
              <img src={SUNNYSIDE.icons.search} className="h-6 mr-3 ml-1" />
              <p>{t("sunflowerLandCodex")}</p>
            </div>
            <img
              src={SUNNYSIDE.icons.close}
              className="float-right cursor-pointer z-20 ml-3"
              onClick={handleHide}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>

          <div
            className="relative h-full overflow-hidden"
            style={{
              paddingLeft: `${PIXEL_SCALE * 16.5}px`,
            }}
          >
            {/* Tabs */}
            <div className="absolute top-1.5 left-0">
              <div className="flex flex-col">
                {categories.map((tab, index) => (
                  <OuterPanel
                    key={`${tab}-${index}`}
                    className={classNames(
                      "flex items-center relative p-0.5 mb-1 cursor-pointer",
                    )}
                    onClick={() => handleTabClick(tab.name)}
                    style={{
                      background:
                        currentTab === tab.name ? "#ead4aa" : undefined,
                    }}
                  >
                    {!!tab.count && (
                      <Label
                        type="default"
                        className="absolute -top-3 left-3 z-10"
                        style={{
                          padding: "0 2.5",
                          height: "24px",
                        }}
                      >
                        {tab.count}
                      </Label>
                    )}

                    <SquareIcon icon={tab.icon} width={9} />
                  </OuterPanel>
                ))}
              </div>
            </div>
            {/* Content */}
            {/* <InnerPanel
              className={classNames("flex flex-col h-full overflow-hidden", {
                "overflow-y-auto scrollable": currentTab !== 5,
              })}
            > */}
            {currentTab === "Deliveries" && (
              <Deliveries
                onClose={onHide}
                state={state}
                gameService={gameService}
              />
            )}
            {currentTab === "Chore Board" && (
              <ChoreBoard gameService={gameService} state={state} />
            )}
            {currentTab === "Leaderboard" && (
              <Season
                id={id}
                isLoading={data?.tickets === undefined}
                data={data?.tickets ?? null}
                season={getCurrentSeason()}
                state={state}
                farmId={farmId}
                gameService={gameService}
              />
            )}
            {currentTab === "Fish" && (
              <Fish
                onMilestoneReached={handleMilestoneReached}
                state={state}
                gameService={gameService}
              />
            )}
            {currentTab === "Flowers" && (
              <Flowers
                onMilestoneReached={handleMilestoneReached}
                state={state}
                gameService={gameService}
              />
            )}

            {currentTab === "Marks" && faction && (
              <FactionLeaderboard
                leaderboard={data?.kingdom ?? null}
                isLoading={data?.kingdom === undefined}
                playerId={id}
                faction={faction.name}
              />
            )}

            {currentTab === "Competition" && (
              <div
                className={classNames(
                  "flex flex-col h-full overflow-hidden overflow-y-auto scrollable",
                )}
              >
                <CompetitionDetails competitionName="ANIMALS" />
              </div>
            )}
          </div>
        </OuterPanel>
        {showMilestoneReached && (
          <div className="absolute w-full sm:w-5/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200]">
            <MilestoneReached
              milestoneName={milestoneName as MilestoneName}
              onClose={handleCloseMilestoneReached}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
