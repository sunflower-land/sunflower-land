var iW = 0; // image width
var iH = 0; // image height
var p1 = 0.99;
var p2 = 0.99;
var p3 = 0.99;
var er = 0; // extra red
var eg = 0; // extra green
var eb = 0; // extra blue

// Filters functions
export const RandomID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

export async function addNoise(id: string) {
  // wait for it to render
  await new Promise((res) => setTimeout(res, 100));
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const context = canvas?.getContext("2d") as CanvasRenderingContext2D;
  const img = document.getElementById(id) as HTMLImageElement;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  context.drawImage(img, 0, 0);

  const imgData = context.getImageData(
    0,
    0,
    img.naturalWidth,
    img.naturalHeight
  );

  for (var i = 0, n = imgData.data.length; i < n; i += 4) {
    // generating random color coefficients
    var randColor1 = 0.9 + Math.random() * 0.4;
    var randColor2 = 0.9 + Math.random() * 0.4;
    var randColor3 = 0.9 + Math.random() * 0.4;

    // assigning random colors to our data
    imgData.data[i] = imgData.data[i] * p2 * randColor1 + er; // green
    imgData.data[i + 1] = imgData.data[i + 1] * p2 * randColor2 + eg; // green
    imgData.data[i + 2] = imgData.data[i + 2] * p3 * randColor3 + eb; // blue
  }

  context.putImageData(imgData, 0, 0);
  var base64URI = canvas.toDataURL();

  img.src = base64URI;
  return base64URI;
}
