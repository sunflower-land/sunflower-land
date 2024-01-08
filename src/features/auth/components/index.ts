export * from "./Beta";
export * from "./CreatingFarm";
export * from "./Loading";
export * from "./Splash";
export * from "./Web3Missing";
export * from "./WrongChain";

export const roundToOneDecimal = (number: number) =>
  Math.round(number * 10) / 10;
