import React, { useEffect, useRef } from "react";

import Phaser from "phaser";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { getRacers, Racer } from "./actions/getRacers";
import useSWR from "swr";
import { useAuth } from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { RacingBumpkin } from "./RacingBumpkin";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { InnerPanel, Panel } from "components/ui/Panel";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  racers: Racer[] = [];
  private bumpkinMap: Map<number, RacingBumpkin> = new Map();

  init(data: { racers: Racer[] }) {
    this.racers = data.racers || [];
  }

  preload() {
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.image("shadow", "world/shadow.png");
  }

  create() {
    this.cameras.main.setBounds(0, 0, 2000, this.cameras.main.height);
  }

  addBumpkin(racer: Racer, x: number, y: number) {
    const { tokenUri } = racer;
    const clothing = interpretTokenUri(tokenUri).equipped;

    const bumpkin = new RacingBumpkin({
      scene: this,
      x,
      y,
      clothing,
    });

    this.add.existing(bumpkin).setScale(3);
  }

  updateRacers(racers: Racer[]) {
    racers.forEach((racer) => {
      if (this.bumpkinMap.has(racer.id)) {
        return;
      }

      const x = 30;
      const y = this.cameras.main.height / 2;

      const clothing = interpretTokenUri(racer.tokenUri).equipped;
      const bumpkin = new RacingBumpkin({ scene: this, x, y, clothing });

      this.add.existing(bumpkin).setScale(3);
      this.bumpkinMap.set(racer.id, bumpkin);
    });
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  backgroundColor: "#2d2d2d",
  parent: "track-container",
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
  autoRound: true,
};

const fetcher = async ([, token]: [string, string]) => {
  return getRacers({ token });
};

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const BumpkinsOnStream: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const scene = useRef<GameScene | null>(null);
  const { authService } = useAuth();
  const token = useSelector(authService, _token);

  const { data, error, isLoading, mutate } = useSWR(
    ["/data?type=bumpkinsOnStream", token],
    fetcher,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 5 * 1000);

    return () => clearInterval(interval);
  }, [mutate]);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    const checkReady = setInterval(() => {
      const activeScene = gameRef.current?.scene.getScene(
        "GameScene",
      ) as GameScene;
      if (activeScene) {
        scene.current = activeScene;
        clearInterval(checkReady);
      }
    }, 100);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      scene.current = null;
    };
  }, []);

  useEffect(() => {
    if (data?.racers && scene.current) {
      scene.current.updateRacers(data.racers);
    }
  }, [data?.racers]);

  if (isLoading) {
    return <div>{`Loading...`}</div>;
  }

  if (error) {
    return <div>{`Error: ${error.message}`}</div>;
  }

  return (
    <Panel className="h-full w-full text-white flex flex-col p-1">
      {/* Header */}
      <InnerPanel className="flex items-center justify-center text-3xl h-11 mb-1">
        {`Bumpkins Race`}
      </InnerPanel>

      {/* Main Content */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar */}
        <InnerPanel className="w-40 flex flex-col space-y-1 p-2 mr-1">
          <div className="border-b border-white pb-1">{`Racers`}</div>
          {(data?.racers ?? []).map((racer, i) => (
            <div key={i} className="text-sm">
              {racer.username ?? `#${racer.id}`}
            </div>
          ))}
        </InnerPanel>

        {/* Track */}
        <main className="flex-1 relative">
          <div
            id="track-container"
            className="w-full h-full bg-[#2d2d2d] overflow-hidden"
          />
        </main>
      </div>
    </Panel>
  );
};
