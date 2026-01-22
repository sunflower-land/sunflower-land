import React, { useContext, useState } from "react";
import { Decimal } from "decimal.js-light";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CHUM_DETAILS } from "features/game/types/fishing";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "../hud/components/inventory/utils/inventory";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { WaterTrap } from "features/game/types/game";
import {
  WaterTrapName,
  WATER_TRAP,
  CRUSTACEAN_CHUM_AMOUNTS,
  CrustaceanChum,
} from "features/game/types/crustaceans";
import { getBumpkinLevel } from "features/game/lib/level";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { CrustaceanGuide } from "./CrustaceanGuide";

const _state = (state: MachineState) => state.context.state;

interface Props {
  waterTrap?: WaterTrap;
  onPlace: (trapType: WaterTrapName, chum?: CrustaceanChum) => void;
  onPickup: () => void;
  onCollect: () => void;
  onClose: () => void;
}

type Tab = "crustaceans" | "guide";

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
  const [tab, setTab] = useState<Tab>("crustaceans");
  const [selectedTrap, setSelectedTrap] = useState<WaterTrapName | undefined>(
    undefined,
  );
  const [selectedChum, setSelectedChum] = useState<CrustaceanChum | undefined>(
    waterTrap?.chum && waterTrap.chum in CRUSTACEAN_CHUM_AMOUNTS
      ? (waterTrap.chum as CrustaceanChum)
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

  const { totalSeconds: secondsLeft } = useCountdown(waterTrap?.readyAt ?? 0);
  const isReady = secondsLeft <= 0;

  const chums = selectedTrap ? WATER_TRAP[selectedTrap].chums : [];

  const isValidChumForTrap =
    selectedTrap && selectedChum ? chums.includes(selectedChum) : true;

  const handlePlace = () => {
    if (!selectedTrap) return;
    const hasTrap = selectedTrap === "Crab Pot" ? hasCrabPot : hasMarinerPot;
    if (!hasTrap) return;

    const chumAmount = selectedChum ? CRUSTACEAN_CHUM_AMOUNTS[selectedChum] : 0;
    const hasChum = selectedChum
      ? (items[selectedChum]?.gte(chumAmount) ?? false)
      : true;

    if (!hasChum) return;

    onPlace(selectedTrap, selectedChum);
  };

  const hasEnoughChum = selectedChum
    ? items[selectedChum]?.gte(CRUSTACEAN_CHUM_AMOUNTS[selectedChum])
    : true;

  // A water trap has been placed
  if (waterTrap) {
    const { type: trapType, caught, chum } = waterTrap;

    return (
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            id: "crustaceans",
            icon: ITEM_DETAILS["Blue Crab"].image,
            name: t("crustaceans"),
          },
          {
            id: "guide",
            icon: SUNNYSIDE.icons.expression_confused,
            name: t("guide"),
          },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === "crustaceans" && (
          <>
            <div className="flex p-2 -mt-2">
              <img
                src={ITEM_DETAILS[trapType].image}
                className="w-14 object-contain mr-4"
              />
              <div className="flex flex-col mt-2">
                {!isReady && (
                  <>
                    <div className="flex items-center mb-2">
                      <img src={SUNNYSIDE.icons.timer} className="h-5 mr-1" />
                      <span className="text-xs mr-1">
                        {secondsToString(secondsLeft, {
                          length: "full",
                        })}
                      </span>
                    </div>
                  </>
                )}

                {chum && (
                  <div className="flex items-center mb-2">
                    <Label
                      type="default"
                      className="text-xs"
                      icon={ITEM_DETAILS[chum].image}
                    >
                      {`${CRUSTACEAN_CHUM_AMOUNTS[chum]} ${chum} ${t("chum")}`}
                    </Label>
                  </div>
                )}
                {caught && getObjectEntries(caught).length > 0 && (
                  <div className="flex flex-wrap my-1">
                    {getObjectEntries(caught).map(([item, amount]) => {
                      return (
                        <Label
                          key={item}
                          type="default"
                          className="text-xs"
                          icon={ITEM_DETAILS[item].image}
                        >
                          {`${amount} ${item} ${t("caught")}`}
                        </Label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {isReady && (
              <div className="flex justify-center">
                <Button
                  className="text-xxs sm:text-sm whitespace-nowrap"
                  onClick={caught ? onCollect : onPickup}
                >
                  {caught ? t("collect") : t("waterTrap.pickup")}
                </Button>
              </div>
            )}
          </>
        )}
        {tab === "guide" && <CrustaceanGuide />}
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

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
          id: "crustaceans",
          icon: ITEM_DETAILS["Crab Pot"].image,
          name: t("crustaceans"),
        },
        {
          id: "guide",
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === "crustaceans" && (
        <>
          <div className="p-2">
            <div className="flex flex-wrap gap-2">
              <Box
                image={ITEM_DETAILS["Crab Pot"].image}
                count={state.inventory["Crab Pot"]}
                onClick={() => {
                  setSelectedTrap("Crab Pot");
                  // Clear chum if it's not valid for Crab Pot
                  if (
                    selectedChum &&
                    !WATER_TRAP["Crab Pot"].chums.includes(selectedChum)
                  ) {
                    setSelectedChum(undefined);
                  }
                }}
                isSelected={selectedTrap === "Crab Pot"}
                disabled={!hasCrabPot}
              />
              <Box
                image={ITEM_DETAILS["Mariner Pot"].image}
                count={state.inventory["Mariner Pot"]}
                onClick={() => {
                  setSelectedTrap("Mariner Pot");
                  // Clear chum if it's not valid for Mariner Pot
                  if (
                    selectedChum &&
                    !WATER_TRAP["Mariner Pot"].chums.includes(selectedChum)
                  ) {
                    setSelectedChum(undefined);
                  }
                }}
                isSelected={selectedTrap === "Mariner Pot"}
                disabled={!hasMarinerPot || !canUseMarinerPot}
              />
            </div>
          </div>

          {selectedTrap && (
            <InnerPanel className="my-1 relative">
              <div className="flex p-1">
                <div className="flex-shrink-0 h-10 w-10 mr-2 justify-items-center">
                  <img
                    src={ITEM_DETAILS[selectedTrap].image}
                    className="h-10"
                  />
                </div>
                <div>
                  <p className="text-sm mb-1">{selectedTrap}</p>
                  <p className="text-xs">
                    {selectedTrap ? ITEM_DETAILS[selectedTrap].description : ""}
                  </p>
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
                  {chums.map((name) => {
                    const chum = name as CrustaceanChum;
                    const currentAmount = items[chum] ?? new Decimal(0);
                    const requiredAmount = CRUSTACEAN_CHUM_AMOUNTS[chum];
                    const hasEnough = currentAmount.gte(requiredAmount);
                    return (
                      <Box
                        key={chum}
                        image={ITEM_DETAILS[chum].image}
                        count={currentAmount.gt(0) ? currentAmount : undefined}
                        onClick={() =>
                          setSelectedChum(
                            selectedChum === chum ? undefined : chum,
                          )
                        }
                        isSelected={selectedChum === chum}
                        disabled={!hasEnough}
                      />
                    );
                  })}
                </div>
                {selectedChum && (
                  <div className="p-2 mt-2">
                    <Label
                      type={hasEnoughChum ? "default" : "warning"}
                      className="mb-1"
                      icon={ITEM_DETAILS[selectedChum].image}
                    >
                      {hasEnoughChum
                        ? `${CRUSTACEAN_CHUM_AMOUNTS[selectedChum]} ${selectedChum}`
                        : `${t("required")}: ${CRUSTACEAN_CHUM_AMOUNTS[selectedChum]} ${selectedChum}${
                            items[selectedChum]?.gt(0)
                              ? ` (${t("count.available", { count: items[selectedChum]?.toString() ?? "0" })})`
                              : ""
                          }`}
                    </Label>
                    <p className="text-xs">{CHUM_DETAILS[selectedChum]}</p>
                  </div>
                )}
              </div>
            </InnerPanel>
          )}

          <Button
            onClick={handlePlace}
            disabled={!selectedTrap || !isValidChumForTrap || !hasEnoughChum}
            className="w-full"
          >
            {t("waterTrap.place")}
          </Button>
        </>
      )}
      {tab === "guide" && <CrustaceanGuide />}
    </CloseButtonPanel>
  );
};
