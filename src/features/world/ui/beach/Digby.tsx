import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import {
  DiggingFormation,
  DIGGING_FORMATIONS,
  DESERT_GRID_WIDTH,
  DiggingGrid,
  DESERT_GRID_HEIGHT,
  getTreasureCount,
  getTreasuresFound,
  getArtefactsFound,
  SEASONAL_ARTEFACT,
} from "features/game/types/desert";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsTillReset } from "lib/utils/time";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsToString } from "lib/utils/time";
import React, { useContext, useEffect, useState } from "react";
import powerup from "assets/icons/level_up.png";
import gift from "assets/icons/gift.png";

import { Desert, GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BuffLabel } from "features/game/types";
import { SquareIcon } from "components/ui/SquareIcon";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { CollectibleName } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import { getRemainingDigs } from "features/island/hud/components/DesertDiggingDisplay";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { ResizableBar } from "components/ui/ProgressBar";
import { Revealed } from "features/game/components/Revealed";
import { ChestRevealing, ChestRewardType } from "../chests/ChestRevealing";
import { gameAnalytics } from "lib/gameAnalytics";
import { getCurrentSeason } from "features/game/types/seasons";

export function hasReadDigbyIntro() {
  return !!localStorage.getItem("digging.intro");
}

function acknowledgeIntro() {
  return localStorage.setItem("digging.intro", new Date().toISOString());
}

function centerFormation(formation: DiggingFormation): DiggingFormation {
  const totalX = formation.reduce((sum, item) => sum + item.x, 0);
  const totalY = formation.reduce((sum, item) => sum + item.y, 0);
  const centerX = Math.floor(totalX / formation.length);
  const centerY = Math.floor(totalY / formation.length);

  return formation.map((item) => ({
    ...item,
    x: item.x - centerX - 0.5,
    y: item.y - centerY - 0.5,
  }));
}

function countFormationOccurrences({
  grid,
  formation,
}: {
  grid: DiggingGrid;
  formation: DiggingFormation;
}): number {
  let count = 0;

  for (let x = 0; x < DESERT_GRID_WIDTH; x++) {
    for (let y = 0; y < DESERT_GRID_HEIGHT; y++) {
      let isPresent = true;

      for (const plot of formation) {
        const newX = x + plot.x;
        const newY = y + plot.y;

        // Check if the new position is within bounds
        if (
          newX < 0 ||
          newX >= DESERT_GRID_WIDTH ||
          newY < 0 ||
          newY >= DESERT_GRID_HEIGHT
        ) {
          isPresent = false;
          break;
        }

        // Check if the cell matches the formation requirement
        if (grid[newX][newY] !== plot.name) {
          // Assuming formation includes value to match
          isPresent = false;
          break;
        }
      }

      if (isPresent) {
        count++;
      }
    }
  }

  return count;
}

function dugToGrid(dug: Desert["digging"]["grid"]): DiggingGrid {
  const grid = new Array(DESERT_GRID_WIDTH)
    .fill(0)
    .map(() => new Array(DESERT_GRID_HEIGHT).fill(undefined));

  for (const hole of dug.flat()) {
    grid[hole.x][hole.y] = getKeys(hole.items)[0];
  }

  return grid;
}

export const Pattern: React.FC<{
  pattern: DiggingFormation;
  isDiscovered: boolean;
}> = ({ pattern, isDiscovered }) => {
  // Find lowest X and highest X in pattern
  const minX = Math.min(...pattern.map((p) => p.x));
  const maxX = Math.max(...pattern.map((p) => p.x));

  const minY = Math.min(...pattern.map((p) => p.y));
  const maxY = Math.max(...pattern.map((p) => p.y));

  const squareWidth = Math.max(maxX - minX + 1, maxY - minY + 1);
  const width = 25;

  const centeredPattern = centerFormation(pattern);
  return (
    <div
      className="relative w-full h-0"
      style={{
        paddingBottom: "100%",
        backgroundImage: `url(${SUNNYSIDE.ui.site_bg})`,

        backgroundSize: "100%",
        borderRadius: "6px",
      }}
    >
      {isDiscovered && (
        <img
          src={SUNNYSIDE.icons.confirm}
          className="absolute -top-2 -right-2 w-6"
        />
      )}

      {centeredPattern.map(({ name, x, y }) => (
        <div
          className="absolute p-0.5"
          key={`${name}-${x}-${y}`}
          style={{
            top: `${width * (y + 1.5)}%`,
            left: `${width * (x + 1.5)}%`,
            width: `${width}%`,
            height: `${width}%`,
          }}
        >
          <img
            className="w-full h-full"
            src={ITEM_DETAILS[name].image}
            key={`${name}-${x}-${y}`}
          />
        </div>
      ))}
    </div>
  );
};

const CountdownLabel = () => (
  <Label className="ml-1" type="info" icon={SUNNYSIDE.icons.stopwatch}>
    {`${secondsToString(secondsTillReset(), {
      length: "medium",
      removeTrailingZeros: true,
    })} left`}
  </Label>
);

export const DailyPuzzle: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  // Just a prolonged UI state to show the shuffle of reward items
  const [isPicking, setIsPicking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const patterns = gameState.context.state.desert.digging.patterns;
  const streak = gameState.context.state.desert.digging.streak ?? {
    count: 0,
    collectedAt: 0,
    totalClaimed: 0,
  };

  const grid = dugToGrid(gameState.context.state.desert.digging.grid);

  const { t } = useAppTranslation();

  const artefactsFound = getArtefactsFound({ game: gameState.context.state });
  const percentage = Math.round((artefactsFound / 3) * 100);

  const hasClaimedReward =
    new Date().toISOString().substring(0, 10) ===
    new Date(streak.collectedAt).toISOString().substring(0, 10);

  const open = async () => {
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "diggingReward.collected",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
  };

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    let type: ChestRewardType = "Basic Desert Rewards";

    if (streak.count >= 4) {
      type = "Advanced Desert Rewards";
    }

    if (streak.count >= 10) {
      type = "Expert Desert Rewards";
    }

    return <ChestRevealing type={type} />;
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Revealed
        onAcknowledged={() => {
          setIsRevealing(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="p-1">
        <div className="flex justify-between mb-1">
          <Label type="default">{t("digby.puzzle")}</Label>
          <CountdownLabel />
        </div>
        <span className="text-xs mt-2">{t("digby.today")}</span>
        <div
          className="flex flex-wrap  scrollable overflow-y-auto pt-2 overflow-x-hidden pr-1"
          style={{ maxHeight: "300px" }}
        >
          {patterns.map((pattern, index) => {
            const discovered = countFormationOccurrences({
              grid,
              formation: DIGGING_FORMATIONS[pattern],
            });

            const duplicates = patterns.filter(
              (p, i) => i < index && p === pattern,
            ).length;

            return (
              <div className="w-1/4 sm:w-1/4" key={index}>
                <div className="m-1">
                  <Pattern
                    key={index}
                    pattern={DIGGING_FORMATIONS[pattern]}
                    isDiscovered={discovered > duplicates}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-2 mb-1">
          {hasClaimedReward ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {[t("digby.streak"), streak.count].filter(Boolean).join(" - ")}
            </Label>
          ) : (
            <Label type="default">
              {[t("digby.streak"), streak.count].filter(Boolean).join(" - ")}
            </Label>
          )}

          <div className="flex items-center">
            <img src={gift} className="h-5 mr-2" />
            <ResizableBar
              percentage={percentage}
              type={"progress"}
              outerDimensions={{
                width: 24,
                height: 7,
              }}
            />
            <span className="text-xs ml-2">{`${artefactsFound}/3`}</span>
            <img
              src={ITEM_DETAILS[SEASONAL_ARTEFACT[getCurrentSeason()]].image}
              className="h-5 ml-1"
            />
          </div>
        </div>

        <div className="mb-2">
          <span className="text-xs">
            {t("digby.streakReward", {
              name: SEASONAL_ARTEFACT[getCurrentSeason()],
            })}
          </span>
        </div>
      </div>
      {!hasClaimedReward && (
        <Button onClick={open} disabled={percentage < 100}>
          {t("claim")}
        </Button>
      )}
    </>
  );
};

const isWearable = (
  item: BumpkinItem | CollectibleName,
): item is BumpkinItem => {
  return getKeys(ITEM_IDS).includes(item as BumpkinItem);
};

export const getItemImage = (item: BumpkinItem | CollectibleName): string => {
  if (!item) return "";

  if (isWearable(item)) {
    return getImageUrl(ITEM_IDS[item]);
  }

  return ITEM_DETAILS[item].image;
};

const BoostDigItems: Partial<
  Record<BumpkinItem | CollectibleName, BuffLabel & { location: string }>
> = {
  "Pharaoh Chicken": {
    ...(COLLECTIBLE_BUFF_LABELS["Pharaoh Chicken"] as BuffLabel),
    location: "Marketplace",
  },
  "Heart of Davy Jones": {
    ...(COLLECTIBLE_BUFF_LABELS["Heart of Davy Jones"] as BuffLabel),
    location: "Marketplace",
  },
  "Bionic Drill": {
    ...(BUMPKIN_ITEM_BUFF_LABELS["Bionic Drill"] as BuffLabel),
    location: "Artefact Shop",
  },
  ...(getCurrentSeason() === "Pharaoh's Treasure"
    ? {
        "Pharaoh's Treasure Banner": {
          shortDescription: "+5 digs",
          labelType: "vibrant",
          boostTypeIcon: gift,
          location: "VIP Item",
        },
      }
    : {}),
};

const getDefaultTab = (game: GameState) => {
  if (!hasReadDigbyIntro()) return 1;

  const treasureCount = getTreasureCount({ game });
  const treasuresFound = getTreasuresFound({ game });
  const percentage = Math.round((treasuresFound.length / treasureCount) * 100);

  if (percentage >= 100) {
    return 0;
  }

  const remainingDigs = getRemainingDigs(game);

  if (remainingDigs <= 0) {
    return 2;
  }

  return 0;
};

export const Digby: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [tab, setTab] = useState(getDefaultTab(gameState.context.state));
  const [showConfirm, setShowConfirm] = useState(false);

  const inventory = gameState.context.state.inventory;
  const digsLeft = getRemainingDigs(gameState.context.state);

  const { t } = useAppTranslation();

  useEffect(() => {
    acknowledgeIntro();
  }, []);

  const confirmBuyMoreDigs = () => {
    onClose();
    gameService.send("desert.digsBought");

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: 10,
      item: "DesertDigs",
      type: "Fee",
    });
  };

  const canAfford = (inventory["Gem"] ?? new Decimal(0))?.gte(10);

  return (
    <CloseButtonPanel
      setCurrentTab={setTab}
      currentTab={tab}
      tabs={[
        {
          icon: ITEM_DETAILS["Sand Shovel"].image,
          name: t("digby.patterns"),
        },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
        {
          icon: powerup,
          name: "Extras",
        },
      ]}
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.digby}
    >
      {tab === 0 && (
        <>
          <DailyPuzzle />
        </>
      )}
      {tab === 1 && (
        <div className="pt-2">
          <NoticeboardItems
            items={[
              {
                icon: ITEM_DETAILS["Sand Shovel"].image,
                text: t("digby.guide.one"),
              },
              {
                icon: ITEM_DETAILS["Crab"].image,
                text: t("digby.guide.two"),
              },
              {
                icon: ITEM_DETAILS["Sand"].image,
                text: t("digby.guide.three"),
              },
              {
                icon: SUNNYSIDE.icons.stopwatch,
                text: t("digby.guide.four"),
              },
            ]}
          />
          <Button onClick={() => setTab(0)}>{t("ok")}</Button>
        </div>
      )}
      {tab === 2 && (
        <>
          {!showConfirm && (
            <>
              <div className="p-1">
                <div className="flex items-center justify-between space-x-1 mb-1">
                  <Label type="default">{t("desert.extraDigs")}</Label>
                  <Label type="default" icon={SUNNYSIDE.tools.sand_shovel}>
                    <span className="text">
                      {t("desert.hud.digsLeft", { digsLeft })}
                    </span>
                  </Label>
                </div>
                <span className="text-xs my-2">{t("digby.moreDigsIntro")}</span>
                <div className="flex flex-col my-2 space-y-1">
                  {getKeys(BoostDigItems).map((item) => (
                    <div key={item} className="flex space-x-2">
                      <div
                        className="bg-brown-600 cursor-pointer relative"
                        style={{
                          ...pixelDarkBorderStyle,
                        }}
                      >
                        <SquareIcon icon={getItemImage(item)} width={20} />
                      </div>
                      <div className="flex flex-col justify-center space-y-1">
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-xs">{item}</span>
                          <span className="text-xxs italic">
                            {BoostDigItems[item]?.location}
                          </span>
                        </div>
                        <Label
                          type={BoostDigItems[item]?.labelType ?? "default"}
                          icon={BoostDigItems[item]?.boostTypeIcon}
                          secondaryIcon={BoostDigItems[item]?.boostedItemIcon}
                        >
                          {BoostDigItems[item]?.shortDescription}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                disabled={!canAfford}
                onClick={canAfford ? () => setShowConfirm(true) : undefined}
              >
                <div className="flex items-center space-x-1">
                  <p>{t("digby.buyMoreDigs")}</p>
                  <img src={ITEM_DETAILS.Gem.image} className="w-4" />
                </div>
              </Button>
            </>
          )}
          {showConfirm && (
            <>
              <div className="flex flex-col p-2 pb-0 items-center">
                <span className="text-sm text-start w-full mb-1">
                  {t("desert.buyDigs.confirmation")}
                </span>
              </div>
              <div className="flex justify-content-around mt-2 space-x-1">
                <Button onClick={() => setShowConfirm(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={confirmBuyMoreDigs}>{t("confirm")}</Button>
              </div>
            </>
          )}
        </>
      )}
    </CloseButtonPanel>
  );
};
