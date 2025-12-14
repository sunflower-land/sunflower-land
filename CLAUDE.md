# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sunflower Land is a decentralized, community-driven MetaVerse farming game running on the Polygon Network. This repo contains the front-end game client built with React, TypeScript, and Phaser for the game world.

## Common Commands

```bash
# Install dependencies
yarn install

# Run development server (port 3000)
yarn dev

# Run development server for Telegram (port 443, requires HTTPS)
yarn dev-telegram

# Build for production
yarn build

# Run tests
yarn test

# Run a single test file
yarn test path/to/file.test.ts

# Type checking
yarn tsc

# Lint
yarn lint

# Lint with auto-fix
yarn format

# Generate ERC1155 metadata
yarn metadata
```

## Environment Setup

Copy `.env.sample` to `.env` before running locally. The sample file contains testnet contract addresses.

## Architecture

### State Management

The app uses **xstate** state machines for managing application state:

- `src/features/auth/lib/authMachine.ts` - Handles authentication flow (connecting wallet, signing, authorization)
- `src/features/game/lib/gameMachine.ts` - Main game state machine (loading, playing, autosaving)
- `src/features/world/mmoMachine.ts` - Multiplayer/MMO state

### Directory Structure

- `src/assets/` - Images, music, branding
- `src/components/` - Reusable React components (especially `components/ui/` for common UI elements)
- `src/lib/` - Utilities, configuration, blockchain interactions, i18n
- `src/features/` - Domain features, each with its own components, actions, and logic

### Key Feature Directories

- `features/game/` - Core game logic
  - `types/` - TypeScript types for game entities (game.ts is central)
  - `events/` - Game event handlers (actions players can take)
  - `lib/` - Game utilities, constants, state processing
  - `actions/` - API actions (loadSession, autosave, etc.)
  - `selectors/` - Stable selector functions for useSelector
  - `hooks/` - Custom hooks with optimized re-render behavior
- `features/auth/` - Authentication and wallet connection
- `features/world/` - Phaser game world, MMO scenes, NPCs
- `features/island/` - Farm island rendering and interactions
- `features/marketplace/` - Trading functionality

### Game Events

Game events are defined in `src/features/game/events/` with a structure:

- Event handler functions apply state changes
- Tests validate business logic
- Events are processed through `processEvent.ts`
- Events are organized by domain: `farming/`, `animals/`, `buildings/`, `crafting/`, `resources/`

### Phaser Integration

The game world uses Phaser 3:

- Scenes in `features/world/scenes/` (BaseScene, PlazaScene, etc.)
- Containers in `features/world/containers/` for game objects
- Tilemaps for world layout

### Internationalization

Uses i18next with translations in `src/lib/i18n/dictionaries/`. The `useAppTranslations` hook provides translated strings.

## Code Style

- **ESLint rule**: `react/jsx-no-literals` is enforced - use translation keys, not raw strings
- **No console.log** - use proper error handling
- Use Tailwind CSS for styling (see `tailwind.config.js`)
- Path aliases: `features/*`, `lib/*`, `components/*`, `assets/*`

### useSelector Best Practices

Use stable selector references to prevent unnecessary re-renders:

```typescript
// BAD - creates new function every render
const inventory = useSelector(
  gameService,
  (state) => state.context.state.inventory,
);

// GOOD - use selectors from features/game/selectors/
import { selectInventory } from "features/game/selectors";
const inventory = useSelector(gameService, selectInventory);

// BETTER - use hooks from features/game/hooks/
import { useInventory } from "features/game/hooks";
const inventory = useInventory();
```

## PR Conventions

Prefix PR titles with category:

- `[FEAT]` - Feature or enhancement
- `[FIX]` - Bug fix
- `[CHORE]` - Admin work, scripts, docs

## Commit Conventions

- Do NOT include "Generated with Claude Code" or similar AI attribution in commits
- Do NOT include "Co-Authored-By: Claude" in commits
- Keep commit messages clean and focused on the changes

## Testing

Tests use Jest with jsdom environment. Business logic should have test coverage. Test files are colocated with source files using `.test.ts` suffix.
