export const getHarvestCountMock = jest.fn(() => "0");

jest.doMock("../harvestCountStorage", () => ({
  recoverShovel: jest.fn(),
  getHarvestCount: getHarvestCountMock,
  addToHarvestCount: jest.fn(),
}));
