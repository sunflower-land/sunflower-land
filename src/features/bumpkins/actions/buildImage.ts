import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";

const API_URL = CONFIG.API_URL ?? "https://api-dev.sunflower-land.com";

type Request = {
  parts: BumpkinParts;
};

type Response = {
  image: string;
};

export async function buildImageRequest({ fileName }: { fileName: string }) {
  const response = await window.fetch(
    `${API_URL}/bumpkins/metadata/${fileName}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
      },
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.BUMPKINS_METADATA_ERROR);
  }

  const data: Response = await response.json();

  return data.image;
}

const URL =
  CONFIG.NETWORK === "mainnet"
    ? "https://images.bumpkins.io/nfts"
    : "https://testnet-images.bumpkins.io/nfts";

export async function buildImage(request: Request): Promise<string> {
  const tokenUri = tokenUriBuilder(request.parts);

  // Grab a small file size and enlarge with CSS
  const size = 100;
  const url = `${URL}/${tokenUri}x${size}.png`;
  const img = new Image();
  img.src = url;

  return new Promise((res, rej) => {
    // Check if image already loaded
    if (img.complete) {
      res(url);
    } else {
      // Image does work
      img.onload = () => {
        res(url);
      };

      // Image 404 - build it
      img.onerror = async () => {
        // Since these are not real NFTs, prepend fake ID and version
        const validName = `0_v1_${tokenUri}?size=${size}`;

        const response = await buildImageRequest({
          fileName: validName,
        });

        res(response);
      };
    }
  });
}
