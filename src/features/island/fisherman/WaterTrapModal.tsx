import React, {
  useContext,
  useRef,
  useSyncExternalStore,
  useState,
} from "react";
import { Decimal } from "decimal.js-light";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { DropdownPanel } from "components/ui/DropdownPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CHUM_DETAILS } from "features/game/types/fishing";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "../hud/components/inventory/utils/inventory";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState, WaterTrap } from "features/game/types/game";
import {
  WaterTrapName,
  WATER_TRAP,
  CRUSTACEAN_CHUM_AMOUNTS,
  CrustaceanChum,
  caughtCrustacean,
} from "features/game/types/crustaceans";
import { getBumpkinLevel } from "features/game/lib/level";
import { CrustaceanGuide } from "./CrustaceanGuide";
import { getKeys } from "features/game/types/decorations";

const _state = (state: MachineState) => state.context.state;

const LAST_TRAP_KEY = "lastSelectedWaterTrap";
const LAST_CHUM_KEY = "lastSelectedWaterTrapChum";

const safeLocalStorage = {
  get<T>(key: string): T | null {
    try {
      return typeof window !== "undefined"
        ? (localStorage.getItem(key) as T)
        : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      if (typeof window !== "undefined") localStorage.setItem(key, value);
    } catch {
      // Safari private mode, quota exceeded, etc.
    }
  },
  remove(key: string): void {
    try {
      if (typeof window !== "undefined") localStorage.removeItem(key);
    } catch {
      // Safari private mode, etc.
    }
  },
};

const getStoredTrap = (
  canUseMarinerPot: boolean,
): WaterTrapName | undefined => {
  const stored = safeLocalStorage.get<WaterTrapName>(LAST_TRAP_KEY);
  if (!stored || !(stored in WATER_TRAP)) return undefined;
  if (stored === "Mariner Pot" && !canUseMarinerPot) return undefined;

  return stored;
};

const getStoredChum = (
  trap: WaterTrapName | undefined,
  state: GameState,
): CrustaceanChum | undefined => {
  if (!trap) return undefined;

  const stored = safeLocalStorage.get<CrustaceanChum>(LAST_CHUM_KEY);
  if (!stored) return undefined;

  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
  const isValid =
    WATER_TRAP[trap].chums.includes(stored) && (items[stored]?.gte(1) ?? false);

  return isValid ? stored : undefined;
};

interface Props {
  waterTrap?: WaterTrap;
  onPlace: (trapType: WaterTrapName, chum?: CrustaceanChum) => void;
  onClose: () => void;
}

type Tab = "crustaceans" | "guide";

export const WaterTrapModal: React.FC<Props> = ({
  waterTrap,
  onPlace,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<Tab>("crustaceans");

  const experience = state.bumpkin?.experience ?? 0;
  const bumpkinLevel = getBumpkinLevel(experience);
  const marinerRequiredLevel = WATER_TRAP["Mariner Pot"].requiredBumpkinLevel;
  const canUseMarinerPot = bumpkinLevel >= marinerRequiredLevel;

  const [userSelection, setUserSelection] = useState<{
    trap?: WaterTrapName;
    chum?: CrustaceanChum;
  }>();

  const snapshotRef = useRef<{
    trap: WaterTrapName | undefined;
    chum: CrustaceanChum | undefined;
  }>(undefined);

  const persisted = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        const trap = getStoredTrap(canUseMarinerPot);
        const chum =
          waterTrap?.chum && waterTrap.chum in CRUSTACEAN_CHUM_AMOUNTS
            ? waterTrap.chum
            : getStoredChum(trap, state);
        const next = { trap, chum };
        if (
          snapshotRef.current?.trap === next.trap &&
          snapshotRef.current?.chum === next.chum
        ) {
          return snapshotRef.current;
        }
        snapshotRef.current = next;
        return next;
      } catch {
        const fallback = { trap: undefined, chum: undefined };
        return snapshotRef.current ?? fallback;
      }
    },
    () => ({ trap: undefined, chum: undefined }),
  );

  const selectedTrap = userSelection?.trap ?? persisted?.trap;
  const selectedChum =
    waterTrap?.chum && waterTrap.chum in CRUSTACEAN_CHUM_AMOUNTS
      ? waterTrap.chum
      : (userSelection?.chum ?? persisted?.chum);

  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };

  const hasAccessToWaterTraps = bumpkinLevel >= 18;

  const chums = selectedTrap
    ? WATER_TRAP[selectedTrap].chums.filter((chum) => items[chum]?.gte(1))
    : [];

  const isValidChumForTrap = selectedChum ? chums.includes(selectedChum) : true;

  const hasTrap = selectedTrap
    ? (state.inventory[selectedTrap]?.gte(1) ?? false)
    : false;

  const hasEnoughChum = selectedChum
    ? items[selectedChum]?.gte(CRUSTACEAN_CHUM_AMOUNTS[selectedChum])
    : true;

  const catchForSelectedChum = selectedTrap
    ? getKeys(caughtCrustacean(selectedTrap, selectedChum))[0]
    : undefined;

  const showResultingCatch =
    selectedTrap &&
    catchForSelectedChum &&
    (selectedChum
      ? (state.farmActivity[
          `${catchForSelectedChum} Caught with ${selectedChum}`
        ] ?? 0) > 0
      : (state.farmActivity[`${catchForSelectedChum} Caught`] ?? 0) > 0);

  const handleTrapChange = (trap: WaterTrapName) => {
    const clearChum =
      selectedChum && !WATER_TRAP[trap].chums.includes(selectedChum);
    setUserSelection((prev) => ({
      trap,
      chum: clearChum ? undefined : prev?.chum,
    }));
    safeLocalStorage.set(LAST_TRAP_KEY, trap);
    if (clearChum) safeLocalStorage.remove(LAST_CHUM_KEY);
  };

  const handleChumChange = (chum: CrustaceanChum | undefined) => {
    setUserSelection((prev) => ({ ...prev, chum }));
    if (chum) {
      safeLocalStorage.set(LAST_CHUM_KEY, chum);
    } else {
      safeLocalStorage.remove(LAST_CHUM_KEY);
    }
  };

  const handlePlace = () => {
    if (!selectedTrap || !hasTrap) return;

    const chumAmount = selectedChum ? CRUSTACEAN_CHUM_AMOUNTS[selectedChum] : 0;
    const hasChum = selectedChum
      ? (items[selectedChum]?.gte(chumAmount) ?? false)
      : true;

    if (!hasChum) return;

    onPlace(selectedTrap, selectedChum);
  };

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
      container={OuterPanel}
    >
      {tab === "crustaceans" && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <DropdownPanel
              options={[
                {
                  value: "Crab Pot",
                  label: (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs">{`Crab Pot (${
                        state.inventory["Crab Pot"]?.toString() ?? 0
                      })`}</p>
                      <p className="text-xxs">
                        {ITEM_DETAILS["Crab Pot"].description}
                      </p>
                    </div>
                  ),
                  icon: ITEM_DETAILS["Crab Pot"].image,
                },
                ...(canUseMarinerPot
                  ? [
                      {
                        value: "Mariner Pot",
                        label: (
                          <div className="flex flex-col gap-1">
                            <p className="text-xs">{`Mariner Pot (${
                              state.inventory["Mariner Pot"]?.toString() ?? 0
                            })`}</p>
                            <p className="text-xxs">
                              {ITEM_DETAILS["Mariner Pot"].description}
                            </p>
                          </div>
                        ),
                        icon: ITEM_DETAILS["Mariner Pot"].image,
                      },
                    ]
                  : []),
              ]}
              value={selectedTrap}
              onChange={(trap) => handleTrapChange(trap)}
            />

            {!selectedTrap && (
              <Label className="ml-1" type="default">
                {t("waterTrap.selectTrap")}
              </Label>
            )}

            {selectedTrap && (
              <>
                {!state.inventory[selectedTrap]?.gte(1) && (
                  <Label className="ml-1" type="danger">
                    {t("fishing.dont.have.enough.bait", { bait: selectedTrap })}
                  </Label>
                )}

                {chums.length === 0 ? (
                  <Label className="ml-1" type="danger">
                    {t("waterTrap.noChumsAvailable")}
                  </Label>
                ) : (
                  <InnerPanel>
                    <p className="mb-1 p-1 text-xs">
                      {t("waterTrap.selectChum")}
                    </p>
                    <div className="flex flex-wrap">
                      {chums.map((chum) => {
                        if (!items[chum]?.gte(1)) return null;

                        const currentAmount = items[chum] ?? new Decimal(0);
                        return (
                          <Box
                            key={chum}
                            image={ITEM_DETAILS[chum].image}
                            count={currentAmount}
                            onClick={() =>
                              handleChumChange(
                                selectedChum === chum ? undefined : chum,
                              )
                            }
                            isSelected={selectedChum === chum}
                          />
                        );
                      })}
                    </div>
                  </InnerPanel>
                )}
                {selectedChum ? (
                  <InnerPanel className="p-2">
                    <div className="flex justify-between">
                      {hasEnoughChum ? (
                        <Label
                          type="default"
                          className="mb-1 ml-1"
                          icon={ITEM_DETAILS[selectedChum].image}
                        >
                          {`${CRUSTACEAN_CHUM_AMOUNTS[selectedChum]} ${selectedChum}`}
                        </Label>
                      ) : (
                        <Label
                          type="warning"
                          className="mb-1 ml-1"
                          icon={ITEM_DETAILS[selectedChum].image}
                        >
                          {`${t("required")}: ${
                            CRUSTACEAN_CHUM_AMOUNTS[selectedChum]
                          } ${selectedChum}${
                            items[selectedChum]?.gt(0)
                              ? ` (${t("count.available", {
                                  count: items[selectedChum]?.toFixed(2) ?? "0",
                                })})`
                              : ""
                          }`}
                        </Label>
                      )}
                      {showResultingCatch && catchForSelectedChum && (
                        <Label
                          type="default"
                          className="mb-1 ml-1"
                          icon={ITEM_DETAILS[catchForSelectedChum].image}
                        >
                          {catchForSelectedChum}
                        </Label>
                      )}
                    </div>
                    <p className="text-xs ml-1">{CHUM_DETAILS[selectedChum]}</p>
                  </InnerPanel>
                ) : (
                  <InnerPanel className="p-2">
                    <div className="flex justify-between">
                      <Label type="default" className="mb-1 ml-1">
                        {t("waterTrap.noChumSelected")}
                      </Label>
                      {showResultingCatch && catchForSelectedChum && (
                        <Label
                          type="default"
                          className="mb-1 ml-1"
                          icon={ITEM_DETAILS[catchForSelectedChum].image}
                        >
                          {catchForSelectedChum}
                        </Label>
                      )}
                    </div>
                  </InnerPanel>
                )}
              </>
            )}
          </div>
          <Button
            onClick={handlePlace}
            disabled={
              !selectedTrap || !hasTrap || !isValidChumForTrap || !hasEnoughChum
            }
            className="w-full"
          >
            {catchForSelectedChum && showResultingCatch
              ? t("waterTrap.placeTrap", { crustacean: catchForSelectedChum })
              : t("waterTrap.place")}
          </Button>
        </div>
      )}
      {tab === "guide" && (
        <InnerPanel>
          <CrustaceanGuide />
        </InnerPanel>
      )}
    </CloseButtonPanel>
  );
};
