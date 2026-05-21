import { GameState } from "features/game/types/game";
import { INITIAL_FARM } from "features/game/lib/constants";
import { isFaceVerified } from "./faceRecognition";

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
