export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    notation: "compact",
  }).format(n);
