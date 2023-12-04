## Mushroom Forest

An empty mushroom world to explore

## Setup

To play Mushroom locally, add the following variable to your `.env`

```
VITE_PORTAL_APP=mushroom-forest
```

## Architecture

`CropBoom.ts` - Handles the major states in the game (loading, rules, completed, error). Will show the game scene once 'ready'.
`CropBoomPhaser.tsx` - Initialises the World Scene and components used inside of the game.
`CropBoomScene.tsx` - Sets up the game logic - custom walking, puzzle + exploding mechanic.
`lib/portalMachine.ts` - Handles the connection to Sunflower Land API and any API interactions.
