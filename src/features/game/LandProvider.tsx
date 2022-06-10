import React, { createContext, useCallback, useContext, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";
import {
  cacheShortcuts,
  getShortcuts,
} from "features/farming/hud/lib/shortcuts";

import {
  MachineInterpreter,
  Context as LandMachineContext,
  landMachine,
} from "./lib/landMachine";
import { InventoryItemName } from "./types/game";
import { useParams } from "react-router-dom";

interface LandContext {
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem?: InventoryItemName;
  gameService: any;
}

const Context = createContext<LandContext>({} as LandContext);

export const LandProvider: React.FC = ({ children }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { id } = useParams();

  const landContext: Partial<LandMachineContext> = { ...authState.context };

  const gameService = useInterpret(landMachine, {
    context: {
      farmId: id ? Number(id) : landContext.farmId,
      ...landContext,
    },
  }) as MachineInterpreter;
  const [shortcuts, setShortcuts] = useState<InventoryItemName[]>(
    getShortcuts()
  );

  const shortcutItem = useCallback((item: InventoryItemName) => {
    const items = cacheShortcuts(item);
    setShortcuts(items);
  }, []);

  const selectedItem = shortcuts.length > 0 ? shortcuts[0] : undefined;

  return (
    <Context.Provider value={{ shortcutItem, selectedItem, gameService }}>
      {children}
    </Context.Provider>
  );
};
