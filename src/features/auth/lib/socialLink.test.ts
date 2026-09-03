import { TEST_FARM } from "features/game/lib/constants";
import {
  clearSocialLinkAttempt,
  getUrlAvailableAt,
  isSocialLinked,
  readSocialLinkAttempt,
  rememberSocialLinkAttempt,
} from "./socialLink";

describe("socialLink", () => {
  describe("isSocialLinked", () => {
    it("treats a present provider key as linked", () => {
      expect(
        isSocialLinked({ ...TEST_FARM, telegram: { linkedAt: 1 } }, "telegram"),
      ).toBe(true);
    });

    it("treats a missing provider key as not linked", () => {
      expect(
        isSocialLinked({ ...TEST_FARM, telegram: undefined }, "telegram"),
      ).toBe(false);
    });
  });

  describe("link attempt memory", () => {
    afterEach(() => clearSocialLinkAttempt());

    it("round-trips the provider", () => {
      rememberSocialLinkAttempt("twitter");
      expect(readSocialLinkAttempt()).toBe("twitter");
    });

    it("ignores values that are not a provider", () => {
      localStorage.setItem("socialLinkAttempt", "google");
      expect(readSocialLinkAttempt()).toBeUndefined();
    });

    it("clears", () => {
      rememberSocialLinkAttempt("discord");
      clearSocialLinkAttempt();
      expect(readSocialLinkAttempt()).toBeUndefined();
    });
  });

  describe("getUrlAvailableAt", () => {
    const setSearch = (search: string) => {
      window.history.replaceState({}, "", `/${search}`);
    };

    afterEach(() => setSearch(""));

    it("parses an epoch ms value", () => {
      setSearch("?error=SOCIAL_ACCOUNT_COOLDOWN&availableAt=1759467120000");
      expect(getUrlAvailableAt()).toBe(1759467120000);
    });

    it("returns undefined when absent or malformed", () => {
      setSearch("?error=SOCIAL_ACCOUNT_COOLDOWN");
      expect(getUrlAvailableAt()).toBeUndefined();

      setSearch("?availableAt=soon");
      expect(getUrlAvailableAt()).toBeUndefined();
    });
  });
});
