import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";

import crumpleCrown from "assets/icons/crumple_crown.png";
import crowWithoutShadow from "assets/decorations/crow_without_shadow.png";
import crowFeather from "assets/decorations/crow_feather_large.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useSelector } from "@xstate/react";
import { WitchesEve } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { OCTOBER_MADNESS } from "features/world/lib/cornmazeMachine";

interface Props {
  isIncompleteAttempt: boolean;
  isPaused: boolean;
  onClick: () => void;
  isEnemy: boolean;
}

export const TipsModalContent: React.FC<Props> = ({
  isIncompleteAttempt: isIncomleteAttempt,
  isPaused,
  onClick,
  isEnemy,
}) => {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);

  const buttonText = isIncomleteAttempt
    ? "Resume Incomplete Attempt"
    : "Let's Go!";

  return (
    <CloseButtonPanel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
      onClose={isPaused ? onClick : undefined}
      tabs={[
        { name: "Tips", icon: SUNNYSIDE.icons.expression_confused },
        { name: "Weekly Stats", icon: crowFeather },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      <>
        {tab === 0 && (
          <>
            {page === 0 && (
              <>
                <div className="p-1 pt-2 space-y-2 mb-2">
                  <div className="space-y-2 flex flex-col">
                    <div className="flex items-center space-x-2">
                      <img src={crowWithoutShadow} alt="Corn" className="w-6" />
                      <p>Collect all the missing crows.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img
                        src={SUNNYSIDE.icons.heart}
                        alt="Health"
                        className="w-6"
                      />
                      <p>Avoid all the enemies. Lose 5 secs time each hit!</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img
                        src={SUNNYSIDE.icons.stopwatch}
                        alt="timer"
                        className="h-6"
                      />
                      <p>
                        Make it back to the portal before the time runs out!
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img src={crowFeather} alt="feather" className="h-6" />
                      <p>{`Earn up to 100 feathers per week.`}</p>
                    </div>
                  </div>
                  <a
                    href="https://docs.sunflower-land.com/player-guides/seasons/witches-eve#the-witchs-maze"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-white text-xxs text-center my-1"
                  >
                    Read more
                  </a>
                </div>
                {!isPaused && !OCTOBER_MADNESS && (
                  <Button onClick={() => setPage(1)}>Next</Button>
                )}
                {!isPaused && OCTOBER_MADNESS && (
                  <Button onClick={onClick}>{buttonText}</Button>
                )}
              </>
            )}
            {page === 1 && (
              <>
                <div className="p-1 pt-2 space-y-2 mb-2">
                  <Label type="danger">October Madness</Label>
                  <div className="space-y-2 flex flex-col">
                    <div className="flex items-center space-x-2">
                      <img
                        src={crumpleCrown}
                        alt="Corn"
                        className="w-14 img-highlight"
                      />
                      {isEnemy && (
                        <p>
                          This week you are the enemy! Catch as many Bumpkins as
                          possible.
                        </p>
                      )}
                      {!isEnemy && (
                        <p>
                          Watch out for players wearing the Crumple Crown. They
                          can hurt you!
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href="https://docs.sunflower-land.com/player-guides/seasons/witches-eve#the-witchs-maze"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-white text-xxs text-center my-1"
                  >
                    Read more
                  </a>
                </div>
                {!isPaused && <Button onClick={onClick}>{buttonText}</Button>}
              </>
            )}
          </>
        )}
        {tab === 1 && <Stats />}
      </>
    </CloseButtonPanel>
  );
};

const _witchesEve = (state: GameMachineState) =>
  state.context.state.witchesEve as WitchesEve;

const Stats: React.FC = () => {
  const { gameService } = useContext(Context);
  const currentWeek = getSeasonWeek();
  const witchesEve = useSelector(gameService, _witchesEve);
  const weeklyData = witchesEve?.maze[currentWeek];

  if (!weeklyData) {
    return (
      <div className="text-sm text-white h-24">No data for this week!</div>
    );
  }

  const completedAttempts = weeklyData?.attempts
    .filter((attempt) => !!attempt.completedAt)
    // sort by crows found. most crows at the top
    .sort((a, b) => b.crowsFound - a.crowsFound);

  return (
    <div className="flex flex-col space-y-2 -mt-[3px] max-h-96 overflow-y-auto scrollable">
      <div className="flex flex-col space-y-1 text-xs p-1">
        <p>{`Total Feathers Earned: ${weeklyData?.claimedFeathers}`}</p>
        <p>{`Total Attempts: ${completedAttempts.length}`}</p>
        <p>{`Highest Score: ${weeklyData?.highestScore}`}</p>
      </div>
      {completedAttempts.length === 0 && (
        <div className="text-sm text-white h-24">No attempts this week.</div>
      )}
      {completedAttempts.length > 0 && (
        <table className="w-full text-xs table-fixed border-collapse p-">
          <thead className="sticky top-0 bg-brown-300">
            <tr>
              <th style={{ border: "1px solid #b96f50" }} className="p-1.5 ">
                <p>Crows Found</p>
              </th>
              <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <p>Health</p>
              </th>
              <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <p>Time</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {completedAttempts.map(({ crowsFound, health, time }, index) => (
              <tr
                key={index}
                className={classNames({
                  "bg-red-500": health === 0,
                })}
              >
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  {crowsFound}
                </td>
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  {health}
                </td>
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  {`${time} ${time > 1 ? "seconds" : "second"}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
