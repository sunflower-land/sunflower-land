import fs from "fs";
import https from "https";
import sharp from "sharp";

import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";

type Image = {
  name: InventoryItemName;
  bg: "green" | "brown";
  tradeable: boolean;
  boosted: boolean;
};

const IMAGES: Image[] = [
  { name: "Fish Market", bg: "green", tradeable: false, boosted: false },
  { name: "CluckCoin", bg: "green", tradeable: true, boosted: false },
];

const BACKGROUNDS: Record<Image["bg"], string> = {
  green: "public/erc1155/images/6x6_bg.png",
  brown: "public/erc1155/images/brown_background_100x100.png",
};

const NOT_FOR_SALE_LABEL = "public/erc1155/images/not_for_sale_label.png";
const BOOSTED_LABEL = "public/erc1155/images/boost_100x100.png";
const WIDTH = 1920;

const fetchBuffer = (url: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });

async function generateImage(image: Image) {
  const ID = KNOWN_IDS[image.name];

  const background = await sharp(BACKGROUNDS[image.bg])
    .webp({ quality: 100, lossless: true })
    .toBuffer();
  const rawImage = ITEM_DETAILS[image.name].image;
  const notForSaleLabel = await sharp(NOT_FOR_SALE_LABEL)
    .webp({ quality: 100, lossless: true })
    .toBuffer();
  const boostedLabel = await sharp(BOOSTED_LABEL)
    .webp({ quality: 100, lossless: true })
    .toBuffer();
  const itemSource = rawImage.startsWith("http")
    ? await fetchBuffer(rawImage)
    : fs.readFileSync(rawImage.startsWith("/") ? rawImage.slice(1) : rawImage);
  const itemImage = await sharp(itemSource)
    .webp({ quality: 100, lossless: true })
    .toBuffer();

  // Composite item image onto background
  const overlays = [
    { input: itemImage },
    ...(image.boosted
      ? [{ input: boostedLabel, top: 0, left: 0, blend: "over" as const }]
      : []),
  ];
  const mergedImage = await sharp(background)
    .webp({ quality: 100, lossless: true })
    .composite(overlays)
    .toBuffer();

  let resized = await sharp(mergedImage)
    .webp({ quality: 100, lossless: true })
    .resize({
      width: WIDTH,
      kernel: sharp.kernel.nearest,
    })
    .toBuffer();

  if (!image.tradeable) {
    resized = await sharp(resized)
      .webp({ quality: 100, lossless: true })
      .composite([
        {
          input: notForSaleLabel,
          top: 0,
          left: 0,
          blend: "over" as const,
        },
      ])
      .toBuffer();
  }

  fs.writeFileSync(`public/erc1155/images/${ID}.png`, resized as any);
}

export const generateImages = async () => {
  await Promise.all(IMAGES.map((item) => generateImage(item)));
};

generateImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
