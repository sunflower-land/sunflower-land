# Love Island daily puzzles — server spec

The middle of Love Island hosts a daily puzzle. Every puzzle pays out
Love Charms through a single game event, `floatingIslandPrize.claimed`, so the
daily caps live in one place. This document is the contract the game API and
the MMO (Colyseus) room need to implement.

Client source of truth: `src/features/world/lib/loveIsland.ts` (pure rules,
unit-tested) and `src/features/world/scenes/LoveIslandScene.ts`.

## Hand-off checklists

**Game API**

- [ ] New event `floatingIslandPrize.claimed` (section 1) — port the client
      handler and its tests.
- [ ] New optional field `floatingIsland.prizeClaims` on the farm state,
      returned to the client unchanged.
- [ ] `hasVipAccess` with `type: "trial"` semantics (trial counts as VIP).

**MMO room (`love_island`)**

- [ ] Publish `state.loveDilemma` (section 3, "Room state") on the shared 40s
      clock, with tiers from the seeded shuffle below.
- [ ] Handle message `loveDilemma.choose`; keep picks private until reveal.
- [ ] At reveal: copy picks into `choices`, resolve, **teleport** choosing
      players onto their platform, enforce 3 attempts/farm/day.
- [ ] No change to `giantFlower` — leave it as is (unused by the client now).

## 1. Game API — `floatingIslandPrize.claimed`

Client handler: `src/features/game/events/landExpansion/claimFloatingIslandPrize.ts`.
Port it as-is.

### Action

```ts
{
  type: "floatingIslandPrize.claimed";
  amount: number;                          // integer, 0..100
  game?: "petal_puzzle" | "love_dilemma";  // which puzzle paid out
  roundId?: number;                        // integer; the puzzle's round
}
```

### State

```ts
floatingIsland: {
  // ...existing fields
  prizeClaims?: {
    claimedAt: number;   // epoch ms
    amount: number;
    game?: "petal_puzzle" | "love_dilemma";
    roundId?: number;
  }[];
}
```

Only the **current UTC day's** claims are kept: on every claim, drop entries
whose UTC date differs from `createdAt`, then append the new one.

### Validation (throw in this order)

| Check                                                | Error                                  |
| ---------------------------------------------------- | -------------------------------------- |
| `amount` not an integer, or `< 0`                    | `Invalid prize amount`                 |
| `roundId` given but not an integer                   | `Invalid round`                        |
| `amount > 100`                                       | `Prize amount exceeds maximum`         |
| a claim with the same `game` **and** `roundId` today | `Prize already claimed for this round` |
| already **10** claims today                          | `Daily claim limit reached`            |
| today's total + `amount` > daily cap                 | `Daily Love Charm limit reached`       |

Daily cap = **100** if `hasVipAccess({ game, now: createdAt })` (trial counts),
else **5**. "Today" is the UTC date of `createdAt`
(`new Date(createdAt).toISOString().split("T")[0]`).

On success: append the claim and add `amount` to `inventory["Love Charm"]`.

An `amount` of `0` is valid and still consumes one of the 10 claims. The Love
Dilemma uses this to record a **lost** round so the client can count attempts.

`{ game, roundId }` is the idempotency key: reloading during a reveal re-sends
the same claim and must be rejected rather than paid twice.

**Cap vs prize sizes.** A standard player's cap (5) is smaller than two wins
(3 + 3). The client therefore sends `min(prize, remaining today)` — e.g. the
second win pays 2, a third pays 0 but still records the attempt — and shows
those capped amounts on the platforms. The API needs no special handling, but
the MMO room should apply the same clamp if it ever reports amounts.

### Per-game rules are NOT enforced here

The event deliberately only guards the caps, and **`amount` is supplied by
the client by design** so any future island game can reuse the event without
API changes. Which puzzle is active, how much a puzzle pays, and how many
attempts a puzzle allows are enforced on the client and in the MMO room
(below). The caps bound the damage of a forged claim to 100 Love Charms/day
for VIP and 5 for everyone else, which is the accepted trade-off. If tighter
enforcement is wanted later, the MMO room can report each round's winners to
the API and the event can require a matching record.

## 2. Which puzzle runs

Only the Love Dilemma runs for now - the petal puzzle is no longer rendered
by the client. `FloatingIslandGameName` keeps `"petal_puzzle"` so old claims
stay typed; a daily rotation can be added later on both sides.

## 3. Love Dilemma — MMO room

Three platforms sit in a row across the centre of the island. Players pick one
by **clicking** it (the platforms are solid, you can't walk onto them). Rounds
run forever on a fixed
**40s clock anchored to the epoch**, so every client and the server agree on
the round with no coordination:

```ts
ROUND_MS = 40_000; // 30s choose + 10s reveal
roundId = Math.floor(now / ROUND_MS);
startAt = roundId * ROUND_MS;
chooseEndsAt = startAt + 30_000;
revealEndsAt = startAt + 40_000;
```

### Tiers

Each round every platform shows one tier (0 = best). The assignment is a
seeded Fisher–Yates shuffle of `[0,1,2]` using **mulberry32(roundId)** —
copy the snippet below verbatim so the server and every client agree.
Prizes per tier depend on the viewer's VIP status, so the room only publishes
tiers, never amounts:

```ts
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getLoveDilemmaTiers(roundId: number): number[] {
  const random = mulberry32(roundId);
  const tiers = [0, 1, 2];
  for (let i = tiers.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [tiers[i], tiers[j]] = [tiers[j], tiers[i]];
  }
  return tiers; // platform index -> tier
}
```

| Tier | VIP | Standard |
| ---- | --- | -------- |
| 0    | 20  | 3        |
| 1    | 10  | 2        |
| 2    | 5   | 1        |

### Room state (`PlazaRoomState.loveDilemma`)

Present only in the `love_island` room, only on Love Dilemma days.

```ts
class LoveDilemma extends Schema {
  @type("number") roundId: number;
  @type("number") chooseEndsAt: number; // epoch ms
  @type("number") revealEndsAt: number; // epoch ms
  @type(["number"]) tiers: ArraySchema<number>; // length 3, platform -> tier
  @type("number") chosenCount: number; // players locked in this round
  @type({ map: "number" }) choices: MapSchema<number>; // sessionId -> platform
}
```

**`choices` must stay empty during the choose phase.** Keep picks in a plain
private map on the room and copy them into the schema at `chooseEndsAt`.
Publishing them early lets clients see where the crowd is going.

### Client → server message

```ts
room.send("loveDilemma.choose", { roundId: number; platform: 0 | 1 | 2 });
```

Rules:

- Ignore if `roundId` ≠ the current round, or if `now > chooseEndsAt`
  (allow ~1s of grace for clock skew).
- Ignore if `platform` is not `0..2`.
- A player may **change their pick** any number of times; the last one wins.
- Enforce **3 attempts per farm per UTC day** server-side too (a resolved,
  non-void round counts as an attempt whether won or lost). Ignore picks from
  a farm that is out of attempts.
- Update `chosenCount` to the number of distinct sessions with a pick.

### Reveal (at `chooseEndsAt`)

1. Copy the private picks into `state.loveDilemma.choices` (the ~1s grace
   after `chooseEndsAt` is fine). Clients don't score the round until the
   map is non-empty and `choices.size >= chosenCount`, and fall back to
   scoring whatever is there 3s after `chooseEndsAt` - so keep `chosenCount`
   accurate and publish the picks well inside that window.
2. Resolve:
   - `counts[p]` = players on platform `p`; `total` = sum.
   - If `total < 5` the round is **void**: nobody wins, nobody loses, no
     attempt is consumed.
   - Otherwise every platform whose count equals the **maximum** loses
     (**ties all lose**). Everyone else wins their platform's prize.
3. **Teleport** each choosing player onto their platform by setting their
   `x`/`y` in `state.players` to the platform spot (see below). Clients lerp
   remote players toward the server position every frame, so without this the
   local snap is fought back within a second.
4. At `revealEndsAt`, advance `roundId`, recompute `tiers`, clear `choices`,
   reset `chosenCount`, and clear the private pick map.

Platform spots (world px), a row 50px apart, left to right:

| Platform | x   | y   |
| -------- | --- | --- |
| 0        | 565 | 576 |
| 1        | 615 | 576 |
| 2        | 665 | 576 |

Spread players on the same platform by a few px so they don't stack; the
client uses `slotOffset(n)` in `LoveIslandScene.ts` and it's fine for the
server to use the same or any small jitter.

### What the client does with the reveal

- Reads `choices`, resolves with the same rules, moves every Bumpkin it can
  see onto its platform, plays a jump for winners, and colours the platforms
  green (paying) / red (most crowded).
- If the local player picked and the round was **not void**, it dispatches
  `floatingIslandPrize.claimed { amount, game: "love_dilemma" }` straight
  away — `amount` is the platform's prize on a win and `0` on a loss. There
  is no modal; a floating "+N" or a "too crowded" bubble is the feedback.
- Void rounds show a "not enough players" bubble and dispatch nothing.
- Attempts left = `3 − (today's love_dilemma claims)`. When it hits 0 the
  platforms stop accepting clicks.

### Until the room ships

If `state.loveDilemma` is absent, the client runs the same clock locally and
fills the round with 6 deterministic simulated players
(`getLoveDilemmaBotChoices(roundId)`), so the game is playable and testable
today. Once the room publishes `loveDilemma` the client switches over
automatically — no client change needed.
