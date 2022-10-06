import {
  EASY_ORDERS,
  generateOrders,
  HARD_ORDERS,
  MEDIUM_ORDERS,
} from "./goblinGrub";

describe("goblinGrub", () => {
  describe("getGoblinGrub", () => {
    it.todo("returns the current goblin grub shop if opened");
    it.todo("returns a closed goblin grub shop");
    it.todo("returns a new goblin grub shop if old version is stored");
  });

  describe("generateOrders", () => {
    it("generates 3 easy orders", () => {
      const orders = generateOrders();

      const easyCount = orders.filter((order) => {
        return EASY_ORDERS.includes(order.name);
      });

      expect(easyCount).toEqual(3);
    });

    it("generates 3 medium orders", () => {
      const orders = generateOrders();

      const mediumCount = orders.filter((order) => {
        return MEDIUM_ORDERS.includes(order.name);
      });

      expect(mediumCount).toEqual(3);
    });

    it("generates 2 hard orders", () => {
      const orders = generateOrders();

      const hardCount = orders.filter((order) => {
        return HARD_ORDERS.includes(order.name);
      });

      expect(hardCount).toEqual(2);
    });

    it.todo("generates random orders");
  });
});
