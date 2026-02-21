export const shortAddress = (
  address: string,
  startLength: number = 5,
  endLength: number = 4,
): string => {
  if (!address) return "";

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};
