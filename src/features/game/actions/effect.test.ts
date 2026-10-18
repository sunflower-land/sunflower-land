import { TEST_FARM } from "features/game/lib/constants";
import { createEffectError, stripRemovedStateKeys } from "./effect";

describe("stripRemovedStateKeys", () => {
  const linked = {
    ...TEST_FARM,
    telegram: { linkedAt: 1 },
    discord: { connected: true, verified: false },
    twitter: { username: "farmer", linkedAt: 1 },
  };

  it("drops the provider key an unlink effect removed server-side", () => {
    const result = stripRemovedStateKeys({ type: "telegram.unlinked" }, linked);

    expect(result.telegram).toBeUndefined();
    // Untouched siblings survive the merge
    expect(result.discord).toEqual(linked.discord);
    expect(result.twitter).toEqual(linked.twitter);
  });

  it("only removes the key for the effect's own provider", () => {
    expect(
      stripRemovedStateKeys({ type: "discord.unlinked" }, linked).discord,
    ).toBeUndefined();
    expect(
      stripRemovedStateKeys({ type: "twitter.unlinked" }, linked).twitter,
    ).toBeUndefined();
  });

  it("leaves state alone for effects that remove nothing", () => {
    const result = stripRemovedStateKeys({ type: "telegram.linked" }, linked);

    expect(result).toBe(linked);
  });

  it("does not mutate the input", () => {
    stripRemovedStateKeys({ type: "telegram.unlinked" }, linked);

    expect(linked.telegram).toBeDefined();
  });
});

describe("createEffectError", () => {
  it("keeps the error code as the message and carries the detail", () => {
    const error = createEffectError("SOCIAL_ACCOUNT_COOLDOWN", {
      availableAt: 1759467120000,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("SOCIAL_ACCOUNT_COOLDOWN");
    expect(error.data).toEqual({ availableAt: 1759467120000 });
  });
});
