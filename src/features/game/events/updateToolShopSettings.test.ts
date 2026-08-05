import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";

import { updateToolShopSettings } from "./updateToolShopSettings";

describe("updateToolShopSettings", () => {
  it("sets a tool's Buy All settings", () => {
    const state = updateToolShopSettings({
      state: TEST_FARM,
      action: {
        type: "toolShop.settingsUpdated",
        settings: { Axe: { blocked: true } },
      },
    });

    expect(state.settings.toolShop?.buyAll?.Axe).toEqual({
      blocked: true,
    });
  });

  it("merges new settings into an existing tool's settings", () => {
    const initial: GameState = {
      ...TEST_FARM,
      settings: {
        ...TEST_FARM.settings,
        toolShop: { buyAll: { Axe: { blocked: true } } },
      },
    };

    const state = updateToolShopSettings({
      state: initial,
      action: {
        type: "toolShop.settingsUpdated",
        settings: { Axe: { blocked: false } },
      },
    });

    expect(state.settings.toolShop?.buyAll?.Axe).toEqual({
      blocked: false,
    });
  });

  it("does not affect other tools' settings", () => {
    const initial: GameState = {
      ...TEST_FARM,
      settings: {
        ...TEST_FARM.settings,
        toolShop: { buyAll: { Axe: { blocked: true } } },
      },
    };

    const state = updateToolShopSettings({
      state: initial,
      action: {
        type: "toolShop.settingsUpdated",
        settings: { Rod: { blocked: true } },
      },
    });

    expect(state.settings.toolShop?.buyAll?.Axe).toEqual({ blocked: true });
    expect(state.settings.toolShop?.buyAll?.Rod).toEqual({ blocked: true });
  });

  it("disables the Buy All feature", () => {
    const state = updateToolShopSettings({
      state: TEST_FARM,
      action: {
        type: "toolShop.settingsUpdated",
        settings: {},
        buyAllEnabled: false,
      },
    });

    expect(state.settings.toolShop?.buyAllEnabled).toBe(false);
  });

  it("preserves the enabled flag when it isn't included in the action", () => {
    const initial: GameState = {
      ...TEST_FARM,
      settings: {
        ...TEST_FARM.settings,
        toolShop: { buyAll: {}, buyAllEnabled: false },
      },
    };

    const state = updateToolShopSettings({
      state: initial,
      action: {
        type: "toolShop.settingsUpdated",
        settings: { Axe: { blocked: true } },
      },
    });

    expect(state.settings.toolShop?.buyAllEnabled).toBe(false);
  });
});
