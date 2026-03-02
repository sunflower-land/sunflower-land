import * as AuthProvider from "features/auth/lib/Provider";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  ButtonPanel,
  InnerPanel,
  OuterPanel,
  Panel,
} from "components/ui/Panel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import classNames from "classnames";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import {
  COMPETITION_POINTS,
  COMPETITION_TASK_DETAILS,
  CompetitionLeaderboardResponse,
  CompetitionName,
  CompetitionPlayer,
  CompetitionTaskName,
  getCompetitionPointsPerTask,
} from "features/game/types/competitions";
import { getKeys } from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { getCompetitionLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { Loading } from "features/auth/components";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";
import chefIcon from "assets/icons/chef_hat.png";
import lockIcon from "assets/icons/lock.png";
import calendarIcon from "assets/icons/calendar.webp";
import { useNow } from "lib/utils/hooks/useNow";
import { LastUpdatedAt } from "components/LastUpdatedAt";

const _state = (state: MachineState) => state.context.state;

export const CompetitionModal: React.FC<{
  competitionName: CompetitionName;
  onClose?: () => void;
}> = ({ onClose, competitionName }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const { t } = useAppTranslation();

  const { competitions } = state;

  const [showIntro, setShowIntro] = useState(!competitions.progress.TESTING);

  const [isConnecting] = useState(false);

  if (isConnecting) {
    return (
      <Panel>
        <Loading />
      </Panel>
    );
  }

  if (showIntro) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES.peggy}
        onClose={() => setShowIntro(false)}
        message={[
          { text: t("competition.intro.one") },
          { text: t("competition.intro.two") },
          { text: t("competition.intro.three") },
        ]}
      />
    );
  }

  if (!competitions.progress[competitionName]) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.peggy}>
        <div className="p-1">
          <Label type="default" className="mb-1">
            {t("competition.areYouReady")}
          </Label>
          <p className="text-sm mb-2">{t("competition.join")}</p>
        </div>
        <div className="flex">
          <Button
            onClick={() => {
              gameService.send({
                type: "competition.started",
                name: competitionName,
              });
            }}
          >
            {t("competition.letsGo")}
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <OuterPanel
      bumpkinParts={NPC_WEARABLES.peggy}
      className="scrollable overflow-y-scroll"
      style={{ maxHeight: "400px" }}
    >
      <img
        src={SUNNYSIDE.icons.close}
        onClick={onClose}
        className="absolute right-2 -top-12 w-10 cursor-pointer"
      />
      <CompetitionDetails competitionName={competitionName} state={state} />
    </OuterPanel>
  );
};

export const CompetitionDetails: React.FC<{
  competitionName: CompetitionName;
  state: GameState;
  hideLeaderboard?: boolean;
}> = ({ competitionName, state, hideLeaderboard }) => {
  const { t } = useAppTranslation();

  const [task, setTask] = useState<CompetitionTaskName>();

  const competition = COMPETITION_POINTS[competitionName];
  const end = useCountdown(competition.endAt);

  const tasks = getKeys(COMPETITION_POINTS[competitionName].points);
  const now = useNow({
    live: true,
    autoEndAt: Math.max(competition.startAt, competition.endAt),
  });

  const hasEnded = end.seconds <= 0;
  const hasBegun = now >= competition.startAt;

  if (hasEnded) {
    return (
      <InnerPanel>
        <Label type="default" className="mb-2">
          {t("competition.ended")}
        </Label>
        <div className="p-1">
          <p className="text-xs mb-2">{t("competition.ended.description")}</p>
          <p className="text-xs mb-2">
            {t("competition.ended.description.two")}
          </p>
        </div>
      </InnerPanel>
    );
  }

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2 flex-wrap">
            <Label type="default">{t("competition.farmerCompetition")}</Label>
            {hasBegun && (
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                <TimerDisplay fontSize={24} time={end} />
              </Label>
            )}
            {!hasBegun && (
              <Label type="formula" icon={lockIcon}>
                {new Date(competition.startAt).toLocaleDateString()}
              </Label>
            )}
          </div>
          {/* <p className="text-xs mb-3">{t("competition.hurry")}</p> */}
          <NoticeboardItems
            iconWidth={8}
            items={[
              {
                icon: ITEM_DETAILS["Love Charm"].image,
                text: t("competition.prizes.one"),
              },
              { icon: chefIcon, text: t("competition.prizes.two") },
              {
                icon: calendarIcon,
                text: t("competition.prizes.three", {
                  startDate: new Date(competition.startAt).toLocaleString(),
                  endDate: new Date(competition.endAt).toLocaleString(),
                }),
              },
            ]}
          />
        </div>
      </InnerPanel>

      <>
        <InnerPanel className="mb-1">
          <div className="p-1">
            <div className="flex justify-between flex-wrap">
              <Label type="default" className="mb-1">
                {t("competition.earnPoints")}
              </Label>
              <Label type="vibrant" className="mb-1">
                {`${state.competitions.progress[competitionName]?.points ?? 0} points`}
              </Label>
            </div>
            <p className="text-xs mb-3">{t("competition.earnPoints.how")}</p>
            <div className="flex flex-wrap -mx-1 items-center">
              {tasks.map((name) => {
                const points = getCompetitionPointsPerTask({
                  game: state,
                  name: competitionName,
                  task: name,
                });
                let taskName = name;
                if (name === "Help 10 Friends") {
                  const helpedForCompetition =
                    state.socialFarming.helpedForCompetition ?? 0;
                  taskName += ` (${helpedForCompetition > 10 ? helpedForCompetition % 10 : helpedForCompetition}/10)`;
                }

                return (
                  <div key={name} className="w-1/2 relative pr-0.5  h-full">
                    <ButtonPanel
                      onClick={() => setTask(name)}
                      className="w-full relative"
                    >
                      <div className="flex items-center">
                        <img
                          src={COMPETITION_TASK_DETAILS[name].icon}
                          className="h-6 mr-1"
                        />
                        <p className="text-xs">{taskName}</p>
                      </div>
                      <Label
                        type="warning"
                        className="absolute -top-4 -right-2"
                      >{`${points} ${points === 1 ? "point" : "points"}`}</Label>
                    </ButtonPanel>
                  </div>
                );
              })}
            </div>
          </div>
        </InnerPanel>

        {hideLeaderboard && <CompetitionLeaderboard name={competitionName} />}

        <InnerPanel>
          <div className="p-1">
            <Label type="default" className="mb-2">
              {t("competition.rules")}
            </Label>
            <NoticeboardItems
              iconWidth={8}
              items={[
                {
                  icon: SUNNYSIDE.icons.timer,
                  text: `${t("competition.rules.one")} ${new Date(COMPETITION_POINTS[competitionName].endAt + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
                },

                {
                  icon: ITEM_DETAILS["Love Charm"].image,
                  text: t("competition.rules.three"),
                },
                {
                  icon: SUNNYSIDE.icons.stopwatch,
                  text: t("competition.rules.four"),
                },
              ]}
            />
          </div>
        </InnerPanel>
      </>

      <ModalOverlay
        show={!!task}
        onBackdropClick={() => setTask(undefined)}
        className="m-2"
      >
        <CloseButtonPanel onClose={() => setTask(undefined)}>
          {task && (
            <>
              <div className="p-1">
                <Label type="default" className="mb-2">
                  {task}
                </Label>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs mb-2">
                    {COMPETITION_TASK_DETAILS[task].description}
                  </p>
                  <Label type="vibrant">{`${state.competitions.progress[competitionName]?.currentProgress[task] ?? 0} Points`}</Label>
                </div>
              </div>
            </>
          )}
        </CloseButtonPanel>
      </ModalOverlay>
    </>
  );
};

const CompetitionLeaderboard: React.FC<{
  name: CompetitionName;
}> = ({ name }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [data, setData] = useState<CompetitionLeaderboardResponse>();

  const { t } = useAppTranslation();
  useEffect(() => {
    const load = async () => {
      const data = await getCompetitionLeaderboard({
        farmId: gameService.getSnapshot().context.farmId,
        name,
        jwt: authService.getSnapshot().context.user.rawToken as string,
      });

      setData(data);
    };

    load();
  }, []);

  if (!data)
    return (
      <InnerPanel className="mb-1">
        <Loading />
      </InnerPanel>
    );

  const { leaderboard, lastUpdated, miniboard, player } = data;
  return (
    <>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between  items-center mb-2">
            <Label type="default" className="">
              {t("competition.leaderboard")}
            </Label>
            <p className="font-secondary text-xs">
              <LastUpdatedAt lastUpdated={lastUpdated} />
            </p>
          </div>
          <CompetitionTable items={leaderboard} />

          {/* Only show miniboard if player isn't in the main leaderboard */}
          {player && !leaderboard.find((m) => m.id === player.id) && (
            <>
              <p className="text-center text-xs mb-2">{`...`}</p>
              <CompetitionTable items={miniboard} />
            </>
          )}
        </div>
      </InnerPanel>
    </>
  );
};

export const CompetitionTable: React.FC<{ items: CompetitionPlayer[] }> = ({
  items,
}) => {
  return (
    <table className="w-full text-xs table-fixed border-collapse">
      <tbody>
        {items.map(({ username, points, rank, bumpkin }, index) => (
          <tr
            key={index}
            className={classNames("relative", {
              "bg-[#ead4aa]": index % 2 === 0,
            })}
          >
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 text-left w-12"
            >
              {toOrdinalSuffix(rank)}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 text-left pl-8 relative"
            >
              <div className="absolute" style={{ left: "4px", top: "1px" }}>
                <NPCIcon width={24} parts={bumpkin} />
              </div>
              {username}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 truncate text-center"
            >
              {points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
