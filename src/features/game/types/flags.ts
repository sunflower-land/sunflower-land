import Decimal from "decimal.js-light";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Craftable } from "./craftables";

export type Flag =
  | "Australian Flag"
  | "Belgium Flag"
  | "Brazillian Flag"
  | "Chinese Flag"
  | "Finland Flag"
  | "French Flag"
  | "Germany Flag"
  | "Indonesian Flag"
  | "Indian Flag"
  | "Iran Flag"
  | "Italian Flag"
  | "Japanese Flag"
  | "Moroccan Flag"
  | "Netherlands Flag"
  | "Philippines Flag"
  | "Poland Flag"
  | "Portugal Flag"
  | "Russian Flag"
  | "Saudi Arabia Flag"
  | "South Korean Flag"
  | "Spain Flag"
  | "Sunflower Flag"
  | "Thailand Flag"
  | "Turkish Flag"
  | "Ukraine Flag"
  | "USA Flag"
  | "Vietnamese Flag";

export const FLAGS: Record<Flag, Craftable> = {
  "Australian Flag": {
    name: "Australian Flag",
    description: "Australian flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Belgium Flag": {
    name: "Belgium Flag",
    description: "Belgium flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Brazillian Flag": {
    name: "Brazillian Flag",
    description: "Brazillian flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 200000,
    section: Section["Flags"],
  },
  "Chinese Flag": {
    name: "Chinese Flag",
    description: "Chinese flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 200000,
    section: Section["Flags"],
  },
  "Finland Flag": {
    name: "Finland Flag",
    description: "Finland flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "French Flag": {
    name: "French Flag",
    description: "French flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Germany Flag": {
    name: "Germany Flag",
    description: "Germany flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Indian Flag": {
    name: "Indian Flag",
    description: "Indian flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Indonesian Flag": {
    name: "Indonesian Flag",
    description: "Indonesian flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Iran Flag": {
    name: "Iran Flag",
    description: "Iran flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Italian Flag": {
    name: "Italian Flag",
    description: "Italian flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Japanese Flag": {
    name: "Japanese Flag",
    description: "Japanese flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Moroccan Flag": {
    name: "Moroccan Flag",
    description: "Morrocan flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Netherlands Flag": {
    name: "Netherlands Flag",
    description: "Netherlands flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Philippines Flag": {
    name: "Philippines Flag",
    description: "Philippines flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 500000,
    section: Section["Flags"],
  },
  "Poland Flag": {
    name: "Poland Flag",
    description: "Poland flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Portugal Flag": {
    name: "Portugal Flag",
    description: "Portugal flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Russian Flag": {
    name: "Russian Flag",
    description: "Russian flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Saudi Arabia Flag": {
    name: "Saudi Arabia Flag",
    description: "Saudi Arabia flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "South Korean Flag": {
    name: "South Korean Flag",
    description: "South Korean flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Spain Flag": {
    name: "Spain Flag",
    description: "Spain flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Sunflower Flag": {
    name: "Sunflower Flag",
    description: "Sunflower flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(1000),
        item: "Sunflower",
      },
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Thailand Flag": {
    name: "Thailand Flag",
    description: "Thailand flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Turkish Flag": {
    name: "Turkish Flag",
    description: "Turkish flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Ukraine Flag": {
    name: "Ukraine Flag",
    description: "Ukraine flag",
    price: new Decimal(50),
    ingredients: [
      {
        item: "Sunflower",
        amount: new Decimal(100),
      },
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 200000,
    section: Section["Flags"],
  },
  "USA Flag": {
    name: "USA Flag",
    description: "USA flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
  "Vietnamese Flag": {
    name: "Vietnamese Flag",
    description: "Vietnamese flag",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    disabled: true,
    supply: 50000,
    section: Section["Flags"],
  },
};
