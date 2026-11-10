# Pull request description

<!--
Every PR must follow this template; a check fails otherwise.
- Title starts with [FEAT], [FIX], [CHORE] or [BALANCE].
- Summary, Context / motivation and How to test are required.
- UI changes: tick the box, or fill in both of its sections.
- Keep the Checklist. Related issues is optional.
Write under each heading; text inside these comment markers is ignored.
-->

## Summary

<!-- What does this PR do, in one short paragraph? Mention the user-facing outcome or the bug fixed. -->

## Context / motivation

<!-- Why is this change needed? Link to design docs, Discord threads or earlier discussion. -->

## How to test

<!-- Numbered steps a reviewer can follow. Include seed data, feature flags or environment notes if needed. -->

1.
2.

## UI changes

<!-- Read docs/DESIGN_SYSTEM.md first. UI changes must solve a problem many players have, not one person's preference. New icons, colours, coloured icon tiles and new filter/tag systems need team sign-off. -->

- [ ] This PR does not change the UI (no visual, layout, copy, icon or colour changes)

### Why this UI change is needed

<!-- If the UI changes: what problem do players have? Link the Discord threads, issues or feedback where several players raised it. -->

### Before / after

<!-- If the UI changes: screenshots (or recordings) of the same screen before and after, on desktop AND mobile, at least 4 images. -->

|         | Before | After |
| ------- | ------ | ----- |
| Desktop |        |       |
| Mobile  |        |       |

## Related issues

<!-- Optional. One line per issue, e.g. "Fixes #123" or "Related #456". -->

---

## Checklist

### PR and scope

- [ ] Title is clear and uses a prefix: `[FEAT]`, `[FIX]`, `[CHORE]` or `[BALANCE]`
- [ ] I have read the contributing guidelines and agree to the T&Cs

### UI (if applicable)

- [ ] Before/after screenshots on desktop and mobile are attached above
- [ ] The change follows the design system: no new icons, colours, icon tiles or filter/tag systems
- [ ] This PR contains only one UI change

### Code quality

- [ ] I have performed a self-review of my own code
- [ ] I have commented code only where it helps future readers (non-obvious logic, invariants, gotchas)
- [ ] I have updated documentation if behaviour or public APIs changed
- [ ] My changes do not introduce new warnings

### Tests

- [ ] I have added or updated tests that cover this change
- [ ] New and existing unit tests pass locally

### Dependencies and coordination

- [ ] Any required changes in other repos (e.g. API) are merged or linked in the description
- [ ] Any dependent packages or downstream modules are already published / coordinated
