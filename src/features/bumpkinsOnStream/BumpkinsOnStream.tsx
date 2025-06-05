import React, { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useAuth } from "features/auth/lib/Provider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { useSelector } from "@xstate/react";
import useSWR from "swr";
import { getRacers } from "./actions/getRacers";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { getRace, Race } from "./actions/getRace";
import { BumpkinsRaceScene } from "./phaser/BumpkinsRaceScene";

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const BumpkinsOnStream: React.FC = () => {
  const { authService } = useAuth();
  const token = useSelector(authService, _token);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game>();
  const [race, setRace] = useState<Race>();
  const [leaderboard, setLeaderboard] = useState<
    { id: string; position: number }[]
  >([]);

  const { data, error, isLoading, mutate } = useSWR(
    ["/data?type=bumpkinsOnStream", token],
    async ([, token]) => getRacers({ token }),
  );

  // set up the game
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: container,
      backgroundColor: "#292929",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0, x: 0 },
        },
      },
      pixelArt: true,
      autoRound: true,
      scene: [new BumpkinsRaceScene()],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = undefined;
    };
  }, []);

  // poll for the lobby data
  useEffect(() => {
    if (!data?.closesAt) return;

    const interval = setInterval(() => {
      if (Date.now() > data.closesAt) {
        clearInterval(interval);
      } else {
        mutate();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.closesAt]);

  // update the racers as they enter the lobby
  useEffect(() => {
    if (!data?.racers) return;
    const scene = gameRef.current?.scene.getScene(
      BumpkinsRaceScene.SceneKey,
    ) as BumpkinsRaceScene;

    scene.updateRacers(data.racers);
  }, [data?.racers]);

  // update the scene text when the state changes
  useEffect(() => {
    const scene = gameRef.current?.scene.getScene(
      BumpkinsRaceScene.SceneKey,
    ) as BumpkinsRaceScene;

    if (!scene) return;

    if (isLoading) {
      scene.updateText("loading");
    } else if (error) {
      scene.updateText("error");
    } else if (data?.closesAt && Date.now() > data.closesAt) {
      scene.updateText("preparing");
    } else if (data?.racers) {
      scene.updateText("ready");
    } else {
      scene.updateText("noRace");
    }
  }, [isLoading, error, data]);

  const getRaceDetails = useCallback(async () => {
    const race = await getRace({ token });
    setRace(race);
  }, [token]);

  //  poll for the race details once the lobby closes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!data?.closesAt) return;

      if (Date.now() > data.closesAt + 10000) {
        getRaceDetails();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.closesAt]);

  // handle the starting of the race
  useEffect(() => {
    if (race) {
      const scene = gameRef.current?.scene.getScene(
        BumpkinsRaceScene.SceneKey,
      ) as BumpkinsRaceScene;
      scene.startRace(race);
    }
  }, [race]);

  // handle the leaderboard
  useEffect(() => {
    if (!race) return;
    if (race.startsAt && Date.now() < race.startsAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - race.startsAt) / 1000;
      const frame = Math.floor(elapsed);

      if (elapsed >= race.duration) {
        clearInterval(interval);
      }

      const sorted = Object.entries(race.racers)
        .map(([id, positions]) => ({
          id,
          username: data?.racers?.find((r) => r.id === Number(id))?.username,
          position: positions[frame] ?? positions.at(-1) ?? 0,
        }))
        .sort((a, b) => b.position - a.position);

      setLeaderboard(sorted);
    }, 1000);

    return () => clearInterval(interval);
  }, [race]);

  const lobbyCloseTime = useCountdown(data?.closesAt ?? 0);
  const hasLobbyClosed = Date.now() > (data?.closesAt ?? 0);

  return (
    <OuterPanel className="fixed inset-0">
      <InnerPanel className="w-full h-full flex flex-col overflow-hidden">
        <InnerPanel className="flex items-center justify-between text-3xl mb-1 h-14 px-3">
          <p>{`Bumpkins Race`}</p>
          {data?.closesAt && !hasLobbyClosed && (
            <div className="flex items-center">
              <p>{`Lobby closes in`}</p>
              <TimerDisplay time={lobbyCloseTime} fontSize={24} />
            </div>
          )}
          {hasLobbyClosed && (
            <div className="flex items-center">
              <p>{`Lobby closed`}</p>
            </div>
          )}
        </InnerPanel>
        <div className="flex h-[calc(100%-7rem)] w-full relative">
          <div className="w-32 flex-shrink-0">
            <InnerPanel className="flex flex-col space-y-1 p-2 mr-1 overflow-y-auto h-full">
              <div className="w-14 text-sm border-b border-black">{`Racers`}</div>
              {!leaderboard.length &&
                (data?.racers ?? []).map((racer, i) => (
                  <div key={i} className="text-sm">
                    {racer.username ?? `#${racer.id}`}
                  </div>
                ))}
              {leaderboard.length &&
                leaderboard.map((racer, i) => (
                  <div key={i} className="text-sm">
                    {racer.username ?? `#${racer.id}`}
                  </div>
                ))}
            </InnerPanel>
          </div>
          <div className="flex-1 min-w-0 relative">
            <div
              ref={containerRef}
              style={{
                width: "100%",
                height: "100%",
                background: "#2d2d2d",
              }}
            />
          </div>
        </div>
      </InnerPanel>
    </OuterPanel>
  );
};
