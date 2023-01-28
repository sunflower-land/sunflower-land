import "lib/__mocks__/configMock";
import * as config from "lib/config";
import { CROP_URL } from "./plant";

describe("image proxy server for dev environment", () => {
  const spy = jest.spyOn((config as any).default, "CONFIG", "get");
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns false if image proxy server is disabled", () => {
    spy.mockReturnValue({
      PROTECTED_IMAGE_PROXY: undefined,
      PROTECTED_IMAGE_URL: "https://sunflower-land.com/testnet-assets",
    });
    expect(CROP_URL("sunflower").startsWith("/testnet-assets")).toBe(false);
  });

  it("returns true if image proxy server is enabled", () => {
    spy.mockReturnValue({
      PROTECTED_IMAGE_PROXY: "/testnet-assets",
      PROTECTED_IMAGE_URL: "https://sunflower-land.com/testnet-assets",
    });
    expect(CROP_URL("sunflower").startsWith("/testnet-assets")).toBe(true);
  });
});
