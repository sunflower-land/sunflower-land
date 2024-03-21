import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Revealed } from "features/game/components/Revealed";

import React, { useContext, useState } from "react";

import budIcon from "assets/icons/bud.png";
import chestIcon from "assets/icons/gift.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChestRevealing } from "./ChestRevealing";
import { getKeys } from "features/game/types/craftables";
import { Bud, TypeTrait } from "features/game/types/buds";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { getDayOfYear, secondsToString } from "lib/utils/time";

// Function to get UTC date at 12:00 AM
function getUTCDateAtMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

// Function to get an array of 7 consecutive dates starting from the given date
function getConsecutiveDatesArray(startDate: Date, length: number) {
  const datesArray = [startDate];
  for (let i = 1; i < length; i++) {
    const nextDate = new Date(startDate);
    nextDate.setUTCDate(startDate.getUTCDate() + i);
    datesArray.push(getUTCDateAtMidnight(nextDate));
  }
  return datesArray;
}

interface Props {
  onClose: () => void;
}

const BUD_ORDER: TypeTrait[] = [
  "Plaza",
  "Woodlands",
  "Cave",
  "Sea",
  "Castle",
  "Port",
  "Retreat",
  "Saphiro",
  "Snow",
  "Beach",
];

/**
 * Based on day of year + year to get a consistent order of buds
 */
export function getDailyBudBoxType(date: Date): TypeTrait {
  const offset = date.getTimezoneOffset();

  let dateToUse = date;

  if (offset > 0) {
    dateToUse = new Date(date.getTime() + offset * 60 * 1000);
  }
  const dayOfYear = getDayOfYear(dateToUse);

  const index = dayOfYear % BUD_ORDER.length;
  return BUD_ORDER[index];
}

const ICONS: Record<TypeTrait, string> = {
  Plaza: budIcon,
  Woodlands: budIcon,
  Cave: budIcon,
  Sea: budIcon,
  Castle: budIcon,
  Port: budIcon,
  Retreat: budIcon,
  Saphiro: budIcon,
  Snow: budIcon,
  Beach: budIcon,
};

export const BudBox: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  // Just a prolonged UI state to show the shuffle of items animation
  const [isPicking, setIsPicking] = useState(false);

  const [isRevealing, setIsRevealing] = useState(false);

  const open = async () => {
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "budBox.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
  };

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return (
      <Panel>
        <ChestRevealing type={"Bud Box"} />
      </Panel>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Panel>
        <Revealed
          onAcknowledged={() => {
            setIsRevealing(false);
          }}
        />
      </Panel>
    );
  }

  const buds = getKeys(gameState.context.state.buds ?? {});

  const days = new Array(7).fill(0);

  // Get current UTC date
  const currentDate = new Date();

  // Get UTC date at midnight
  const currentUTCMidnight = getUTCDateAtMidnight(currentDate);

  // Get array of 7 consecutive dates starting from current date
  let consecutiveDatesArray = getConsecutiveDatesArray(currentUTCMidnight, 7);

  // Add timezone offset
  consecutiveDatesArray = consecutiveDatesArray.map((date) => {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  });

  const playerBudTypes = buds.map((id) => {
    const bud = gameState.context.state.buds?.[id] as Bud;
    return bud.type;
  });

  const secondsLeftToday = secondsTillReset();

  let hasOpened = false;
  const openedAt = gameState.context.state.pumpkinPlaza.budBox?.openedAt ?? 0;

  if (openedAt) {
    hasOpened = getDayOfYear(new Date()) === getDayOfYear(new Date(openedAt));
  }

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-2">
        <div className="flex flex-wrap mr-12">
          <Label
            icon={chestIcon}
            type="default"
            className="mb-2 mr-3 capitalize"
          >
            {t("budBox.title")}
          </Label>
        </div>
        <p className="text-xs mb-2">{t("budBox.description")}</p>
        {consecutiveDatesArray.map((date, index) => {
          const dailyBud = getDailyBudBoxType(date);

          const hasBud = buds.some((type) => playerBudTypes.includes(dailyBud));

          const dayOfWeek = date.toLocaleDateString("en-US", {
            weekday: "long",
          });

          return (
            <OuterPanel
              key={date.toISOString()}
              className="flex justify-between relative mb-1"
            >
              <div className="flex justify-between relative mb-1">
                <div>
                  <Label
                    type={
                      playerBudTypes.includes(dailyBud) ? "success" : "default"
                    }
                    className="mr-1"
                  >
                    {dailyBud}
                  </Label>
                </div>
              </div>
              {index === 0 && !hasOpened && (
                <Button
                  onClick={open}
                  disabled={!hasBud}
                  className="w-16 h-8 text-xs mt-4"
                >
                  {t("budBox.open")}
                </Button>
              )}
              {index === 0 && hasOpened && (
                <Label
                  icon={SUNNYSIDE.icons.confirm}
                  type="success"
                  className="absolute -top-2 -right-2"
                >
                  {t("budBox.opened")}
                </Label>
              )}
              {index === 0 && !hasOpened && (
                <Label
                  icon={SUNNYSIDE.icons.stopwatch}
                  type="info"
                  className="absolute -top-2 -right-2"
                >
                  {`Today - ${secondsToString(secondsLeftToday, {
                    length: "short",
                  })} left`}
                </Label>
              )}
              {index > 0 && (
                <Label type="default" className="absolute -top-2 -right-2">
                  {dayOfWeek}
                </Label>
              )}
            </OuterPanel>
          );
        })}
      </div>
    </CloseButtonPanel>
  );
};
