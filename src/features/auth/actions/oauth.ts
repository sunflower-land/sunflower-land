import FSLAuthorization from "fsl-authorization";
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

  fslAuthorization.signIn().then((code) => {
    if (code) {
      window.location.href = `${baseUrl}/oauth/fsl?code=${code}&state=${nonce}`;
    }
  });
};

export const fslAuthorization = FSLAuthorization.init({
  responseType: "code", // 'code' | 'token'
  appKey: "RWi72tQ1oz8i",
  scope: "basic", // 'basic' | 'wallet'
  usePopup: true,
});
