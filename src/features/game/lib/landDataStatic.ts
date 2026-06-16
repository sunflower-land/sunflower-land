/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import Decimal from "decimal.js-light";
import type { GameState } from "../types/game";

import { INITIAL_FARM } from "./constants";

export const STATIC_OFFLINE_FARM: GameState = { ...INITIAL_FARM };
