import React, { useContext, useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { getKeys } from "features/game/types/craftables";
import {
  getLavaPitRequirements,
  getLavaPitTime,
} from "features/game/events/landExpansion/startLavaPit";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { secondsToString } from "lib/utils/time";
import { getObsidianYield } from "features/game/events/landExpansion/collectLavaPit";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { useNow } from "lib/utils/hooks/useNow";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { LAVA_PIT_TIME } from "features/game/events/landExpansion/startLavaPit";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _lavaPit = (id: string) => (state: MachineState) =>
  state.context.state.lavaPits[id];
const _season = (state: MachineState) => state.context.state.season;
const _lavaPitTimeAndBoosts = (state: MachineState) =>
  getLavaPitTime({ game: state.context.state });
const _obsidianYield = (state: MachineState) =>
  getObsidianYield({ game: state.context.state }).amount;
const _gameState = (state: MachineState) => state.context.state;

interface Props {
  onClose: () => void;
  id: string;
}

export const LavaPitModalContent: React.FC<Props> = ({ onClose, id }) => {
  const { t } = useTranslation();

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const lavaPit = useSelector(gameService, _lavaPit(id));
  const { time: lavaPitTime, boostsUsed } = useSelector(
    gameService,
    _lavaPitTimeAndBoosts,
  );
  const obsidianYield = useSelector(gameService, _obsidianYield);
  const season = useSelector(gameService, _season);
  const gameState = useSelector(gameService, _gameState);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showBoosts, setShowBoosts] = useState(false);
  const now = useNow({ live: true });
  const isLavaPitTimeBoosted = boostsUsed.length > 0;

  const throwResourcesIntoPit = () => {
    gameService.send({ type: "lavaPit.started", id });
  };

  const collectLavaPit = () => {
    gameService.send({ type: "lavaPit.collected", id });
  };

  const { requirements } = getLavaPitRequirements(
    gameService.state.context.state,
    now,
  );

  const hasIngredients = getKeys(requirements).every((itemName) =>
    (inventory[itemName] ?? new Decimal(0)).gte(
      requirements[itemName] ?? new Decimal(0),
    ),
  );

  const lavaPitInProgress = lavaPit?.startedAt !== undefined;
  const timeRemaining = Math.max(0, (lavaPit.readyAt ?? 0) - now);
  const canCollect = lavaPitInProgress && timeRemaining <= 0;
  const wasRecentlyCollected = now - (lavaPit?.collectedAt ?? 0) < 1000;

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
          id: "lavaPit",
          name: "Lava Pit",
          icon: ITEM_DETAILS["Lava Pit"].image,
        },
      ]}
      container={OuterPanel}
    >
      <InnerPanel>
        <Label
          type="default"
          icon={SEASON_ICONS[season.season]}
          className="mt-2 ml-2"
        >
          {t(`season.${season.season}`)}
        </Label>
        <p className="text-xs p-2">{t("lavaPit.description")}</p>
        <div
          className="flex flex-wrap p-2 gap-2 cursor-pointer"
          onClick={() => setShowIngredients(!showIngredients)}
        >
          <IngredientsPopover
            show={showIngredients}
            ingredients={getKeys(requirements)}
            onClick={() => setShowIngredients(false)}
          />
          {getKeys(requirements).map((itemName) => {
            return (
              <RequirementLabel
                key={itemName}
                type="item"
                item={itemName}
                balance={inventory[itemName] ?? new Decimal(0)}
                requirement={requirements[itemName] ?? new Decimal(0)}
              />
            );
          })}
        </div>
      </InnerPanel>

      <div className="pt-1" />

      <InnerPanel>
        <div className="flex justify-between">
          {lavaPitInProgress && (
            <Label
              type="default"
              className="ml-2"
              icon={ITEM_DETAILS["Lava Pit"].image}
            >
              {t("active")}
            </Label>
          )}
          {!lavaPitInProgress && (
            <div>
              <Label
                type="warning"
                icon={ITEM_DETAILS["Lava Pit"].image}
                className="ml-2"
              >
                {t("reward")}
              </Label>
            </div>
          )}

          {lavaPitInProgress && canCollect && (
            <Label type="success">{"Ready"}</Label>
          )}
          {lavaPitInProgress && !canCollect && (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`${t("ready.in")}: ${secondsToString(timeRemaining / 1000, {
                length: "medium",
              })}`}
            </Label>
          )}
          {!lavaPitInProgress && (
            <div
              className="flex flex-row items-end cursor-pointer"
              onClick={
                isLavaPitTimeBoosted
                  ? () => setShowBoosts(!showBoosts)
                  : undefined
              }
            >
              {isLavaPitTimeBoosted && (
                <RequirementLabel
                  type="time"
                  waitSeconds={lavaPitTime / 1000}
                  boosted
                />
              )}
              <RequirementLabel
                type="time"
                waitSeconds={LAVA_PIT_TIME / 1000}
                strikethrough={isLavaPitTimeBoosted}
              />
              <BoostsDisplay
                boosts={boostsUsed}
                show={showBoosts}
                state={gameState}
                onClick={() => setShowBoosts(!showBoosts)}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-start cursor-context-menu hover:brightness-100">
            <Box
              image={ITEM_DETAILS["Obsidian"].image}
              className="-mt-2 -ml-1 -mb-1"
            />
            <div>
              <div className="flex flex-wrap items-start">
                <Label type="default" className="mr-1 mb-1">
                  {`${obsidianYield} x Obsidian`}
                </Label>
              </div>
              <p className="text-xs ml-0.5">
                {ITEM_DETAILS["Obsidian"].description}
              </p>
            </div>
          </div>
        </div>
        {lavaPitInProgress && canCollect && (
          <Button onClick={collectLavaPit} disabled={!canCollect}>
            {t("lavaPit.collect")}
          </Button>
        )}
        {lavaPitInProgress && !canCollect && (
          <Button onClick={collectLavaPit} disabled={!canCollect}>
            {t("lavaPit.burning")}
          </Button>
        )}
        {!lavaPitInProgress && (
          <Button
            disabled={
              !hasIngredients || lavaPitInProgress || wasRecentlyCollected
            }
            onClick={throwResourcesIntoPit}
          >
            {t("lavaPit.throw")}
          </Button>
        )}
      </InnerPanel>
    </CloseButtonPanel>
  );
};
