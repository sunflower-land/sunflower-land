import * as fs from "fs";
import * as path from "path";

import { KNOWN_IDS } from "../src/features/game/types";
import {
  Attribute,
  Images,
  MarkdownSections,
  MetadataObject,
  ResultKeys,
} from "./models";

const FILENAME_REGEXP = /[ \w-]+?(?=\.)/;
const IMAGE_PATH = "https://sunflower-land.com/play/erc1155/images/";
const images = getImages();
generateMarkdown();

function getImages(): Images {
  const imagesPath = path.join(__dirname, `../public/erc1155/images/`);
  return fs.readdirSync(imagesPath).reduce((images, fileName) => {
    const matchResults = fileName.match(FILENAME_REGEXP);
    const id = matchResults?.length ? +matchResults[0] : undefined;
    if (id) {
      images[id] = IMAGE_PATH + fileName;
    }
    return images;
  }, {} as Images);
}

function generateMarkdown() {
  Promise.allSettled(Object.entries(KNOWN_IDS).map(parseMarkdownFile)).then(
    (results) => {
      const noMetadataFiles: string[] = [];
      results.forEach((result) => {
        if (result.status === "rejected") {
          if (result.reason.code === "ENOENT") {
            const matchResults = (result.reason.path as string).match(
              FILENAME_REGEXP
            );
            if (matchResults?.length) {
              noMetadataFiles.push(matchResults[0]);
              return;
            }
          }

          console.log(result.reason);
          return;
        }

        const metadata = result.value;
        const jsonPath = path.join(
          __dirname,
          `../public/erc1155/${metadata.id}.json`
        );
        delete metadata.id;

        fs.writeFile(jsonPath, JSON.stringify(metadata), () => undefined);
      });
      console.log("Metadata file not found for: ", noMetadataFiles);
    }
  );
}

function parseMarkdownFile(entry: [string, number]): Promise<MetadataObject> {
  const name = entry[0];
  const id = entry[1];
  const filePath = path.join(__dirname, `./markdown/${id}.md`);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, fileData) => {
      if (err) {
        reject(err);
        return;
      }

      const sections = generateSections(fileData);
      const result: MetadataObject = {
        id,
        name,
        description: getFullDescription(name, sections.description),
        decimals: getDecimals(sections.decimals),
        external_url: "https://docs.sunflower-land.com/getting-started/about",
      };

      if (images[id]) {
        result.image = images[id];
      }

      const bgColor = sections.background_color.trim();
      if (bgColor) {
        result.background_color = bgColor;
      }

      const attributes = sections.attributes.trim();
      if (attributes) {
        result.attributes = getAttributes(attributes, id);
      }

      resolve(result);
    });
  });
}

function getFullDescription(name: string, description: string): string {
  const nameHeader = `\r\n## ${name}\r\n\r\n`;

  return nameHeader + description.trim();
}

function getAttributes(attrString: string, id: number): Attribute[] {
  const attributes: Attribute[] = [];
  for (let attr of attrString.split("\r\n")) {
    attr = attr.trim();
    if (attr) {
      try {
        attributes.push(JSON.parse(attr));
      } catch (e) {
        console.log("Error in line - ", attr);
        console.log(`File - ${id}.md`);
        throw e;
      }
    }
  }

  return attributes;
}

function getDecimals(decimalString: string): number {
  const decimals = parseInt(decimalString.trim());

  return isNaN(decimals) ? 0 : decimals;
}

function generateSections(fileData: string): MarkdownSections {
  let currentField: ResultKeys | undefined;
  const sections: MarkdownSections = {
    description: "",
    decimals: "",
    background_color: "",
    attributes: "",
  };

  for (const line of fileData.split("\n")) {
    if (line.startsWith("# ")) {
      currentField = line
        .replace("# ", "")
        .replace(" ", "_")
        .trim()
        .toLowerCase() as ResultKeys;
    } else if (currentField) {
      sections[currentField] += `${line}\r\n`;
    }
  }

  return sections;
}
