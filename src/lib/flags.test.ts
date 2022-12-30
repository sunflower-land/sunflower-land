import "./__mocks__/configMock";
import Decimal from "decimal.js-light";
import { hasBetaAccess } from "./flags";

describe("hasBetaAccess", () => {
  it("returns true for a beta feature if the player has a beta pass", () => {
    expect(hasBetaAccess({ "Beta Pass": new Decimal(1) })).toBe(true);
  });

  it("returns false for a beta feature if the player does not have a beta pass", () => {
    expect(hasBetaAccess({})).toBe(false);
  });
});
