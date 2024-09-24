import * as AuthProvider from "features/auth/lib/Provider";
import { Modal } from "components/ui/Modal";
import React, { useContext, useEffect, useState } from "react";
import board from "assets/decorations/competition_board.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
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
import walletIcon from "assets/icons/wallet.png";
import sflIcon from "assets/icons/sfl.webp";
import giftIcon from "assets/icons/gift.png";
import worldIcon from "assets/icons/world.png";
import levelupIcon from "assets/icons/level_up.png";
import choreIcon from "assets/icons/chores.webp";
import classNames from "classnames";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import {
  COMPETITION_POINTS,
  COMPETITION_TASK_DETAILS,
  COMPETITION_TASK_PROGRESS,
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
import {
  getCompetitionLeaderboard,
  getLeaderboard,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { Loading } from "features/auth/components";
import { getRelativeTime } from "lib/utils/time";
import { NPC } from "features/island/bumpkin/components/NPC";

export const CompetitionBoard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const { bumpkin, rewards, createdAt, inventory } = gameState.context.state;

  const coords = () => {
    const expansionCount = inventory["Basic Land"]?.toNumber() ?? 0;

    if (expansionCount < 6) {
      return { x: -6, y: -4.5 };
    }
    if (expansionCount >= 6 && expansionCount < 21) {
      return { x: -6, y: -10.5 };
    } else {
      return { x: -6, y: -16.5 };
    }
  };

  const { x, y } = coords();

  return (
    <>
      <MapPlacement x={x} y={y} width={4} height={4}>
        <img
          src={board}
          style={{ width: `${PIXEL_SCALE * 50}px` }}
          className="cursor-pointer hover:img-highlight"
          onClick={() => setIsOpen(true)}
        />
      </MapPlacement>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <CompetitionModal
          competitionName="TESTING"
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

const CompetitionModal: React.FC<{
  competitionName: CompetitionName;
  onClose: () => void;
}> = ({ onClose, competitionName }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const { competitions } = gameState.context.state;

  const [showIntro, setShowIntro] = useState(true);
  const [task, setTask] = useState<CompetitionTaskName>();

  const competition = COMPETITION_POINTS[competitionName];
  const end = useCountdown(competition.endAt);

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={() => setShowIntro(false)}
        message={[
          {
            text: "Howdy Bumpkin...you've joined at a special time!",
          },
          {
            text: "Sunflower Land & FSL are hosting the first every farming competition.",
          },
          {
            text: "It is time to show off your farming skills, climb the leaderboard and win prizes.",
          },
        ]}
      />
    );
  }

  if (!competitions.progress[competitionName]) {
    return (
      <Panel>
        <div className="p-1">
          <Label type="default" className="mb-1">
            Are you ready?
          </Label>
          <p className="text-sm mb-2">
            Would you like to join the farmer competition and compete for
            prizes?
          </p>
          <p className="text-xs mb-2">
            This competition is sponsored by our friends at FSL. You will need
            an FSL wallet to participate and claim prizes.
          </p>
        </div>
        <div className="flex">
          <Button className="mr-1" onClick={onClose}>
            Maybe later
          </Button>
          <Button
            onClick={() => {
              gameService.send("competition.started", {
                name: competitionName,
              });
            }}
          >
            Let's go!
          </Button>
        </div>
      </Panel>
    );
  }

  const tasks = getKeys(COMPETITION_POINTS[competitionName].points);

  const playerPoints = getCompetitionPoints({
    name: competitionName,
    game: gameState.context.state,
  });

  return (
    <OuterPanel
      className="scrollable overflow-y-scroll"
      style={{ maxHeight: "400px" }}
    >
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2 flex-wrap">
            <Label type="default">Farmer Competition</Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              <TimerDisplay fontSize={24} time={end} />
            </Label>
          </div>
          <NoticeboardItems
            iconWidth={8}
            items={[
              { icon: walletIcon, text: "$10,000 USD of FSL Points" },
              { icon: sflIcon, text: "50,000 SFL to be won!" },
              {
                icon: giftIcon,
                text: "Bonus prizes for top 10, 100 & 1000 players",
              },
            ]}
          />
        </div>
      </InnerPanel>

      {!gameState.context.fslId && (
        <InnerPanel className="mb-1">
          <div className="p-1">
            <Label type="danger" className="mb-2">
              Missing FSL ID
            </Label>
            <p className="text-xs mb-1 block">
              You must create an FSL ID to participate in this competition.
            </p>
            <p className="text-xs block">1. Visit X and sign up for FSL ID</p>
            <p className="text-xs block mb-1">2. Connect your FSL ID below</p>
          </div>
          <div className="flex">
            <Button className="mr-1 relative">
              FSL ID
              <img src={worldIcon} className="absolute right-1 top-0.5 h-7" />
            </Button>

            <Button className="relative">
              Connect
              <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
            </Button>
          </div>
        </InnerPanel>
      )}

      {gameState.context.fslId && (
        <>
          <InnerPanel className="mb-1">
            <div className="p-1">
              <div className="flex justify-between mb-2">
                <Label type="default" className="">
                  Earn points
                </Label>
                <Label type="vibrant">{`${"TODO"} points`}</Label>
              </div>
              <p className="text-xs mb-3">
                Every time you complete a task below, you earn points!
              </p>
              <div className="flex flex-wrap -mx-1 items-center">
                {tasks.map((name) => (
                  <div className="w-1/2 relative pr-0.5  h-full">
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
                        type="vibrant"
                        className="absolute -top-4 -right-2"
                      >{`${COMPETITION_POINTS[competitionName].points[name]} points`}</Label>
                    </ButtonPanel>
                  </div>
                ))}
              </div>
            </div>
          </InnerPanel>

          <CompetitionLeaderboard name={competitionName} />
        </>
      )}

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
                    {`Completed: ${getTaskCompleted({ task, name: competitionName, game: gameState.context.state })}`}
                  </p>
                  <Label type="vibrant">{`${getTaskCompleted({ task, name: competitionName, game: gameState.context.state }) * COMPETITION_POINTS[competitionName].points[task]} Points`}</Label>
                </div>
              </div>
            </>
          )}
        </CloseButtonPanel>
      </ModalOverlay>
    </OuterPanel>
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
      <InnerPanel>
        <Loading />
      </InnerPanel>
    );

  const { leaderboard, lastUpdatedAt, miniboard, player } = data;
  return (
    <>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between  items-center mb-2">
            <Label type="default" className="">
              Leaderboard
            </Label>
            <p className="font-secondary text-xs">
              {t("last.updated")} {getRelativeTime(lastUpdatedAt)}
            </p>
          </div>
          <CompetitionTable items={leaderboard} />

          {player && (
            <>
              <p className="text-center text-xs mb-2">...</p>
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
              <div className="absolute" style={{ left: "4px", top: "-7px" }}>
                <NPC width={20} parts={bumpkin} />
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
