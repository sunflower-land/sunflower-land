// Wool required to craft the Oil Drill per Oil Rig rank (replaces Leather).
// Deliberately zero-import: shared by the craft recipe (types/tools.ts) and the
// skill tree (SKILL_RANKS["Oil Rig"] in bumpkinSkills.ts) so the two stay in
// sync without depending on each other. tools.ts is not a leaf, so sourcing this
// from there would couple the skill tree to its whole dependency chain and risk
// re-introducing the tools -> bumpkinSkills -> images -> tools require cycle.
export const OIL_DRILL_WOOL_BY_RANK = [20, 15, 10] as const;
