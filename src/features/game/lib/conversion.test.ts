import { getItemUnit } from "./conversion";

describe("getItemUnit", () => {
  it("uses 18 decimals for resources", () => {
    expect(getItemUnit("Wood")).toEqual("ether");
    expect(getItemUnit("Leather")).toEqual("ether");
  });

  it("uses 18 decimals for the beetles and their feeds", () => {
    // Their metadata declares 18 decimals, so a "wei" unit here would move
    // 1 base unit instead of 10^18 on deposit/withdraw.
    expect(getItemUnit("Brown Beetle")).toEqual("ether");
    expect(getItemUnit("Amber Beetle")).toEqual("ether");
    expect(getItemUnit("Mud")).toEqual("ether");
    expect(getItemUnit("Rawhide")).toEqual("ether");
    expect(getItemUnit("Truffle")).toEqual("ether");
    expect(getItemUnit("Brown Beetle Feed")).toEqual("ether");
    expect(getItemUnit("Amber Beetle Feed")).toEqual("ether");
  });

  it("uses 1 decimal for collectibles", () => {
    expect(getItemUnit("Abandoned Bear")).toEqual("wei");
  });
});
