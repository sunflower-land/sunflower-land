/**
 * Capitalize the first letter of a string
 * @param s string
 * @returns string
 */
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const capitalizeFirstLetters = (inputString: string) => {
  return inputString.replace(/\b\w/g, (char) => char.toUpperCase());
};
