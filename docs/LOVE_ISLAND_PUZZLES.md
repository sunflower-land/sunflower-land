# Love Island daily puzzles — server spec

Love Island hosts daily puzzles: the Love Dilemma or Lover's Push in the
middle of the island (one at a time) and the Love Boulder at the top. Every
puzzle pays out
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
- [ ] Publish `state.loveBoulder` (section 4) and handle `loveBoulder.hit`:
      decrement, record the miner, break at zero, respawn 5s later.
- [ ] Publish `state.lovePush` (section 5) with the seeded layout; handle
      `lovePush.push`: move the boulder a tile (300ms cooldown per boulder),
      credit the pusher, celebrate 10s when all four are lit, next layout.
- [ ] No change to `giantFlower` — leave it as is (unused by the client now).

## 1. Game API — `floatingIslandPrize.claimed`

Client handler: `src/features/game/events/landExpansion/claimFloatingIslandPrize.ts`.
Port it as-is.

### Action

```ts
{
  type: "floatingIslandPrize.claimed";
  amount: number;                          // integer, 0..100
  game?: "petal_puzzle" | "love_dilemma" | "love_boulder" | "love_push"; // which puzzle paid out
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
    game?: "petal_puzzle" | "love_dilemma" | "love_boulder" | "love_push";
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

## 2. Which puzzles run

The middle of the island hosts **one** puzzle at a time - the Love Dilemma
(section 3) or Lover's Push (section 5) - chosen by the hard-coded constant
`LOVE_ISLAND_CENTRE_PUZZLE` in `src/features/world/lib/loveIsland.ts`
(`"dilemma" | "push"`), flipped by hand and deployed. The room should publish
the matching state (`loveDilemma` or `lovePush`); publishing the other one is
harmless, the client ignores it. The Love Boulder (section 4, top of the
island) runs all day, every day alongside either. The petal puzzle is no
longer rendered by the client; `FloatingIslandGameName` keeps
`"petal_puzzle"` so old claims stay typed.

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

## 4. Love Boulder — MMO room

A boulder sits at the very top of the island, at the foot of the cliff where
the path dead-ends (world px **620, 362**; art 26x25). The whole island taps
it down from **50,000 hits** to zero. When it cracks, a **5 Love Charm**
prize sits on the rubble for **5 seconds**: anyone who landed at least one
hit on that boulder can click it to claim, **once per UTC day**. When the 5
seconds are up a fresh boulder appears at 50,000 and anyone who didn't click
misses out. There is no guide entry and no HUD text beyond the hit count
above the boulder (in a label) - the boulder is meant to be discovered.

```ts
LOVE_BOULDER_HITS = 50_000;
LOVE_BOULDER_PRIZE = 5;
LOVE_BOULDER_MAX_CLAIMS = 1; // per farm per UTC day
LOVE_BOULDER_HIT_COOLDOWN_MS = 200; // per player
LOVE_BOULDER_RESPAWN_MS = 5_000; // = the prize window
```

### Room state (`PlazaRoomState.loveBoulder`)

Present only in the `love_island` room. The client treats `hits === 0` (or
the field missing) as "the room isn't running it" and simulates locally.

```ts
class LoveBoulder extends Schema {
  @type("number") roundId: number; // increments on every respawn
  @type("number") hits: number; // 50000 - what a fresh boulder starts at
  @type("number") hitsRemaining: number; // counts down to 0
  @type("number") brokenAt: number; // epoch ms; 0 while standing
  @type("number") respawnAt: number; // epoch ms; 0 while standing
  @type({ map: "number" }) miners: MapSchema<number>; // farmId -> hits this round
}
```

`roundId` must be unique for the lifetime of the farm's day (it is the
idempotency key for the claim), so persist a counter or derive it from
timestamps - don't restart at 0 whenever the room reboots within a day. A
simple option is `roundId = Math.floor(spawnedAt / 1000)`.

### Client → server message

```ts
room.send("loveBoulder.hit", { roundId: number });
```

Rules:

- Ignore if `roundId` ≠ the current round, or the boulder is broken
  (`brokenAt > 0`).
- Ignore if the player's last accepted hit was under **200ms** ago.
- Ignore if the player is further than ~**40px** from the boulder (use the
  position in `state.players`; the client refuses to send from further away,
  so this only guards forged messages).
- Otherwise `hitsRemaining -= 1` and `miners[farmId] += 1`.
- When `hitsRemaining` reaches **0**: set `brokenAt = now`,
  `respawnAt = now + 5_000`. Leave `miners` populated - clients read it to
  know whether they helped (a reload mid-round loses their local count).
- At `respawnAt`: `roundId += 1`, `hitsRemaining = hits`, `brokenAt = 0`,
  `respawnAt = 0`, clear `miners`.

The room does not need to know about the daily claim limit - the claim is a
game event and the once-a-day rule is enforced client-side against the
farm's `floatingIsland.prizeClaims` (and bounded by the event's daily caps).

### What the client does

- Shows `hitsRemaining` in a label above the boulder (nothing else), subtracting hits it
  has sent that the room hasn't reflected yet, and never lets that optimistic
  count reach zero - only `brokenAt > 0` breaks the boulder.
- Each tap: must be within reach, respects the 200ms cooldown, sends
  `loveBoulder.hit`, shakes the boulder and chips off rubble.
- When `brokenAt` flips from 0: plays the shatter and shows a clickable
  Love Charm "+5" on the rubble while `now < respawnAt`.
- Clicking it: if `miners[farmId] > 0` (or its own count is > 0) and the farm
  has no `love_boulder` claim today, dispatches
  `floatingIslandPrize.claimed { amount, game: "love_boulder", roundId }`
  with `amount = min(5, remaining today)` and floats a "+N". Players who
  didn't hit it get a "hit the boulder" bubble; players who already claimed
  today get an "already claimed" bubble. Nothing is claimed automatically -
  miss the window and the prize is gone.
- When the new round arrives the boulder reappears at full hits.

### Until the room ships

If `state.loveBoulder` is absent (or `hits` is 0), the client runs a local
stand-in: a simulated crowd takes 40 hits/s, the local player's taps come
off on top, and the break/5s window/respawn cycle runs on the client's own
clock. Once the room publishes `loveBoulder` the client switches over
automatically.

## 5. Lover's Push — MMO room

Four identical boulders on a **6x6 grid** in the centre clearing (the spot
the Dilemma platforms use - only one of the two is on, see section 2). Tiles
are **20px**, the grid's top-left is world px **(555, 506)**, so tile `(x, y)`
has its centre at `(555 + 20x + 10, 506 + 20y + 10)`. Boulder art is
`resources/stone_rock.png` (18x16); boulders are solid.

- A player **walks into a boulder** to shove it **one tile** the way they're
  heading. Anyone can push at any time - **first come, first served**; a
  boulder can be pushed again once it has finished sliding (**300ms**).
  Everyone sees it slide. Each shove credits the pusher with a move.
- **Four target tiles are hidden.** The room publishes only `lit` - how many
  boulders are on a target. Nothing says which boulder or which tile, and
  pushing a boulder off a target turns its light off again. That is the
  puzzle: the crowd has to work out which placements are right.
- Boulders can't leave the grid and can't be pushed into each other. The
  border around the grid is walkable, so a boulder on a wall or in a corner
  can always be pushed back in from outside. Layouts are generated solvable
  (with these rules that's nearly every roll).
- All four lit = **solved**. The layout is celebrated for **10s**
  (`solvedAt`/`nextRoundAt`), then a fresh one appears with `roundId + 1`.
- Everyone credited with at least one move in the solved round is paid
  automatically by their client (no click): **20** Love Charms for VIP, **3**
  otherwise, **once per farm per UTC day** (capped by the daily limits).

```ts
LOVE_PUSH_GRID_SIZE = 6;
LOVE_PUSH_BOULDERS = 4;
LOVE_PUSH_MOVE_MS = 300; // slide time = per-boulder push cooldown
LOVE_PUSH_PRIZES = { vip: 20, standard: 3 };
LOVE_PUSH_MAX_CLAIMS = 1; // per farm per UTC day
LOVE_PUSH_SOLVED_MS = 10_000; // celebration before the next layout
LOVE_PUSH_MIN_SOLUTION_PUSHES = 6; // generator rejects easier layouts
```

### Layout (seeded)

The layout for a round is derived from `roundId` with the **same
mulberry32** as the Dilemma tiers, so the server and every client agree on
where the boulders start without any extra message - and the server never
has to publish the targets. Port `getLovePushLayout` from
`src/features/world/lib/loveIsland.ts` **verbatim** (it and its helpers
`pickLovePushTiles`, `getLovePushSolutionLength`, `canLovePush`,
`applyLovePush` are pure and unit-tested). In short:

```ts
random = mulberry32(roundId * 104729 + 7);
repeat up to 40 times:
  targets  = 4 distinct random tiles (uniform over the 36, drawn without replacement)
  boulders = 4 distinct random tiles not on a target
  if unsolvable (BFS over boulder sets with the push rules): continue
  if fewest pushes >= 6: accept
  else remember the first solvable one as a fallback
accept the fallback, or (never in practice) the fixed layout in the code
```

`roundId` must be unique for the lifetime of the farm's day (it is the
idempotency key for the claim) - persist a counter or derive it from a
timestamp, e.g. `roundId = Math.floor(startedAt / 1000)`; don't restart at 0
when the room reboots. The client's local stand-in starts at 1.

### Push rules (must match the client exactly)

```ts
DELTAS = { north: (0,-1), east: (1,0), south: (0,1), west: (-1,0) };

canPush(boulders, b, dir):
  to     = boulders[b] + DELTAS[dir]      // where it goes
  pusher = boulders[b] - DELTAS[dir]      // where the pusher comes from (may be off the grid)
  return inGrid(to) && !occupied(to) && !occupied(pusher)
```

`direction` is the way the **boulder** moves: a player pushing `east` is
walking into it from the **west** - from the border tile if the boulder is
on the west edge.

### Room state (`PlazaRoomState.lovePush`)

Present only in the `love_island` room while Lover's Push is the centre
puzzle. The client treats `boulders.length !== 4` (or the field missing) as
"the room isn't running it" and simulates locally.

```ts
class LovePush extends Schema {
  @type("number") roundId: number; // +1 on every new layout
  @type(["number"]) boulders: ArraySchema<number>; // length 4, tile index y*6+x
  @type("number") lit: number; // boulders on a target, 0..4
  @type({ map: "number" }) pushers: MapSchema<number>; // farmId -> boulders moved this round
  @type("number") solvedAt: number; // epoch ms; 0 while unsolved
  @type("number") nextRoundAt: number; // epoch ms; 0 while unsolved
}
```

Keep `targets` (and per-boulder `movedAt`) in private fields on the room -
**never** in the schema.

### Client → server message

```ts
room.send("lovePush.push", { roundId: number; boulder: 0 | 1 | 2 | 3; direction: string });
```

Rules:

- Ignore if `roundId` ≠ the current round, the round is solved
  (`solvedAt > 0`), `boulder` is not `0..3`, `direction` is not one of the
  four, or `canPush` is false.
- Ignore if that boulder moved less than **300ms** ago (first come, first
  served - the client won't send faster, so this only guards forged or racing
  messages).
- Ignore if the player is further than ~**30px** from the pusher tile's
  centre, i.e. not standing behind the boulder (use `state.players`; the
  client only sends while physically pressing against it, so this only
  guards forged messages).
- Otherwise: `boulders[boulder] += DELTAS[direction]`, `movedAt[boulder] =
now`, `pushers[farmId] += 1`, recompute `lit = boulders on a target`.
- If `lit === 4`: `solvedAt = now`, `nextRoundAt = now + 10_000`. Leave
  `pushers` populated - clients read it to know whether they helped (a reload
  mid-round loses their local count).

At `nextRoundAt`: `roundId += 1`, `boulders`/private targets from
`getLovePushLayout(roundId)`, `lit` recomputed (0 by construction), clear
`pushers` and `movedAt`, `solvedAt = nextRoundAt = 0`.

The room does not need to know about the daily claim limit - the claim is a
game event and the once-a-day rule is enforced client-side against the farm's
`floatingIsland.prizeClaims` (and bounded by the event's daily caps).

### What the client does

- Draws the grid, the four boulders at `boulders` (solid), and four lights in
  a label above the grid with the first `lit` of them green.
- While the local player is walking into a boulder (a physics collision with
  their movement pointing at it) and `canPush` holds, sends `lovePush.push`
  once per 300ms per boulder, remembering the direction it asked for.
- When a boulder's tile changes it slides there (300ms) for everyone; the
  client credits itself a move if the boulder went the way it shoved it,
  until `pushers` catches up. If a boulder slides onto the local player they
  are nudged one tile further on.
- When `solvedAt` flips from 0: tints the boulders green and flashes the
  lights. If `max(pushers[farmId], own count) > 0` and the farm has no
  `love_push` claim today, dispatches
  `floatingIslandPrize.claimed { amount, game: "love_push", roundId }` with
  `amount = min(prize, remaining today)` and floats a "+N". Players who
  already claimed today get an "already claimed" bubble; nothing for players
  who didn't help. Pushing during the celebration just shows a "wait for the
  next puzzle" bubble.
- When `roundId` changes the boulders snap to the new layout and the lights
  go out.

### Until the room ships

If `state.lovePush` is absent (or has no boulders), the client runs a local
stand-in: the same seeded layout, the local player's shoves apply straight
away, and a simulated crowd shoves a random boulder that isn't on a target
every **8s** so boulders are seen moving that the player didn't push. The
10s celebration and next layout run on the client's own clock. Once the room
publishes `lovePush` the client switches over automatically.
