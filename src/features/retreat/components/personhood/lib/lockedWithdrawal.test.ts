import type { GameState, LockedWithdrawal } from "features/game/types/game";
import { getPendingGrant } from "./lockedWithdrawal";

const now = 1_800_000_000_000;

const grant = (overrides: Partial<LockedWithdrawal> = {}): LockedWithdrawal =>
  ({
    grantedAt: now - 1000,
    expiresAt: now + 1000,
    type: "items",
    items: { Kuebiko: 1 },
    ...overrides,
  }) as LockedWithdrawal;

const game = (
  withdrawalGrant?: LockedWithdrawal,
  status: GameState["ban"]["status"] = "lock",
  transaction?: GameState["transaction"],
): Pick<GameState, "ban" | "transaction"> => ({
  ban: { status, withdrawalGrant },
  transaction,
});

describe("getPendingGrant", () => {
  it("shows the grant to a locked farm", () => {
    expect(getPendingGrant({ game: game(grant()), now })?.type).toBe("items");
  });

  it("shows nothing without a grant", () => {
    expect(getPendingGrant({ game: game(undefined), now })).toBeUndefined();
  });

  it("shows nothing once the grant has expired", () => {
    expect(
      getPendingGrant({ game: game(grant({ expiresAt: now })), now }),
    ).toBeUndefined();
  });

  it("shows nothing while a transaction is open", () => {
    expect(
      getPendingGrant({
        game: game(grant(), "lock", {
          event: "transaction.itemsWithdrawn",
        } as GameState["transaction"]),
        now,
      }),
    ).toBeUndefined();
  });

  it("shows nothing when the farm is not locked", () => {
    expect(getPendingGrant({ game: game(grant(), "ok"), now })).toBeUndefined();
  });
});
