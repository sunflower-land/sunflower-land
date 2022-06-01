import * as fs from "fs";
import * as path from "path";
const { exec } = require("child_process");

function resize(fileName: string) {
  const output = path.join(__dirname, `./resized/${fileName}`);
  const input = path.join(__dirname, `./images/${fileName}`);
  console.log({
    input,
    output,
  });
  exec(
    `convert ${input} -filter point -background transparent -resize 900x900 -gravity center -extent 1024x1024 ${output}`,
    (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}

function prepareImage(fileName: string) {
  const png = path.join(__dirname, "./square_showcase.png");
  const input = path.join(__dirname, `./resized/${fileName}`);
  const output = path.join(__dirname, `./merged/${fileName}`);

  exec(
    `convert ${png} null: \\( ${input}  -coalesce \\) \\
    -layers composite -set dispose background ${output}`,
    (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}

const Crops: Record<string, number> = {
  sunflower: 0,
  potato: 1,
  pumpkin: 2,
  carrot: 3,
  cabbage: 4,
  beetroot: 5,
  cauliflower: 6,
  parsnip: 7,
  radish: 8,
  wheat: 9,
};

function writeData(fileName: string, id: number) {
  const [cropName, farmId] = fileName.split("_");

  const img = path.join(__dirname, `./merged/${fileName}`);
  const fileType = fileName.split(".")[1];

  const newJson = {
    name: `Mutant ${cropName}`,
    description: `## Mutant ${cropName}
    A rare mutant crop discovered while harvesting crops.
    Rumour has it these mutants were made by crazy farmer scientists developing technology for the Goblin War.
    [Link](https://docs.sunflower-land.com/crafting-guide)
    ### Contributor
    Sunflower Land is an open books game built by a community of hundreds of developers and artists across the globe.
    Come join us on [Github](https://github.com/sunflower-land/sunflower-land)
    Designed by Farm #${farmId}
    `,
    image: `https://sunflower-land.com/play/mutant-crops/${id}.${fileType}`,
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/crafting-guide",
    attributes: [{ trait_type: "Crop", value: cropName }],
  };

  const jsonFileName = `${id}.json`;
  console.log({ jsonFileName });
  const jsonPath = path.join(__dirname, "./metadata/", jsonFileName);
  fs.writeFile(jsonPath, JSON.stringify(newJson), () =>
    console.log(`Wrote file: ${id}`)
  );
  const imageFileName = `${id}.${fileType}`;
  const fileNamePath = path.join(__dirname, "./metadata/", imageFileName);
  console.log({ fileNamePath });

  fs.copyFile(img, fileNamePath, (e) => console.log(`Wrote image: ${id}`, e));
}

async function jsonFiles() {
  const folder = path.join(__dirname, `./merged`);

  let fileNames: string[] = [];

  fs.readdirSync(folder).forEach((file) => {
    console.log(file);
    // prepareImage(file);
    if (file === ".DS_Store") {
      return;
    }

    fileNames.push(file);
  });

  fileNames = fileNames.sort(() => 0.5 - Math.random());
  let readFiles = [...fileNames];

  let count = 0;
  while (readFiles.length > 0) {
    const cropId = count % 10;

    const fileNameIndex = readFiles.findIndex((name) => {
      const [cropName, farmId] = name.split("_");

      return Crops[cropName] === cropId;
    });

    if (fileNameIndex !== -1) {
      console.log({ fileNameIndex });
      writeData(readFiles[fileNameIndex], count + 1);
      readFiles = readFiles.filter((_, index) => index !== fileNameIndex);
    } else {
      console.log("Caught", cropId, fileNameIndex);
      const oldIndex = fileNames.findIndex((name) => {
        const [cropName, farmId] = name.split("_");

        return Crops[cropName] === cropId;
      });
      console.log({ oldIndex });
      writeData(fileNames[oldIndex], count + 1);
      fileNames = fileNames.filter((_, index) => index !== oldIndex);
    }

    count++;
  }
  //fileNames.forEach((fileName) => {});
}

jsonFiles();
