import { Minigame } from "features/game/types/game";
import {
  UNLIMITED_ATTEMPTS_SFL,
  FREE_DAILY_ATTEMPTS,
  RESTOCK_ATTEMPTS,
  BETA_TESTERS,
  INITIAL_DATE,
  ATTEMPTS_BETA_TESTERS,
} from "../Constants";

/**
 * Gets the number of attempts left for the minigame.
 * @param minigame The minigame.
 * @returns The number of attempts left.
 */
export const getAttemptsLeft = (minigame?: Minigame, farmId = 0) => {
  const dateKey = new Date().toISOString().slice(0, 10);

  const history = minigame?.history ?? {};
  const purchases = minigame?.purchases ?? [];

  // const now = new Date();
  // const startOfTodayUTC = getStartOfUTCDay(now);
  // const endOfTodayUTC = startOfTodayUTC + 24 * 60 * 60 * 1000; // 24 hours later

  // Unlimited attempts
  const hasUnlimitedAttempts = hasRecentUnlimitedAttempts(purchases);
  if (hasUnlimitedAttempts) return Infinity;

  // Restock attempts
  const restockAttempts = hasRecentRestockAttempts(purchases);

  // Total attempts used
  const totalAttemptsUsed = getTotalAttemptsInSurroundingMonths(history);

  // Free daily attempts
  const freeTotalAttempts =
    getDaysPassedSince(INITIAL_DATE) * FREE_DAILY_ATTEMPTS;

  // Total attempts
  let attemptsLeft = freeTotalAttempts - totalAttemptsUsed + restockAttempts;

  // +Beta attemtps
  if (BETA_TESTERS.includes(farmId) && dateKey < INITIAL_DATE) {
    attemptsLeft += ATTEMPTS_BETA_TESTERS;
  }

  return attemptsLeft;
};

/**
 * Checks if there are any recent purchases of unlimited attempts.
 * @param purchases The list of purchases made in the minigame.
 * @returns True if there are recent purchases of unlimited attempts, false otherwise.
 */
const hasRecentUnlimitedAttempts = (
  purchases: { purchasedAt: number; sfl: number }[],
): boolean => {
  return purchases.some((purchase) => {
    const isPurchaseWithinRange = isWithinRange(purchase.purchasedAt);
    return isPurchaseWithinRange && purchase.sfl === UNLIMITED_ATTEMPTS_SFL;
  });
};

/**
 * Calculates the number of restock attempts made recently.
 * @param purchases The list of purchases made in the minigame.
 * @returns The total number of restock attempts made.
 */
const hasRecentRestockAttempts = (
  purchases: { purchasedAt: number; sfl: number }[],
): number => {
  let restockAttempts = 0;
  RESTOCK_ATTEMPTS.forEach((option) => {
    const restockedCount = purchases.filter(
      (purchase) =>
        purchase.sfl === option.sfl && isWithinRange(purchase.purchasedAt),
    ).length;

    restockAttempts += option.attempts * restockedCount;
  });
  return restockAttempts;
};

/**
 * Calculates the total number of attempts used in the current month, previous month, and next month.
 * @param history The history of attempts, where keys are date strings and values are objects with an `attempts` property.
 * @returns The total number of attempts used in the surrounding months.
 */
const getTotalAttemptsInSurroundingMonths = (
  history: Record<string, { attempts: number }>,
) => {
  return Object.entries(history).reduce((sum, [dateString, entry]) => {
    return isWithinRange(dateString) ? sum + entry.attempts : sum;
  }, 0);
};

/**
 * Checks if a given date is within the range of the current month, the previous month, or the next month.
 * @param date The date to check, can be a string or a number (timestamp).
 * @returns True if the date is within the range, false otherwise.
 */
export const isWithinRange = (date: string | number) => {
  const now = new Date();
  const entryDate = new Date(date);
  const dateKey = now.toISOString().slice(0, 10);
  let lowerLimit;

  if (dateKey >= INITIAL_DATE) {
    lowerLimit = new Date(INITIAL_DATE);
  } else {
    lowerLimit = new Date(now);
    lowerLimit.setMonth(lowerLimit.getMonth() - 1);
  }

  const upperLimit = new Date(now);
  upperLimit.setMonth(upperLimit.getMonth() + 1);

  return entryDate >= lowerLimit && entryDate <= upperLimit;
};

/**
 * Calculates the number of days passed since a given UTC start date.s
 * @param utcStartDate The UTC start date in the format "YYYY-MM-DD".
 * @returns The number of days passed since the start date, including today as day 1.
 */
export const getDaysPassedSince = (utcStartDate: string): number => {
  const start = new Date(utcStartDate); // ej: "2025-04-21"
  const now = new Date();

  const startUTC = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const msPerDay = 1000 * 60 * 60 * 24;

  const diffInDays = Math.floor((nowUTC - startUTC) / msPerDay);

  return Math.max(0, diffInDays + 1);
};

/**
 * Attaches a one-time animation complete event listener to a sprite.
 * @param object The sprite to attach the event listener to.
 * @param animKey The animation key/name to filter for.
 * @param callback The callback function to execute when the animation completes.
 */
export const onAnimationComplete = (
  object: Phaser.GameObjects.Sprite,
  animKey: string,
  callback: () => void,
) => {
  object?.once(
    Phaser.Animations.Events.ANIMATION_COMPLETE,
    (anim: Phaser.Animations.Animation) => {
      if (anim.key === animKey) {
        callback();
      }
    },
  );
};

/**
 * Creates and plays an animation on a sprite if it doesn't already exist.
 * @param scene The Phaser scene.
 * @param sprite The sprite to play the animation on.
 * @param spriteName The name of the sprite texture/spritesheet.
 * @param animType The type/name of the animation to create.
 * @param start The starting frame number.
 * @param end The ending frame number.
 * @param frameRate The frame rate for the animation.
 * @param repeat Information on how many times to repeat the animation (-1 for infinite).
 */
export const createAnimation: any = (
  scene: Phaser.Scene,
  sprite: Phaser.GameObjects.Sprite,
  spriteName: string,
  animType: string,
  start: number,
  end: number,
  frameRate: number,
  repeat: number,
) => {
  const animationKey = `${spriteName}_${animType}_anim`;

  if (!scene.anims.exists(animationKey)) {
    scene.anims.create({
      key: animationKey,
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start,
        end,
      }),
      frameRate,
      repeat,
    });
  }
  sprite.play(animationKey, true);
}

/**
 * Adds a sound effect to the scene and returns the sound object.
 * @param scene The Phaser scene.
 * @param key The key of the sound asset.
 * @param loop Whether the sound should loop (default: false).
 * @param volume The volume level (default: 0.2).
 * @returns The Phaser sound object.
 */
export const addSoundEffect = (
  scene: Phaser.Scene,
  key: string,
  loop = false,
  volume = 0.2,
): Phaser.Sound.BaseSound => {
  return scene.sound.add(key, { loop, volume });
}
