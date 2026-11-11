import React from "react";
import { useSelector } from "@xstate/react";

import Decimal from "decimal.js-light";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { TemperateSeasonName } from "features/game/types/game";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import {
  getLavaPitRequirements,
  LAVA_PIT_TIME,
} from "features/game/events/landExpansion/startLavaPit";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";
import { useNow } from "lib/utils/hooks/useNow";

const SEASONS: TemperateSeasonName[] = ["spring", "summer", "autumn", "winter"];

const _gameState = (state: MachineState) => state.context.state;

/**
 * The Lava Pit's Guide tab: how the pit works and what it takes in every
 * season (with the player's own boosts applied, the same way the Lava Pit tab
 * shows the current season).
 */
export const LavaPitGuide: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = React.useContext(Context);
  const game = useSelector(gameService, _gameState);
  const now = useNow();
  const currentSeason = game.season.season;

  return (
    <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto scrollable pr-0.5">
      <InnerPanel className="flex flex-col gap-1">
        <Label
          type="default"
          icon={ITEM_DETAILS["Lava Pit"].image}
          className="ml-1.5 mt-1"
        >
          {t("lavaPit.guide.howItWorks")}
        </Label>
        <NoticeboardItems
          items={[
            {
              text: t("lavaPit.guide.throw"),
              icon: ITEM_DETAILS["Lava Pit"].image,
            },
            {
              text: t("lavaPit.guide.burn", {
                hours: LAVA_PIT_TIME / (60 * 60 * 1000),
              }),
              icon: SUNNYSIDE.icons.stopwatch,
            },
            {
              text: t("lavaPit.guide.obsidian"),
              icon: ITEM_DETAILS.Obsidian.image,
            },
            {
              text: t("lavaPit.guide.seasons"),
              icon: SEASON_ICONS[currentSeason],
            },
          ]}
        />
      </InnerPanel>

      <InnerPanel className="flex flex-col gap-2">
        <Label
          type="default"
          icon={SUNNYSIDE.icons.basket}
          className="ml-1.5 mt-1"
        >
          {t("lavaPit.guide.recipes")}
        </Label>
        {SEASONS.map((season) => {
          const { requirements } = getLavaPitRequirements(
            { ...game, season: { ...game.season, season } },
            now,
          );

          return (
            <div key={season} className="flex flex-col gap-1 p-1">
              <div className="flex items-center gap-1">
                <Label type="default" icon={SEASON_ICONS[season]}>
                  {t(`season.${season}`)}
                </Label>
                {season === currentSeason && (
                  <Label type="success">{t("lavaPit.guide.current")}</Label>
                )}
              </div>
              <div className="flex flex-col gap-1 px-1">
                {getKeys(requirements).map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <img
                      src={ITEM_DETAILS[item].image}
                      className="w-5 h-5 object-contain"
                      alt=""
                    />
                    <span className="text-xs flex-1 min-w-0">
                      {getTranslatedItemName(item)}
                    </span>
                    <RequirementLabel
                      type="item"
                      item={item}
                      balance={game.inventory[item] ?? new Decimal(0)}
                      requirement={requirements[item] ?? new Decimal(0)}
                      hideIcon
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </InnerPanel>
    </div>
  );
};
