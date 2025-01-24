import React, { useContext } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { getKeys } from "features/game/types/craftables";
import { LAVA_PIT_REQUIREMENTS } from "features/game/events/landExpansion/startLavaPit";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { formatNumber } from "lib/utils/formatNumber";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { secondsToString } from "lib/utils/time";
import { LAVA_PIT_MS } from "features/game/events/landExpansion/collectLavaPit";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _lavaPit = (id: string) => (state: MachineState) =>
  state.context.state.lavaPits[id];
const _season = (state: MachineState) => state.context.state.season;

interface Props {
  onClose: () => void;
  id: string;
}

export const LavaPitModalContent: React.FC<Props> = ({ onClose, id }) => {
  const { t } = useTranslation();

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const lavaPit = useSelector(gameService, _lavaPit(id));
  const season = useSelector(gameService, _season);

  useUiRefresher();

  const throwResourcesIntoPit = () => {
    gameService.send("lavaPit.started", {
      id,
    });
  };

  const collectLavaPit = () => {
    gameService.send("lavaPit.collected", {
      id,
    });
  };

  const hasIngredients = getKeys(LAVA_PIT_REQUIREMENTS).every((itemName) =>
    (inventory[itemName] ?? new Decimal(0)).gte(
      LAVA_PIT_REQUIREMENTS[itemName] ?? new Decimal(0),
    ),
  );

  const lavaPitInProgress = lavaPit?.startedAt !== undefined;
  const timeRemaining = LAVA_PIT_MS - (Date.now() - (lavaPit?.startedAt ?? 0));
  const canCollect = lavaPitInProgress && timeRemaining <= 0;
  const wasRecentlyCollected = Date.now() - (lavaPit?.collectedAt ?? 0) < 1000;

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
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
        <div className="flex flex-col gap-2 p-2">
          {getKeys(LAVA_PIT_REQUIREMENTS).map((itemName) => {
            return (
              <>
                <div className="flex items-start cursor-context-menu hover:brightness-100">
                  <Box
                    image={ITEM_DETAILS[itemName].image}
                    className="-mt-2 -ml-2 -mb-1"
                  />
                  <div>
                    <div className="flex flex-wrap items-start">
                      <Label type="default" className="mr-1 mb-1">
                        {`${formatNumber(LAVA_PIT_REQUIREMENTS[itemName])} x ${itemName}`}
                      </Label>
                    </div>

                    <p className="text-xs ml-0.5">
                      {ITEM_DETAILS[itemName]?.description
                        ? ITEM_DETAILS[itemName].description
                        : t("reward.collectible")}
                    </p>
                  </div>
                </div>
              </>
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
            <Label
              type="warning"
              icon={ITEM_DETAILS["Lava Pit"].image}
              className="ml-2"
            >
              {t("reward")}
            </Label>
          )}

          {lavaPitInProgress && canCollect && (
            <Label type="success">{"Ready"}</Label>
          )}
          {lavaPitInProgress && !canCollect && (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`${t("ready.in")} ${secondsToString(timeRemaining / 1000, {
                length: "medium",
              })}`}
            </Label>
          )}
          {!lavaPitInProgress && (
            <Label icon={SUNNYSIDE.icons.stopwatch} type="transparent">
              {secondsToString(LAVA_PIT_MS / 1000, {
                length: "short",
              })}
            </Label>
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
                  {`1 x Obsidian`}
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
