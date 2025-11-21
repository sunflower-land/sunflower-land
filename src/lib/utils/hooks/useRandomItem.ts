import { useState } from "react";

/**
 * This hook allows you to get a random item from an array that will persist between renders.
 * @param array Array of items
 * @returns A random item from the array
 */

export const useRandomItem = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error("Array must not be empty");
  }

  const [index] = useState(() => Math.floor(Math.random() * array.length));
  return array[index];
};
