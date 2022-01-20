/**
 * A wrapper that provides app state and dispatches events
 */

import React from "react";
import { useState } from "react";
import Tinycon from "tinycon";

type AppState = {
  harvestable: number,
};

interface AppContext {
  state: AppState;
  appDispatcher: (action: AppAction) => AppState;
}

export const AppContext = React.createContext<AppContext>({} as AppContext);

type AppAction =
  | {
      type: "harvestable.increment";
      value: number;
    };

function eventReducer(state: AppState, action: AppAction) {
  if (action.type === "harvestable.increment") {

    if (action.value != -1 && action.value !== 1) {
      throw new Error("This counter should increment or decrement by 1 only");
    }
    const harvestable = state.harvestable + action.value;
    Tinycon.setBubble(harvestable);
    return {
      ...state,
      harvestable
    } as AppState;
  }

  throw new Error(`Unexpected event dispatched`);
}

export const AppProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<AppState>({
    harvestable: 0,
  });

  const appDispatcher = React.useCallback(
    (action: AppAction) => {
      const newState = eventReducer(state, action);
      setState(newState);
      return newState;
    },
    [state]
  );

  return (
    <AppContext.Provider value={{ state, appDispatcher }}>
      {children}
    </AppContext.Provider>
  );
};
