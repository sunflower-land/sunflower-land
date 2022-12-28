import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";

export type TreasureName =
  | "Starfish"
  | "Clam Shell"
  | "Sea Cucumber"
  | "Crab"
  | "Coral";

type Treasure = {
  sfl: Decimal;
};

// PLACEHOLDERS
export const TREASURE: () => Record<TreasureName, Treasure> = () => ({
  "Clam Shell": {
    sfl: marketRate(10),
  },
  "Sea Cucumber": {
    sfl: marketRate(10),
  },
  Coral: {
    sfl: marketRate(10),
  },
  Crab: {
    sfl: marketRate(10),
  },
  Starfish: {
    sfl: marketRate(10),
  },
});
