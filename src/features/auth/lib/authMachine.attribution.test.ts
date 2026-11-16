import { interpret } from "xstate";
import { CONFIG } from "lib/config";

jest.mock("lib/moonforgeTutorial", () => ({
  TUTORIAL_STEPS: ["auth", "login", "expand_to_3_land"],
  trackTutorialStep: jest.fn(),
}));
jest.mock("lib/onboardingAnalytics", () => ({
  onboardingAnalytics: { logEvent: jest.fn() },
}));
jest.mock("lib/analytics/meta", () => ({
  META_EVENT_IDS: { completeRegistration: (id: number) => `signup-${id}` },
  trackMetaEvent: jest.fn(),
}));
jest.mock("features/auth/actions/login", () => ({
  login: jest.fn(async () => ({ token: "token" })),
  decodeToken: jest.fn(() => ({ farmId: undefined })),
}));
jest.mock("features/auth/actions/signup", () => ({
  signUp: jest.fn(async () => ({ token: "new-token", farm: { id: 77 } })),
}));
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

(CONFIG as unknown as { API_URL: string }).API_URL = "https://api.test";

/* eslint-disable @typescript-eslint/no-require-imports */
const { signUp } = require("features/auth/actions/signup");
const { trackMetaEvent } = require("lib/analytics/meta");
const { FIRST_TOUCH_KEY } = require("lib/analytics/attribution");
const { setConsent } = require("lib/analytics/consent");
const { authMachine } = require("./authMachine");
/* eslint-enable @typescript-eslint/no-require-imports */

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("authMachine attribution at signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("captures the landing touch on load, sends it with signup and mirrors CompleteRegistration", async () => {
    window.history.replaceState(
      {},
      "",
      "/?utm_source=meta&utm_medium=paid_social&sl_cid=c1&sl_aid=ad1&sl_angle=cozy&fbclid=CLICK",
    );
    setConsent(true, "banner");

    const service = interpret(
      authMachine.withConfig({
        actions: {
          assignToken: () => undefined,
          saveToken: () => undefined,
          setTransactionId: () => undefined,
        },
      }),
    ).start();

    // idle.entry ran captureTouch(): first touch is frozen in storage.
    const first = JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY)!);
    expect(first).toMatchObject({
      utm_source: "meta",
      sl_aid: "ad1",
      sl_angle: "cozy",
      fbclid: "CLICK",
    });

    // Drive the machine straight into account creation.
    const creating = authMachine.withConfig({
      actions: {
        assignToken: () => undefined,
        saveToken: () => undefined,
        setTransactionId: () => undefined,
      },
    });
    service.stop();
    const svc = interpret(creating).start("noAccount");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svc.send({ type: "CREATE_FARM", equipment: {} } as any);
    await flush();
    await flush();

    expect(signUp).toHaveBeenCalledTimes(1);
    const args = signUp.mock.calls[0][0];
    expect(args.utm).toMatchObject({ source: "meta", medium: "paid_social" });
    expect(args.attribution.first_touch).toMatchObject({
      sl_cid: "c1",
      sl_aid: "ad1",
    });
    expect(args.attribution.consent).toBe(true);
    expect(trackMetaEvent).toHaveBeenCalledWith(
      "CompleteRegistration",
      "signup-77",
    );
    expect(svc.getSnapshot().value).toBe("connected");
    svc.stop();
  });
});
