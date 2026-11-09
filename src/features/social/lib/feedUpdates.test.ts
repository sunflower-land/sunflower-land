import type { Interaction, Milestone } from "../types/types";
import {
  interactionBelongsInFeed,
  mergeChatUpdate,
  mergeFeedUpdate,
  milestoneBelongsInFeed,
} from "./feedUpdates";

const FOLLOWED = 2;
const STRANGER = 3;

const interaction = (
  type: Interaction["type"],
  senderId = FOLLOWED,
  createdAt = 1_000,
): Interaction => ({
  type,
  sender: { id: senderId, username: `farm-${senderId}` },
  recipient: { id: 1, username: "me" },
  message: `${type} message`,
  createdAt,
});

const milestone = (isGlobal: boolean, senderId = FOLLOWED): Milestone => ({
  ...interaction("milestone", senderId),
  message: "Reached level 90!",
  isGlobal,
});

describe("interactionBelongsInFeed", () => {
  const following = [FOLLOWED];

  it("keeps cheers out of the Helped list", () => {
    expect(
      interactionBelongsInFeed({
        update: interaction("cheer"),
        filter: "help",
        following,
      }),
    ).toBe(false);
  });

  it("shows helps from anyone under Helped", () => {
    expect(
      interactionBelongsInFeed({
        update: interaction("help", STRANGER),
        filter: "help",
        following,
      }),
    ).toBe(true);
  });

  it("shows follows from anyone under Follows and All", () => {
    expect(
      interactionBelongsInFeed({
        update: interaction("follow", STRANGER),
        filter: "follow",
        following,
      }),
    ).toBe(true);
    expect(
      interactionBelongsInFeed({
        update: interaction("follow", STRANGER),
        filter: "all",
        following,
      }),
    ).toBe(true);
  });

  it("only shows other interactions from followed farms in All", () => {
    expect(
      interactionBelongsInFeed({
        update: interaction("cheer", FOLLOWED),
        filter: "all",
        following,
      }),
    ).toBe(true);
    expect(
      interactionBelongsInFeed({
        update: interaction("cheer", STRANGER),
        filter: "all",
        following,
      }),
    ).toBe(false);
  });

  it("only shows chats under Chat", () => {
    expect(
      interactionBelongsInFeed({
        update: interaction("chat"),
        filter: "chat",
        following,
      }),
    ).toBe(true);
    expect(
      interactionBelongsInFeed({
        update: interaction("help"),
        filter: "chat",
        following,
      }),
    ).toBe(false);
  });
});

describe("milestoneBelongsInFeed", () => {
  it("never shows milestones in a filtered list", () => {
    expect(
      milestoneBelongsInFeed({
        update: milestone(false),
        filter: "help",
        following: [FOLLOWED],
        isWorldFeed: true,
      }),
    ).toBe(false);
  });

  it("shows global milestones from anyone in the world feed", () => {
    expect(
      milestoneBelongsInFeed({
        update: milestone(true, STRANGER),
        filter: "all",
        following: [FOLLOWED],
        isWorldFeed: true,
      }),
    ).toBe(true);
  });

  it("hides global milestones from strangers outside the world feed", () => {
    expect(
      milestoneBelongsInFeed({
        update: milestone(true, STRANGER),
        filter: "all",
        following: [FOLLOWED],
        isWorldFeed: false,
      }),
    ).toBe(false);
  });
});

describe("mergeFeedUpdate", () => {
  it("prepends a new entry to the first page", () => {
    const existing = interaction("help", FOLLOWED, 500);
    const update = interaction("cheer", FOLLOWED, 1_000);

    const merged = mergeFeedUpdate(
      [{ feed: [existing], following: [FOLLOWED] }],
      update,
    );

    expect(merged).toEqual([
      { feed: [update, existing], following: [FOLLOWED] },
    ]);
  });

  it("ignores the same event delivered twice", () => {
    const update = interaction("cheer");

    const once = mergeFeedUpdate([{ feed: [], following: [] }], update);
    const twice = mergeFeedUpdate(once, { ...update });

    expect(twice).toBe(once);
    expect(twice[0].feed).toHaveLength(1);
  });

  it("ignores an event a later page already holds", () => {
    const update = interaction("help", FOLLOWED, 10);
    const pages = [
      { feed: [interaction("chat", FOLLOWED, 20)], following: [] },
      { feed: [{ ...update }], following: [] },
    ];

    expect(mergeFeedUpdate(pages, update)).toBe(pages);
  });

  it("keeps two different events from the same farm", () => {
    const help = interaction("help");
    const cheer = interaction("cheer");

    const merged = mergeFeedUpdate(
      mergeFeedUpdate([{ feed: [], following: [] }], help),
      cheer,
    );

    expect(merged[0].feed).toEqual([cheer, help]);
  });
});

describe("mergeChatUpdate", () => {
  it("ignores the same message delivered twice", () => {
    const update = interaction("chat");

    const once = mergeChatUpdate(undefined, update);
    const twice = mergeChatUpdate(once, { ...update });

    expect(twice).toEqual([[update]]);
  });
});
