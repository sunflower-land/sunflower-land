import type { FaceRecognitionEvent, GameState } from "features/game/types/game";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  faceCooldownUntil,
  getFaceRecognitionAttemptsLeft,
  isFaceVerified,
} from "./faceRecognition";

describe("isFaceVerified", () => {
  it("returns true when game.verified is true, regardless of faceRecognition", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      verified: true,
    };

    expect(isFaceVerified({ game })).toBe(true);
  });

  it("returns true when game.verified is true even with no successful history", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      verified: true,
      faceRecognition: {
        history: [{ event: "failed", createdAt: 1_000_000, confidence: 0.1 }],
      },
    };

    expect(isFaceVerified({ game })).toBe(true);
  });

  it("returns false when faceRecognition is undefined and not verified", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: undefined,
    };

    expect(isFaceVerified({ game })).toBe(false);
  });

  it("returns false when history is empty", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: { history: [] },
    };

    expect(isFaceVerified({ game })).toBe(false);
  });

  it("returns true when the latest event is 'succeeded'", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: {
        history: [
          { event: "failed", createdAt: 1_000_000, confidence: 0.1 },
          { event: "succeeded", createdAt: 2_000_000, confidence: 0.99 },
        ],
      },
    };

    expect(isFaceVerified({ game })).toBe(true);
  });

  it("returns false when the latest event is 'failed'", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: {
        history: [
          { event: "succeeded", createdAt: 1_000_000, confidence: 0.99 },
          { event: "failed", createdAt: 2_000_000, confidence: 0.1 },
        ],
      },
    };

    expect(isFaceVerified({ game })).toBe(false);
  });

  it("returns false when the latest event is 'duplicate'", () => {
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: {
        history: [
          { event: "succeeded", createdAt: 1_000_000, confidence: 0.99 },
          {
            event: "duplicate",
            createdAt: 2_000_000,
            duplicates: [{ similarity: 99, faceId: "face-1", farmId: 42 }],
          },
        ],
      },
    };

    expect(isFaceVerified({ game })).toBe(false);
  });

  it("returns false when the latest event is 'ownerChanged'", () => {
    // After an ownership change, the appended `ownerChanged` event
    // supersedes any prior `succeeded` entry — the new owner has not
    // proven they are the same person.
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: {
        history: [
          { event: "succeeded", createdAt: 1_000_000, confidence: 0.99 },
          { event: "ownerChanged", createdAt: 2_000_000 },
        ],
      },
    };

    expect(isFaceVerified({ game })).toBe(false);
  });

  it("resolves createdAt ties in favour of the entry appended later", () => {
    // Append-only history: when two entries share the same
    // millisecond, the one appended later wins so an `ownerChanged`
    // appended right after a `succeeded` still flips to unverified.
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: {
        history: [
          { event: "succeeded", createdAt: 1_000_000, confidence: 0.99 },
          { event: "ownerChanged", createdAt: 1_000_000 },
        ],
      },
    };

    expect(isFaceVerified({ game })).toBe(false);
  });

  it("does not mutate the history array", () => {
    const history = [
      { event: "ownerChanged" as const, createdAt: 3_000_000 },
      { event: "failed" as const, createdAt: 1_000_000, confidence: 0.1 },
      { event: "succeeded" as const, createdAt: 2_000_000, confidence: 0.99 },
    ];
    const snapshot = [...history];
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: { history },
    };

    isFaceVerified({ game });

    expect(game.faceRecognition?.history).toEqual(snapshot);
  });

  it("determines the latest event by createdAt, not by array order", () => {
    // The 'succeeded' entry has the highest createdAt, so the user
    // should be verified even if it appears earlier in the array.
    const game: GameState = {
      ...INITIAL_FARM,
      verified: false,
      faceRecognition: {
        history: [
          { event: "succeeded", createdAt: 3_000_000, confidence: 0.99 },
          { event: "failed", createdAt: 1_000_000, confidence: 0.1 },
          { event: "failed", createdAt: 2_000_000, confidence: 0.1 },
        ],
      },
    };

    expect(isFaceVerified({ game })).toBe(true);
  });
});

const HOUR = 60 * 60 * 1000;
const NOW = 100 * HOUR;

const failed = (createdAt: number): FaceRecognitionEvent => ({
  event: "failed",
  createdAt,
  confidence: 0.1,
});
const duplicate = (createdAt: number): FaceRecognitionEvent => ({
  event: "duplicate",
  createdAt,
  duplicates: [{ similarity: 99, faceId: "face-1", farmId: 42 }],
});
const succeeded = (createdAt: number): FaceRecognitionEvent => ({
  event: "succeeded",
  createdAt,
  confidence: 0.99,
});

const withHistory = (
  history: NonNullable<GameState["faceRecognition"]>["history"],
) =>
  ({
    ...INITIAL_FARM,
    verified: false,
    faceRecognition: { history },
  }) as GameState;

describe("getFaceRecognitionAttemptsLeft", () => {
  it("gives the full allowance with no history", () => {
    const game: GameState = { ...INITIAL_FARM, faceRecognition: undefined };

    expect(getFaceRecognitionAttemptsLeft({ game, now: NOW })).toBe(5);
  });

  it("only counts failed and duplicate attempts", () => {
    const game = withHistory([
      succeeded(NOW - 5 * HOUR),
      { event: "ownerChanged", createdAt: NOW - 4 * HOUR },
      failed(NOW - 2 * HOUR),
      duplicate(NOW - 1 * HOUR),
    ]);

    expect(getFaceRecognitionAttemptsLeft({ game, now: NOW })).toBe(3);
  });

  it("ignores failed attempts older than 24 hours", () => {
    const game = withHistory([
      failed(NOW - 30 * HOUR),
      duplicate(NOW - 25 * HOUR),
      failed(NOW - 1 * HOUR),
    ]);

    expect(getFaceRecognitionAttemptsLeft({ game, now: NOW })).toBe(4);
  });

  it("never goes below zero", () => {
    const game = withHistory(
      Array.from({ length: 7 }, (_, i) => failed(NOW - i * HOUR)),
    );

    expect(getFaceRecognitionAttemptsLeft({ game, now: NOW })).toBe(0);
  });
});

describe("faceCooldownUntil", () => {
  it("has no cooldown with no history", () => {
    const game: GameState = { ...INITIAL_FARM, faceRecognition: undefined };

    expect(faceCooldownUntil({ game, now: NOW })).toBe(0);
  });

  it("does not count successful scans and owner changes as attempts", () => {
    // A farm that has verified several times before only needs one
    // failed scan to reach five history entries
    const game = withHistory([
      succeeded(NOW - 400 * HOUR),
      succeeded(NOW - 300 * HOUR),
      succeeded(NOW - 200 * HOUR),
      { event: "ownerChanged", createdAt: NOW - 100 * HOUR },
      failed(NOW - 1 * HOUR),
    ]);

    expect(faceCooldownUntil({ game, now: NOW })).toBe(0);
  });

  it("does not count failed attempts before the last successful scan", () => {
    const game = withHistory([
      failed(NOW - 5 * HOUR),
      failed(NOW - 4 * HOUR),
      failed(NOW - 3 * HOUR),
      failed(NOW - 2 * HOUR),
      succeeded(NOW - 1.5 * HOUR),
      failed(NOW - 1 * HOUR),
    ]);

    expect(faceCooldownUntil({ game, now: NOW })).toBe(0);
    expect(getFaceRecognitionAttemptsLeft({ game, now: NOW })).toBe(4);
  });

  it("does not count failed attempts older than 24 hours", () => {
    const game = withHistory([
      failed(NOW - 50 * HOUR),
      failed(NOW - 49 * HOUR),
      duplicate(NOW - 48 * HOUR),
      failed(NOW - 47 * HOUR),
      failed(NOW - 1 * HOUR),
    ]);

    expect(faceCooldownUntil({ game, now: NOW })).toBe(0);
  });

  it("applies a cooldown after five failed attempts within 24 hours", () => {
    const game = withHistory([
      succeeded(NOW - 400 * HOUR),
      failed(NOW - 5 * HOUR),
      duplicate(NOW - 4 * HOUR),
      failed(NOW - 3 * HOUR),
      failed(NOW - 2 * HOUR),
      failed(NOW - 1 * HOUR),
    ]);

    // Ends once the oldest of the five attempts is 24 hours old
    expect(faceCooldownUntil({ game, now: NOW })).toBe(NOW + 19 * HOUR);
  });

  it("uses the five most recent attempts regardless of array order", () => {
    const game = withHistory([
      failed(NOW - 1 * HOUR),
      failed(NOW - 5 * HOUR),
      failed(NOW - 3 * HOUR),
      failed(NOW - 2 * HOUR),
      failed(NOW - 4 * HOUR),
      failed(NOW - 6 * HOUR),
    ]);

    expect(faceCooldownUntil({ game, now: NOW })).toBe(NOW + 19 * HOUR);
  });

  it("lifts the cooldown once an attempt leaves the 24 hour window", () => {
    const game = withHistory([
      failed(NOW - 5 * HOUR),
      failed(NOW - 4 * HOUR),
      failed(NOW - 3 * HOUR),
      failed(NOW - 2 * HOUR),
      failed(NOW - 1 * HOUR),
    ]);

    const later = NOW + 19 * HOUR;

    expect(faceCooldownUntil({ game, now: later })).toBe(0);
    expect(getFaceRecognitionAttemptsLeft({ game, now: later })).toBe(1);
  });
});
