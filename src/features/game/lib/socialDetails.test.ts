import { resolveSocialDetails } from "./socialDetails";
import { SocialDetails } from "../actions/loadSession";

const existing: SocialDetails = {
  provider: "google",
  sub: "google-sub-1234",
  email: "tester@example.com",
};
const incoming: SocialDetails = {
  provider: "google",
  sub: "google-sub-9999",
  email: "linked@example.com",
};

describe("resolveSocialDetails", () => {
  it("keeps the current value when data is undefined", () => {
    expect(resolveSocialDetails(undefined, existing)).toBe(existing);
  });

  it("keeps the current value when data is null", () => {
    expect(resolveSocialDetails(null, existing)).toBe(existing);
  });

  it("keeps the current value when data is a string (would-throw guard)", () => {
    expect(resolveSocialDetails("oops", existing)).toBe(existing);
  });

  it("keeps the current value when data is a number", () => {
    expect(resolveSocialDetails(42, existing)).toBe(existing);
  });

  it("keeps the current value when data is an object without socialDetails", () => {
    expect(resolveSocialDetails({ linkedWallet: "0xabc" }, existing)).toBe(
      existing,
    );
  });

  it("returns the new socialDetails when the payload explicitly includes one", () => {
    expect(resolveSocialDetails({ socialDetails: incoming }, existing)).toEqual(
      incoming,
    );
  });

  it("clears to undefined when the payload sets socialDetails to null (unlink signal)", () => {
    expect(
      resolveSocialDetails({ socialDetails: null }, existing),
    ).toBeUndefined();
  });

  it("clears to undefined when the payload sets socialDetails to undefined explicitly", () => {
    expect(
      resolveSocialDetails({ socialDetails: undefined }, existing),
    ).toBeUndefined();
  });

  it("works with no current value", () => {
    expect(
      resolveSocialDetails({ socialDetails: incoming }, undefined),
    ).toEqual(incoming);
    expect(resolveSocialDetails(undefined, undefined)).toBeUndefined();
  });
});
