## Crop Boom

Crop Boom is a mini-game where players must cross a dangerous field of exploding crops.

Those who reach the other side are rewarded with an Arcade Token!

## Setup

To play Crop Boom locally, add the following variable to your `.env`

```
VITE_PORTAL_APP=crop-boom
```

## Architecture

`CropBoom.ts` - Handles the major states in the game (loading, rules, completed, error). Will show the game scene once 'ready'.
`CropBoomPhaser.tsx` - Initialises the World Scene and components used inside of the game.
`CropBoomScene.tsx` - Sets up the game logic - custom walking, puzzle + exploding mechanic.
`lib/portalMachine.ts` - Handles the connection to Sunflower Land API and any API interactions.
