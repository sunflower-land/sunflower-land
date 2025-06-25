import { Decimal } from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import {
  buyOptionPurchaseItem,
  OptionPurchaseItemName,
  PurchaseType,
} from "./buyOptionPurchaseItem";

describe("buyOptionPurchaseItem", () => {
  it("throws an error if the action type is invalid", () => {
    expect(() =>
      buyOptionPurchaseItem({
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
      buyOptionPurchaseItem({
        state: INITIAL_FARM,
        action: {
          type: "optionPurchaseItem.bought",
          item: "Random Item" as OptionPurchaseItemName,
          purchaseType: "Gem",
          amount: 1,
        },
      }),
    ).toThrow("Item does not exist");
  });

  it("throws an error if there are no purchase options", () => {
    expect(() =>
      buyOptionPurchaseItem({
        state: INITIAL_FARM,
        action: {
          type: "optionPurchaseItem.bought",
          item: "Test Item" as OptionPurchaseItemName,
          purchaseType: "Gem",
          amount: 1,
        },
      }),
    ).toThrow("No purchase options found");
  });

  it("throws an error if the purchase type is invalid", () => {
    expect(() =>
      buyOptionPurchaseItem({
        state: INITIAL_FARM,
        action: {
          type: "optionPurchaseItem.bought",
          item: "Fishing Lure",
          purchaseType: "Random" as PurchaseType,
          amount: 1,
        },
      }),
    ).toThrow("Invalid purchase type");
  });

  it("throws an error if there's not enough funds", () => {
    expect(() =>
      buyOptionPurchaseItem({
        state: { ...INITIAL_FARM, inventory: { Gem: new Decimal(0) } },
        action: {
          type: "optionPurchaseItem.bought",
          item: "Fishing Lure",
          purchaseType: "Gem",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient Items");
  });

  it("throws an error if there's not enough funds for multiple amount", () => {
    expect(() =>
      buyOptionPurchaseItem({
        state: { ...INITIAL_FARM, inventory: { Gem: new Decimal(99) } },
        action: {
          type: "optionPurchaseItem.bought",
          item: "Fishing Lure",
          purchaseType: "Gem",
          amount: 10,
        },
      }),
    ).toThrow("Insufficient Items");
  });

  it.todo("throws an error if there's not enough coins");

  it("adds the item to the inventory with purchase type gem", () => {
    const state = buyOptionPurchaseItem({
      state: { ...INITIAL_FARM, inventory: { Gem: new Decimal(10) } },
      action: {
        type: "optionPurchaseItem.bought",
        item: "Fishing Lure",
        purchaseType: "Gem",
        amount: 1,
      },
    });
    expect(state.inventory["Gem"]).toEqual(new Decimal(0));
    expect(state.inventory["Fishing Lure"]).toEqual(new Decimal(1));
  });

  it("adds the item to the inventory with purchase type feather", () => {
    const state = buyOptionPurchaseItem({
      state: { ...INITIAL_FARM, inventory: { Feather: new Decimal(100) } },
      action: {
        type: "optionPurchaseItem.bought",
        item: "Fishing Lure",
        purchaseType: "Feather",
        amount: 1,
      },
    });
    expect(state.inventory["Feather"]).toEqual(new Decimal(0));
    expect(state.inventory["Fishing Lure"]).toEqual(new Decimal(1));
  });

  it("adds the item to the inventory with purchase type gem and multiple amount", () => {
    const state = buyOptionPurchaseItem({
      state: { ...INITIAL_FARM, inventory: { Gem: new Decimal(100) } },
      action: {
        type: "optionPurchaseItem.bought",
        item: "Fishing Lure",
        purchaseType: "Gem",
        amount: 10,
      },
    });
    expect(state.inventory["Gem"]).toEqual(new Decimal(0));
    expect(state.inventory["Fishing Lure"]).toEqual(new Decimal(10));
  });

  it("adds the item to the inventory with purchase type feather and multiple amount", () => {
    const state = buyOptionPurchaseItem({
      state: { ...INITIAL_FARM, inventory: { Feather: new Decimal(1000) } },
      action: {
        type: "optionPurchaseItem.bought",
        item: "Fishing Lure",
        purchaseType: "Feather",
        amount: 10,
      },
    });
    expect(state.inventory["Feather"]).toEqual(new Decimal(0));
    expect(state.inventory["Fishing Lure"]).toEqual(new Decimal(10));
  });
});
