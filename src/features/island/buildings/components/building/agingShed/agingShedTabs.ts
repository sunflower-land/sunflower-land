import type { AgingShed } from "features/game/lib/agingShed";

const RACK_TABS = ["agingRack", "fermentationRack", "spiceRack"] as const;

type RackTab = (typeof RACK_TABS)[number];
export type AgingShedTab = RackTab | "upgrade";

export function getReadyAgingShedTabs(
  racks: AgingShed["racks"],
  now: number,
): RackTab[] {
  const queues = [racks.aging, racks.fermentation, racks.spice];

  return RACK_TABS.filter((_, index) =>
    queues[index].some((job) => job.readyAt <= now),
  );
}
