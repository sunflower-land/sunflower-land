import type Phaser from "phaser";

/**
 * Screenshot-parity helpers, dependency-free. The workflow: capture the React
 * farm and the Phaser farm on the same fixture, then diff. Wired into a
 * proper harness as phases land; usable from the console meanwhile.
 */

/** Snapshot the Phaser canvas as a PNG data URL. */
export function capturePhaserCanvas(game: Phaser.Game): Promise<string> {
  return new Promise((resolve) => {
    game.renderer.snapshot((snapshot) => {
      resolve((snapshot as HTMLImageElement).src);
    });
  });
}

const drawToCanvas = (image: HTMLImageElement): CanvasRenderingContext2D => {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2d canvas context unavailable");
  context.drawImage(image, 0, 0);
  return context;
};

const loadImage = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

export type PixelDiff = {
  width: number;
  height: number;
  totalPixels: number;
  mismatchedPixels: number;
  mismatchRatio: number;
};

/**
 * Naive per-pixel comparison of two same-sized data URLs with a small
 * per-channel tolerance. Throws on size mismatch — a size mismatch is itself
 * a parity failure worth surfacing loudly.
 */
export async function diffDataUrls(
  a: string,
  b: string,
  channelTolerance = 3,
): Promise<PixelDiff> {
  const [imageA, imageB] = await Promise.all([loadImage(a), loadImage(b)]);

  if (
    imageA.naturalWidth !== imageB.naturalWidth ||
    imageA.naturalHeight !== imageB.naturalHeight
  ) {
    throw new Error(
      `Size mismatch: ${imageA.naturalWidth}x${imageA.naturalHeight} vs ` +
        `${imageB.naturalWidth}x${imageB.naturalHeight}`,
    );
  }

  const width = imageA.naturalWidth;
  const height = imageA.naturalHeight;
  const dataA = drawToCanvas(imageA).getImageData(0, 0, width, height).data;
  const dataB = drawToCanvas(imageB).getImageData(0, 0, width, height).data;

  let mismatchedPixels = 0;
  for (let i = 0; i < dataA.length; i += 4) {
    if (
      Math.abs(dataA[i] - dataB[i]) > channelTolerance ||
      Math.abs(dataA[i + 1] - dataB[i + 1]) > channelTolerance ||
      Math.abs(dataA[i + 2] - dataB[i + 2]) > channelTolerance ||
      Math.abs(dataA[i + 3] - dataB[i + 3]) > channelTolerance
    ) {
      mismatchedPixels += 1;
    }
  }

  const totalPixels = width * height;
  return {
    width,
    height,
    totalPixels,
    mismatchedPixels,
    mismatchRatio: mismatchedPixels / totalPixels,
  };
}
