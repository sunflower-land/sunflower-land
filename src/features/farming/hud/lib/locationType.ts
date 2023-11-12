export type LocationType = "Home" | "Social" | "Visit" | "Other";

export function getLocationType(): LocationType {
  if (window.location.href.includes("/world/")) return "Social";
  if (window.location.href.includes("/land/")) return "Home";
  if (window.location.href.includes("visit")) return "Visit";
  return "Other";
}
