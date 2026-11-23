import { TEST_FARM } from "features/game/lib/constants";
import { createEffectError, postEffect, stripRemovedStateKeys } from "./effect";
import { secureFetch } from "lib/requestToken";
import { ERRORS } from "lib/errors";

jest.mock("lib/requestToken", () => ({
  ...jest.requireActual("lib/requestToken"),
  secureFetch: jest.fn(),
}));

describe("postEffect", () => {
  it("keeps the request details on an unexpected response", async () => {
    (secureFetch as jest.Mock).mockResolvedValue({ status: 500, ok: false });

    await expect(
      postEffect({
        farmId: 1,
        token: "token",
        transactionId: "tx-1",
        effect: { type: "layout.deleted" },
      } as unknown as Parameters<typeof postEffect>[0]),
    ).rejects.toMatchObject({
      message: ERRORS.EFFECT_SERVER_ERROR,
      status: 500,
      endpoint: "POST /event",
      transactionId: "tx-1",
    });
  });
});

describe("postEffect expected outcomes", () => {
  const post = () =>
    postEffect({
      farmId: 1,
      token: "token",
      transactionId: "tx-1",
      effect: { type: "layout.deleted" },
    } as unknown as Parameters<typeof postEffect>[0]);

  it.each([
    [401, undefined, ERRORS.SESSION_EXPIRED],
    [409, undefined, ERRORS.MULTIPLE_DEVICES_OPEN],
    [503, { message: "Temporary maintenance" }, ERRORS.MAINTENANCE],
  ])("names what a %i means", async (status, body, outcome) => {
    (secureFetch as jest.Mock).mockResolvedValue({
      status,
      ok: false,
      json: async () => body,
    });

    await expect(post()).rejects.toMatchObject({
      message: ERRORS.EFFECT_SERVER_ERROR,
      status,
      meta: { outcome },
    });
  });

  it("leaves an unplanned 503 as a plain failure", async () => {
    (secureFetch as jest.Mock).mockResolvedValue({
      status: 503,
      ok: false,
      json: async () => ({}),
    });

    const error = await post().catch((e) => e);

    expect(error.status).toBe(503);
    expect(error.meta).toBeUndefined();
  });
});

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
