import { interpret } from "xstate";
import { CONFIG } from "lib/config";

jest.mock("lib/moonforgeTutorial", () => ({
  TUTORIAL_STEPS: ["auth", "login", "expand_to_3_land"],
  trackTutorialStep: jest.fn(),
}));

jest.mock("lib/onboardingAnalytics", () => ({
  onboardingAnalytics: { logEvent: jest.fn() },
}));

// authMachine transitively imports @wagmi/core, which ships ESM that this
// repo's jest transform cannot parse. Only the auth transitions are under
// test here, so the wallet/network layer is stubbed out.
jest.mock("features/auth/actions/login", () => ({
  login: jest.fn(async () => ({ token: "token" })),
  decodeToken: jest.fn(() => ({ farmId: 1 })),
}));
jest.mock("features/auth/actions/signup", () => ({ signUp: jest.fn() }));
jest.mock("features/auth/actions/claimFarm", () => ({ claimFarm: jest.fn() }));
jest.mock("features/auth/actions/createAccount", () => ({
  saveReferrerId: jest.fn(),
  getReferrerId: jest.fn(),
}));
jest.mock("features/auth/actions/social", () => ({
  getToken: jest.fn(() => null),
  removeJWT: jest.fn(),
  saveJWT: jest.fn(),
}));
jest.mock("features/world/ui/community/actions/portal", () => ({
  removeMinigameJWTs: jest.fn(),
}));

// ART_MODE (no API_URL) short-circuits the machine straight to `connected`,
// making the welcome -> authorising flow unreachable. It is read once at
// module load, so this must happen before authMachine is required.
(CONFIG as unknown as { API_URL: string }).API_URL = "https://api.test";

/* eslint-disable @typescript-eslint/no-require-imports */
const { trackTutorialStep } = require("lib/moonforgeTutorial");
const { authMachine } = require("./authMachine");
/* eslint-enable @typescript-eslint/no-require-imports */

/**
 * `tutorial_step_completed` used to fire on the SIGN_IN / SIGNUP transitions -
 * i.e. the instant the button was pressed, before any wallet connected or any
 * account existed. Every abandoned or failed auth attempt counted as a
 * completed tutorial step, inflating every rate downstream of it.
 */
describe("authMachine tutorial instrumentation", () => {
  const startAtWelcome = (loginResult: () => Promise<{ token: string }>) =>
    interpret(
      authMachine.withConfig({
        services: { login: loginResult },
        actions: { assignToken: () => undefined, saveToken: () => undefined },
      }),
    ).start();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not report the auth step when the player merely presses sign in", () => {
    const service = startAtWelcome(async () => ({ token: "token" }));

    expect(service.getSnapshot().value).toBe("welcome");

    service.send({ type: "SIGN_IN" });

    expect(service.getSnapshot().value).toBe("signIn");
    expect(trackTutorialStep).not.toHaveBeenCalled();

    service.stop();
  });

  it("reports the auth step once a token actually exists", async () => {
    const service = startAtWelcome(async () => ({ token: "token" }));

    service.send({ type: "SIGN_IN" });
    service.send({ type: "CONNECTED" });

    await new Promise((r) => setTimeout(r, 0));

    expect(service.getSnapshot().value).toBe("verifying");
    expect(trackTutorialStep).toHaveBeenCalledTimes(1);
    expect(trackTutorialStep).toHaveBeenCalledWith("auth", {
      method: "wallet",
    });

    service.stop();
  });

  it("reports method 'account' for the signup branch", async () => {
    const service = startAtWelcome(async () => ({ token: "token" }));

    service.send({ type: "SIGNUP" });
    service.send({ type: "CONNECTED" });

    await new Promise((r) => setTimeout(r, 0));

    expect(trackTutorialStep).toHaveBeenCalledWith("auth", {
      method: "account",
    });

    service.stop();
  });

  it("reports nothing when authentication fails", async () => {
    const service = startAtWelcome(async () => {
      throw new Error("wallet refused");
    });

    service.send({ type: "SIGN_IN" });
    service.send({ type: "CONNECTED" });

    await new Promise((r) => setTimeout(r, 0));

    expect(service.getSnapshot().value).toBe("unauthorised");
    expect(trackTutorialStep).not.toHaveBeenCalled();

    service.stop();
  });
});
