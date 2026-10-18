import type { GameState } from "../../types/game";
import { buildPreviewLink, diffState, readPreviewParams } from "./previewLink";
import { PREVIEW_FIXTURES, getPreviewFixture } from "./previewState";

/**
 * Console helper for ART_MODE / PR previews. Once the game is running:
 *
 *   __sflPreview.link()          // URL that reproduces the current state
 *   __sflPreview.patch()         // just the patch (current state vs fixture)
 *   await __sflPreview.copy()    // link → clipboard
 *
 * A tester who has clicked their way into an interesting state can hand the
 * link to whoever is reviewing, and the scenario generator can be fed real
 * examples from it.
 */
export type PreviewShareHelper = {
  link: (route?: string) => string;
  patch: () => Record<string, unknown> | undefined;
  copy: (route?: string) => Promise<string>;
};

declare global {
  interface Window {
    __sflPreview?: PreviewShareHelper;
  }
}

export function createPreviewShareHelper(
  getState: () => GameState,
): PreviewShareHelper {
  const params = readPreviewParams(window.location);
  const fixture =
    params.fixture && PREVIEW_FIXTURES[params.fixture]
      ? params.fixture
      : undefined;
  // Same cached object the game booted with, so node ids line up.
  const base = getPreviewFixture(fixture ?? "default") as GameState;

  const patch = () => {
    const diff = diffState(base, getState()) ?? {};
    // The loader stamps these itself to skip the boot gates, so a shared link
    // does not need to carry them (and the timestamp is absolute).
    if (base.tcsAcknowledged === undefined) delete diff.tcsAcknowledged;
    const activity = diff.farmActivity;
    if (
      !base.farmActivity["welcome Bonus Claimed"] &&
      activity &&
      typeof activity === "object" &&
      "welcome Bonus Claimed" in activity
    ) {
      const { "welcome Bonus Claimed": _, ...rest } = activity as Record<
        string,
        unknown
      >;
      if (Object.keys(rest).length) diff.farmActivity = rest;
      else delete diff.farmActivity;
    }
    return diff;
  };

  const link = (route?: string) => {
    const hash = window.location.hash.replace(/^#/, "");
    const currentRoute = hash.split("?")[0] || "/";

    return buildPreviewLink({
      base: `${window.location.origin}${window.location.pathname}`,
      route: route ?? currentRoute,
      fixture,
      patch: patch(),
      keepIntro: params.intro === "1",
    });
  };

  const copy = async (route?: string) => {
    const url = link(route);
    await navigator.clipboard?.writeText(url);
    return url;
  };

  return { link, patch, copy };
}

export function installPreviewShareHelper(
  getState: () => GameState,
): () => void {
  window.__sflPreview = createPreviewShareHelper(getState);
  return () => {
    delete window.__sflPreview;
  };
}
