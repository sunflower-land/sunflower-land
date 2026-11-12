# Sunflower Land design system

The game's UI is something players learn. Every change, however small, has a cost: early and casual players lose their bearings, and a fix for one person's pain point often becomes a new pain point for everyone else. This document is the bar that every UI change, community or team, is reviewed against.

## Principles

1. **Consistency beats preference.** Make a new screen look and behave like the screens next to it, even if you would have designed it differently.
2. **Change the UI only for a shared problem.** A UI change needs evidence that many players hit the problem, not just that it bothers the author.
3. **Icons and colours belong to the team.** They are how the game communicates, and only the team adds to or changes that vocabulary.
4. **Reuse before you build.** Almost every need is already met by a component in `src/components/ui/`.
5. **Less on screen.** Prefer removing information to adding it. A screen that needs a legend or a tap to explain itself is too dense.

## Rules

Reviewers check every UI PR against these rules. A PR that breaks one is sent back or closed.

| #   | Rule                                                                                                                                                                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **No new icons, colours, borders or label types** without team sign-off. This includes recolouring an existing icon, drawing a new frame around one, and adding hex values or Tailwind colours.                                                           |
| R2  | **Don't give an existing colour or icon a new meaning.** The meanings are listed under [Colour](#colour) and [Icons](#icons).                                                                                                                             |
| R3  | **No coloured icon tiles.** Don't put icons in new coloured or framed squares to signal a category, season, building or similar.                                                                                                                          |
| R4  | **No new filter or tag systems.** Don't add filter panels, rows of filter chips, or new ways of classifying content (e.g. "tags") to existing screens. Use the categories and tabs the screen already has. `Chip` stays in the places it is already used. |
| R5  | **Use the existing primitives.** Don't hand-roll panels, buttons, borders or modals. New code uses no raw hex classes (`bg-[#…]`), CSS rounded corners, drop shadows or gradients. Older code has some; don't copy it.                                    |
| R6  | **All copy goes through i18n.** New keys go in `src/lib/i18n/dictionaries/dictionary.json` only, and text stays on the type scale (see [Typography](#typography)).                                                                                        |
| R7  | **Check mobile and desktop.** Every screen must work at phone width (~375px) and on desktop: no clipped text, no horizontal scroll, and tap targets no smaller than the existing buttons.                                                                 |
| R8  | **One UI change per PR.** Don't bundle unrelated tweaks, so each one can be judged, and reverted, on its own.                                                                                                                                             |
| R9  | **Show and justify the change.** Every PR that changes UI includes before and after screenshots on desktop and mobile, plus the reasoning, ideally with links to player discussion. See the [PR template](./PULL_REQUEST_TEMPLATE.md).                    |

### Anti-patterns

These come from a UI change that was merged and then reverted:

- **Season and building icons in coloured square tiles** on the seed card and in the crop guide (breaks R1–R3). The coloured frames read as a new legend that players have to learn, and they compete with the colours `Label` already uses for meaning.
- **A filter panel with "Type", "Tags" and "Season" chip groups** added to the crop guide (breaks R4). It introduced a classification the rest of the game doesn't use, and it pushed the guide's actual content below the fold.

## Foundations

### Pixel art

- Everything is drawn at `PIXEL_SCALE` (`2.625`, from `features/game/lib/constants`). Size art and spacing in whole art-pixels (`PIXEL_SCALE * n`) and keep `image-rendering: pixelated`.
- Borders are 9-slice images from `features/game/lib/style.ts` (`pixel*BorderStyle`). Don't fake them with CSS borders, radii or shadows.
- Use `SquareIcon` to show an icon at a pixel-correct size inside a fixed box.

### Colour

The palette is defined in `tailwind.config.js` (`brown-*`, `blue-*`, `silver-500`, `error`, …) and in `LABEL_STYLES` (`components/ui/Label.tsx`). Text is `#181425` on light backgrounds, `#3e2731` on warm (brown or orange) ones, and white on dark labels.

`Label` types carry meaning. Use them only with the meaning they already have:

| Label type    | Colour        | Meaning                                                              |
| ------------- | ------------- | -------------------------------------------------------------------- |
| `default`     | grey          | neutral information                                                  |
| `info`        | blue          | boosts, plus neutral highlights such as counts                       |
| `success`     | green         | buffs, success, something available                                  |
| `warning`     | orange/yellow | rare items or rewards. Never use it for a neutral state or a filter. |
| `danger`      | red           | errors, sold out, missing requirements, negative effects             |
| `vibrant`     | pink          | special or community events                                          |
| `formula`     | dark navy     | status such as locked, pending or week markers                       |
| `chill`       | soft tan      | low-emphasis notes                                                   |
| `transparent` | none          | inline text with a label's spacing                                   |

### Typography

- Fonts come from `tailwind.config.js` (`font-body`, `font-pixel`, …). Don't load new fonts.
- Sizes: `text-xs` is the default for UI text and labels, `text-xxs` is for secondary captions, and `text-sm` is for headings and emphasis. `text-base` and `text-lg` are rare; don't use them for body copy.
- Let translated text wrap (`max-w-[…]`, not `whitespace-nowrap`). Some locales are much longer than English.

### Numbers and time

Never hand-format a number or a duration. The shared formatters keep rounding and units consistent and translated:

- `formatNumber(value, { decimalPlaces })` (`lib/utils/formatNumber`) rounds **down**; the default is 2 places. Use `shortenCount` for compact counts (e.g. on item slots). `setPrecision` is for maths, not display.
- `secondsToString(seconds, { length, isShortFormat, removeTrailingZeros })` (`lib/utils/time`): `length` is `"short"` (1 unit), `"medium"` (2) or `"full"` (all). Use `formatDateTime` for dates.
- Show the same quantity the same way everywhere. If the seed shop shows a duration as `"medium"`, the guide and the plot show it the same way.

### Icons

- Use icons from the `SUNNYSIDE` registry (`assets/sunnyside.ts`) and the item images (`ITEM_DETAILS`). Don't add a new icon file for an idea an existing icon already covers.
- Meanings already established:
  - `stopwatch`: a duration
  - `lightning`: boosted or sped-up
  - `chevron_right`: a sequence or next step
  - `close` / `confirm` / `cancel`: what their names say
  - `lock`: locked
  - season art: the season itself
- Show season, building and item icons plainly (see R3). If an icon isn't obvious, put a short text label next to it.

### Motion and sound

- Reuse the existing animations: `animate-float`, `animate-pulsate` and `animate-bump` (`tailwind.config.js`), plus the sprite animations already in the game. Play sounds through `useSound` (`lib/utils/hooks/useSound.ts`), whose `HOWLERS` registry is built from `SOUNDS` (`assets/sound-effects/soundEffects.ts`).
- **New animations and sounds need team sign-off**, the same as icons and colours (R1). Motion and sound carry meaning: a pulse means "act here", a bump means "something changed".
- Keep motion short and purposeful. Nothing loops forever except an attention cue the player can resolve.

### Event theming

Event styles (e.g. the Halloween borders in `features/game/lib/style.ts`) are only for that event's own UI, and only while the event runs. They are never a general style option, and they're removed or switched off when the event ends.

## Components

Pick the primitive that matches the need. Copy an existing screen that does the same job before writing new layout.

| Need                              | Use                                                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A dialog                          | `Modal` + `CloseButtonPanel` (`features/game/components/CloseablePanel.tsx`) with `title`, `tabs` and `onClose`                                                                                               |
| Sections in a dialog              | `CloseButtonPanel` `tabs`, or `Tab`                                                                                                                                                                           |
| A shop or list with a detail pane | `SplitScreenView` + a detail layout from `components/ui/layouts/` (`SeedRequirements`, `CraftingRequirements`, …)                                                                                             |
| Containers                        | `Panel` (double border) → `OuterPanel` / `InnerPanel` for nesting. `ColorPanel` only where it is already used.                                                                                                |
| A selectable card or row          | `ButtonPanel`                                                                                                                                                                                                 |
| An action                         | `Button` (`variant="primary"` by default, `"secondary"` for the lesser action). Use `ConfirmButton` / `ConfirmationModal` for destructive or expensive actions, `RoundButton` for HUD-style circular buttons. |
| An item slot                      | `Box`                                                                                                                                                                                                         |
| Costs, rewards, time, XP or level | `RequirementLabel`                                                                                                                                                                                            |
| A status tag                      | `Label` (see [Colour](#colour))                                                                                                                                                                               |
| A countdown                       | `CountdownLabel` / `TimeLeftPanel`                                                                                                                                                                            |
| Progress                          | `ProgressBar` / `ResizableBar`                                                                                                                                                                                |
| Forms                             | `TextInput`, `NumberInput`, `Switch`, `Checkbox`, `Dropdown`                                                                                                                                                  |
| A clickable filter                | `Chip`, only in its existing places (inventory filters, Codex collections, marketplace favourites, referrals, crop guide). New filter UI needs team sign-off (R4). See [Chip states](#chip-states).           |
| The tool or item the player holds | the HUD's `selectedItem` + `shortcutItem` from the game `Context`. Don't build an in-scene picker.                                                                                                            |
| An NPC talking                    | `SpeakingModal` (multi-step messages with optional actions and the NPC's `bumpkinParts`) or `SpeakingText`. Don't build an ad-hoc panel for dialogue.                                                         |
| A boost breakdown                 | `BoostsDisplay` with its required `base` row (see [Boosted values](#boosted-values))                                                                                                                          |
| Gains and losses                  | The toast system (`features/game/toast/`). Inventory, coin, FLOWER and XP changes already surface there; don't add a separate popup for them.                                                                 |
| Loading                           | `Loading` (`features/auth/components/Loading.tsx`, optional `text` or `dotsOnly`)                                                                                                                             |

## Behaviour

### Stable positions

Don't reorder things under the player during a session. If feeding an animal, collecting an item or a value changing would re-sort a list or a scene, players lose track of what they were doing. Order may change when the **membership** changes (something added or removed), not when an item's data changes. The animal buildings, for example, key their sort only on herd membership.

### Boosted values

- **Boost panels show the base.** `BoostsDisplay` requires a `base` row (`Base: <value>`), so the rows visibly add up to the boosted total. Format the base the same way as the total beside it.
- **⚡ means a value really is boosted.** Only show the lightning icon, or an accelerated countdown, when the value is actually boosted right now. Legacy or unboosted entities show a plain value or countdown.
- **Struck-through base values are for detail views only.** A roomy detail panel (e.g. the seed card's `RequirementLabel` with `boosted`) may show `⚡ new value` next to the struck-out base. Compact list rows (guides, recipe lists) show only `⚡ new value`: a struck base doubles the row's width and squeezes the layout on mobile. The full breakdown lives in the boost panel.
- **Speed boosts read as a speed**, e.g. "1.35x Crop Growth Speed", not "x0.75 Growth Time". Update both the short label and the prose description when a boost changes.
- Every boost label is a full translation key. Never build one by concatenating (`` `${t("speed")}: ${x}x` ``).

### Chip states

A selected `Chip` must look active and an unselected one inactive. An earlier version read the wrong way round: a pale grey selected chip looked disabled next to brown unselected ones. The pressable depth comes from the chip's 9-slice art (`assets/ui/selected_chip.png` / `unselected_chip.png`, via `pixelChipSelectedBorderStyle` / `pixelChipBorderStyle`). The thicker bottom border is the intended shadow; don't recreate it with CSS `box-shadow`.

### Feedback, loading and empty states

- **Every action gives feedback.** Gains and losses go through the toast system. Errors use a `danger` `Label` or the game's error modal. Don't fail silently.
- **Show a `Loading` state** when waiting on the server, and disable the action button while a request is in flight so it can't be sent twice.
- **Empty states explain themselves.** Show a short translated sentence saying why the list is empty and, where it helps, what to do next. Never leave a blank panel.

## Tutorials and onboarding

- **One popup = one action.** The NPC says what to do, then a single pulsing hand (`SUNNYSIDE.icons.click_icon`) shows where. Never show more than one hand at a time.
- **Open the next popup the moment the action lands**, not after the collect animation finishes.
- **Copy doesn't narrate the UI** ("follow the arrow"). Teaching a verb ("tap") or a meaning (what the AOE box is) is fine.
- **Hands that walk across several targets** (e.g. plots) go one at a time, ordered by position, not by id.
- Building hands, default tabs and button hands read shared predicates from `<feature>/lib/onboarding.ts`, so they always agree.

## Reviewing a UI PR

1. **Is the problem real and shared?** Look for linked player discussion. "It annoyed me" isn't enough.
2. **Before/after on desktop and mobile:** are the screenshots in the PR? Open the PR's preview build to check yourself.
3. **Rules R1–R9:** look out for new icons, colours, tiles, filters, hand-rolled styling or bundled changes.
4. **Net density:** does the screen show more than it did? If so, is every addition worth it?

## Changing the design system

The design system itself (this file, `components/ui/`, `features/game/lib/style.ts`, `assets/ui/`, `assets/sunnyside.ts`, `tailwind.config.js`, `styles.css`) is owned by the team through `.github/CODEOWNERS`. Propose changes in an issue or on Discord before opening a PR.
