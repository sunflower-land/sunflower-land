import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

/**
 * Dev-build only: engine badge + the Layout preset switcher. Each preset
 * bundles its own land size, island and content (see landLayouts.ts and
 * fixtures/veteranFarm.ts), so this is the only control — though the
 * fine-grained localStorage override keys (`phaserFarm.dev.island` / biome /
 * season / expansions) still work when set directly, which the Playwright
 * parity harness relies on.
 */

const read = (key: string) => {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};

const LayoutSelect: React.FC = () => (
  <label className="flex items-center gap-1">
    <span>{"Layout"}</span>
    <select
      className="text-black text-xs"
      value={read("phaserFarm.dev.layout")}
      onChange={(event) => {
        const value = event.target.value;
        try {
          if (value) {
            localStorage.setItem("phaserFarm.dev.layout", value);
            // The preset owns the land size and the stress carpet.
            localStorage.removeItem("phaserFarm.dev.expansions");
            if (value === "stress") {
              localStorage.setItem("phaserFarm.dev.stress", "1");
            } else {
              localStorage.removeItem("phaserFarm.dev.stress");
            }
          } else {
            localStorage.removeItem("phaserFarm.dev.layout");
            localStorage.removeItem("phaserFarm.dev.stress");
          }
        } catch {
          // best-effort dev tooling
        }
        window.location.reload();
      }}
    >
      <option value="">{"(fixture)"}</option>
      <option value="basic">{"basic • 9 land"}</option>
      <option value="everything">{"everything • 42 land"}</option>
      <option value="stress">{"stress • 42 land"}</option>
      <option value="veteran">{"veteran • volcano 12"}</option>
    </select>
  </label>
);

export const DevPanel: React.FC = () => (
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-auto">
    <InnerPanel>
      <div className="px-1 flex items-center gap-2 text-xs">
        <Label type="info">{"Phaser (dev)"}</Label>
        <LayoutSelect />
      </div>
    </InnerPanel>
  </div>
);
