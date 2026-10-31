import { createInitialAgingShed } from "features/game/lib/agingShed";
import { getReadyAgingShedTabs } from "./agingShedTabs";

const NOW = 1000;

function racksWithReadyJobs(
  aging: boolean,
  fermentation: boolean,
  spice: boolean,
) {
  const racks = createInitialAgingShed().racks;
  racks.aging = [
    {
      id: "fish",
      fish: "Anchovy",
      startedAt: 0,
      readyAt: aging ? NOW : NOW + 1,
    },
  ];
  racks.fermentation = [
    {
      id: "vegetable",
      recipe: "Pickled Broccoli",
      startedAt: 0,
      readyAt: fermentation ? NOW : NOW + 1,
    },
  ];
  racks.spice = [
    {
      id: "salt",
      recipe: "Refined Salt",
      startedAt: 0,
      readyAt: spice ? NOW : NOW + 1,
    },
  ];
  return racks;
}

describe("getReadyAgingShedTabs", () => {
  it.each([
    [false, false, false, []],
    [true, false, false, ["agingRack"]],
    [false, true, false, ["fermentationRack"]],
    [false, false, true, ["spiceRack"]],
    [true, true, false, ["agingRack", "fermentationRack"]],
    [true, false, true, ["agingRack", "spiceRack"]],
    [false, true, true, ["fermentationRack", "spiceRack"]],
    [true, true, true, ["agingRack", "fermentationRack", "spiceRack"]],
  ] as const)(
    "orders ready racks for aging=%s, fermentation=%s, spice=%s",
    (aging, fermentation, spice, expected) => {
      expect(
        getReadyAgingShedTabs(
          racksWithReadyJobs(aging, fermentation, spice),
          NOW,
        ),
      ).toEqual(expected);
    },
  );

  it("ignores empty queues and includes a rack with both ready and pending jobs", () => {
    const racks = createInitialAgingShed().racks;
    racks.aging = [
      { id: "pending", fish: "Anchovy", startedAt: 0, readyAt: NOW + 1 },
      { id: "ready", fish: "Anchovy", startedAt: 0, readyAt: NOW - 1 },
    ];
    expect(getReadyAgingShedTabs(racks, NOW)).toEqual(["agingRack"]);
    expect(getReadyAgingShedTabs(createInitialAgingShed().racks, NOW)).toEqual(
      [],
    );
  });

  it("recomputes readiness when reopening after a job finishes", () => {
    const racks = racksWithReadyJobs(false, false, false);
    expect(getReadyAgingShedTabs(racks, NOW)).toEqual([]);
    expect(getReadyAgingShedTabs(racks, NOW + 1)[0]).toBe("agingRack");
  });
});
