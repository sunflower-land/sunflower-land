import { SUNNYSIDE } from "assets/sunnyside";

export type CodexCategoryName = "My Farm" | "Fish" | "Mutants";

export interface CodexCategory {
  name: CodexCategoryName;
  icon: string;
}

export const categories: CodexCategory[] = [
  {
    name: "My Farm",
    icon: SUNNYSIDE.icons.heart,
  },
  {
    name: "Fish",
    icon: SUNNYSIDE.icons.heart,
  },
  {
    name: "Mutants",
    icon: SUNNYSIDE.icons.heart,
  },
];

export type CodexTabIndex = keyof typeof categories;
