import { produce } from "immer";

import type { GameState } from "features/game/types/game";
import type { WorkbenchToolName } from "features/game/types/tools";
import { getObjectEntries } from "lib/object";

export type ToolShopBuyAllSetting = {
  blocked?: boolean;
};

export type UpdateToolShopSettingsAction = {
  type: "toolShop.settingsUpdated";
  settings: Partial<Record<WorkbenchToolName, ToolShopBuyAllSetting>>;
  buyAllEnabled?: boolean;
};

type Options = {
  state: Readonly<GameState>;
  action: UpdateToolShopSettingsAction;
  createdAt?: number;
};

export function updateToolShopSettings({ state, action }: Options): GameState {
  return produce(state, (draft) => {
    const buyAll = draft.settings.toolShop?.buyAll ?? {};
    const buyAllEnabled =
      action.buyAllEnabled ?? draft.settings.toolShop?.buyAllEnabled ?? true;

    draft.settings.toolShop = {
      ...draft.settings.toolShop,
      buyAll,
      buyAllEnabled,
    };

    getObjectEntries(action.settings).forEach(([toolName, setting]) => {
      if (!setting) return;

      buyAll[toolName] = {
        ...buyAll[toolName],
        ...setting,
      };
    });
  });
}
