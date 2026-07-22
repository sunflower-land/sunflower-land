# Feed All Animals — Design

Date: 2026-07-20
Status: Approved

## Summary

Players who own an active golden asset can feed animals for free, but must
still click every animal one by one. This feature adds a one-click "Feed All"
disc button inside the Hen House and Barn that feeds (and where applicable,
cures or collects from) every eligible animal in that building via a single
new game event, `animals.fedAll`.

Golden asset coverage (checked with `isCollectibleBuilt`, i.e. owned AND
placed/active on the farm):

| Species | Golden asset | Building  |
| ------- | ------------ | --------- |
| Chicken | Gold Egg     | Hen House |
| Cow     | Golden Cow   | Barn      |
| Sheep   | Golden Sheep | Barn      |

## Decisions (confirmed with product)

1. **Sick animals + Oracle Syringe**: when the Oracle Syringe wearable is
   active, the bulk action cures sick animals (free, no Barn Delight consumed
   — matching `getBarnDelightCost`) and then feeds them in the same click.
   Without the syringe, sick animals are always skipped — even if the player
   has Barn Delight in inventory. Manual intervention is required.
2. **Partial Barn coverage**: with only one of Golden Cow / Golden Sheep, the
   button shows and processes only the covered species. Uncovered species are
   untouched.
3. **Empty state**: the button renders greyed out / disabled whenever no
   animal is currently eligible, and re-enables as animals wake up while the
   screen is open. No event is sent while disabled.
4. **Ready animals**: the bulk action collects their produce (via the existing
   `claimProduce` logic, including rewards and mutant items). Claiming starts
   the sleep cycle, so these animals are not subsequently fed.
   **One-click harvest (added 2026-07-22):** free feeding via a golden asset
   always grants exactly the XP needed for the next level, so every fed animal
   lands in `ready`. Rather than requiring a second click to harvest, the
   action runs a final claim pass: any animal that became `ready` from this
   action's feed (or cure-then-feed) has its produce claimed and goes to
   sleep in the same click.
5. Manual per-animal feeding continues to work exactly as before.

## Backend

New file: `src/features/game/events/landExpansion/feedAllAnimals.ts`

```ts
export type FeedAllAnimalsAction = {
  type: "animals.fedAll";
  building: AnimalBuildingType; // "Hen House" | "Barn"
};
```

Registered in `src/features/game/events/index.ts` as
`"animals.fedAll": feedAllAnimals`. The events registry is the shared
open-source game engine executed by the server, so this registration is the
backend implementation.

### Eligibility helper

```ts
export function getFeedAllTargets({ state, building, createdAt }): {
  toClaim: string[]; // animal ids, state "ready", awake
  toCure: string[]; // animal ids, state "sick", awake, Oracle Syringe active
  toFeed: string[]; // animal ids, state idle/sad/happy, awake, within capacity
};
```

Rules, evaluated per animal in the building:

- Only species covered by an active golden asset are considered.
- Sleeping animals (`createdAt < awakeAt`) are always skipped (this also
  covers `needsLove` animals, which are asleep by definition).
- `ready` → `toClaim` (capacity lock does not block claiming, matching the
  manual UI where ready-clicks are handled before the lock check).
- `sick` → `toCure` only when Oracle Syringe is active. Cure targets are NOT
  duplicated into `toFeed`; the handler feeds them itself right after curing
  (step 5 below), gated on the same capacity check.
- `idle` / `sad` / `happy` → `toFeed` when `isAnimalFeedable` (over-capacity
  animals cannot be fed, mirroring the single-feed event).

The helper is exported so the frontend can use identical logic for the
disabled state — the server-side handler re-derives it and remains
authoritative.

### Handler

`feedAllAnimals` composes existing handlers rather than duplicating logic:

1. Throw `"Building does not exist"` if the building has no placed instance.
2. Throw `"No active golden asset for this building"` if no covered species.
3. Compute targets; throw `"No animals to feed"` if all three lists are empty.
4. For each `toClaim` id: `claimProduce({ state, action, createdAt })`.
5. For each `toCure` id: `feedAnimal` with `item: "Barn Delight"` (free via
   Oracle Syringe), then — if now feedable — `feedAnimal` with no item (free
   via the golden asset path).
6. For each `toFeed` id: `feedAnimal` with no item.
7. Final claim pass over `toCure` + `toFeed`: any animal now `ready`
   (free feeds always level up) gets `claimProduce`, so one click feeds,
   harvests and puts the building to sleep.

Each composed call already handles XP, favourite-food logic, state
transitions (`happy`/`ready`), produce drops, rewards, `farmActivity`
tracking, and `boostsUsedAt` — no re-implementation.

## Frontend

**Redesigned 2026-07-22 (superseding the dedicated disc button):** the
feed-all trigger lives on the existing feeder machine instead of a separate
button. `FeederMachine` accepts an optional `building` prop (passed by
`HenHouseInside.tsx` and `BarnInside.tsx`).

- With a golden asset active, no sick animal needing hand-crafted medicine,
  and at least one eligible animal, the machine shows a pulsing lightning
  bolt (`SUNNYSIDE.icons.lightning`) in its top-right; clicking the machine
  then sends `animals.fedAll` and plays the `feed_animal` sound instead of
  opening the crafting modal.
- The crafting modal stays reachable whenever the bulk action can't do
  everything: a sick animal the action won't cure (uncovered species, or no
  Oracle Syringe) keeps the machine in modal mode so medicine can be made,
  and once every covered animal is asleep (no eligible targets, bolt hidden)
  clicking opens the modal again — which also keeps feed craftable for
  uncovered species under partial Barn coverage.
- A `setTimeout` to the soonest `awakeAt` among covered sleeping animals
  re-evaluates eligibility so the bolt reappears while the screen is open.
- Click-time targets are re-derived (double-tap guard) before sending.

### Animal sprite sync

`Chicken.tsx`, `Cow.tsx`, and `Sheep.tsx` each run a local XState
`animalMachine` that normally only transitions on direct clicks. A bulk event
updates game state underneath them, so each component gets a sync effect (in
the same style as the existing sick-sync effect) with deps on both the game
animal state and the machine state:

- machine in `idle`/`sad`/`happy`, game state now `happy`/`sad`/`ready` and
  different from the machine → send `FEED` with the updated animal.
- machine `sick`, game state no longer sick → send `CURE`; a follow-up effect
  run then delivers `FEED` if the animal was also fed.
- machine `ready`, game state `idle` (produce claimed) → send `CLAIM_PRODUCE`.

Remounting was rejected: the machine's `initial` state maps `happy`/`sad` to
`idle`, so a remount would visually reset freshly fed animals.

### i18n

New keys in the English dictionary (per repo convention) for the button
label/alt text, e.g. `feedAll.button` = "Feed All".

## Testing

`src/features/game/events/landExpansion/feedAllAnimals.test.ts`, following
existing event-test patterns (e.g. `feedAnimal.test.ts`):

- Throws when the building is not placed.
- Throws when no golden asset is active for the building.
- Throws when no animals are eligible (all asleep/sick-without-syringe).
- Gold Egg: feeds all awake chickens; no food deducted; XP increases; states
  become `happy` (or `ready` on level-up).
- Barn: Golden Cow only → cows fed, sheep untouched; Golden Sheep only →
  sheep fed, cows untouched; both → both fed.
- Sleeping animals are skipped.
- Ready animals: produce added to inventory, rewards granted, animal put to
  sleep; not double-fed.
- Sick without Oracle Syringe: skipped even with Barn Delight in inventory;
  Barn Delight untouched.
- Sick with Oracle Syringe: cured and fed; no Barn Delight consumed.
- Over-capacity animals: not fed; a ready over-capacity animal still claims.
- `boostsUsedAt` records the golden asset boosts; `farmActivity` tracks
  `<Animal> Fed` per fed animal.

Frontend behaviour (visibility, disabled state) is covered by the shared
`getFeedAllTargets` unit tests; component snapshot tests are out of scope,
consistent with the repo's existing coverage of building interiors.

## Out of scope

- Feeding uncovered species from inventory food.
- Collect-all as a standalone feature outside golden-asset buildings.
- Love/pet actions (`needsLove` animals are asleep and skipped).
