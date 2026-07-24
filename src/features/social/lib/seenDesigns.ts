import type { ShowcasedDesign } from "features/game/types/social";

const SEEN_DESIGNS_KEY = "designShowcase.seen";

// Only recent designs are ever returned by the API, so the list of seen ids is
// capped rather than grown forever.
const MAX_SEEN_DESIGNS = 100;

function getSeenDesignIds(): string[] {
  try {
    const stored = localStorage.getItem(SEEN_DESIGNS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Whether any of the showcased designs have not been opened by this player yet.
 * Used to flag the Plaza noticeboard as unread.
 */
export function hasUnseenDesigns(designs: ShowcasedDesign[]) {
  const seen = new Set(getSeenDesignIds());

  return designs.some((design) => !seen.has(design.messageId));
}

export function markDesignsAsSeen(designs: ShowcasedDesign[]) {
  const ids = designs.map((design) => design.messageId);
  const previous = getSeenDesignIds().filter((id) => !ids.includes(id));

  localStorage.setItem(
    SEEN_DESIGNS_KEY,
    JSON.stringify([...ids, ...previous].slice(0, MAX_SEEN_DESIGNS)),
  );
}
