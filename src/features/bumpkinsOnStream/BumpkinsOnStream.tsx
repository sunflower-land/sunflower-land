import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useAuth } from "features/auth/lib/Provider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { useSelector } from "@xstate/react";
import useSWR from "swr";
import { getRacers, Racer } from "./actions/getRacers";
import { RacingBumpkin } from "./RacingBumpkin";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";

export class BumpkinsRaceScene extends Phaser.Scene {
  public static SceneKey = "BumpkinsRaceScene";
  public ready = false;
  private bumpkinMap = new Map<string, RacingBumpkin>();

  constructor() {
    super(BumpkinsRaceScene.SceneKey);
  }

  preload() {
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.image("shadow", "world/shadow.png");
  }

  create() {
    this.ready = true;
  }

  updateRacers(racers: Racer[]) {
    racers.forEach((racer) => {
      if (this.bumpkinMap.has(`${racer.id}`)) return;

      const { equipped } = interpretTokenUri(racer.tokenUri);
      const x = this.cameras.main.width / 4;
      const y =
        this.cameras.main.height -
        racer.startYPercent * this.cameras.main.height;

      const bumpkin = new RacingBumpkin({
        scene: this,
        x,
        y,
        clothing: equipped,
      });
      this.add.existing(bumpkin).setScale(3);
    });
  }
}
// ---- React Component ----
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const BumpkinsOnStream: React.FC = () => {
  const { authService } = useAuth();
  const token = useSelector(authService, _token);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game>();

  const { data, error, isLoading, mutate } = useSWR(
    ["/data?type=bumpkinsOnStream", token],
    async ([, token]) => getRacers({ token }),
  );

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
      pixelArt: true,
      autoRound: true,
      scene: [BumpkinsRaceScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (!data?.racers) return;
    const scene = gameRef.current?.scene.getScene(
      BumpkinsRaceScene.SceneKey,
    ) as BumpkinsRaceScene;

    scene.updateRacers(data.racers);
  }, [data?.racers]);

  return (
    <OuterPanel className="fixed inset-0">
      <InnerPanel className="w-full h-full flex flex-col overflow-hidden">
        <InnerPanel className="flex items-center justify-center text-3xl py-5 mb-1">
          {`Bumpkins Race`}
        </InnerPanel>
        <div className="flex h-[calc(100%-7rem)] w-full relative">
          <div className="w-32 flex-shrink-0">
            <InnerPanel className="flex flex-col space-y-1 p-2 mr-1 overflow-y-auto h-full">
              <div className="w-14 text-sm border-b border-black">{`Racers`}</div>
              {(data?.racers ?? []).map((racer, i) => (
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
