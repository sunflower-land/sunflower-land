/**
 * @jest-environment-options {"url": "https://sunflower-land.com/play/"}
 */
import { isValidRedirect } from "./portalUtil";

describe("isValidRedirect", () => {
  it("accepts sunflower-land.com", () => {
    expect(isValidRedirect("https://sunflower-land.com")).toBe(true);
  });

  it("accepts a subdomain of sunflower-land.com", () => {
    expect(isValidRedirect("https://chicken-rescue.sunflower-land.com")).toBe(
      true,
    );
  });

  it("accepts a nested subdomain with a path", () => {
    expect(
      isValidRedirect("https://portal.testnet.sunflower-land.com/play/"),
    ).toBe(true);
  });

  it("accepts a local development server", () => {
    expect(isValidRedirect("http://localhost:3001")).toBe(true);
  });

  it("rejects a host that only starts with sunflower-land.com", () => {
    expect(isValidRedirect("https://sunflower-land.com.example.org")).toBe(
      false,
    );
  });

  it("rejects a host that only ends with sunflower-land.com", () => {
    expect(isValidRedirect("https://notsunflower-land.com")).toBe(false);
  });

  it("rejects sunflower-land.com used as credentials for another host", () => {
    expect(isValidRedirect("https://sunflower-land.com@example.org")).toBe(
      false,
    );
  });

  it("rejects localhost used as credentials for another host", () => {
    expect(isValidRedirect("http://localhost:3001@example.org")).toBe(false);
  });

  it("rejects sunflower-land.com over http", () => {
    expect(isValidRedirect("http://sunflower-land.com")).toBe(false);
  });

  it("rejects localhost over https", () => {
    expect(isValidRedirect("https://localhost:3001")).toBe(false);
  });

  it("rejects a non-http scheme", () => {
    expect(isValidRedirect("javascript:alert(1)")).toBe(false);
  });

  it("rejects a value that is not a URL", () => {
    expect(isValidRedirect("sunflower-land.com")).toBe(false);
  });

  it("rejects an empty value", () => {
    expect(isValidRedirect("")).toBe(false);
  });
});
