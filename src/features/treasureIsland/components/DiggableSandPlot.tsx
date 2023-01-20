import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

import goblinDigging from "assets/npcs/goblin_treasure_sheet.png";
import shadow from "assets/npcs/shadow.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";
import { setImageWidth } from "lib/images";
import classNames from "classnames";

// treasureIsland[id] = {
//   discovered: 'Basic Bear'
//   dugAt: createdAt,
// };

// {
//   discovered: InventoryItemName,
//   dugAt: Date.now(),
// };

type TreasureReward = {
  discovered: InventoryItemName | null;
  dugAt: number;
};

const Reward: React.FC<{ reward?: TreasureReward }> = ({ reward }) => {
  if (!reward || !reward.discovered) return null;

  return (
    <div
      className="absolute h-full w-full flex justify-center items-end"
      style={{ bottom: 16 }}
    >
      <img
        id="reward-id"
        src={ITEM_DETAILS[reward.discovered].image}
        className={classNames({
          "treasure-reward": reward.discovered,
        })}
        onLoad={(e) => setImageWidth(e.currentTarget)}
      />
    </div>
  );
};

export const DiggableSandPlot: React.FC<{ id: number }> = ({ id }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);
  const goblinDiggingRef = useRef<SpriteSheetInstance>();
  const [treasureIsland, setTreasureIsland] = useState<
    (TreasureReward | undefined)[]
  >(Array(107).fill(undefined));
  const [showDug, setShowDug] = useState(false);
  const { setToast } = useContext(ToastContext);

  const [digging, setDigging] = useState(false);

  const today = new Date().getUTCDay();

  const reward = treasureIsland[id];

  useLayoutEffect(() => {
    const isDug = reward && new Date(reward.dugAt).getUTCDay() === today;

    if (isDug) setShowDug(true);
  }, []);

  if (showDug) {
    return (
      <div className="w-full h-full">
        <img
          src={SUNNYSIDE.soil.sand_dug}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            top: `${PIXEL_SCALE * 2}px`,
          }}
        />
      </div>
    );
  }

  const handleDig = () => {
    setDigging(true);
    // Come back tomorrow
    // if (isDug) {
    // if (warning === "warned") {
    //   setShowRecoveryWarning(true);
    //   return;
    // }
    // warn();
    // return;
    // }

    // Missing shovel
    if (
      selectedItem !== "Sand Shovel" ||
      !gameState.context.state.inventory["Sand Shovel"]?.gte(1)
    ) {
      // if (warning === "warned") {
      //   setShowMissingShovel(true);
      //   return;
      // }
      // warn();
      // return;
    }

    // gameService.send("REVEAL", {
    //   event: {
    //     type: "treasure.dug",
    //     id,
    //     createdAt: new Date(),
    //   },
    // });

    // export type Reward = {
    //   items?: {
    //     name: InventoryItemName;
    //     amount: number;
    //   }[];
    //   sfl?: Decimal;
    // };

    setTimeout(() => {
      const newTreasureIsland = treasureIsland.map((item, index) => {
        if (index === id) {
          return {
            discovered: "Sunflower Cake",
            dugAt: Date.now(),
          } as TreasureReward;
        }

        return item;
      });

      setTreasureIsland(newTreasureIsland);
    }, 3000);
  };

  const isDigging = gameState.matches("revealing");

  // Undug sand plot
  return (
    <div
      id="sand-plot"
      className="w-full h-full cursor-pointer relative"
      onClick={handleDig}
    >
      {digging && (
        <>
          <Spritesheet
            key="digging-goblin"
            className="absolute group-hover:img-highlight pointer-events-none z-10"
            style={{
              width: `${PIXEL_SCALE * 33}px`,
              imageRendering: "pixelated",
              bottom: "19px",
              left: "-56px",
            }}
            getInstance={(spritesheet) => {
              goblinDiggingRef.current = spritesheet;
            }}
            image={goblinDigging}
            widthFrame={33}
            heightFrame={28}
            fps={14}
            steps={13}
            endAt={13}
            direction={`forward`}
            autoplay
            loop
            onEnterFrame={[
              {
                frame: 10,
                callback: () => {
                  if (treasureIsland[id] !== undefined) {
                    goblinDiggingRef.current?.pause();
                    setTimeout(() => {
                      setDigging(false);
                      setShowDug(true);
                      if (reward?.discovered) {
                        setToast({
                          icon: ITEM_DETAILS[reward.discovered].image,
                          content: `+1`,
                        });
                      }
                    }, 3000);
                  }
                },
              },
            ]}
          />
          <img
            src={shadow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              left: `-37px`,
              bottom: `16px`,
            }}
          />
        </>
      )}
      {digging && (
        <div className="absolute w-full h-full">
          <img
            src={SUNNYSIDE.soil.sand_dug}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 2}px`,
            }}
          />
          <Reward reward={reward} />
        </div>
      )}
    </div>
  );
};
