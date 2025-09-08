/**
 * getEntries is a ref to Object.entries, but the return is typed literally.
 */
export const getObjectEntries = Object.entries as <T extends object>(
  obj: T,
) => Array<[keyof T, T[keyof T]]>;
