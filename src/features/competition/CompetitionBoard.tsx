import * as AuthProvider from "features/auth/lib/Provider";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
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
import sflIcon from "assets/icons/sfl.webp";
import giftIcon from "assets/icons/gift.png";
import classNames from "classnames";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import {
  COMPETITION_POINTS,
  COMPETITION_TASK_DETAILS,
  CompetitionLeaderboardResponse,
  CompetitionName,
  CompetitionPlayer,
  CompetitionTaskName,
  getCompetitionPoints,
  getTaskCompleted,
} from "features/game/types/competitions";
import { getKeys } from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { getCompetitionLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { Loading } from "features/auth/components";
import { getRelativeTime } from "lib/utils/time";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { CompetitionPrizes } from "./CompetitionPrizes";
import { GameState } from "features/game/types/game";

export const CompetitionModal: React.FC<{
  competitionName: CompetitionName;
  onClose?: () => void;
}> = ({ onClose, competitionName }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const { competitions } = gameState.context.state;

  const [showIntro, setShowIntro] = useState(!competitions.progress.TESTING);
  const [task, setTask] = useState<CompetitionTaskName>();

  const competition = COMPETITION_POINTS[competitionName];
  const end = useCountdown(competition.endAt);

  const [isConnecting, setIsConnecting] = useState(false);

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
        bumpkinParts={NPC_WEARABLES.richie}
        onClose={() => setShowIntro(false)}
        message={[
          {
            text: t("competition.intro.one"),
          },
          {
            text: t("competition.intro.two"),
          },
          {
            text: t("competition.intro.three"),
          },
        ]}
      />
    );
  }

  if (!competitions.progress[competitionName]) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.richie}>
        <div className="p-1">
          <Label type="default" className="mb-1">
            {t("competition.areYouReady")}
          </Label>
          <p className="text-sm mb-2">{t("competition.join")}</p>
        </div>
        <div className="flex">
          <Button
            onClick={() => {
              gameService.send("competition.started", {
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

  const tasks = getKeys(COMPETITION_POINTS[competitionName].points);

  return (
    <OuterPanel
      bumpkinParts={NPC_WEARABLES.richie}
      className="scrollable overflow-y-scroll"
      style={{ maxHeight: "400px" }}
    >
      <img
        src={SUNNYSIDE.icons.close}
        onClick={onClose}
        className="absolute right-2 -top-12 w-10 cursor-pointer"
      />
      <CompetitionDetails
        competitionName={competitionName}
        state={gameState.context.state}
      />
    </OuterPanel>
  );
};

export const CompetitionDetails: React.FC<{
  competitionName: CompetitionName;
  state: GameState;
}> = ({ competitionName, state }) => {
  const { t } = useAppTranslation();

  const [task, setTask] = useState<CompetitionTaskName>();

  const competition = COMPETITION_POINTS[competitionName];
  const end = useCountdown(competition.endAt);

  const tasks = getKeys(COMPETITION_POINTS[competitionName].points);

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2 flex-wrap">
            <Label type="default">{t("competition.farmerCompetition")}</Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              <TimerDisplay fontSize={24} time={end} />
            </Label>
          </div>
          <p className="text-xs mb-3">{t("competition.hurry")}</p>
          <NoticeboardItems
            iconWidth={8}
            items={[
              {
                icon: ITEM_DETAILS["Black Sheep"].image,
                text: t("competition.prizes.one"),
              },
              { icon: sflIcon, text: t("competition.prizes.two") },
              {
                icon: giftIcon,
                text: t("competition.prizes.three"),
              },
            ]}
          />
        </div>
      </InnerPanel>

      <>
        <InnerPanel className="mb-1">
          <div className="p-1">
            <div className="flex justify-between mb-2">
              <Label type="default" className="">
                {t("competition.earnPoints")}
              </Label>
              <Label type="vibrant">{`${getCompetitionPoints({ game: state, name: competitionName })} points`}</Label>
            </div>
            <p className="text-xs mb-3">{t("competition.earnPoints.how")}</p>
            <div className="flex flex-wrap -mx-1 items-center">
              {tasks.map((name) => (
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
                      <p className="text-xs">{name}</p>
                    </div>
                    <Label
                      type="warning"
                      className="absolute -top-4 -right-2"
                    >{`${COMPETITION_POINTS[competitionName].points[name]} points`}</Label>
                  </ButtonPanel>
                </div>
              ))}
            </div>
          </div>
        </InnerPanel>

        <CompetitionLeaderboard name={competitionName} />

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
                  icon: sflIcon,
                  text: t("competition.rules.three"),
                },
                {
                  icon: SUNNYSIDE.icons.stopwatch,
                  text: t("competition.rules.four"),
                },
                {
                  icon: giftIcon,
                  text: t("competition.rules.five"),
                },
              ]}
            />
          </div>

          <CompetitionPrizes />
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
                <p className="text-xs mb-2">
                  {COMPETITION_TASK_DETAILS[task].description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs">
                    {`Completed: ${getTaskCompleted({ task, name: competitionName, game: state })}`}
                  </p>
                  <Label type="vibrant">{`${getTaskCompleted({ task, name: competitionName, game: state }) * (COMPETITION_POINTS[competitionName]?.points[task] ?? 0)} Points`}</Label>
                </div>
              </div>
            </>
          )}
        </CloseButtonPanel>
      </ModalOverlay>
    </>
  );
};

export const CompetitionLeaderboard: React.FC<{ name: CompetitionName }> = ({
  name,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [data, setData] = useState<CompetitionLeaderboardResponse>();

  const { t } = useAppTranslation();
  useEffect(() => {
    const load = async () => {
      const data = await getCompetitionLeaderboard({
        farmId: gameService.state.context.farmId,
        name,
        jwt: authService.state.context.user.rawToken as string,
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

  const { leaderboard, lastUpdated, miniboard, player, devs } = data;
  return (
    <>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between  items-center mb-2">
            <Label type="default" className="">
              {t("competition.leaderboard")}
            </Label>
            <p className="font-secondary text-xs">
              {t("last.updated")} {getRelativeTime(lastUpdated)}
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
          {/* Add devs positions */}
          {devs && (
            <div className="mt-2 space-y-2">
              <Label type="default" className="">
                {`Devs`}
              </Label>
              <CompetitionTable items={devs} />
            </div>
          )}
        </div>
      </InnerPanel>
    </>
  );
};

export const CompetitionTable: React.FC<{ items: CompetitionPlayer[] }> = ({
  items,
}) => {
  const { t } = useAppTranslation();
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
