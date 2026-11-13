import Decimal from "decimal.js-light";
import { getKeys } from "lib/object";
import type { GameState, InventoryItemName } from "../types/game";
import type { BumpkinItem } from "../types/bumpkin";
import { KNOWN_IDS } from "../types";

/**
 * The type of the toast.
 */
export type ToastItem =
  | InventoryItemName
  | "SFL"
  | "XP"
  | "coins"
  | "faction_points"
  | BumpkinItem
  | `Bud #${number}`
  | `Pet #${number}`;

/**
 * How much of an item a single player action gained (positive) or used (negative).
 */
export type ToastChange = {
  item: ToastItem;
  difference: Decimal;
};

/**
 * A row in the toast panel.
 * @param item The toast item.
 * @param difference The amount gained or used by the player's current run of actions on the item.
 * @param id The toast ID. It changes every time an action updates the toast.
 */
export interface Toast extends ToastChange {
  id: string;
}

/**
 * The amounts the toast panel tracks. An amount that is `undefined` is not known yet.
 */
export type ToastState = {
  inventory?: Partial<Record<InventoryItemName, Decimal>>;
  balance?: Decimal;
  coins?: number;
  experience?: number;
  factionPoints?: number;
  wardrobe?: Partial<Record<BumpkinItem, number>>;
  buds?: Partial<Record<number, unknown>>;
  petNFTs?: Partial<Record<number, unknown>>;
};

/**
 * Reads the amounts the toast panel tracks from the game state.
 */
export const getToastState = (game: GameState): ToastState => ({
  inventory: game.inventory,
  balance: game.balance,
  coins: game.coins,
  experience: game.bumpkin.experience,
  factionPoints: game.faction?.points,
  wardrobe: game.wardrobe,
  buds: game.buds,
  petNFTs: game.pets?.nfts ?? {},
});

type Amount = Decimal | number;

/**
 * Whether an amount can be compared. The toast only watches the game, so an
 * amount it cannot read (missing, NaN, not a number) is skipped, never thrown on.
 */
const isKnown = (amount: Amount | undefined): amount is Amount =>
  amount instanceof Decimal || Number.isFinite(amount);

/**
 * The change of a single amount. Nothing is returned while either side is unknown,
 * so the first amount the panel sees is a starting point and not a gain.
 */
const getAmountChange = (
  item: ToastItem,
  previous: Amount | undefined,
  next: Amount | undefined,
): ToastChange[] => {
  if (!isKnown(previous) || !isKnown(next)) return [];

  const difference = new Decimal(next).minus(previous);

  return difference.equals(0) ? [] : [{ item, difference }];
};

/**
 * The changes of a record of amounts. An item missing from one side counts as zero.
 */
const getRecordChanges = <Key extends string | number, Value>({
  previous,
  next,
  toItem,
  toAmount,
}: {
  previous: Partial<Record<Key, Value>> | undefined;
  next: Partial<Record<Key, Value>> | undefined;
  toItem: (key: Key) => ToastItem;
  toAmount: (value: Value | undefined) => Amount;
}): ToastChange[] => {
  if (!previous || !next || previous === next) return [];

  const keys = new Set([...getKeys(next), ...getKeys(previous)]);

  return [...keys].flatMap((key) =>
    getAmountChange(toItem(key), toAmount(previous[key]), toAmount(next[key])),
  );
};

/**
 * Gets what one player action changed: every tracked item whose amount differs
 * between the state before the action and the state after it.
 * @param previous The state before the action.
 * @param next The state after the action.
 * @returns The amount gained or used for each item that changed.
 */
export const getToastChanges = (
  previous: ToastState,
  next: ToastState,
): ToastChange[] => [
  ...getRecordChanges({
    previous: previous.inventory,
    next: next.inventory,
    toItem: (name) => name,
    toAmount: (amount) => amount ?? 0,
  }),
  ...getAmountChange("SFL", previous.balance, next.balance),
  ...getAmountChange("coins", previous.coins, next.coins),
  ...getAmountChange("XP", previous.experience, next.experience),
  // Faction points only toast when they are earned
  ...getAmountChange(
    "faction_points",
    previous.factionPoints,
    next.factionPoints,
  ).filter(({ difference }) => difference.greaterThan(0)),
  // A wearable that shares its name with an inventory item (Axe, Chef Hat...)
  // has no toast of its own: the row and its icon belong to the item
  ...getRecordChanges({
    previous: previous.wardrobe,
    next: next.wardrobe,
    toItem: (name) => name,
    toAmount: (amount) => amount ?? 0,
  }).filter(({ item }) => !(item in KNOWN_IDS)),
  ...getRecordChanges({
    previous: previous.buds,
    next: next.buds,
    toItem: (id): ToastItem => `Bud #${Number(id)}`,
    toAmount: (bud) => (bud ? 1 : 0),
  }),
  ...getRecordChanges({
    previous: previous.petNFTs,
    next: next.petNFTs,
    toItem: (id): ToastItem => `Pet #${Number(id)}`,
    toAmount: (pet) => (pet ? 1 : 0),
  }),
];

/**
 * Adds the toasts of one player action to the toasts on screen.
 *
 * A toast counts one run of actions in the same direction. Gaining more of an
 * item whose toast shows a gain adds to it (+1, +2, +3), and the same goes for
 * using more of an item whose toast shows a loss. A change in the other
 * direction starts a new count, so chopping a tree after a craft that cost
 * 10 Wood shows +1 and not -9.
 * @param toasts The toasts on screen, newest first.
 * @param incoming The toasts of the action, each with the amount the action changed.
 * @returns The toasts to show, with the action's toasts at the top and its last change first.
 */
export const addToasts = (toasts: Toast[], incoming: Toast[]): Toast[] =>
  incoming.reduce((list, toast) => {
    const existing = list.find(({ item }) => item === toast.item);
    const isSameDirection =
      existing?.difference.isPositive() === toast.difference.isPositive();

    return [
      existing && isSameDirection
        ? { ...toast, difference: existing.difference.plus(toast.difference) }
        : toast,
      ...list.filter(({ item }) => item !== toast.item),
    ];
  }, toasts);

/**
 * Removes the toasts with the given IDs. A toast that a later action has
 * updated has a new ID, so it stays.
 * @param toasts The toasts on screen.
 * @param ids The IDs of the toasts to remove.
 */
export const removeToasts = (toasts: Toast[], ids: string[]): Toast[] => {
  const remaining = toasts.filter(({ id }) => !ids.includes(id));

  return remaining.length === toasts.length ? toasts : remaining;
};
