// import mergeImages from "merge-images";
// import { Canvas, Image } from "canvas";
// import path from "path";
// import fs from "fs";
// import sizeOf from "image-size";
// import scalePixelArt from "scale-pixel-art";

// async function main() {
//   //   let ids: number[] = [];
//   //   //passing directoryPath and callback function
//   //   const files = fs.readdirSync(__dirname);
//   //   //listing all files using forEach
//   //   files.forEach(function (file) {
//   //     // Do whatever you want to do with the file
//   //     if (file.endsWith(".png")) {
//   //       console.log(file, Number(file.split(".")[0]));
//   //       const id = Number(file.split(".")[0]);
//   //       if (!isNaN(id)) ids.push(id);
//   //     }
//   //   });

//   //   console.log({ ids });

//   //   ids.forEach((id) => {
//   //     sizeOf(
//   //       path.join(__dirname, `${id}.png`),
//   //       async function (err, dimensions: any) {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         if (dimensions.width < 1920) {
//   //           const scaleFactor = 1920 / dimensions.width;
//   //           console.log(id, dimensions.width, dimensions.height, scaleFactor);

//   //           const inputBuffer = fs.readFileSync(
//   //             path.join(__dirname, `${id}.png`)
//   //           );

//   //           try {
//   //             const outputBuffer = await scalePixelArt(inputBuffer, scaleFactor);

//   //             fs.writeFileSync(path.join(__dirname, `${id}.png`), outputBuffer);
//   //           } catch (e) {
//   //             console.log({ failed: id, scaleFactor });
//   //           }
//   //           console.log({ written: id });
//   //         }
//   //       }
//   //     );
//   //   });
//   const label = path.join(__dirname, `not_for_sale_label.png`);

//   const images = [532, 545, 920, 921, 924, 1203];
//   images.forEach((id) => {
//     mergeImages([path.join(__dirname, `${id}.png`), label], {
//       Canvas: Canvas,
//       Image: Image,
//       format: "png",
//     }).then((b64: any) => {
//       console.log({ b64 });
//       fs.writeFileSync(
//         path.join(__dirname, `${id}.png`),
//         b64.split(";base64,").pop(),
//         "base64"
//       );
//     });
//   });

//   // data:image/png;base64,iVBORw0KGgoAA...
// }

// main();
