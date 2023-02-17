type StreamType = "discord" | "twitch";

type Party = {
  type: StreamType;
  startAt: number;
  endAt: number;
};

// Schedule 100 discord chats
const discordChatsStartDate = new Date(1676349000000);
const discordChatDates = new Array(100).fill(null).map((_, index) => {
  var date = new Date(discordChatsStartDate);
  date.setDate(discordChatsStartDate.getDate() + 7 * index);
  return date;
});

// Schedule 100 twitch streams
const twitchStartDate = new Date(1676588400000);

// const twitchStartDate = new Date(1676588400000);
const twitchDates = new Array(100).fill(null).map((_, index) => {
  var date = new Date(twitchStartDate);
  date.setDate(twitchStartDate.getDate() + 7 * index);
  return date;
});

export function upcomingParty(): Party {
  const nextDiscordChat = getNextDiscordChatTime();
  const nextTwitch = getNextTwitchTime();

  console.log(nextDiscordChat < nextTwitch);
  if (nextDiscordChat.startAt < nextTwitch.startAt) {
    return {
      ...nextDiscordChat,
      type: "discord",
    };
  }
  return {
    ...nextTwitch,
    type: "twitch",
  };
}

const DISCORD_LENGTH_MS = 60 * 60 * 1000;

export function getNextDiscordChatTime() {
  const startAt =
    discordChatDates
      .find((date) => date.getTime() + DISCORD_LENGTH_MS > Date.now())
      ?.getTime() ?? 0;
  return {
    startAt,
    endAt: startAt + DISCORD_LENGTH_MS,
  };
}

const TWITCH_LENGTH_MS = 60 * 60 * 1000;

export function getNextTwitchTime() {
  const startAt =
    twitchDates
      .find((date) => date.getTime() + TWITCH_LENGTH_MS > Date.now())
      ?.getTime() ?? 0;

  return {
    startAt,
    endAt: startAt + TWITCH_LENGTH_MS,
  };
}
