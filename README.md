# Sunflower Land

The goal of this project is to create a decentralized and community driven MetaVerse style game.

This repo includes the front-end game which users can play and interact with the game on the Polygon Network and off chain data.

Looking to help out? Read our contributing Guidlines - https://github.com/sunflower-land/sunflower-land/blob/main/docs/CONTRIBUTING.md

# Getting Started

Firstly, you will need to clone the repo locally. Once you have it ready navigate into the directory and run the following commands:

1. `npm install --global yarn` (if you don't have yarn installed)
2. `yarn install`
3. `yarn dev`

# Testing

`yarn test`

This runs a range of business logic unit tests in the repo.

The plan is to use react testing library to test some of the core user interactions as well.

# Architecture

We use `xstate` to control the manage the user and session using a State Machine approach. This prevents our application from getting into invalid states and handles the use cases of switching accounts, networks, etc.

The primary states include:

- Connecting (connecting to MetaMask)
- Ready (Waiting for user input - Start)
- Signing (Sign a message to verify the account on the API)
- Authorising (Checking if a user has an account/farm)
- Unauthorised (when one of the above state transition fails)
- Authorised (Play the game!)

# Vite

The app uses vite for bundling and development purposes. You can set build specific configuration in `vite.config.ts`

# Tailwind

Tailwind is our CSS tool of choice. It enables us to:

- Use utility based classes
- Consistent theming (view `tailwind.config.js`)
- Perform CSS processing to minimize build sizes

# Directory Organization

- Assets: Images, Music, Branding and other Media
- Components: Reusable react components
- Lib: Utils, classes, machines and more.
- Features: Core domain concepts that have their own use cases/boundaries.
  Each feature (e.g. crops) has a similar nested structure of components, graphql & lib that are specific only to that feature.

# Contributing Guidelines

TODO

# No Licence

The previous version was used in unethically on other Blockchains. The team is working on deciding the licence that will best suit our community. Until then, the code falls under No Licence and cannot be reused.

All media assets (images and music) are not available for use in commercial or private projects.
