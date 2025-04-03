# Telegram Setup

Looking to connect Telegram and build bot integrations? Well let's get started!

The Telegram Login Widget requires an SSL HTTPS connection. When working on Telegram features, you will need to run the app using the following command:

`yarn dev-telegram`

You can then open the game on `https://127.0.0.1`

## Bot Setup

You will need to setup your own bot for customisation. Head to `https://web.telegram.org/k/#@BotFather` and follow the prompts to create a bot.

Run the `/newbot` command.

This will produce 2 outputs.

1. The name of your bot. E.g. `adam_testnet_bot` -> Put this value in your `.env` - `VITE_TELEGRAM_BOT=<NAME>`
2. The bot key. E.g. `7asd12...` -> Put this in your **API** `.env` - `TELEGRAM_BOT_KEY=<KEY>`

Run the `/setdomain` command, to whitelist your local app.

Use the following domain: `https://127.0.0.1`

You should now be able to link your Telegram in-game.

## Webhook

Telegram fires off events every time a user interacts with your Bot chat. We listen to events to determine when a player has started the conversation with the bot.

To setup a webhook, you manually need to fire an API request. You can run this in your terminal.

`curl -F "url=https://api-hannigan.sunflower-land.com/webhooks/telegram" "https://api.telegram.org/bot7734005392:AAFWI0ke0jxOBVyIFL5fxLV-M0uFiaQw-3E/setWebhook"`

Update the above with your local BE API and the key you generated above
