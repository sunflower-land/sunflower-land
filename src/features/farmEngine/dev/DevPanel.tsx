import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

/**
 * Dev-build only: engine badge + the parity-matrix switcher. The selects
 * write the localStorage keys `applyPhaserDevOverrides` reads (island type,
 * biome, season, expansion count on the offline fixture) and reload.
 */

const read = (key: string) => {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};

const write = (key: string, value: string) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // storage unavailable — the switcher is best-effort dev tooling
  }
  window.location.reload();
};

/**
 * Farm layout presets [landLayouts.ts]. Each bundles its own land size, so
 * choosing one clears the manual Land override to avoid a confusing mix.
 */
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
      <option value="basic">{"basic \u2022 9 land"}</option>
      <option value="everything">{"everything \u2022 42 land"}</option>
      <option value="stress">{"stress \u2022 42 land"}</option>
    </select>
  </label>
);

const Select: React.FC<{
  label: string;
  storageKey: string;
  options: string[];
}> = ({ label, storageKey, options }) => (
  <label className="flex items-center gap-1">
    <span>{label}</span>
    <select
      className="text-black text-xs"
      value={read(storageKey)}
      onChange={(event) => write(storageKey, event.target.value)}
    >
      <option value="">{"(fixture)"}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

/**
 * The perf Easter egg: a 99-plot carpet of ready sunflowers (the level-4 well
 * fertility cap) + a 50-bumpkin crowd on the 42-expansion land. Tap like crazy.
 */
const StressToggle: React.FC = () => {
  const on = read("phaserFarm.dev.stress") === "1";
  return (
    <button
      className={`px-1 border rounded text-xs cursor-pointer ${
        on ? "bg-red-500 text-white" : "bg-white text-black"
      }`}
      onClick={() => {
        try {
          if (on) {
            localStorage.removeItem("phaserFarm.dev.stress");
          } else {
            localStorage.setItem("phaserFarm.dev.stress", "1");
            localStorage.setItem("phaserFarm.dev.expansions", "42");
          }
        } catch {
          // best-effort dev tooling
        }
        window.location.reload();
      }}
    >
      {on ? "\u{1F4A5} stress ON" : "\u{1F4A5} stress"}
    </button>
  );
};

export const DevPanel: React.FC = () => (
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-auto">
    <InnerPanel>
      <div className="px-1 flex items-center gap-2 text-xs">
        <Label type="info">{"Phaser (dev)"}</Label>
        <Select
          label="Island"
          storageKey="phaserFarm.dev.island"
          options={["basic", "spring", "desert", "volcano"]}
        />
        <Select
          label="Biome"
          storageKey="phaserFarm.dev.biome"
          options={[
            "Basic Biome",
            "Spring Biome",
            "Desert Biome",
            "Volcano Biome",
            "Swamp Biome",
            "Spooky Biome",
            "Crystal Biome",
            "Galaxy Biome",
            "Marble Age Biome",
          ]}
        />
        <Select
          label="Season"
          storageKey="phaserFarm.dev.season"
          options={["spring", "summer", "autumn", "winter"]}
        />
        <LayoutSelect />
        <Select
          label="Land"
          storageKey="phaserFarm.dev.expansions"
          options={["3", "9", "15", "23", "42"]}
        />
        <StressToggle />
      </div>
    </InnerPanel>
  </div>
);
