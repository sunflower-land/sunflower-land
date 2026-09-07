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
- [ ] Publish `state.lovePush` (section 5) with the seeded starts; handle
      `lovePush.push`: record the player's push and publish the counts, roll
      the boulder a tile once **five** players (**two** off mainnet) push it
      the same way (300ms cooldown per boulder) - into the pit, or, if it
      hits something, bursting and restarting on its side - credit the crowd
      on a roll or a sink,
      celebrate 10s when all four are sunk, next round. Drop a player's
      pushes when they leave. Carry a verbatim copy of `loveIslandTiles.ts`.
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
it down from **10,000 hits** to zero. When it cracks, a **5 Love Charm**
prize sits on the rubble for **5 seconds**: anyone who landed at least one
hit on that boulder can click it to claim, **once per UTC day**. When the 5
seconds are up a fresh boulder appears at 10,000 and anyone who didn't click
misses out. There is no guide entry and no HUD beyond the hit count above
the boulder (in a label) and a health bar below it - the boulder is meant to
be discovered. The boulder's collider is the art plus an **8px** buffer on
every side, so the crowd mines it from around its edge rather than standing
on top of it.

```ts
LOVE_BOULDER_HITS = 10_000;
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

Four identical boulders start at the **top, right, bottom and left of the
island** - hub and spoke - and have to be rolled into a **pit in the centre
of the clearing**. Boulders
live on the island's own **16px tile grid** (the map is 80x60 tiles); tile
`(x, y)` has its centre at `(16x + 8, 16y + 8)`. The pit is tile **(38, 35)**

- world px **(616, 568)**. Boulder art is `resources/stone_rock.png`
  (18x16); boulders are solid.

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
- **What a roll does** (`step`): if the tile ahead is the **pit**, the
  boulder **sinks** - it's done, out of play, nothing can bump into it. If
  the tile ahead is **not walkable** (water, the edge of the island or the
  map, a rock, tree or building - anything in the map's `Collision` layer)
  or holds **another boulder still in play**, the boulder **crashes**
  (`resets[boulder] += 1`): it bursts, nobody is credited, and a fresh one
  appears at a **new start on the same side of the island**
  (`getLovePushRestart`, seeded by the round, the boulder and the number of
  crashes, so both sides agree; the room publishes `starts` anyway).
  Otherwise it **moves** there. That is the puzzle: the island
  has to agree on a route from each side to the centre and not roll a
  boulder into anything on the way.
- All four sunk = **solved**. The round is celebrated for **10s**
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
LOVE_PUSH_PIT = { x: 38, y: 35 }; // tile; world (616, 568)
LOVE_PUSH_MIN_START_DISTANCE = 10; // tiles (Manhattan) from the pit to a start
LOVE_PUSH_PRIZE = { item: "Bronze Love Box", amount: 1 };
LOVE_PUSH_MAX_CLAIMS = 1; // per farm per UTC day
LOVE_PUSH_SOLVED_MS = 10_000; // celebration before the next round
```

### Walkable tiles

Which tiles a boulder can roll over (and a player stand on) comes from the
map: a tile is walkable when a `Ground*` or `Paths*` layer covers it and no
`Collision` rectangle touches it. `_scripts/loveIslandTiles.ts` packs that
into `src/features/world/lib/loveIslandTiles.ts` - one bit per tile,
row-major, LSB first, base64 - and the API carries a **verbatim copy**
(`src/colyseus/src/lib/loveIslandTiles.ts`). Re-run the script and copy
the file whenever `love_island_map.json` changes; the room and every
client must agree on these bits or layouts and resets will differ.

### Layout (seeded)

Where the boulders start is derived from `roundId` with the **same
mulberry32** as the Dilemma tiers (`mulberry32(roundId * 104729 + 7)`), so
the server and every client agree - the room publishes `starts` anyway, so
a client that joins mid-round knows where each boulder started. Port
`getLovePushLayout` from `src/features/world/lib/loveIsland.ts`
**verbatim** (it and its helpers are pure and unit-tested). In short:

```
candidates = every walkable tile at Manhattan distance >= 10 from the pit
             from which a LONE boulder can be rolled into the pit
             (walk back from the pit: a step from t in direction d needs
              t + d walkable-or-pit and t - d walkable, where the pusher stands)
side(t)    = 0 top / 1 right / 2 bottom / 3 left of the pit, by the larger axis
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
crowd can roll it home from**.
Other boulders are ignored when checking that - they can always be rolled
out of the way or sunk first.

`roundId` must be unique for the lifetime of the farm's day (it is the
idempotency key for the claim) - persist a counter or derive it from a
timestamp, e.g. `roundId = Math.floor(startedAt / 1000)`; don't restart at 0
when the room reboots. The client's local stand-in starts at 1.

### Push rules (must match the client exactly)

```ts
DELTAS = { north: (0,-1), east: (1,0), south: (0,1), west: (-1,0) };

step(boulders, sunk, b, dir):
  to = boulders[b] + DELTAS[dir]
  if to == PIT:                                   return "sink"
  if !walkable(to):                               return "reset"   // water, edge, rock, tree, building
  if any other boulder i, !sunk[i], on `to`:      return "reset"
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
  @type(["number"]) boulders: ArraySchema<number>; // length 4, tile index y*80+x (the pit once sunk)
  @type(["number"]) starts: ArraySchema<number>; // length 4, where each last started from (a fresh spot after every crash)
  @type(["boolean"]) sunk: ArraySchema<boolean>; // length 4, in the pit
  @type("number") lit: number; // boulders in the pit, 0..4 (= sunk trues)
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
  (`solvedAt > 0`), `boulder` is not `0..3` or is already sunk, or
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
    - `sink`: `boulders[boulder] = PIT`, `sunk[boulder] = true`, credit the
      crowd as above, `lit = sunk.filter(Boolean).length`.
    - `reset`: `resets[boulder] += 1`, then
      `starts[boulder] = boulders[boulder] = restart(...)` - a fresh spot on
      its side. Nobody is credited. Publish the new start.
- If every boulder is sunk: `solvedAt = now`, `nextRoundAt = now + 10_000`.
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

- Draws the pit at (616, 568) with an "n/4" tally floating above it (how
  many are sunk - it pops when one drops in), a faint ring at each `starts`
  tile, and the four boulders at `boulders` (solid). A sunk boulder is
  hidden and has no collider. There is no grid and no other HUD.
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
  their movement pointing at it) and it isn't sunk, sends `lovePush.push`
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
- When `sunk[boulder]` flips to true: the boulder rolls into the pit and
  shrinks away; the pit gulps.
- When `solvedAt` flips from 0: the pit pulses. If
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
random boulder that's still out there **one step toward the pit** every
**8s** (five of them at once) so boulders are seen moving that the player
didn't push. The 10s celebration and next round run on the client's own
clock. Once the room publishes `lovePush` the client switches over
automatically.
