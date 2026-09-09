# Love Island daily puzzles — server spec

Love Island hosts daily puzzles: the Love Dilemma or Lover's Push in the
middle of the island (one at a time), the Love Boulder at the top and the
Love Marvel in the lake on the west. Every
puzzle pays out
Love Charms through a single game event, `floatingIslandPrize.claimed`, so the
daily caps live in one place. This document is the contract the game API and
the MMO (Colyseus) room need to implement.

Client source of truth: `src/features/world/lib/loveIsland.ts` and
`src/features/world/lib/loveKraken.ts` (pure rules, unit-tested) and
`src/features/world/scenes/LoveIslandScene.ts`.

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
- [ ] Publish `state.lovePush` (section 5) with the seeded starts; handle
      `lovePush.push`: record the player's push and publish the counts, roll
      the boulder a tile once **five** players (**two** off mainnet) push it
      the same way (300ms cooldown per boulder) - parking on a free square,
      or, if it hits anything (another boulder included), bursting and
      restarting on its side - credit the crowd on a roll or a park,
      celebrate 10s when all four squares are taken, next round. Drop a player's
      pushes when they leave. Carry a verbatim copy of `loveIslandTiles.ts`.
- [ ] Publish `state.loveKraken` (section 6) and handle `loveKraken.reel`:
      judge the reel against the epoch-anchored ring, add a point, record the
      angler, drag 3 points a second back, land it at `health`, hold the prize
      10s, respawn. Roll its prize per UTC day, the same way as the boulder's.
- [ ] No change to `giantFlower` — leave it as is (unused by the client now).

## 1. Game API — `floatingIslandPrize.claimed`

Client handler: `src/features/game/events/landExpansion/claimFloatingIslandPrize.ts`.
Port it as-is.

### Action

```ts
{
  type: "floatingIslandPrize.claimed";
  amount: number;                          // integer, 0..100
  game?: "petal_puzzle" | "love_dilemma" | "love_boulder" | "love_push" | "love_kraken"; // which puzzle paid out
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
    game?: "petal_puzzle" | "love_dilemma" | "love_boulder" | "love_push" | "love_kraken";
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

**Puzzles that pay an item instead.** `FLOATING_ISLAND_GAME_ITEM_PRIZE` maps a
game name to `{ item, amount }` — today just `love_push` →
`{ item: "Bronze Love Box", amount: 1 }`, the prize the petal puzzle used to
pay for the same clearing. For those games the claim's `amount` is **ignored**:
no Love Charms are added, the daily Love Charm cap is neither checked nor
consumed, and the claim is recorded as `amount: 0` so it cannot squeeze the
other puzzles out of the day's budget. The amount is ignored rather than
rejected so a client that has not shipped the change yet still gets its box.
Every game listed there must also appear in the per-game daily claim cap, or
the item would be mintable once per round rather than once per day.

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
island) and the Love Marvel (section 6, the lake on the west) both run all
day, every day alongside either, and alongside each other — three things are
live at once and each pays its own prize once a day. The petal puzzle is no
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
it down from **10,000 hits** to zero. When it cracks, the day's prize sits
on the rubble for **5 seconds**: anyone who landed at least one
hit on that boulder can click it to claim, **once per UTC day**. When the 5
seconds are up a fresh boulder appears at 10,000 and anyone who didn't click
misses out. There is no guide entry and no HUD beyond the hit count above
the boulder (in a label) and a health bar below it - the boulder is meant to
be discovered. The boulder's collider is the art plus an **8px** buffer on
every side, so the crowd mines it from around its edge rather than standing
on top of it.

```ts
LOVE_BOULDER_HITS = 10_000;
LOVE_BOULDER_MAX_CLAIMS = 1; // per farm per UTC day
LOVE_BOULDER_HIT_COOLDOWN_MS = 200; // per player
LOVE_BOULDER_RESPAWN_MS = 5_000; // = the prize window
```

**The prize** is rolled per UTC day on the API and published on the room as
`prize` (an item name, or the literal `"Coins"`) plus `prizeAmount` — a
Bronze Love Box, a Bronze Food Box, 250 coins or 500 coins (client PRs #7631
and #7632). `"love_boulder"` is in `FLOATING_ISLAND_SERVER_PAID_GAMES`, so
the client's copy of the claim event records it as worth **0 Love Charms**
and pays nothing; only the server knows the roll, and the next sync brings
the prize down. The claim is sent with `amount: 0`. Section 6's Love Marvel
uses the same roll.

### Room state (`PlazaRoomState.loveBoulder`)

Present only in the `love_island` room. The client treats `hits === 0` (or
the field missing) as "the room isn't running it" and simulates locally.

```ts
class LoveBoulder extends Schema {
  @type("number") roundId: number; // increments on every respawn
  @type("number") hits: number; // 10000 - what a fresh boulder starts at
  @type("number") hitsRemaining: number; // counts down to 0
  @type("number") brokenAt: number; // epoch ms; 0 while standing
  @type("number") respawnAt: number; // epoch ms; 0 while standing
  @type("string") prize: string; // item name or "Coins" - the day's roll
  @type("number") prizeAmount: number; // 1 for a box, 250 or 500 for coins
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
- Ignore if the player is further than ~**50px** from the boulder (use the
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

- Shows `hitsRemaining` in a label above the boulder and as a health bar
  below it (`hitsRemaining / hits`), subtracting hits it has sent that the
  room hasn't reflected yet, and never lets that optimistic count (or the
  bar) reach zero - only `brokenAt > 0` breaks the boulder.
- Each tap: must be within reach, respects the 200ms cooldown, sends
  `loveBoulder.hit`, shakes the boulder and chips off rubble.
- When `brokenAt` flips from 0: plays the shatter and shows the day's
  prize on the rubble - its icon and amount - while `now < respawnAt`.
- Clicking it: if `miners[farmId] > 0` (or its own count is > 0) and the farm
  has no `love_boulder` claim today, dispatches
  `floatingIslandPrize.claimed { amount: 0, game: "love_boulder", roundId }`
  and names what was won in a bubble - the server pays its own roll. Players who
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

Four identical boulders start at the **top, right, bottom and left of the
island** - hub and spoke - and have to be rolled into **four squares in the
centre of the clearing**, one boulder to a square. Boulders live on the
island's own **16px tile grid** (the map is 80x60 tiles); tile `(x, y)` has
its centre at `(16x + 8, 16y + 8)`. The squares are the 2x2 block
**(37, 34), (38, 34), (37, 35), (38, 35)**; "the centre" for sides and start
distances is tile **(38, 35)** - world px **(616, 568)**. The "boulders" are love
rocks - `public/world/love_rock.png` (18x17, a pixel heart); they are solid,
with a 6px buffer of clear ground on every side so the crowd pushing one
stands around its edge rather than on top of it. The squares are solid to
players too - nobody can stand on them, only boulders go there.

- **One player can't budge a boulder.** A player **walks into a boulder** to
  put their **push** on it in the direction they're heading. A push is a
  standing vote: one per player per boulder (pushing another side moves it),
  kept until the boulder rolls, the round ends or the player leaves the
  room. A boulder can be pushed in **several directions at once** - the
  crowd may be split - and every direction with a push shows its own arrow
  at the boulder's edge (half size on the first push, growing as that crowd
  fills). The first direction to reach the full crowd is the one that goes.
  Never the number.
- Once **five players** (**two** off mainnet - `getLovePushPushersNeeded(network)`,
  both sides) are pushing the same boulder the **same way**, it rolls **one
  tile** that way - see `step` below. Everyone sees it roll, every pusher
  behind it is credited with a move, and **all** pushes on that boulder are
  cleared (whichever way they pointed). Pushes on the other boulders stand.
  A boulder can be pushed again once it has finished rolling (**300ms**).
- **What a roll does** (`step`), in this order: if the tile ahead holds
  **any other boulder** - out in the open or parked in a square - the
  boulder **crashes** (`resets[boulder] += 1`): it bursts, nobody is
  credited, and a fresh one appears at a **new start on the same side of the
  island** (`getLovePushRestart`, seeded by the round, the boulder and the
  number of crashes, so both sides agree; the room publishes `starts`
  anyway). Else if the tile ahead is a **free square**, the boulder
  **parks** there (`sunk[boulder] = true`) - it's done for the round, that
  square is taken, and from now on it's something the others crash into.
  Else if the tile ahead is **not walkable** (water, the edge of the island
  or the map, a rock, tree or building - anything in the map's `Collision`
  layer), it crashes as above. Otherwise it **moves** there. That is the
  puzzle: the island has to agree on a route from each side to a free
  square and not roll a boulder into anything on the way.
- All four parked = **solved**. The round is celebrated for **10s**
  (`solvedAt`/`nextRoundAt`), then fresh boulders appear with `roundId + 1`.
- Everyone credited with at least one move in the solved round is paid
  automatically by their client (no click): **1 Bronze Love Box**, **once per
  farm per UTC day**. That is what the petal puzzle paid for this same
  clearing, so islanders keep the reward they always had. Unlike the other two
  puzzles the prize is an item, not Love Charms, so the daily Love Charm caps
  neither bound it nor are spent by it — VIP and standard get the same box,
  and a player who has already earned their day's charms elsewhere still gets
  one. The claim is still sent through `floatingIslandPrize.claimed` with
  `amount: 0`; the event mints the box (`FLOATING_ISLAND_GAME_ITEM_PRIZE`).

```ts
LOVE_PUSH_BOULDERS = 4;
LOVE_PUSH_MAINNET_PUSHERS_NEEDED = 5; // players pushing the same way to roll a boulder on mainnet
LOVE_PUSH_TESTNET_PUSHERS_NEEDED = 2; // everywhere else, so testers can move one
LOVE_PUSH_PUSHERS_NEEDED = getLovePushPushersNeeded(network); // the value in force here (both sides)
LOVE_PUSH_MOVE_MS = 300; // roll time = per-boulder move cooldown
LOVE_PUSH_CENTRE = { x: 38, y: 35 }; // tile; world (616, 568)
LOVE_PUSH_TARGETS = [(37, 34), (38, 34), (37, 35), (38, 35)]; // the four squares
LOVE_PUSH_MIN_START_DISTANCE = 10; // tiles (Manhattan) from the centre to a start
LOVE_PUSH_PRIZE = { item: "Bronze Love Box", amount: 1 };
LOVE_PUSH_MAX_CLAIMS = 1; // per farm per UTC day
LOVE_PUSH_SOLVED_MS = 10_000; // celebration before the next round
```

### Walkable tiles

Which tiles a boulder can roll over (and a player stand on) comes from the
map: a tile is walkable when a `Ground*` or `Paths*` layer covers it and
neither a `Collision` rectangle nor one of the scene's own solid fixtures
touches it. The fixtures (`src/features/world/lib/loveIslandFixtures.ts`)
are things the scene adds on top of the map - today just the Love Boulder
and its buffer - so a heart can't be rolled under the Love Boulder, where
nobody could stand to push it back out. `_scripts/loveIslandTiles.ts` packs
that into `src/features/world/lib/loveIslandTiles.ts` - one bit per tile,
row-major, LSB first, base64 - and the API carries a **verbatim copy**
(`src/colyseus/src/lib/loveIslandTiles.ts`). Re-run the script and copy
the file whenever `love_island_map.json` or the fixtures change; the room
and every client must agree on these bits or layouts and resets will differ.

### Layout (seeded)

Where the boulders start is derived from `roundId` with the **same
mulberry32** as the Dilemma tiers (`mulberry32(roundId * 104729 + 7)`), so
the server and every client agree - the room publishes `starts` anyway, so
a client that joins mid-round knows where each boulder started. Port
`getLovePushLayout` from `src/features/world/lib/loveIsland.ts`
**verbatim** (it and its helpers are pure and unit-tested). In short:

```
candidates = every walkable tile at Manhattan distance >= 10 from the centre
             from which a LONE boulder can be rolled into a square
             (walk back from the squares: a step from t in direction d needs
              t + d walkable-or-square and t - d walkable, where the pusher stands;
              never through a square)
side(t)    = 0 top / 1 right / 2 bottom / 3 left of the centre, by the larger axis
for boulder b in 0..3:
  pick a random candidate on side b not already picked
  (any candidate, if that side has no room - never happens on this map)

restart(roundId, b, resets, boulders, starts):   // after a crash
  random = mulberry32(roundId * 104729 + 7 + b * 7919 + resets * 31)
  same pick, side b, avoiding every boulder's tile and every start
  (so never the spot it just left); the old start if nowhere is free
```

Boulder `b` is always on side `b` - one at the top, one on the right, one at
the bottom, one on the left - and every boulder **always starts somewhere a
crowd can roll it into a square from**.
Other boulders are ignored when checking that - they can always be rolled
out of the way or sunk first.

`roundId` must be unique for the lifetime of the farm's day (it is the
idempotency key for the claim) - persist a counter or derive it from a
timestamp, e.g. `roundId = Math.floor(startedAt / 1000)`; don't restart at 0
when the room reboots. The client's local stand-in starts at 1.

### Push rules (must match the client exactly)

```ts
DELTAS = { north: (0,-1), east: (1,0), south: (0,1), west: (-1,0) };

step(boulders, b, dir):
  to = boulders[b] + DELTAS[dir]
  if any other boulder i on `to` (parked or not):   return "reset"
  if to is one of the four squares:                  return "sink"    // parks there
  if !walkable(to):                                   return "reset"   // water, edge, rock, tree, building
  return "move"
```

`direction` is the way the **boulder** rolls: a player pushing `east` is
walking into it from the **west**. The player's position is checked against
the tile behind the boulder they touched.

### Room state (`PlazaRoomState.lovePush`)

Present only in the `love_island` room while Lover's Push is the centre
puzzle. The client treats `boulders.length !== 4` (or the field missing) as
"the room isn't running it" and simulates locally.

```ts
class LovePush extends Schema {
  @type("number") roundId: number; // +1 on every new round
  @type(["number"]) boulders: ArraySchema<number>; // length 4, tile index y*80+x (its square once parked)
  @type(["number"]) starts: ArraySchema<number>; // length 4, where each last started from (a fresh spot after every crash)
  @type(["boolean"]) sunk: ArraySchema<boolean>; // length 4, parked in a square
  @type("number") lit: number; // squares taken, 0..4 (= sunk trues)
  @type(["number"]) resets: ArraySchema<number>; // length 4, times each has hit something and gone back
  @type(["number"]) pushCounts: ArraySchema<number>; // length 16: [boulder * 4 + d], players pushing boulder in direction d (north, east, south, west)
  @type({ map: "number" }) pushers: MapSchema<number>; // farmId -> boulders helped roll this round
  @type("number") solvedAt: number; // epoch ms; 0 while unsolved
  @type("number") nextRoundAt: number; // epoch ms; 0 while unsolved
}
```

Keep every player's push (`votes[boulder]: farmId -> direction`) and
per-boulder `movedAt` in private fields on the room - **never** in the
schema. `pushCounts` is **every** direction's crowd on every boulder, flat:
`pushCounts[boulder * 4 + d]` with `d` the direction's index in `north,
east, south, west`. Nobody can tell from the state who is pushing.

### Client → server message

```ts
room.send("lovePush.push", { roundId: number; boulder: 0 | 1 | 2 | 3; direction: string });
```

Rules:

- Ignore if `roundId` ≠ the current round, the round is solved
  (`solvedAt > 0`), `boulder` is not `0..3` or is already parked, or
  `direction` is not one of the four. **Do not** reject a push just because
  the tile ahead is blocked - rolling into something is the penalty, not an
  invalid move.
- Ignore if that boulder moved less than **300ms** ago (it's still rolling -
  the client won't send this fast, so this only guards forged or racing
  messages).
- Ignore if the player is further than ~**30px** from the pusher tile's
  centre, i.e. not standing behind the boulder (use `state.players`; the
  client only sends while physically pressing against it, so this only
  guards forged messages).
- Ignore (nothing to publish) if `votes[boulder][farmId]` is already
  `direction` - the client resends the same push every 2s as a retry.
- Otherwise set `votes[boulder][farmId] = direction` and let `crowd` = the
  farms in `votes[boulder]` pushing `direction`.
  - If `crowd.length < LOVE_PUSH_PUSHERS_NEEDED`: publish the boulder's
    four `pushCounts` and stop.
  - Else clear `votes[boulder]` (all of it, whichever way they pointed - so
    all four of that boulder's `pushCounts` go to 0), set
    `movedAt[boulder] = now`, and apply `step`:
    - `move`: `boulders[boulder] = to`, `pushers[farmId] += 1` for **every**
      farm in `crowd`.
    - `sink`: `boulders[boulder] = to` (the square), `sunk[boulder] = true`,
      credit the crowd as above, `lit = sunk.filter(Boolean).length`.
    - `reset`: `resets[boulder] += 1`, then
      `starts[boulder] = boulders[boulder] = restart(...)` - a fresh spot on
      its side. Nobody is credited. Publish the new start.
- If every boulder is parked: `solvedAt = now`, `nextRoundAt = now + 10_000`.
  Leave `pushers` populated - clients read it to know whether they helped
  (a reload mid-round loses their local count).

On `onLeave`: delete the farm from every `votes[boulder]` and republish the
counts that changed. A push from someone who is gone must not count toward a
crowd that is no longer there.

At `nextRoundAt`: `roundId += 1`, `starts` and `boulders` from
`getLovePushLayout(roundId)`, `sunk` all false, `lit = 0`, `resets` all 0,
clear `votes` (all counts 0), `pushers` and `movedAt`,
`solvedAt = nextRoundAt = 0`.

The room does not need to know about the daily claim limit - the claim is a
game event and the once-a-day rule is enforced client-side against the farm's
`floatingIsland.prizeClaims` (and bounded by the event's daily caps).

### What the client does

- Draws the four squares on the ground as slots (`world/love_boulder_slot.png`,
  a 16x16 hole per tile plus a 1px shadow row below) with an "n/4" tally
  floating above them (how many are taken - it pops when one is), a faint
  ring at each `starts` tile, and the four boulders at `boulders` (solid).
  The slots never change: a taken one is called out by a **tick**
  (`icons/confirm.png`) riding the crown of the boulder parked in it, drawn
  above everything so it reads through a crowd. A parked boulder stays where
  it is, untinted, still solid - the others crash into it. There is no grid
  and no other HUD.
- For every direction with a count > 0 on a boulder: draws the matching
  arrow icon (`arrow_up` / `arrow_right` / `arrow_down` / `arrow_left`)
  **just past the boulder's edge on that side** (10px from its tile centre,
  so arrows from two boulders aiming at one tile stay apart), scaled from
  **half size** at one push to full size at `needed`, with a small bar on
  the far side of the arrow filled `count / needed`. The boulder tints from
  grey toward orange by its **biggest** direction's `count / needed`. No
  number is shown. An arrow pops when someone joins that direction and goes
  away when its count drops to 0.
- While the local player is walking into a boulder (a physics collision with
  their movement pointing at it) and it isn't parked, sends `lovePush.push`
  with the direction they're heading. It remembers that push and only sends
  again on that boulder if the direction changes, or every 2s as a retry
  (the room treats a repeat as a no-op).
- When a boulder's tile changes it rolls there (300ms) for everyone; the
  client credits itself a move if the boulder went the way it was pushing,
  and forgets its push on that boulder either way, until `pushers` catches
  up. If a boulder rolls onto the local player they are nudged one tile
  further on.
- When `resets[boulder]` goes up: the boulder bursts where it was (a flash
  and a spray of rubble) and a fresh one appears at its new `starts` tile
  with a bounce, the ring moving with it; a player who was pushing it gets
  an "it hit something" bubble.
- When `sunk[boulder]` flips to true: the boulder rolls onto its square and
  settles with a bounce, and a tick pops in over it once it lands.
- When `solvedAt` flips from 0: the parked boulders flash. If
  `max(pushers[farmId], own count) > 0` and the farm has no `love_push` claim
  today, dispatches
  `floatingIslandPrize.claimed { amount: 0, game: "love_push", roundId }` -
  the box is the prize, so there is no Love Charm amount to send - and shows a
  "you won a Bronze Love Box" bubble. Players who already claimed today get an
  "already claimed" bubble; nothing for players who didn't help. Pushing
  during the celebration just shows a "wait for the next puzzle" bubble.
- When `roundId` changes the boulders snap to the new `starts`, grey, with
  no arrows, the start rings move with them and the tally reads 0/4.

### Until the room ships

If `state.lovePush` is absent (or has no boulders), the client runs a local
stand-in: the same seeded starts; the local player's push counts straight
away and a simulated player joins it every **1s** until the boulder rolls,
so a lone tester can still shift one; and the simulated crowd rolls a
random boulder that's still out there **one step along its route to a free
square** (`getLovePushRouteStep`, around the other boulders) every **8s**
(five of them at once) so boulders are seen moving that the player
didn't push. The 10s celebration and next round run on the client's own
clock. Once the room publishes `lovePush` the client switches over
automatically.

## 6. Love Marvel — MMO room

A Love Marine Marvel lurks in the lake on the west of the island, its head
and four tentacles breaking the surface at world px **(306, 566)** — the
east side of the lake, right off the end of the wharf. (The seasonal
guardian that used to stand in this water has been removed.) It is a
community game: a ring sweeps around the beast
with a catch zone on it, and every islander on the bank casts a line and
reels **on the beat**. Each landed reel drags the Marvel a point closer to
the surface; the Marvel drags **three points a second** back. One angler can
never out-pull it. Around **twenty** reeling properly land it in about a
minute.

**Every landed reel changes the ring** for the angler who landed it: the
catch zone jumps a quarter turn or more away, the marker reverses direction,
and the sweep winds up 40ms tighter — so the fight gets more frantic the
closer that angler is to landing the beast, and nobody can settle into a
rhythm. A purple dot is left where the reel scored.

When it is landed, the day's prize floats over it for **10 seconds** and
**claims itself two seconds in** for anyone who landed at least one reel on
that Marvel, **once per UTC day**. Nobody has to click. When the window
shuts a fresh Marvel surfaces at no progress. Like the Love Boulder there is no
guide entry and no HUD beyond the ring, the fishing disc above it and the
progress bar below — it is meant to be discovered.

Client source of truth: `src/features/world/lib/loveKraken.ts`.

```ts
LOVE_KRAKEN_SPOT = { x: 306, y: 566 }; // ring centre / reach anchor
LOVE_KRAKEN_HEALTH = 1700; // points to land it
LOVE_KRAKEN_REEL_POINTS = 1; // one landed reel
LOVE_KRAKEN_FIGHT_BACK_PER_SEC = 3; // points it drags back a second
LOVE_KRAKEN_RING_MS_MAX = 2_000; // sweep on a fresh line
LOVE_KRAKEN_RING_MS_MIN = 1_200; // ...and the tightest it gets
LOVE_KRAKEN_RING_MS_STEP = 40; // tighter by this much per landed reel
LOVE_KRAKEN_ZONE_SHARE = 0.12; // the catch zone, as a share of a sweep
LOVE_KRAKEN_ZONE_HALF_DEG = 21.6; // = 360 * 0.12 / 2
LOVE_KRAKEN_REACH = 90; // how close a player must stand
LOVE_KRAKEN_RESPAWN_MS = 10_000; // = the prize window
LOVE_KRAKEN_AUTO_CLAIM_MS = 2_000; // it pays itself this far in
LOVE_KRAKEN_MAX_CLAIMS = 1; // per farm per UTC day

// Fastest a reel can land. Only long enough to stop two landing on one pass
// of the zone - the zone jumping away is what actually paces an angler.
getLoveKrakenReelCooldownMs(ringMs) = round(ringMs * 0.12 * 2); // 480ms at 2s
```

**Where the numbers come from.** The zone jumps 90-270° from where it was,
so the marker reaches the next one after **half a sweep** on average - one
reel per `ringMs / 2`, or 1/s on a fresh line. Twenty anglers make 20/s
against the Marvel's 3/s, and their sweeps tighten as they go (1s a reel
down to 0.6s after twenty reels), so they take about 16s to make the first
351 points and then run at ~30/s: `351 + 44 × 30.3 ≈ 1690`.

Fewer anglers still get there, just slowly - three is roughly the point
where the Marvel stops losing at all on a fresh line. Change `health` and
the room's number is the one the client draws the bar from, so it can be
retuned without a client release.

### The ring — one per angler, in legs

Each angler has their own ring: their own zone, their own direction and
their own sweep. It is drawn and judged **entirely on the client** — the
room needs none of it (see the message rules below for what the room does
enforce, and why that is enough).

**Every pull of the rod moves the zone, landed or missed.** Without that the
game is beaten by holding the button down: every tap is free, so the marker
eventually wanders into a zone that never moved. With it, a mashed pull
lands only the 12% of the ring the zone covers and then throws the aim
somewhere new — measured in the scene, mashing lands **11 reels a minute
against 116** for waiting for the marker. A missed pull costs an angler
about as much time as one that lands, and scores nothing.

A **landed** pull additionally reverses the marker and winds the sweep up
40ms, and leaves a purple dot where it scored.

The marker runs in **legs**: a leg starts the instant a reel lands and runs
until the next one does, and it begins at exactly the angle the marker had
reached — so the reversal and the wind-up never move it. A **miss leaves the
marker alone** and only moves the zone, so the line keeps sweeping evenly
however wildly the angler is tapping.

> Reading the phase straight off the clock as `now % ringMs` looks
> equivalent and is not: the moment `ringMs` changes, that phase lurches.
> That is what made the marker snap back to the top mid-sweep.

```ts
// Client-side only. `mulberry32` is the same one the Dilemma uses.

function getLoveKrakenRingMs(reels: number): number {
  return Math.max(1200, 2000 - Math.max(0, reels) * 40);
}

function getLoveKrakenSpin(reels: number): 1 | -1 {
  return Math.max(0, reels) % 2 === 0 ? 1 : -1; // 1 clockwise
}

// Degrees clockwise from the top. Starts at the top and jumps 90-270 degrees
// from where it was on EVERY pull, so it always visibly moves.
function getLoveKrakenZoneAngle({ roundId, attempts }): number {
  const random = mulberry32(roundId * 7919 + 13);
  let angle = 0;
  for (let i = 0; i < Math.max(0, attempts); i++) {
    angle = (angle + 90 + random() * 180) % 360;
  }
  return angle;
}

// angler = { attempts, reels, legStartAt?, legStartAngle? }
function getLoveKrakenRing({ roundId, angler, now }) {
  const reels = Math.max(0, angler.reels);
  const ringMs = getLoveKrakenRingMs(reels);
  const spin = getLoveKrakenSpin(reels);
  const zoneAngle = getLoveKrakenZoneAngle({
    roundId,
    attempts: angler.attempts,
  });
  const wrap = (a: number) => ((a % 360) + 360) % 360;

  // No leg to anchor to yet, so read it off the clock
  if (angler.legStartAt === undefined || angler.legStartAngle === undefined) {
    return {
      angle: wrap(((now % ringMs) / ringMs) * 360),
      zoneAngle,
      ringMs,
      spin,
    };
  }

  const swept = ((now - angler.legStartAt) / ringMs) * 360;
  return {
    angle: wrap(angler.legStartAngle + spin * swept),
    zoneAngle,
    ringMs,
    spin,
  };
}
```

A reel is on the beat when the marker is within **21.6°** of `zoneAngle`,
the short way round.

### Room state (`PlazaRoomState.loveKraken`)

Present only in the `love_island` room. The client treats `health === 0` (or
the field missing) as "the room isn't running it" and simulates locally.

```ts
class LoveKraken extends Schema {
  @type("number") roundId: number; // increments on every respawn
  @type("number") health: number; // 1700 - what a fresh Marvel needs
  @type("number") progress: number; // 0..health, counts up
  @type("number") caughtAt: number; // epoch ms; 0 while it fights
  @type("number") respawnAt: number; // epoch ms; 0 while it fights
  @type("string") prize: string; // item name or "Coins"
  @type("number") prizeAmount: number; // 1 for a box, 250 or 500 for coins
  @type({ map: "number" }) anglers: MapSchema<number>; // farmId -> reels
}
```

`roundId` must be unique for the lifetime of the farm's day (it is the
idempotency key for the claim), so persist a counter or derive it from
timestamps — don't restart at 0 whenever the room reboots within a day.
`roundId = Math.floor(spawnedAt / 1000)` is fine.

`progress` may be fractional (the fight-back is continuous); the client
rounds it for the bar. Publishing it on a tick of ~200ms is plenty — the bar
is 46px wide, so smaller steps are invisible.

### The fight back

On a timer, and floored at zero:

```ts
progress = Math.max(0, progress - (elapsedMs / 1000) * 3);
```

It runs the whole time the Marvel is fighting, including while nobody is on
the bank, so an abandoned Marvel drains back to zero rather than banking the
crowd's work for later. It stops once the Marvel is caught.

### Client → server message

```ts
room.send("loveKraken.reel", { roundId: number });
```

Rules:

- Ignore if `roundId` ≠ the current round, or the Marvel is caught
  (`caughtAt > 0`).
- Ignore if their last accepted reel was under
  `getLoveKrakenReelCooldownMs(getLoveKrakenRingMs(anglers[farmId]))` ago —
  **500ms** on a fresh line, down to 300ms once that angler has 20 reels.
  `anglers[farmId]` is the only input, and the room already has it.
- Ignore if the player is further than **90px** from `(306, 566)` (use the
  position in `state.players`; the client refuses to send from further away,
  so this only guards forged messages). 90 covers the two places anyone can
  stand at this end of the lake: the **wharf**, about 22px off its end, and
  the **west bank** across the water. They face each other over the beast.
- Otherwise `progress = min(health, progress + 1)` and `anglers[farmId] += 1`.

**Why the room does not check the ring.** It could — the geometry is
deterministic — but only by tracking each angler's attempt count, leg anchor
and leg angle, and by staying in step with the client on all three across
dropped and in-flight messages. That is a lot of state and a lot of ways to
desync a player out of the game, for a shared bar whose prize is capped at
one roll per farm per UTC day.

The cooldown does the job instead. It is set to the **tightest gap the zone
can legitimately leave** (a quarter turn), so it never blocks an honest
angler who got a short jump, while capping a forged client that ignores the
ring entirely at **two reels a sweep** against the one a sweep an honest
angler averages. A cheat is worth at most one extra player on a bar that
needs twenty — and the Love Boulder, which this sits next to, has no check
at all.

- When `progress` reaches `health`: set `caughtAt = now`,
  `respawnAt = now + 10_000`. Leave `anglers` populated — clients read it to
  know whether they helped (a reload mid-round loses their local count).
- At `respawnAt`: `roundId += 1`, `progress = 0`, `caughtAt = 0`,
  `respawnAt = 0`, clear `anglers`, and re-read the day's prize (the UTC day
  may have rolled over).

The room does not need to know about the daily claim limit — the claim is a
game event and the once-a-day rule is enforced client-side against the
farm's `floatingIsland.prizeClaims` (and bounded by the event's daily caps).

### The prize

**The same roll as the Love Boulder** — a Bronze Love Box, a Bronze Food
Box, 250 coins or 500 coins, picked per UTC day on the API and published as
`prize` (the item name, or the literal `"Coins"`) plus `prizeAmount`. Reuse
the boulder's roll; whether the two share a seed for the day or roll
independently is the API's call, but they are separate claims and a player
can take both on the same day.

Client-side, `"love_kraken"` is in `FLOATING_ISLAND_SERVER_PAID_GAMES`, so
this copy of the event records the claim as worth **0 Love Charms** and pays
nothing — only the server knows the roll. The API's copy pays the prize and
the next sync brings it down.

```ts
{ type: "floatingIslandPrize.claimed", amount: 0, game: "love_kraken", roundId }
```

### What the client does

- Draws the beast (`kraken_head.webp` 11x12 and four `kraken_tentacle.webp`
  8x16, each with its own ripple) at **native size on integer top-left
  coordinates**, never scaled, rotated or tweened, so every pixel lines up
  with the map tiles behind it. Around it: the ring with the green catch
  zone and a white marker sweeping it, a fishing disc above it
  (`world/fishing_disc.png`) and the island's progress bar below. The bar
  runs **green while the bank is gaining and red while the Marvel is**, so a
  thin crowd can see at a glance that they need more hands. No numbers.
- The disc, the ring and the beast are all one button. The **first** click
  (within reach) casts the line and leaves it in the water — the Bumpkin
  plays `casting` and settles into the `waiting` loop. **Every click after
  that** plays `reeling` and drops back into `waiting`, whether or not it
  landed. A miss does nothing at all; a hit splashes, flashes the marker
  green and sends `loveKraken.reel`. Walking anywhere takes the line out.
- The bar is **the room's** — a reel of your own flashes the marker and
  splashes, it never moves the bar optimistically. With a crowd on the bank
  the bar is moving constantly anyway.
- On a landed reel: a purple dot pops on the ring where it scored and fades,
  the marker flashes green, the water splashes, and the zone, direction and
  sweep all change for the next leg. A miss flashes the marker red and does
  nothing else.
- Every other player the room lists in `anglers`, and who is still within
  reach, holds their rod out and pulls it whenever their count goes up. This
  needs no extra traffic beyond `anglers`.
- When `caughtAt` flips from 0: the beast thrashes, splashes and fades, and
  the day's prize floats where the disc was while `now < respawnAt`.
- **It claims itself.** Two seconds into the window, every player with
  `anglers[farmId] > 0` (or their own count > 0) and no `love_kraken` claim
  today dispatches the claim above on their own, cheers, and gets a bubble
  naming what they won — nobody has to click, and nobody who helped haul the
  beast up can miss out by looking away. The remaining eight seconds are
  celebration. Clicking the prize before then just takes it early; a player
  who never reeled is left alone rather than nagged.
- When `roundId` changes a fresh Marvel surfaces at no progress.

The Marvel sits in the lake, which the map's `Collision` layer already
blocks, so it needs no fixture in `loveIslandFixtures.ts` and the walkable
tile bitmap is unchanged — a Lover's Push rock could never roll onto water
anyway.

### Until the room ships

If `state.loveKraken` is absent (or `health` is 0), the client runs a local
stand-in: a simulated bank lands what **twenty anglers** reeling properly
would make - 20 reels a second on a fresh Marvel, winding up to 33/s as the
fight goes on - against the same 3/s fight back, the local player's own
reels go straight on top, and the catch / 10s window / respawn cycle runs on
the client's own clock. Once the room publishes `loveKraken`
the client switches over automatically — no client change needed.
