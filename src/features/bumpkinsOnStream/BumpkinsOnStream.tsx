import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useAuth } from "features/auth/lib/Provider";
import useSWR from "swr";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { useSelector } from "@xstate/react";
import { getRacers, Racer } from "./actions/getRacers";
import { RacingBumpkin } from "./RacingBumpkin";

// Game scene
class GameScene extends Phaser.Scene {
  private bumpkins: RacingBumpkin[] = [];
  private racers: Racer[] = [];
  public hasStarted = false;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data: { racers: Racer[] }) {
    this.racers = data?.racers || [];
  }

  preload() {
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
  }

  create() {
    this.add
      .text(400, 50, "Bumpkins on Stream", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    for (let i = 0; i < 5; i++) {
      this.addBumpkin("", 120 + i * 80);
    }

    this.add.rectangle(400, 300, 20, 20, 0xff0000); // static debug dot
  }

  addBumpkin(tokenUri: string, y: number) {
    const bumpkin = new RacingBumpkin({
      scene: this,
      x: 400,
      y: y,
    });

    this.add.existing(bumpkin);
  }
}

// Game configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2d2d2d",
  scene: GameScene,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
};

// Fetcher function for SWR
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
    // Initialize the game
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (data?.racers && gameRef.current) {
      const scene = gameRef.current.scene.getScene("GameScene") as GameScene;
      if (scene) {
        // Restart the scene with new racer data
        scene.scene.restart({ racers: data?.racers || [] });
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2d2d2d",
          color: "#ffffff",
        }}
      >
        {`Loading...`}
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2d2d2d",
          color: "#ff0000",
        }}
      >
        {`Error: ${error.message}`}
      </div>
    );
  }

  return (
    <div
      id="game-container"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2d2d2d",
      }}
    />
  );
};
