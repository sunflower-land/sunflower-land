import { CONFIG } from "lib/config";

export function discordOAuth({ nonce }: { nonce: string }) {
  const applicationID = "1287592468124012634";

  // const redirect = encodeURIComponent("http://localhost:3000/#/oauth/discord");
  const redirect = encodeURIComponent(CONFIG.DISCORD_REDIRECT);

  const state = nonce;

  // Guild = server
  const scope = "guilds.members.read";
  window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${applicationID}&scope=${scope}&redirect_uri=${redirect}&prompt=consent&state=${state}`;
}

export const connectToFSL = ({ nonce }: { nonce: string }) => {
  const baseUrl = CONFIG.API_URL;

  const redirect = encodeURIComponent(`${baseUrl}/oauth/fsl`);
  const appKey = "RWi72tQ1oz8i";
  const state = nonce; //
  const url = `https://id.fsl.com/api/account/oauth/authorize?response_type=code&appkey=${appKey}&redirect_uri=${redirect}&state=${state}&scope=basic%20wallet`;

  window.location.href = url;
};
