import Decimal from "decimal.js-light";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Craftable } from "./craftables";

export type Flag =
  | "Australian Flag"
  | "Belgian Flag"
  | "Brazillian Flag"
  | "Chinese Flag"
  | "Finnish Flag"
  | "French Flag"
  | "German Flag"
  | "Indonesian Flag"
  | "Indian Flag"
  | "Iranian Flag"
  | "Italian Flag"
  | "Japanese Flag"
  | "Moroccan Flag"
  | "Dutch Flag"
  | "Philippine Flag"
  | "Polish Flag"
  | "Portuguese Flag"
  | "Russian Flag"
  | "Saudi Arabian Flag"
  | "South Korean Flag"
  | "Spanish Flag"
  | "Sunflower Flag"
  | "Thai Flag"
  | "Turkish Flag"
  | "Ukrainian Flag"
  | "American Flag"
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
  "Belgian Flag": {
    name: "Belgian Flag",
    description: "Belgian flag",
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
  "Finnish Flag": {
    name: "Finnish Flag",
    description: "Finnish flag",
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
  "German Flag": {
    name: "German Flag",
    description: "German flag",
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
  "Iranian Flag": {
    name: "Iranian Flag",
    description: "Iranian flag",
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
  "Dutch Flag": {
    name: "Dutch Flag",
    description: "Dutch flag",
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
  "Philippine Flag": {
    name: "Philippine Flag",
    description: "Philippine flag",
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
  "Polish Flag": {
    name: "Polish Flag",
    description: "Polish flag",
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
  "Portuguese Flag": {
    name: "Portuguese Flag",
    description: "Portuguese flag",
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
  "Saudi Arabian Flag": {
    name: "Saudi Arabian Flag",
    description: "Saudi Arabian flag",
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
  "Spanish Flag": {
    name: "Spanish Flag",
    description: "Spanish flag",
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
  "Thai Flag": {
    name: "Thai Flag",
    description: "Thai flag",
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
  "Ukrainian Flag": {
    name: "Ukrainian Flag",
    description: "Ukrainian flag",
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
  "American Flag": {
    name: "American Flag",
    description: "American flag",
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
