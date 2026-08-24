import Decimal from "decimal.js-light";
import {
  CHAPTER_ARTEFACT,
  isChapterArtefact,
  shouldHideChapterArtefact,
} from "./desert";

describe("isChapterArtefact", () => {
  it.each([...new Set(Object.values(CHAPTER_ARTEFACT))])(
    "identifies %s as a chapter artefact",
    (name) => {
      expect(isChapterArtefact(name)).toBe(true);
    },
  );

  it("does not identify regular digging treasure as a chapter artefact", () => {
    expect(isChapterArtefact("Coral")).toBe(false);
  });
});

describe("shouldHideChapterArtefact", () => {
  const currentChapterArtefact = "Otter Pebble";

  it("hides an unowned artefact from a previous chapter", () => {
    expect(
      shouldHideChapterArtefact({
        name: "Scarab",
        currentChapterArtefact,
        amount: new Decimal(0),
      }),
    ).toBe(true);
  });

  it("shows an owned artefact from a previous chapter", () => {
    expect(
      shouldHideChapterArtefact({
        name: "Scarab",
        currentChapterArtefact,
        amount: new Decimal(1),
      }),
    ).toBe(false);
  });

  it("shows the current chapter artefact when it is unowned", () => {
    expect(
      shouldHideChapterArtefact({
        name: currentChapterArtefact,
        currentChapterArtefact,
        amount: new Decimal(0),
      }),
    ).toBe(false);
  });

  it("shows regular digging treasure when it is unowned", () => {
    expect(
      shouldHideChapterArtefact({
        name: "Coral",
        currentChapterArtefact,
        amount: new Decimal(0),
      }),
    ).toBe(false);
  });
});
