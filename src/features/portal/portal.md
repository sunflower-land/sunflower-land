## Building Portals

Welcome to the Portal Building Guide.

To get setup, please refer to https://docs.sunflower-land.com/contributing/portals/getting-started

## Now what?

We have provided a basic template of a Portal including a Scene + HUD. You are free to edit `PortalExample.tsx` to add or remove and functionality you desire.

We encourage builders to reuse UI components in this repo for consistency and speed of development.

## APIs

https://docs.sunflower-land.com/contributing/portals/portal-apis

`./actions/loadPortal.ts` to load a player's data

## Purchase

Call `purchase` in `./lib/portalUtil.ts` to spend a players SFL or items.

## Store score

Call `played` in `./lib/portalUtil.ts` to record a players progress, attempts and score.

## Claim Prize

If there are prizes available (talk to SFL team), you can allow a player to claim them.

Call `claimPrize` in `./lib/portalUtil.ts`.

Note: A players score must be saved first before claiming a prize.
