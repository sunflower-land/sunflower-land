import { IDS } from "../src/features/game/types";

export type MetadataObject = {
  name: string;
  external_url: string;
  [ResultKeys.Description]: string;
  [ResultKeys.Decimals]: number;
  id?: number;
  image?: string;
  [ResultKeys.BackgroundColor]?: string;
  [ResultKeys.Attributes]?: Attribute[];
};

export type Images = {
  [key in (typeof IDS)[number]]?: string;
};

export type MarkdownSections = {
  [key in ResultKeys]: string;
};

export interface Attribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export enum ResultKeys {
  Description = "description",
  Decimals = "decimals",
  BackgroundColor = "background_color",
  Attributes = "attributes",
}
