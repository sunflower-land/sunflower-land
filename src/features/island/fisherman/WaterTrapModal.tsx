import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { Chum, CHUM_AMOUNTS, CHUM_DETAILS } from "features/game/types/fishing";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "../hud/components/inventory/utils/inventory";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNow } from "lib/utils/hooks/useNow";
import { WaterTrap } from "features/game/types/game";
import { WaterTrapName, WATER_TRAP } from "features/game/types/crustaceans";
import { getBumpkinLevel } from "features/game/lib/level";
import { getObjectEntries } from "features/game/expansion/lib/utils";

const _state = (state: MachineState) => state.context.state;

interface Props {
  waterTrap?: WaterTrap;
  onPlace: (trapType: WaterTrapName, chum?: Chum) => void;
  onPickup: () => void;
  onCollect: () => void;
  onClose: () => void;
}

export const WaterTrapModal: React.FC<Props> = ({
  waterTrap,
  onPlace,
  onPickup,
  onCollect,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const [selectedTrap, setSelectedTrap] = useState<WaterTrapName | undefined>(
    undefined,
  );
  const [selectedChum, setSelectedChum] = useState<Chum | undefined>(
    waterTrap?.chum && waterTrap.chum in CHUM_AMOUNTS
      ? (waterTrap.chum as Chum)
      : undefined,
  );

  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };

  const hasCrabPot = (state.inventory["Crab Pot"]?.toNumber() ?? 0) > 0;
  const hasMarinerPot = (state.inventory["Mariner Pot"]?.toNumber() ?? 0) > 0;

  const experience = state.bumpkin?.experience ?? 0;
  const bumpkinLevel = getBumpkinLevel(experience);
  const marinerRequiredLevel = WATER_TRAP["Mariner Pot"].requiredBumpkinLevel;
  const canUseMarinerPot = bumpkinLevel >= marinerRequiredLevel;
  const hasAccessToWaterTraps = bumpkinLevel >= 18;

  const now = useNow({
    live: !!waterTrap,
    autoEndAt: waterTrap?.readyAt,
  });
  const isReady = waterTrap && waterTrap.readyAt <= now && !waterTrap.caught;
  const isPickedUp = waterTrap && waterTrap.caught;
  const isPlaced = waterTrap && !isReady && !isPickedUp;

  const { totalSeconds: secondsLeft } = useCountdown(waterTrap?.readyAt ?? 0);

  const handlePlace = () => {
    if (!selectedTrap) return;
    const hasTrap = selectedTrap === "Crab Pot" ? hasCrabPot : hasMarinerPot;
    if (!hasTrap) return;

    if (!selectedChum) return;

    const chumAmount = CHUM_AMOUNTS[selectedChum];
    const hasChum = items[selectedChum]?.gte(chumAmount) ?? false;

    if (!hasChum) return;

    onPlace(selectedTrap, selectedChum);
  };

  if (isPickedUp) {
    const trapType = waterTrap?.type;
    const caught = waterTrap.caught ?? {};

    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="flex p-2 -mt-2">
          <img
            src={ITEM_DETAILS[trapType].image}
            className="w-14 object-contain mr-2"
          />
          <div className="mt-2 flex-1">
            <div className="flex flex-wrap my-1">
              {getObjectEntries(caught).map(([item, amount]) => {
                const itemName = item;
                const hasCaughtBefore =
                  !!state.farmActivity[`${itemName} Caught`];
                const isUnknown = !hasCaughtBefore;

                return (
                  <div
                    key={item}
                    className="flex space-x-2 justify-start mr-2 mb-1"
                  >
                    <img
                      src={
                        isUnknown
                          ? SUNNYSIDE.icons.search
                          : ITEM_DETAILS[itemName].image
                      }
                      className="h-5"
                    />
                    <Label type="default">
                      {`${amount} ${isUnknown ? "Unknown" : itemName}`}
                    </Label>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
              <span className="text-xs">{t("waterTrap.ready")}</span>
            </div>
          </div>
        </div>
        <Button
          className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
          onClick={onCollect}
        >
          {t("collect")}
        </Button>
      </CloseButtonPanel>
    );
  }

  if (isReady) {
    const trapType = waterTrap?.type;

    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="flex p-2 -mt-2">
          <img
            src={ITEM_DETAILS[trapType].image}
            className="w-14 object-contain mr-2"
          />
          <div className="mt-2 flex-1">
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
              <span className="text-xs">{t("waterTrap.ready")}</span>
            </div>
          </div>
        </div>
        <Button
          className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
          onClick={onPickup}
        >
          {t("waterTrap.pickup")}
        </Button>
      </CloseButtonPanel>
    );
  }

  if (isPlaced) {
    const trapType = waterTrap?.type;
    // const catchCount = WATER_TRAP[trapType].catchCount;

    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="flex p-2 -mt-2">
          <img
            src={ITEM_DETAILS[trapType].image}
            className="w-14 object-contain mr-2"
          />
          <div className="mt-2 flex-1">
            <div className="flex items-center mb-2">
              <img src={SUNNYSIDE.icons.timer} className="h-5 mr-1" />
              <span className="text-xs mr-1">
                {secondsToString(secondsLeft, {
                  length: "full",
                })}
              </span>
            </div>
            <div className="flex flex-wrap my-1">
              <div className="flex space-x-2 justify-start mr-2 mb-1">
                <img src={ITEM_DETAILS["Crab"].image} className="h-5" />
                {/* <Label type="default">{`${catchCount} Crab`}</Label> */}
              </div>
            </div>
          </div>
        </div>
        <Button
          className="text-xxs sm:text-sm mb-2 whitespace-nowrap"
          onClick={onCollect}
          disabled={true}
        >
          {t("collect")}
        </Button>
      </CloseButtonPanel>
    );
  }

  if (!hasAccessToWaterTraps) {
    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="p-3 flex flex-col items-center">
          <img
            src={SUNNYSIDE.icons.expression_confused}
            className="w-10 h-10 mb-3"
            alt="Curious"
          />
          <p className="text-sm text-center italic mb-2">
            {t("waterTrap.loreMessage")}
          </p>
          <Label type="info" className="text-xs">
            {t("coming.soon")}
          </Label>
        </div>
      </CloseButtonPanel>
    );
  }

  const selectedTrapDescription = selectedTrap
    ? selectedTrap === "Crab Pot"
      ? t("description.crab.pot")
      : t("description.mariner.pot")
    : "";

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-2">
        <div className="flex flex-wrap gap-2">
          <Box
            image={ITEM_DETAILS["Crab Pot"].image}
            count={state.inventory["Crab Pot"]}
            onClick={() => setSelectedTrap("Crab Pot")}
            isSelected={selectedTrap === "Crab Pot"}
            disabled={!hasCrabPot}
          />
          <Box
            image={ITEM_DETAILS["Mariner Pot"].image}
            count={state.inventory["Mariner Pot"]}
            onClick={() => setSelectedTrap("Mariner Pot")}
            isSelected={selectedTrap === "Mariner Pot"}
            disabled={!hasMarinerPot || !canUseMarinerPot}
          />
        </div>
      </div>

      {selectedTrap && (
        <InnerPanel className="my-1 relative">
          <div className="flex p-1">
            <div className="flex-shrink-0 h-10 w-10 mr-2 justify-items-center">
              <img src={ITEM_DETAILS[selectedTrap].image} className="h-10" />
            </div>
            <div>
              <p className="text-sm mb-1">{selectedTrap}</p>
              <p className="text-xs">{selectedTrapDescription}</p>
              {!state.inventory[selectedTrap] && (
                <Label className="mt-2" type="default">
                  {t("statements.craft.composter")}
                </Label>
              )}
            </div>
          </div>
          {!state.inventory[selectedTrap] && (
            <Label className="absolute -top-3 right-0" type="danger">
              {t("fishermanModal.zero.available")}
            </Label>
          )}
        </InnerPanel>
      )}

      {selectedTrap && (
        <InnerPanel className="mb-1">
          <div className="p-2">
            <p className="mb-1 p-1 text-xs">{t("waterTrap.selectChum")}</p>
            <div className="flex flex-wrap gap-1">
              {Object.keys(CHUM_AMOUNTS)
                .filter((name) => items[name as InventoryItemName]?.gte(1))
                .map((name) => {
                  const chum = name as Chum;
                  const amount = CHUM_AMOUNTS[chum];
                  const hasEnough = items[chum]?.gte(amount) ?? false;
                  return (
                    <Box
                      key={chum}
                      image={ITEM_DETAILS[chum].image}
                      count={items[chum]}
                      onClick={() => setSelectedChum(chum)}
                      isSelected={selectedChum === chum}
                      disabled={!hasEnough}
                    />
                  );
                })}
            </div>
            {selectedChum && (
              <div className="p-2 mt-2">
                <div className="flex justify-between">
                  <Label
                    type="default"
                    className="mb-1"
                    icon={ITEM_DETAILS[selectedChum].image}
                  >
                    {selectedChum}
                  </Label>
                  <Label
                    type={
                      items[selectedChum]?.gte(CHUM_AMOUNTS[selectedChum])
                        ? "default"
                        : "danger"
                    }
                    className="mb-1"
                  >
                    {`${CHUM_AMOUNTS[selectedChum]} ${selectedChum}`}
                  </Label>
                </div>
                <p className="text-xs">{CHUM_DETAILS[selectedChum]}</p>
              </div>
            )}
          </div>
        </InnerPanel>
      )}

      <Button
        onClick={handlePlace}
        disabled={
          !selectedTrap ||
          !selectedChum ||
          !items[selectedChum]?.gte(CHUM_AMOUNTS[selectedChum])
        }
        className="w-full"
      >
        {t("waterTrap.place")}
      </Button>
    </CloseButtonPanel>
  );
};
