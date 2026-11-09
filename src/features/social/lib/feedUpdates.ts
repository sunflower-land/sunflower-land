import type { Interaction, Milestone } from "../types/types";
import type { FeedFilter } from "../Feed";

export type FeedPage = { feed: Interaction[]; following: number[] };

/**
 * Identifies one feed entry. Realtime pushes carry no database id, so fall
 * back to the fields that pin an event down; the API stores interactions with
 * the same `createdAt` it pushes, so a pushed entry and its fetched copy match.
 */
export const getInteractionKey = (interaction: Interaction) =>
  interaction.id ??
  `${interaction.type}-${interaction.sender?.id}-${interaction.createdAt}-${interaction.message}`;

/**
 * Whether a realtime interaction belongs in the list for `filter`. Mirrors the
 * API's feed query (`getReceivedInteractions`), so an entry pushed live is one
 * the next refetch would also return, rather than one that vanishes on reload
 * (or a cheer showing up under "Helped").
 */
export const interactionBelongsInFeed = ({
  update,
  filter,
  following,
}: {
  update: Interaction;
  filter: FeedFilter;
  following: number[];
}) => {
  const isFollowing = following.includes(update.sender?.id);

  switch (filter) {
    case "all":
      return update.type === "follow" || isFollowing;
    case "help":
      return update.type === "help";
    case "follow":
      return update.type === "follow";
    case "chat":
    case "cheer":
      return update.type === filter && isFollowing;
  }
};

/**
 * Whether a realtime milestone belongs in the list for `filter`. The API only
 * returns milestones in the unfiltered feed, and global milestones from farms
 * you do not follow only in the world feed.
 */
export const milestoneBelongsInFeed = ({
  update,
  filter,
  following,
  isWorldFeed,
}: {
  update: Milestone;
  filter: FeedFilter;
  following: number[];
  isWorldFeed: boolean;
}) => {
  if (filter !== "all") return false;
  if (!update.isGlobal) return true;

  return isWorldFeed || following.includes(update.sender?.id);
};

/**
 * Prepend a realtime entry to the first page, unless any page already holds
 * it. The socket can deliver the same event more than once (reconnects, a
 * refetch that already returned it), and each copy used to be prepended.
 */
export const mergeFeedUpdate = (
  current: FeedPage[] | undefined,
  update: Interaction,
): FeedPage[] => {
  if (!current || current.length === 0) {
    return [{ feed: [update], following: [] }];
  }

  const key = getInteractionKey(update);
  const exists = current.some((page) =>
    page?.feed?.some((interaction) => getInteractionKey(interaction) === key),
  );

  if (exists) return current;

  return [
    {
      feed: [update, ...(current[0]?.feed ?? [])],
      following: current[0]?.following ?? [],
    },
    ...current.slice(1),
  ];
};

/**
 * Same as `mergeFeedUpdate`, for the chat's pages (plain arrays).
 */
export const mergeChatUpdate = (
  current: Interaction[][] | undefined,
  update: Interaction,
): Interaction[][] => {
  const pages = current ?? [];
  const key = getInteractionKey(update);
  const exists = pages.some((page) =>
    page?.some((interaction) => getInteractionKey(interaction) === key),
  );

  if (exists) return pages;

  return [[update, ...(pages[0] ?? [])], ...pages.slice(1)];
};
