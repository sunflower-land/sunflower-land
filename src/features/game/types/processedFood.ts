export type ProcessedResource =
  | "Fish Flake"
  | "Fish Stick"
  | "Fish Oil"
  | "Crab Stick";

export type ProcessedResourceDetails = {
  description: string;
};

export const PROCESSED_RESOURCES: Record<
  ProcessedResource,
  ProcessedResourceDetails
> = {
  "Fish Flake": {
    description: "A processed fish ingredient - guaranteed catch.",
  },
  "Fish Stick": {
    description: "A sturdy processed fish ingredient - guaranteed catch.",
  },
  "Fish Oil": {
    description: "A refined fish ingredient - guaranteed catch.",
  },
  "Crab Stick": {
    description: "A crab-based processed ingredient - guaranteed catch.",
  },
};
