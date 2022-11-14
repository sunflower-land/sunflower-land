import Decimal from "decimal.js-light";

export type TadpoleName =
  | "healthy"
  | "chipped"
  | "cracked"
  | "damaged"
  | "dying";

export type IncubatorName = "empty" | "active";

export type Tadpole = {
  health: TadpoleName;
  id?: number[];
};

export type Incubator = {
  name: IncubatorName;
  description: string;
  id?: string;
  earnings?: Decimal;
};

export type InventoryItemName = TadpoleName | IncubatorName;
