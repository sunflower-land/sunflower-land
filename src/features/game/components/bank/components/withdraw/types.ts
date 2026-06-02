import type { LabelType } from "components/ui/Label";
import type { BuffLabel } from "features/game/types";

/**
 * A pill shown on an item describing its on-chain withdraw state
 * (e.g. "Withdrawable", "In use", "2d 4h left", "Soon").
 */
export interface WithdrawStatus {
  type: LabelType;
  icon?: string;
  text: string;
}

/**
 * Normalised representation of a single withdrawable thing — a collectible,
 * a wearable, a Bud NFT or a Pet NFT. Each Withdraw* screen maps its own
 * game state into this shape so the shared Direction C layout
 * (`WithdrawCollection`) can render a grid → detail → cart flow uniformly.
 */
export interface WithdrawEntry {
  /** Stable unique key (item name, wearable name, `bud-1`, `pet-1`). */
  key: string;
  /** On-chain id, used for ordering and React keys. */
  id: number;
  name: string;
  image: string;
  /** Extra classes for the grid/detail image (e.g. Bud/Pet upscaling). */
  iconClassName?: string;
  /** Total owned (the stepper cap). NFTs are unique so this is 1. */
  total: number;
  /** Unique NFT (Bud/Pet): suppress the redundant "1" count badge. */
  unique?: boolean;
  /** True when the item cannot currently be withdrawn. */
  locked: boolean;
  /** Human readable reason shown in the detail panel when locked. */
  lockReason?: string;
  /** Status pill shown in grid/detail. */
  status?: WithdrawStatus;
  /** Long-form description (collectibles/wearables only). */
  description?: string;
  /** Boost labels to surface in the detail panel. */
  buffs?: BuffLabel[];
}
