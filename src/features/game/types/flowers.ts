// import Decimal from "decimal.js-light";
// import { marketRate } from "../lib/halvening";
// import { Craftable } from "./craftables";

// export type FlowerName = "White Flower" | "Blue Flower";

// export type Flower = {
//   buyPrice: Decimal;
//   sellPrice: Decimal;
//   harvestSeconds: number;
//   name: FlowerName;
//   description: string;
// };

// /**
//  * Crops and their original prices
//  * TODO - use crop name from GraphQL API
//  */
// export const FLOWERS: () => Record<FlowerName, Flower> = () => ({
//   "White Flower": {
//     buyPrice: marketRate(0.01),
//     sellPrice: marketRate(0.02),
//     harvestSeconds: 1 * 60,
//     name: "White Flower",
//     description: "A sunny flower",
//   },
//   "Blue Flower": {
//     buyPrice: marketRate(0.01),
//     sellPrice: marketRate(0.02),
//     harvestSeconds: 5 * 60,
//     name: "Blue Flower",
//     description: "Healthier than you might think.",
//   },
// });

// export type FlowerSeedName = `${FlowerName} Seed`;

// export const FLOWER_SEEDS: () => Record<FlowerSeedName, Craftable> = () => ({
//   "White Flower Seed": {
//     name: "White Flower Seed",
//     price: marketRate(1),
//     ingredients: [],
//     description: "Bees love this flower",
//     requires: "Radish Pie",
//   },
//   "Blue Flower Seed": {
//     name: "Blue Flower Seed",
//     price: marketRate(1),
//     ingredients: [],
//     description: "Bees use this flower to reduce flying time",
//     requires: "Radish Pie",
//   },
// });
