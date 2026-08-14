# Community Games (Giveaways) — how to build a mini-game

Community games are the little mini-games we run during the weekly community
stream. An admin sets one up, players join, everyone plays the **same game at the
same time**, scores are submitted, and winners claim prizes.

This folder holds the Phaser **scenes** — one per mini-game (`RaceScene`,
`ChopScene`, `JumpScene`, `TriviaScene`, `PopScene`). This doc is the short version
of how the whole thing hangs together so a new game can be spun up quickly.

---

## The idea in one picture

```
   Admin creates a giveaway (picks a mini-game + prizes + a start time)
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                          ▼
     LOBBY  ───────────────►   PLAYING   ───────────────►  RESULTS
  (upcoming)   startAt         (live)      30s later       (complete)
  everyone     reached       the game       time's up      leaderboard
  waits,                     runs, you      → submit        + winners
  paused                     score points     your score     claim prizes
```

Everyone shares one lifecycle. **Only the Phaser scene differs per game** — the
lobby, the clock, score submission, results and prizes are all handled for you.

---

## The lifecycle (phases)

The scene reads the current phase every frame via `bridge.getPhase()`
(see [`../lib/phase.ts`](../lib/phase.ts)). It's derived from the server status +
the clock, so you never manage it yourself:

| Phase      | What's happening                       | What your scene should do           |
| ---------- | -------------------------------------- | ----------------------------------- |
| `loading`  | Board not fetched yet                  | Nothing / idle                      |
| `lobby`    | Joined, paused, waiting for `startAt`  | Stand still, `idle()` the player    |
| `racing`   | **The game is live — play!**           | Run your game, let the player score |
| `ended`    | Time's up, awaiting admin finalisation | Stop the game                       |
| `complete` | Finalised, prizes claimable            | Stop the game                       |

The clock is fixed at **30s** (`RACE_DURATION_MS` in
[`../lib/sim.ts`](../lib/sim.ts)), anchored to `bridge.getRaceStartAt()`.

**Running longer than 30s.** A multi-round game keeps its own duration and derives
rounds from the same `getRaceStartAt()` anchor — see `TRIVIA_GAME_MS`/`triviaRound`
in [`../lib/trivia.ts`](../lib/trivia.ts) and `POP_GAME_MS`/`popRound` in
[`../lib/pop.ts`](../lib/pop.ts). If you do that, opt out of the shared 30s
countdown in [`../GiveawayGame.tsx`](../GiveawayGame.tsx) and show your own, and
widen `RACE_WINDOW_MS` in [`../lib/mockGiveaways.ts`](../lib/mockGiveaways.ts) so
the offline fixture doesn't re-anchor mid-game.

---

## Scoring — submit once, at the end

- Higher score = better. Winners are ranked best-first.
- Score whatever you like **during `racing`** (tap accuracy, distance, etc.).
- Push the live number to the HUD with `bridge.onScoreChange(score)` — this is
  **display only**, it does not hit the server.
- When the 30s clock is up, call `bridge.onFinish(finalScore)` **exactly once**.
  That's the single submission to the server. Do **not** submit mid-game — it
  triggers an autosave each time and flashes a loading screen.

```ts
// once, when isRaceOver(elapsed) first becomes true:
if (!this.finished && bridge.getPhase() === "racing" && over) {
  this.finished = true;
  bridge.onFinish(this.score);
}
```

---

## Other players (clothing + movement) come from the MMO — for free

Every giveaway scene connects to **one dedicated party-games server**
(`sunflorea_party_games`) using the giveaway scene as its `sceneId`. It's its own
server so event players aren't mixed in with the town-hall / stream crowd, but a
single shared one so everyone in the event sees each other. Because these scenes
extend `BaseScene`, other players are rendered automatically with their **real
clothing + username** — exactly like the plaza.

> ⚠️ The Colyseus backend must register the `sunflorea_party_games` room id
> (like it already does for `sunflorea_stream`). Until it does, players can't
> join it and you'll see no one else.

**How movement syncs (important):** each client drives _only its own_ Bumpkin and
broadcasts its position with `sendPositionToServer()`; `BaseScene` moves everyone
else toward the positions they broadcast. So live movement only appears if your
scene actually moves the local player **and** calls `sendPositionToServer()` each
frame. (An earlier version faked other racers with a local sim that only animated
during `racing` — that's why players once "spawned but didn't move".)

- **`RaceScene`** moves the local player one hop per correct button press, then
  calls `sendPositionToServer()`; `BaseScene` renders + moves everyone else.
- **`ChopScene`** overrides `updateOtherPlayers()` because nobody walks (they'd
  all stack on one spawn), so it places each room player at a fixed spot around
  you — still with their real clothing from the room state.

> A remote player's clothing arrives at runtime, so bespoke sprite sheets (the
> axe swing) aren't preloaded. Either use a **baked** BumpkinContainer animation
> (`walk()`, `idle()`, `dig()`) or **lazy-load** the sheet on demand — `ChopScene`
> does the latter (`ensureAxe`) so remote choppers swing a real axe.

---

## The bridge — your only link to React

Everything the scene needs is on the `GiveawayBridge`
(see [`../lib/bridge.ts`](../lib/bridge.ts)), read from the Phaser registry:

```ts
private get bridge() {
  return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
}
```

| Member                 | Use                                       |
| ---------------------- | ----------------------------------------- |
| `playerId`             | Local player's farm ID                    |
| `getPhase()`           | Current lifecycle phase (see above)       |
| `getRaceStartAt()`     | Epoch-ms the 30s clock is anchored to     |
| `onScoreChange(score)` | Push live score to the HUD (display only) |
| `onFinish(score)`      | Submit the final score — **call once**    |

---

## Adding a new mini-game — the checklist

Two files carry the config: [`../lib/minigames.ts`](../lib/minigames.ts) (the
metadata — safe for UI to import) and [`registry.ts`](./registry.ts) (the scene
class — Phaser only). Adding a game is: **one config entry + one scene.**

1. **Add a config entry** to `GIVEAWAY_MINIGAMES` in
   [`../lib/minigames.ts`](../lib/minigames.ts): a `type`, `name`, `description`,
   `available: true`, and a `sceneId`. This alone makes it appear in the admin's
   create dropdown with your description.
2. **Add the MMO scene id** to the `Scenes` type and the party-games routing in
   [`mmoMachine.ts`](../../world/mmoMachine.ts), plus a spawn point in
   [`spawn.ts`](../../world/lib/spawn.ts). (Same `sceneId` string as step 1.)
3. **Write the scene** in this folder, extending `BaseScene` with that scene key
   and `controls: { enabled: false }`, then register it under its `type` in
   [`registry.ts`](./registry.ts). Copy `ChopScene` — it's the fullest example.
   Everything downstream (scene list, initial scene) is derived from the config.
4. Score during `racing`, submit once via `onFinish` at the end. Done.

> Need custom on-screen controls (touch buttons)? Keep gameplay in the scene and
> add a small React overlay in [`../GiveawayGame.tsx`](../GiveawayGame.tsx),
> talking to the scene through the `"gameControls"` registry channel (its shape
> is per-game). Two worked examples:
>
> - **Race** — colour buttons: `RaceControls` (`setTarget` + a press `queue`) /
>   [`RaceButtons`](../ui/RaceButtons.tsx).
> - **Jumper** — one tap button: `JumpControls` (a `taps` counter + `tap`) /
>   [`JumpButton`](../ui/JumpButton.tsx).
> - **Pumpkin Pop** — a tap button _plus_ a round HUD: the channel runs both ways
>   (`PopControls` — the button bumps `taps`; the scene publishes the round, the
>   clock and each round's pop reveal back for [`PopPanel`](../ui/PopPanel.tsx) to
>   render). Keeping the clock in the scene means the panel can't drift out of
>   step with what's happening on screen.
>
> Note the lint quirk: the shared object comes from `useState`, so mutate it
> through a **method** (`queue.push(...)`, `set(...)`) — never by assignment.

---

## What you get for free vs. what you build

**For free (don't rebuild these):**

- The lobby, the 30s countdown, and phase transitions.
- Joining, score submission, the results leaderboard, and prize claiming.
- Rendering other players with their real clothing + usernames (MMO).
- The in-game admin disc button (create / finish the event) and "Go home".

**You build:**

- The actual gameplay for `racing` (movement, timing, input, feedback).
- How a score is earned, and the single `onFinish` call at the end.
- Where remote players stand, if you don't want their broadcast positions.

**What you can't do (by design):**

- No server-authoritative physics — games are **client-simulated**, so keep
  scoring on the honour system / simple to reason about.
- No custom backend fields — the giveaway has no `type` on the server, so the
  mini-game type rides along in the `?type=` URL param.
- Don't submit scores mid-game — only the final score, once.
