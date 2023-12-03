export type PortalName = "infected" | "crop-boom";

export const SUPPORTED_PORTALS: PortalName[] = ["infected", "crop-boom"];

export const MAX_TOTAL_ARCADE_TOKENS = 50;

export const DAILY_ARCADE_TOKENS: Record<PortalName, number> = {
  infected: 1,
  "crop-boom": 1,
};
