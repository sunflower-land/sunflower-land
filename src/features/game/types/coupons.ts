export type CouponName = "Trading Ticket" | "War Bond";

export type Coupon = {
  description: string;
};

export const COUPONS: () => Record<CouponName, Coupon> = () => ({
  "Trading Ticket": {
    description: "Free trades! Woohoo!",
  },
  "War Bond": {
    description:
      "A mark of a true warrior. Exchange at Goblin village for rare items.",
  },
});
