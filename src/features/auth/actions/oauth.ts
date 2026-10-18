import { CONFIG } from "lib/config";
import { rememberSocialLinkAttempt } from "features/auth/lib/socialLink";

export function discordOAuth({ nonce }: { nonce: string }) {
  const applicationID = "1287592468124012634";

  // const redirect = encodeURIComponent("http://localhost:3000/#/oauth/discord");
  const redirect = encodeURIComponent(CONFIG.DISCORD_REDIRECT);

  const state = nonce;

  // The API's error redirect does not say which provider failed
  rememberSocialLinkAttempt("discord");

  // Guild = server
  const scope = "guilds.members.read";
  window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${applicationID}&scope=${scope}&redirect_uri=${redirect}&prompt=consent&state=${state}`;
}
