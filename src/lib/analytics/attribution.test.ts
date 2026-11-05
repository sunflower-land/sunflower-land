import {
  captureTouch,
  fbcFromClickId,
  FIRST_TOUCH_KEY,
  getAttributionPayload,
  LAST_TOUCH_KEY,
  readTouchFromLocation,
} from "./attribution";

const now = 1_762_000_000_000;

describe("readTouchFromLocation", () => {
  it("reads utm, sl_* and fbclid params and builds _fbc from the click id", () => {
    const touch = readTouchFromLocation(
      {
        search:
          "?utm_source=meta&utm_medium=paid_social&utm_campaign=SL%20%7C%20seasonal&utm_content=ad1&sl_cid=c1&sl_asid=as1&sl_aid=a1&sl_angle=seasonal&fbclid=CLICK",
        pathname: "/",
        hash: "#/",
      },
      "",
      now,
    );
    expect(touch).toMatchObject({
      at: now,
      utm_source: "meta",
      utm_medium: "paid_social",
      utm_campaign: "SL | seasonal",
      utm_content: "ad1",
      sl_cid: "c1",
      sl_asid: "as1",
      sl_aid: "a1",
      sl_angle: "seasonal",
      fbclid: "CLICK",
      fbc: fbcFromClickId("CLICK", now),
    });
    expect(touch?.landing_path).toContain("/?utm_source=meta");
  });

  it("reads params placed after the hash too", () => {
    const touch = readTouchFromLocation(
      { search: "", pathname: "/", hash: "#/?utm_source=tiktok" },
      "",
      now,
    );
    expect(touch?.utm_source).toBe("tiktok");
  });

  it("is undefined for a plain load with no referrer", () => {
    expect(
      readTouchFromLocation({ search: "", pathname: "/", hash: "#/" }, "", now),
    ).toBeUndefined();
  });

  it("counts an external referrer as a touch, but not our own host", () => {
    expect(
      readTouchFromLocation(
        { search: "", pathname: "/", hash: "" },
        "https://www.reddit.com/r/SunflowerLand",
        now,
      ),
    ).toMatchObject({ referrer: "https://www.reddit.com/r/SunflowerLand" });
    expect(
      readTouchFromLocation(
        { search: "", pathname: "/", hash: "" },
        `http://${window.location.hostname}/`,
        now,
      ),
    ).toBeUndefined();
  });

  it("clips absurd values", () => {
    const touch = readTouchFromLocation(
      { search: `?fbclid=${"x".repeat(2000)}`, pathname: "/", hash: "" },
      "",
      now,
    );
    expect(touch?.fbclid).toHaveLength(512);
  });
});

describe("captureTouch / getAttributionPayload", () => {
  const setUrl = (search: string) => {
    window.history.replaceState({}, "", `/${search}`);
  };
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "_fbp=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUrl("");
  });

  it("freezes the first touch and keeps updating the last touch", () => {
    setUrl("?utm_source=meta&sl_aid=a1");
    captureTouch(now);
    setUrl("");
    captureTouch(now + 1000); // plain navigation: no change
    setUrl("?utm_source=google&utm_medium=cpc");
    captureTouch(now + 2000);

    const first = JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY)!);
    const last = JSON.parse(localStorage.getItem(LAST_TOUCH_KEY)!);
    expect(first).toMatchObject({ at: now, utm_source: "meta", sl_aid: "a1" });
    expect(last).toMatchObject({
      at: now + 2000,
      utm_source: "google",
      utm_medium: "cpc",
    });
  });

  it("refreshes cookies onto both touches at signup and carries consent", () => {
    setUrl("?utm_source=meta");
    captureTouch(now);
    document.cookie = "_fbp=fb.1.123.456";
    const payload = getAttributionPayload(true);
    expect(payload.first_touch).toMatchObject({
      utm_source: "meta",
      fbp: "fb.1.123.456",
    });
    expect(payload.last_touch?.fbp).toBe("fb.1.123.456");
    expect(payload.consent).toBe(true);
  });

  it("sends only consent when there was never a touch", () => {
    expect(getAttributionPayload(false)).toEqual({
      first_touch: undefined,
      last_touch: undefined,
      consent: false,
    });
  });
});
