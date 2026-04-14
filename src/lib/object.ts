/**
 * getKeys is a ref to Object.keys, but the return is typed literally.
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T,
) => Array<keyof T>;

/**
 * getValues is a ref to Object.values, but the return is typed literally.
 */
export const getValues = Object.values as <T extends object>(
  obj: T,
) => Array<T[keyof T]>;

/**
 * getObjectEntries is a ref to Object.entries, but the return is typed literally.
 */
export const getObjectEntries = Object.entries as <T extends object>(
  obj: T,
) => Array<[keyof T, T[keyof T]]>;
