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
} from "features/game/types/desert";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsToString } from "lib/utils/time";
import React, { useContext, useEffect, useState } from "react";

import siteBg from "assets/ui/site_bg.png";
import { Desert } from "features/game/types/game";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";

function hasReadIntro() {
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

const Pattern: React.FC<{
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
        backgroundImage: `url(${siteBg})`,

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

export const DailyPuzzle: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const patterns = gameState.context.state.desert.digging.patterns;
  const grid = dugToGrid(gameState.context.state.desert.digging.grid);

  const { t } = useAppTranslation();
  return (
    <div className="p-1">
      <div className="flex justify-between mb-1">
        <Label type="default">{t("digby.puzzle")}</Label>
        <Label className="ml-1" type="info" icon={SUNNYSIDE.icons.stopwatch}>
          {`${secondsToString(secondsTillReset(), {
            length: "medium",
            removeTrailingZeros: true,
          })} left`}
        </Label>
      </div>
      <span className="text-xs mt-2 mx-1">{t("digby.today")}</span>
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
    </div>
  );
};

export const Digby: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState(hasReadIntro() ? 0 : 1);

  const { t } = useAppTranslation();

  useEffect(() => {
    acknowledgeIntro();
  }, []);

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
      ]}
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.digby}
    >
      {tab === 0 && <DailyPuzzle />}
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
    </CloseButtonPanel>
  );
};
