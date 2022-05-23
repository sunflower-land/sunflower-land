import Decimal from "decimal.js-light";
import { shouldResetGoblin } from "../goblinShovelStorage";

export const getGoblinCountMock = jest.fn(() => new Decimal(0));
export const getHarvestCountMock = jest.fn(() => new Decimal(0));
export const getGoblinShovelMock = jest.fn(() => ({
  harvestCount: new Decimal(0),
  goblinCount: new Decimal(0),
  firstGoblinAt: Date.now(),
}));

jest.doMock("../goblinShovelStorage", () => ({
  recoverShovel: jest.fn(),
  getGoblinCount: getGoblinCountMock,
  getHarvestCount: getHarvestCountMock,
  getGoblinShovel: getGoblinShovelMock,
  setGoblinShovel: jest.fn(),
  addToHarvestCount: jest.fn(),
  shouldResetGoblin: shouldResetGoblin,
}));
