const numberWithBreaks = (n: number | string): string => {
  return `${n}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export { numberWithBreaks };
