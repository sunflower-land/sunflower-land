import { INITIAL_FARM } from "features/game/lib/constants";
import { startChapter } from "./startChapter";
import Decimal from "decimal.js-light";

describe("chapter.started", () => {
  it("requries chapter not already started", () => {
    expect(() =>
      startChapter({
        action: { type: "chapter.started" },
        state: {
          ...INITIAL_FARM,
          chapter: { name: "Paw Prints", boughtAt: {} },
        },
        createdAt: new Date("2026-01-01").getTime(),
      }),
    ).toThrow("Chapter already started");
  });

  it("starts the chapter", () => {
    const state = startChapter({
      action: { type: "chapter.started" },
      state: { ...INITIAL_FARM },
      createdAt: new Date("2026-01-01").getTime(),
    });

    expect(state.chapter).toEqual({ name: "Paw Prints", boughtAt: {} });
  });

  it("removes surges", () => {
    const state = startChapter({
      action: { type: "chapter.started" },
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Chapter Surge": new Decimal(1),
        },
        chapter: {
          name: "Better Together",
          boughtAt: {},
          surge: { power: 10 },
        },
      },
      createdAt: new Date("2026-01-01").getTime(),
    });

    expect(state.chapter).toEqual({ name: "Paw Prints", boughtAt: {} });
    expect(state.inventory["Chapter Surge"]).toBeUndefined();
  });
});
