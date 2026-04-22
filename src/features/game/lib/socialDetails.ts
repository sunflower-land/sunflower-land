import { SocialDetails } from "../actions/loadSession";

/**
 * Resolves the next `socialDetails` value from an effect response.
 *
 * Used by every effect-success transition. The contract:
 *  - If the response payload is an object that explicitly contains a
 *    `socialDetails` key (including `null` from `social.unlinked`),
 *    take its value (mapping `null` → `undefined` to clear).
 *  - Otherwise, keep the existing context value.
 *
 * Guards against `data` being a primitive — `"x" in data` would throw.
 */
export const resolveSocialDetails = (
  data: unknown,
  current: SocialDetails | undefined,
): SocialDetails | undefined => {
  if (typeof data === "object" && data !== null && "socialDetails" in data) {
    const next = (data as { socialDetails?: SocialDetails | null })
      .socialDetails;
    return next ?? undefined;
  }
  return current;
};
