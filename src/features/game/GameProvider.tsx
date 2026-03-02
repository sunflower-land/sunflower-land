/**
 * A wrapper that provides game state and dispatches events
 */
import { useState, useCallback, useEffect } from "react";
import { useActor, useActorRef } from "@xstate/react";
import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";
import {
  cacheShortcuts,
  getShortcuts,
} from "features/farming/hud/lib/shortcuts";
import { startGame, MachineInterpreter } from "./lib/gameMachine";
import { InventoryItemName } from "./types/game";
import {
  cacheShowAnimationsSetting,
  getShowAnimationsSetting,
} from "features/farming/hud/lib/animations";
import {
  cacheEnableQuickSelectSetting,
  getEnableQuickSelectSetting,
} from "features/farming/hud/lib/quickSelect";
import {
  cacheShowTimersSetting,
  getShowTimersSetting,
} from "features/farming/hud/lib/timers";

interface GameContext {
  shortcutItem: (item: InventoryItemName) => void;
  shortcuts: InventoryItemName[];
  selectedItem?: InventoryItemName;
  gameService: MachineInterpreter;
  showAnimations: boolean;
  toggleAnimations: () => void;
  enableQuickSelect: boolean;
  toggleQuickSelect: () => void;
  showTimers: boolean;
  toggleTimers: () => void;
  fromRoute?: string;
  setFromRoute: (route: string) => void;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const GameProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const [gameMachine] = useState(startGame(authState.context) as any);

  // TODO - Typescript error
  const gameService = useActorRef(gameMachine) as MachineInterpreter;

  useEffect(() => {
    const handleRouteChange = () => {
      if (
        !window.location.href.includes("visit") &&
        gameService.getSnapshot().matches("visiting")
      ) {
        gameService.send({ type: "END_VISIT" });
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("pushstate", handleRouteChange);
    window.addEventListener("replacestate", handleRouteChange);

    // Also check on mount
    handleRouteChange();

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("pushstate", handleRouteChange);
      window.removeEventListener("replacestate", handleRouteChange);
    };
  }, [gameService?.state?.value]);

  const [shortcuts, setShortcuts] =
    useState<InventoryItemName[]>(getShortcuts());
  const [showAnimations, setShowAnimations] = useState<boolean>(
    getShowAnimationsSetting(),
  );
  const [enableQuickSelect, setEnableQuickSelect] = useState<boolean>(
    getEnableQuickSelectSetting(),
  );
  const [showTimers, setShowTimers] = useState<boolean>(getShowTimersSetting());
  const [fromRoute, setFromRoute] = useState<string | undefined>();

  const shortcutItem = useCallback((item: InventoryItemName) => {
    const originalShortcuts = getShortcuts();
    const originalSelectedItem =
      originalShortcuts.length > 0 ? originalShortcuts[0] : undefined;

    // skip shortcut logic if selected item is the same
    // to avoid unnecessary rerenders for components using useContext(Context)
    if (originalSelectedItem === item) return;

    const items = cacheShortcuts(item);

    setShortcuts(items);
  }, []);

  const toggleAnimations = () => {
    const newValue = !showAnimations;

    setShowAnimations(newValue);
    cacheShowAnimationsSetting(newValue);
  };

  const toggleQuickSelect = () => {
    const newValue = !enableQuickSelect;

    setEnableQuickSelect(newValue);
    cacheEnableQuickSelectSetting(newValue);
  };

  const toggleTimers = () => {
    const newValue = !showTimers;

    setShowTimers(newValue);
    cacheShowTimersSetting(newValue);
  };

  const selectedItem = shortcuts.length > 0 ? shortcuts[0] : undefined;

  return (
    <Context.Provider
      value={{
        shortcutItem,
        shortcuts,
        selectedItem,
        gameService,
        showAnimations,
        toggleAnimations,
        enableQuickSelect,
        toggleQuickSelect,
        showTimers,
        toggleTimers,
        fromRoute,
        setFromRoute,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGame = () => {
  const context = React.useContext(Context);
  const [gameState] = useActor(context.gameService);

  if (!context) {
    throw new Error("useAuth must be used within an GameProvider");
  }

  return { gameState, gameService: context.gameService };
};
