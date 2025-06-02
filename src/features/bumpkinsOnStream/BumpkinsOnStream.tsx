import React, { useEffect, useRef } from "react";

import Phaser from "phaser";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { getRacers, Racer } from "./actions/getRacers";
import useSWR from "swr";
import { useAuth } from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { RacingBumpkin } from "./RacingBumpkin";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";

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
    const centerX = this.cameras.main.width / 2;

    this.add
      .text(centerX, 50, "Bumpkins on Stream", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
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
      if (this.bumpkinMap.has(racer.farmId)) return;

      const x = this.cameras.main.width / 2;
      const y = Math.random() * 100 + this.bumpkinMap.size * 100;

      const clothing = interpretTokenUri(racer.tokenUri).equipped;
      const bumpkin = new RacingBumpkin({ scene: this, x, y, clothing });

      this.add.existing(bumpkin).setScale(3);
      this.bumpkinMap.set(racer.farmId, bumpkin);
    });
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2d2d2d",
  parent: "game-container",
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
  const { authService } = useAuth();
  const token = useSelector(authService, _token);

  const { data, error, isLoading } = useSWR(
    ["/data?type=bumpkinsOnStream", token],
    fetcher,
  );

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (data?.racers && gameRef.current) {
      const scene = gameRef.current.scene.getScene("GameScene") as GameScene;
      scene.updateRacers(data.racers);
    }
  }, [data?.racers]);

  return (
    <div
      id="game-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#2d2d2d",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        zIndex: 0,
      }}
    />
  );
};
