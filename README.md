<h1 align="center">Sunflower Land</h1>
<p align="center">
<a href="https://github.com/sunflower-land/sunflower-land/actions/workflows/ci.yml/"><img src="https://github.com/sunflower-land/sunflower-land/actions/workflows/ci.yml/badge.svg" alt="CI Build Status" /></a>
<a href="https://github.com/sunflower-land/sunflower-land/actions/workflows/translate.yml/"><img src="https://github.com/sunflower-land/sunflower-land/actions/workflows/translate.yml/badge.svg" alt="Translate" /></a>
<a href="https://github.com/sunflower-land/sunflower-land/actions/workflows/testnet.yml"><img src="https://github.com/sunflower-land/sunflower-land/actions/workflows/testnet.yml/badge.svg" alt="Testnet deploy" /></a>
<a href="https://github.com/sunflower-land/sunflower-land/actions/workflows/mainnet.yml"> <img src="https://github.com/sunflower-land/sunflower-land/actions/workflows/mainnet.yml/badge.svg" alt="Mainnet deploy" /></a>
<a href="https://x.com/0xSunflowerLand"><img src="https://img.shields.io/twitter/follow/0xSunflowerLand?style=social" height="100%" alt="Twitter Follow: 0xSunflowerLand" /></a>
<a href="https://www.youtube.com/channel/UCA08g3x6EGPPZE_4093q3PQ?sub_confirmation=1"><img src="https://img.shields.io/youtube/channel/subscribers/UCA08g3x6EGPPZE_4093q3PQ?style=social&label=Sunflower%20Land" alt="Youtube Subscribe: Sunflower Land" /></a>
<a href="https://discord.gg/sunflowerland"><img src="https://img.shields.io/discord/880987707214544966?label=Sunflower%20Land&logo=Discord&style=social" alt="Discord: Sunflower Land" /></a>
</p>

![banner_2400_800-export](https://github.com/user-attachments/assets/4d08da2c-a5a5-4131-acbb-b9b41132f6df)

The goal of this project is to create a decentralized and community-driven MetaVerse style game.

This repo includes the front-end game in which users can play and interact with the game on the Polygon Network and offchain data.

Looking to help out? Read our [contributing docs](https://github.com/sunflower-land/sunflower-land/blob/main/docs/CODE_CONTRIBUTING.md)

By contributing you agree to our [terms and services](https://docs.sunflower-land.com/support/terms-of-service)

# Website | Official Links

### 🌻 Main Website

[https://sunflower-land.com/](https://sunflower-land.com/)

### 🧑‍🌾 Start Farming | Play

[https://sunflower-land.com/play](https://sunflower-land.com/play)

### 😕 Stuck somewhere ?

Read the official docs/ litepaper here: [docs.sunflower-land.com](https://docs.sunflower-land.com/)

### 👶 How to play ?

Follow the official guide here: [How to Play?](https://docs.sunflower-land.com/getting-started/how-to-start)

# 🎨 Sunnyside Assets

Sunflower Land uses crops, icons and tiles from Daniel Diggle's SunnySide Asset Pack.

These raw assets/tiles are not in this repo. You must purchase the asset pack if you wish to extend these assets or use them elsewhere.

[Download Here](https://danieldiggle.itch.io/sunnyside)

# 👶 Getting Started

You can take a look at the instructions in [CODE_CONTRIBUTING.md](https://github.com/sunflower-land/sunflower-land/blob/main/docs/CODE_CONTRIBUTING.md) to get started on open-source contribution for Sunflower Land

# 🧪 Testing

`yarn test`

This runs a range of business logic unit tests in the repo.

The plan is to use react testing library to test some of the core user interactions as well.

# ⚙️ Architecture

We use `xstate` to control the manage the user and session using a State Machine approach. This prevents our application from getting into invalid states and handles the use cases of switching accounts, networks, etc.

The primary states include:

- Connecting (connecting to MetaMask)
- Ready (Waiting for user input - Start)
- Signing (Sign a message to verify the account on the API)
- Authorising (Checking if a user has an account/farm)
- Unauthorised (when one of the above state transitions fails)
- Authorised (Play the game!)

# ⚙️ Vite

The app uses vite for bundling and development purposes. You can set build specific configuration in `vite.config.ts`

# 🌈 Tailwind

Tailwind is our CSS tool of choice. It enables us to:

- Use utility based classes
- Consistent theming (view `tailwind.config.js`)
- Perform CSS processing to minimize build sizes

# 🏷️ ERC1155 Metadata

Metadata is generated from markdown files.

Prerequisites:

`yarn global add ts-node`

To add new item:

1. Create `{SFT id}.md` file in `metadata\markdown` folder
2. Add `{SFT id}.png(gif)` file to `public\erc1155\images` folder
3. Run `yarn metadata`

# 🗃️ Directory Organization

- Assets: Images, Music, Branding and other Media
- Components: Reusable react components
- Lib: Utils, classes, machines and more.
- Features: Core domain concepts that have their own use cases/boundaries.
  Each feature (e.g. crops) has a similar nested structure of components, graphql & lib that are specific only to that feature.

# 🤝 Contributing Guidelines

👨‍💻 Developers - https://github.com/sunflower-land/sunflower-land/blob/main/docs/CODE_CONTRIBUTING.md

🧑‍🎨 Artists - https://github.com/sunflower-land/sunflower-land/blob/main/docs/ART_CONTRIBUTING.md

# ⚖️ No Licence

The previous version was used unethically on other Blockchains. The team is working on deciding the licence that will best suit our community. Until then, the code falls under No Licence and cannot be reused.

All media assets (images and music) are not available for use in commercial or private projects.

To access the crops, resources and land tiles, please refer to the [SunnySide Asset Pack](https://danieldiggle.itch.io/sunnyside)

If you wish to use Bumpkin NFTs or custom Sunflower Land collectibles in your own project please reach out to the core team on [Discord](https://discord.com/invite/sunflowerland).
