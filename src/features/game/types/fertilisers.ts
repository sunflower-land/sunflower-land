// Base fruit-patch yield granted by the Fruitful Blend fertiliser, before any
// skill multiplier (Fruitful Bounty) is applied.
//
// Lives in this zero-import leaf module so both the gameplay consumer
// (events/landExpansion/fertiliseFruitPatch) and the boost-label builder
// (types/collectibleItemBuffs) can read it without depending on each other.
export const FRUITFUL_BLEND_YIELD = 0.1;
