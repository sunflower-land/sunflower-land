import React, { useContext, useEffect, useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";

import { CodexCategory, CodexCategoryName } from "features/game/types/codex";
import { MilestoneReached } from "./components/MilestoneReached";
import { MilestoneName } from "features/game/types/milestones";
import { Fish } from "./pages/Fish";
import { Flowers } from "./pages/Flowers";
import { Deliveries } from "./pages/Deliveries";
import { ChoreBoard } from "./pages/ChoreBoard";
import { FactionLeaderboard } from "./pages/FactionLeaderboard";
import { LeagueLeaderboard } from "./pages/LeaguesLeaderboard";
import { ChapterCollections } from "./pages/ChapterCollections";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import classNames from "classnames";
import { useSound } from "lib/utils/hooks/useSound";

import factions from "assets/icons/factions.webp";
import chores from "assets/icons/chores.webp";
import { Leaderboards } from "features/game/expansion/components/leaderboard/actions/cache";
import { fetchLeaderboardData } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { getChapterTicket } from "features/game/types/chapters";
import { CompetitionDetails } from "features/competition/CompetitionBoard";
import { MachineState } from "features/game/lib/gameMachine";
import { ANIMALS } from "features/game/types/animals";
import { Checklist, checklistCount } from "components/ui/CheckList";
import { getBumpkinLevel } from "features/game/lib/level";
import trophyIcon from "assets/icons/trophy.png";
import { hasFeatureAccess } from "lib/flags";
import { AuthMachineState } from "features/auth/lib/authMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import { useNow } from "lib/utils/hooks/useNow";
import { ChapterBounties } from "./pages/ChapterBounties";
import deliveryIcon from "assets/icons/delivery.webp";

interface Props {
  show: boolean;
  onHide: () => void;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _state = (state: MachineState) => state.context.state;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const Codex: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);
  const farmId = useSelector(gameService, _farmId);
  const state = useSelector(gameService, _state);
  const token = useSelector(authService, _token);
  const now = useNow();
  const chapterTicket = getChapterTicket(now);

  const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);

  const { username, bounties, delivery, choreBoard, kingdomChores, faction } =
    state;

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
        const data = await fetchLeaderboardData(farmId, token);
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

  const handleMilestoneReached = (milestoneName: MilestoneName) => {
    setMilestoneName(milestoneName);
    setShowMilestoneReached(true);
  };

  const handleCloseMilestoneReached = () => {
    setShowMilestoneReached(false);
    setMilestoneName(undefined);
  };

  // Use Set for O(1) lookup instead of Object.keys().includes()
  const animalNamesSet = new Set(Object.keys(ANIMALS));
  const incompleteMegaBounties = bounties.requests.filter(
    (deal) => !animalNamesSet.has(deal.name),
  );
  // Optimize: Use Set for O(1) lookup instead of array.find()
  const completedBountyIds = new Set(bounties.completed.map((r) => r.id));
  const incompleteMegaBountiesCount = incompleteMegaBounties.filter(
    (deal) => !completedBountyIds.has(deal.id),
  ).length;

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

  // Pre-calculate checklist count once
  const checklistCountValue = checklistCount(state, bumpkinLevel, now);
  const hasLeagues =
    hasFeatureAccess(state, "LEAGUES") && state.prototypes?.leagues;

  // Build categories array more efficiently
  const categories: CodexCategory[] = [
    {
      name: "Deliveries",
      icon: deliveryIcon,
      count: incompleteDeliveries,
    },
    {
      name: "Chore Board",
      icon: chores,
      count: incompleteChores,
    },
    {
      name: "Leaderboard",
      icon: ITEM_DETAILS[chapterTicket].image,
      count: incompleteMegaBountiesCount,
    },
    {
      name: "Checklist",
      icon: SUNNYSIDE.ui.board,
      count: checklistCountValue,
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
    {
      name: "Collections" as const,
      icon: SUNNYSIDE.icons.treasure,
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
    ...(hasLeagues
      ? [
          {
            name: "Leagues" as const,
            icon: trophyIcon,
            count: 0,
          },
        ]
      : []),
  ];

  return (
    // TODO feat/marks-leaderboard ADD SHOW
    <Modal show={show} onHide={onHide} dialogClassName="md:max-w-3xl">
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
              onClick={onHide}
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
                {categories.map((tab) => (
                  <OuterPanel
                    key={tab.name}
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
            {currentTab === "Deliveries" && (
              <Deliveries onClose={onHide} state={state} />
            )}
            {currentTab === "Chore Board" && <ChoreBoard state={state} />}
            {currentTab === "Leaderboard" && <ChapterBounties />}
            {currentTab === "Checklist" && <Checklist />}
            {currentTab === "Fish" && (
              <Fish onMilestoneReached={handleMilestoneReached} state={state} />
            )}
            {currentTab === "Flowers" && (
              <Flowers
                onMilestoneReached={handleMilestoneReached}
                state={state}
              />
            )}
            {currentTab === "Collections" && (
              <ChapterCollections state={state} onClose={onHide} />
            )}
            {currentTab === "Marks" && faction && (
              <FactionLeaderboard
                leaderboard={data?.kingdom ?? null}
                isLoading={data?.kingdom === undefined}
                faction={faction.name}
              />
            )}
            {currentTab === "Competition" && (
              <div
                className={classNames(
                  "flex flex-col h-full overflow-hidden overflow-y-auto scrollable",
                )}
              >
                <CompetitionDetails
                  competitionName="BUILDING_FRIENDSHIPS"
                  state={state}
                  hideLeaderboard={
                    now < new Date("2025-10-20T00:00:00Z").getTime()
                  }
                />
              </div>
            )}
            {currentTab === "Leagues" && state.prototypes?.leagues && (
              <InnerPanel>
                <LeagueLeaderboard
                  data={data?.leagues ?? null}
                  isLoading={data === undefined}
                  username={username}
                  farmId={farmId}
                />
              </InnerPanel>
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
