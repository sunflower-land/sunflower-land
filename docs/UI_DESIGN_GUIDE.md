# UI Design Guide

A guide for contributors (human and AI) building UI in Sunflower Land. Always reach for the components in `src/components/ui/` before hand-rolling divs and custom CSS.

## Panels

Panels group areas of content inside a modal.

- **Default choice**: use the close-button panel (`CloseButtonPanel`) — it is the most widely used wrapper for modals.
- **Panel effect**: we typically always want the layered effect — an outer panel with a panel on top of it. For most content a single `Panel` is enough.
- **`InnerPanel`**: when a UI has lots of information or several distinct use cases, break the content up with inner panels. Example: fishing — choosing bait, choosing chum, etc. If it is a single form where everything is required, keep it together; if there are optional/separate steps, split them into inner panels.
- **`ColorPanel`**: used to call attention to information, mainly as widgets. Never embed one inside an `InnerPanel` — it should sit directly under a modal or under another inner panel. Typical layout: icon on the left, text on the right.
- **`ButtonPanel`**: use for any larger clickable element in the game (e.g. a delivery card). Its light colour implies clickability. For a normal action, use `Button`; for a clickable card, use `ButtonPanel`. Button panels should be roughly square in shape, with their content **centred**. To show a price or reward on a card, use an absolutely positioned label stretching the full width of the bottom edge (the "buy Gems" float pattern).
- Content is wrapped in its own element with its own padding (p-1).
- Action rows (any element containing a button or group of buttons) are siblings of the content element, never nested inside it.
- An action row must have no left, right, or bottom padding. Its buttons run flush to the panel's left, right, and bottom edges. Top padding, top margin, or a top border is allowed, to separate it from the content above. If there are two buttons in the action row they should have `gap-1` between them.

### Padding & hierarchy inside a panel

- Use ~2 x PIXEL SCALE of uniform padding inside panels.
- Hierarchy: a `Label` at the top left acts as the title. Other labels can sit on the far right — keep the labels separated.
- **Exception to the padding rule**: buttons should stretch the full width of the panel, ignoring the 2px padding. The same applies to labels — it looks much nicer and pixel-perfect that way.

## Labels

- In most cases use the **default** label.
- Labels are for short text only — never more than 3–4 words. Never put long text inside a label.
- Labels are **not clickable**. If something needs to be clickable, use a `Button` or a `Chip`.
- Use default labels to break up categories in a long list of items.
- Always be mindful of how many labels are on a single component. Too many labels are visually distracting.

### Label types & colour meanings

| Type      | Colour      | Use for                                                                                                                  |
| --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `default` | Brown       | Titles, section headers, most cases                                                                                      |
| `success` | Green       | Something successfully happened                                                                                          |
| `info`    | Blue        | Time-related or urgent information                                                                                       |
| `danger`  | Red         | Errors, destructive/irreversible actions                                                                                 |
| `warning` | Yellow      | **Rewards, prizes, costs** — anything the player gets or pays (FLOWER, airdrops, achievements). Not actually "warnings". |
| `vibrant` | Purple      | Call-to-action — promos and special events                                                                               |
| `formula` | Black       | Forms and calculations                                                                                                   |
| `chill`   | Light brown | Light, friendly content (e.g. contributor thanks, usually with a heart emoji)                                            |

## Buttons

- `Button` is the main button used everywhere. Clicking a button should always do something: open a modal, trigger an action, save, or move to a confirmation step.
- **Icons**: fixed to the far left of the button, with the text centred.
- **Floating labels**: labels can be absolutely positioned on the top right of a button — half on, half off, ~2 PIXEL_SCALE in from the right. Use these to convey extra information in a simple UI, e.g. the reason a button is disabled, or a `warning` label showing a cost/prize ("50 Gems").
- **Secondary actions**: for smaller actions that are not the main call to action (e.g. "Eat all food", or a link elsewhere), use plain underlined text instead of a button.
- `RoundButton`: only for buttons **inside the game world**, not the UI layer. Anything clickable in-game should use a round button.

## Boxes & selection

- `Box` is for cycling through options — inventory items, shop items, toggling between things. Clicking a box does **not** trigger an action (unlike a button).
- If you need a custom item-cycling UI, you can build your own box out of an `OuterPanel`.
- Anything that toggles/selects must show a **select box** around the active item.
- `ButtonPanel` can also be used for selection (e.g. deliveries with a details page on the right). When it toggles, give it the active colour **and** a select box.

## Other staples

- **Progress**: always use the existing progress bar components.
- **Costs / ingredients**: always use `RequirementsLabel`.
- **Shop or crafting views**: use `SplitScreenView`.
- **Form inputs**: use the existing `TextInput`, `NumberInput`, `Dropdown`, `SelectBox`, `Tab`, `Switch`, and `Checkbox` components — no custom form controls.

## Layout & alignment

- **Left-align everything** by default.
- Any element with flex and a horizontal direction gets `items-center`. This is the default, not a choice — write it on every row, even when the children happen to be the same height and it looks identical without it. Only exception: when a row pairs a fixed-height element (icon, avatar, checkbox) with text that wraps to multiple lines, use items-start so the fixed element aligns to the first line rather than floating to the middle of the block.
- The only centre-aligned case: a details/mini view on the right of a `SplitScreenView`.
- If you have a lot of text, either use line breaks or break it up with labels as headers for the next content. Use an icon on the left with text on the right to break the monotony of long content. If you find there is a large amount of text, first try to see if you can condense it. Long text is not something we want to encourage.
- **Align numbers in a column**: for anything form-related with scaling costs (e.g. inputting how much to buy), lay values out table-style so numbers sit directly below each other for easy comparison. Use the same pattern for showing counts of things (e.g. replenish stock — all the seeds that are coming).

## Animations & effects

- Everything in-game must keep 1px consistency — pixel art only.
- No CSS glows/soft effects on in-world elements. If you want a glow, it must be a pixel-art sprite sheet.

## UX patterns

- **Genius has the least moving parts.** If you find yourself adding new pages, modals, and forms to convey a message, the design is becoming more complex than our game designs should be. The ideal is a single modal: the player makes a choice, then does an action.
- **Confirmations**: any action spending meaningful player resources (Gems, FLOWER, Coins, or any high amount) must show a confirmation pop-up.
- **Players do not read text.** Never rely on text to convey complex UI — use icons, labels, and layout. If you need a lot of text the UX is too complicated - simplify.
- **Minimise clicks** for actions players repeat many times a day. More complex flows (one-off setup, enabling a feature or mechanic) can afford more steps.
