import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import type { InventoryItemName } from "features/game/types/game";
import { FLOWER_SEEDS, FLOWERS } from "features/game/types/flowers";
import { calculateInstaGrowCost } from "features/game/events/landExpansion/instaGrowFlower";
import {
  getFlowerBoostWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import {
  getCurrentHoneyProduced,
  getCurrentSpeed,
} from "features/game/lib/beehiveProduction";
import { getFullHiveHoneyYield } from "features/game/events/landExpansion/harvestBeehive";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "lib/object";
import { formatNumber } from "lib/utils/formatNumber";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";

/**
 * Compact modal contents for Phase 4 interactions. These are simplified
 * stand-ins for the DOM's inline modal JSX (FlowerBed.tsx, Beehive.tsx,
 * FishermanNPC.tsx) — the flows and events are exact; the presentation is
 * leaner (parity gap tracked in the checklist).
 */

const _state = (state: MachineState) => state.context.state;

export const FlowerInstaGrow: React.FC<{ id: string; onClose: () => void }> = ({
  id,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const now = useNow();

  const bed = state.flowers.flowerBeds[id];
  const flower = bed?.flower;
  if (!flower) return null;

  const growSeconds = FLOWER_SEEDS[FLOWERS[flower.name].seed].plantSeconds;
  const secondsLeft =
    flower.baseDurationMs !== undefined
      ? Math.max(
          (flower.baseDurationMs -
            workAccruedAt({
              startedAt: flower.plantedAt,
              at: now,
              windows: getFlowerBoostWindows(state),
            })) /
            1000,
          0,
        )
      : Math.max((flower.plantedAt + growSeconds * 1000 - now) / 1000, 0);

  const cost = calculateInstaGrowCost(secondsLeft);
  const obsidian = state.inventory.Obsidian ?? new Decimal(0);

  return (
    <CloseButtonPanel onClose={onClose} title={flower.name}>
      <div className="p-2 flex flex-col items-center">
        <img src={ITEM_DETAILS[flower.name].image} className="w-10 mb-2" />
        <p className="text-xs text-center mb-2">
          {secondsToString(secondsLeft, { length: "medium" })}
        </p>
        <RequirementLabel
          type="item"
          item="Obsidian"
          requirement={cost}
          balance={obsidian}
        />
        <Button
          className="mt-2"
          disabled={obsidian.lt(cost)}
          onClick={() => {
            gameService.send({ type: "flower.instaGrown", id });
            onClose();
          }}
        >
          {t("instaGrow")}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};

export const FlowerCongratulations: React.FC<{
  id: string;
  onClose: () => void;
}> = ({ id, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const flower = state.flowers.flowerBeds[id]?.flower;
  if (!flower) return null;

  return (
    <Panel bumpkinParts={NPC_WEARABLES.poppy}>
      <div className="p-2 flex flex-col items-center">
        <Label type="vibrant" className="mb-2">
          {t("congrats")}
        </Label>
        <img src={ITEM_DETAILS[flower.name].image} className="w-10 mb-2" />
        <p className="text-sm text-center mb-2">{flower.name}</p>
        <Button
          onClick={() => {
            gameService.send({ type: "flower.harvested", id });
            onClose();
          }}
        >
          {t("ok")}
        </Button>
      </div>
    </Panel>
  );
};

export const BeehiveLevel: React.FC<{ id: string; onClose: () => void }> = ({
  id,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const now = useNow();

  const hive = state.beehives[id];
  if (!hive) return null;

  const honeyProduced = getCurrentHoneyProduced(hive, now);
  const speed = getCurrentSpeed(hive, now);
  const percentage = (honeyProduced / DEFAULT_HONEY_PRODUCTION_TIME) * 100;
  const secondsToFull =
    speed === 0
      ? undefined
      : Math.max(
          0,
          (DEFAULT_HONEY_PRODUCTION_TIME - honeyProduced) / speed / 1000,
        );
  const { yield: fullYield } = getFullHiveHoneyYield(state);

  return (
    <Panel bumpkinParts={NPC_WEARABLES.stevie}>
      <div className="p-2 flex flex-col items-center">
        <Label type="default" icon={ITEM_DETAILS.Honey.image} className="mb-2">
          {`${formatNumber(percentage, { decimalPlaces: 2 })}% full`}
        </Label>
        <p className="text-xs mb-1">
          {`Full hive yield: ${formatNumber(fullYield, { decimalPlaces: 2 })} Honey`}
        </p>
        {speed === 0 ? (
          <Label type="danger" className="mb-2">
            {t("beehive.honeyProductionPaused")}
          </Label>
        ) : (
          <p className="text-xs mb-2">
            {`Full in ${secondsToString(secondsToFull ?? 0, { length: "medium" })}`}
          </p>
        )}
        <Button
          onClick={() => {
            gameService.send("beehive.harvested", { id });
            onClose();
          }}
        >
          {"Harvest"}
        </Button>
      </div>
    </Panel>
  );
};

export const FishermanCaught: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const caught = state.fishing.wharf.caught ?? {};

  return (
    <Panel>
      <div className="p-2 flex flex-col items-center">
        <Label type="vibrant" className="mb-2">
          {"Congratulations!"}
        </Label>
        <div className="flex flex-wrap justify-center mb-2">
          {getKeys(caught).map((name) => (
            <div key={name} className="flex items-center mr-2">
              <img
                src={ITEM_DETAILS[name as InventoryItemName].image}
                className="w-8 mr-1"
              />
              <span className="text-sm">{`${caught[name]} x ${name}`}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            gameService.send("rod.reeled");
            onClose();
          }}
        >
          {t("claim")}
        </Button>
      </div>
    </Panel>
  );
};
