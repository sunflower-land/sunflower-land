import { Decimal } from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import {
  buyMultiplePurchaseItem,
  MultiplePurchaseItemName,
  PurchaseType,
} from "./buyMultiPurchaseItem";

describe("buyMultiplePurchaseItem", () => {
  it("throws an error if the action type is invalid", () => {
    expect(() =>
      buyMultiplePurchaseItem({
        state: INITIAL_FARM,
        action: {
          type: "invalid" as any,
          item: "Fishing Lure",
          purchaseType: "Gem",
          amount: 1,
        },
      }),
    ).toThrow("Invalid action type");
  });

  it("throws an error if the item doesn't exist", () => {
    expect(() =>
      buyMultiplePurchaseItem({
        state: INITIAL_FARM,
        action: {
          type: "multiplePurchaseItem.bought",
          item: "Random Item" as MultiplePurchaseItemName,
          purchaseType: "Gem",
          amount: 1,
        },
      }),
    ).toThrow("Item does not exist");
  });

  it("throws an error if there are no purchase options", () => {
    expect(() =>
      buyMultiplePurchaseItem({
        state: INITIAL_FARM,
        action: {
          type: "multiplePurchaseItem.bought",
          item: "Test Item" as MultiplePurchaseItemName,
          purchaseType: "Gem",
          amount: 1,
        },
      }),
    ).toThrow("No purchase options found");
  });

  it("throws an error if the purchase type is invalid", () => {
    expect(() =>
      buyMultiplePurchaseItem({
        state: INITIAL_FARM,
        action: {
          type: "multiplePurchaseItem.bought",
          item: "Fishing Lure",
          purchaseType: "Random" as PurchaseType,
          amount: 1,
        },
      }),
    ).toThrow("Invalid purchase type");
  });

  it("throws an error if there's not enough funds", () => {
    expect(() =>
      buyMultiplePurchaseItem({
        state: { ...INITIAL_FARM, inventory: { Gem: new Decimal(0) } },
        action: {
          type: "multiplePurchaseItem.bought",
          item: "Fishing Lure",
          purchaseType: "Gem",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient Items");
  });

  it.todo("throws an error if there's not enough coins");

  it("adds the item to the inventory with purchase type gem", () => {
    const state = buyMultiplePurchaseItem({
      state: { ...INITIAL_FARM, inventory: { Gem: new Decimal(10) } },
      action: {
        type: "multiplePurchaseItem.bought",
        item: "Fishing Lure",
        purchaseType: "Gem",
        amount: 1,
      },
    });
    expect(state.inventory["Fishing Lure"]).toEqual(new Decimal(1));
  });

  it("adds the item to the inventory with purchase type feather", () => {
    const state = buyMultiplePurchaseItem({
      state: { ...INITIAL_FARM, inventory: { Feather: new Decimal(100) } },
      action: {
        type: "multiplePurchaseItem.bought",
        item: "Fishing Lure",
        purchaseType: "Feather",
        amount: 1,
      },
    });
    expect(state.inventory["Fishing Lure"]).toEqual(new Decimal(1));
  });
});
