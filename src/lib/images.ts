const p1 = 0.99;
const p2 = 0.99;
const p3 = 0.99;
const er = 0; // extra red
const eg = 0; // extra green
const eb = 0; // extra blue

const NOISED_ATTRIBUTE = "isNoised";

/**
 * Generate random ID for images.
 * @returns The random ID
 */
export const RandomID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

/**
 * Add noise to an image.  This method should be used in onload() method for images.
 * @param id The image ID
 * @param noise The image noise level
 * @returns The noised image data
 */
export const addNoise = (id: string, noise = 0.4) => {
  const img = document.getElementById(id) as HTMLImageElement;

  // add noise only if image has loaded and noise is not added
  if (!img?.complete || img.getAttribute(NOISED_ATTRIBUTE)) {
    return;
  }

  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const context = canvas?.getContext("2d") as CanvasRenderingContext2D;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  context.drawImage(img, 0, 0);

  const imgData = context.getImageData(
    0,
    0,
    img.naturalWidth,
    img.naturalHeight
  );

  for (let i = 0, n = imgData.data.length; i < n; i += 4) {
    // generating random color coefficients
    const randColor1 = 0.93 + Math.random() * noise;
    const randColor2 = 0.93 + Math.random() * noise;
    const randColor3 = 0.93 + Math.random() * noise;

    // assigning random colors to our data
    imgData.data[i] = imgData.data[i] * p1 * randColor1 + er; // red
    imgData.data[i + 1] = imgData.data[i + 1] * p2 * randColor2 + eg; // green
    imgData.data[i + 2] = imgData.data[i + 2] * p3 * randColor3 + eb; // blue
  }

  context.putImageData(imgData, 0, 0);
  const base64URI = canvas.toDataURL();

  img.src = base64URI;
  img.setAttribute(NOISED_ATTRIBUTE, "true");
  return base64URI;
};
