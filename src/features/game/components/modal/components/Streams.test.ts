import { STREAMS_CONFIG, getNextStreamTime } from "./Streams";

const wednesday = {
  schedule: {
    day: STREAMS_CONFIG.wednesday.day,
    hour: STREAMS_CONFIG.wednesday.startHour,
    minute: STREAMS_CONFIG.wednesday.startMinute,
  },
  options: {
    intervalWeeks: STREAMS_CONFIG.wednesday.intervalWeeks,
    anchorDate: STREAMS_CONFIG.wednesday.anchorDate,
  },
};

const friday = {
  schedule: {
    day: STREAMS_CONFIG.friday.day,
    hour: STREAMS_CONFIG.friday.startHour,
    minute: STREAMS_CONFIG.friday.startMinute,
  },
  options: {
    intervalWeeks: STREAMS_CONFIG.friday.intervalWeeks,
    anchorDate: STREAMS_CONFIG.friday.anchorDate,
  },
};

describe("getNextStreamTime", () => {
  it("keeps the Sydney wall-clock time when the next stream is across the DST boundary", () => {
    // 16:30 AEST on Wed 30 Sep 2026: today's stream has ended, Sydney enters
    // daylight saving on 4 Oct, so the next stream (14 Oct) is 15:30 AEDT.
    const now = Date.parse("2026-09-30T06:30:00Z");

    const { startTime, isOngoing } = getNextStreamTime(wednesday.schedule, {
      ...wednesday.options,
      now,
    });

    expect(isOngoing).toBe(false);
    expect(new Date(startTime).toISOString()).toBe("2026-10-14T04:30:00.000Z");
  });

  it("reports the stream as ongoing during the hour after it starts", () => {
    // 15:45 AEST on Wed 30 Sep 2026 (an on-week)
    const now = Date.parse("2026-09-30T05:45:00Z");

    const { startTime, isOngoing } = getNextStreamTime(wednesday.schedule, {
      ...wednesday.options,
      now,
    });

    expect(isOngoing).toBe(true);
    expect(new Date(startTime).toISOString()).toBe("2026-09-30T05:30:00.000Z");
  });

  it("skips off weeks of a bi-weekly stream", () => {
    // Mon 5 Oct 2026 (AEDT): Wed 7 Oct is an off week, so the next is 14 Oct
    const now = Date.parse("2026-10-05T00:00:00Z");

    const { startTime, isOngoing } = getNextStreamTime(wednesday.schedule, {
      ...wednesday.options,
      now,
    });

    expect(isOngoing).toBe(false);
    expect(new Date(startTime).toISOString()).toBe("2026-10-14T04:30:00.000Z");
  });

  it("schedules the Friday stream at 11:00 Sydney", () => {
    // Mon 5 Oct 2026 (AEDT): Fri 9 Oct is an on week, 11:00 AEDT = 00:00 UTC
    const now = Date.parse("2026-10-05T00:00:00Z");

    const { startTime } = getNextStreamTime(friday.schedule, {
      ...friday.options,
      now,
    });

    expect(new Date(startTime).toISOString()).toBe("2026-10-09T00:00:00.000Z");
  });

  it("skips NO_STREAM_DATES", () => {
    // Mon 22 Dec 2025 (AEDT): Fri 26 Dec is Boxing Day, so skip to 2 Jan
    const now = Date.parse("2025-12-22T00:00:00Z");

    const { startTime } = getNextStreamTime(
      { day: 5, hour: 11, minute: 0 },
      { now },
    );

    expect(new Date(startTime).toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });
});
