import { canInstantHarvestSaltNode, getSaltNodeSprite } from "./saltNodeStage";
import saltNodeEmpty from "assets/buildings/salt/salt_node_empty.png";
import saltNodeStage1 from "assets/buildings/salt/salt_node_stage_1.png";
import saltNodeStage2 from "assets/buildings/salt/salt_node_stage_2.png";
import saltNodeStage3 from "assets/buildings/salt/salt_node_stage_3.png";

describe("getSaltNodeSprite", () => {
  it("maps charge counts to expected stage sprites", () => {
    expect(getSaltNodeSprite(0)).toBe(saltNodeEmpty);
    expect(getSaltNodeSprite(1)).toBe(saltNodeStage1);
    expect(getSaltNodeSprite(2)).toBe(saltNodeStage2);
    expect(getSaltNodeSprite(3)).toBe(saltNodeStage3);
    expect(getSaltNodeSprite(5)).toBe(saltNodeStage3);
  });
});

describe("canInstantHarvestSaltNode", () => {
  it("returns true only when not visiting and charges/rakes are available", () => {
    expect(
      canInstantHarvestSaltNode({
        visiting: false,
        storedCharges: 1,
        availableRakes: 1,
      }),
    ).toBe(true);

    expect(
      canInstantHarvestSaltNode({
        visiting: true,
        storedCharges: 1,
        availableRakes: 1,
      }),
    ).toBe(false);

    expect(
      canInstantHarvestSaltNode({
        visiting: false,
        storedCharges: 0,
        availableRakes: 1,
      }),
    ).toBe(false);

    expect(
      canInstantHarvestSaltNode({
        visiting: false,
        storedCharges: 1,
        availableRakes: 0,
      }),
    ).toBe(false);
  });
});
