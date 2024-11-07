import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Revealed } from "features/game/components/Revealed";

import React, { useContext, useState } from "react";

import chestIcon from "assets/icons/gift.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChestRevealing } from "./ChestRevealing";
import { getKeys } from "features/game/types/craftables";
import { Bud, TypeTrait } from "features/game/types/buds";
import { getDayOfYear, secondsToString } from "lib/utils/time";
import { secondsTillReset } from "lib/utils/time";

interface Props {
  onClose: () => void;
  setIsLoading?: (isLoading: boolean) => void;
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
  const dayOfYear = getDayOfYear(date);

  const index = dayOfYear % BUD_ORDER.length;
  return BUD_ORDER[index];
}

export const BudBox: React.FC<Props> = ({ onClose, setIsLoading }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t, i18n } = useAppTranslation();

  // Just a prolonged UI state to show the shuffle of items animation
  const [isPicking, setIsPicking] = useState(false);

  const [isRevealing, setIsRevealing] = useState(false);

  const open = async () => {
    setIsLoading && setIsLoading(true);
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
    setIsLoading && setIsLoading(false);
  };

  const getDayOfWeek = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
    };

    switch (i18n.language) {
      case "fr":
        return date.toLocaleDateString("fr-FR", options);
      case "pt":
        return date.toLocaleDateString("pt-PT", options);
      case "tk":
        return date.toLocaleDateString("tr-TR", options);
      case "zh-CN":
        return date.toLocaleDateString("zh-CN", options);
      case "ko":
        return date.toLocaleDateString("ko-KR", options);
      case "ru":
        return date.toLocaleDateString("ru-RU", options);
      default:
        return date.toLocaleDateString("en-US", options);
    }
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

  const days = new Array<number>(7).fill(0);
  const now = Date.now();

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
        {days.map((_, index) => {
          const date = new Date(now + 24 * 60 * 60 * 1000 * index);
          const dailyBud = getDailyBudBoxType(date);
          const hasBud = playerBudTypes.includes(dailyBud);

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
                  className="w-auto h-8 text-xs mt-4"
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
                  className="absolute -top-3 -right-2"
                >
                  {t("budBox.today", {
                    timeLeft: secondsToString(secondsLeftToday, {
                      length: "short",
                    }),
                  })}
                </Label>
              )}
              {index > 0 && (
                <Label
                  type="default"
                  className="absolute -top-2 -right-2 capitalize"
                >
                  {getDayOfWeek(date)}
                </Label>
              )}
            </OuterPanel>
          );
        })}
      </div>
    </CloseButtonPanel>
  );
};
