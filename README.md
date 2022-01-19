# sunflower-land

The goal of this project is to create a decentralized and community driven MetaVerse style game.

This repo includes the front-end game which users can play and interact with the game on the Polygon Network.

# Getting Started

Firstly, you will need to clone the repo locally. Once you have it ready navigate into the directory and run the following commands:

1. `npm install --global yarn` (if you don't have yarn installed)
2. `yarn install`
3. `yarn dev`

# Testing

TODO

# Architecture

We use `xstate` to control the manage the user and session using a State Machine approach. This prevents our application from getting into invalid states and handles the use cases of switching accounts, networks, etc.

The primary states include:

- Connecting (connecting to MetaMask)
- Ready (Waiting for user input - Start)
- Signing (Sign a message to verify the account on the API)
- Authorising (Checking if a user has an account/farm)
- Unauthorised (when one of the above state transition fails)
- Authorised (Play the game!)

**State Management**

We use Apollo as our GraphQL client and our state management tool. The Apollo cache is used extensively as the source of truth of the state of the game. The reactive nature of Apollo hooks ensures that when we update the cache, the application reflects this changes in real time.

# Vite

The app uses vite for bundling and development purposes. You can set build specific configuration in `vite.config.ts`

# Tailwind

Tailwind is our CSS tool of choice. It enables us to:

- Use utility based classes
- Consistent theming (view `tailwind.config.js`)
- Perform CSS processing to minimize build sizes

# Directory Organization

-- Assets

Images, Music, Branding and other Media

-- Components

Reusable react components

-- Features

Core domain concepts that have their own use cases/boundaries.

Each feature (e.g. crops) has a similar nested structure of components, graphql & lib that are specific only to that feature.

-- GraphQL

GraphQL config

-- Lib

Utils, classes, machines and more.

# Contributing Guidelines

TODO

# Licensing

Please refer to the Licence.MD for any code related licencing.

All media assets (images and music) are not available for use in commercial or private projects.
