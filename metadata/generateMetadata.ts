import * as fs from "fs";
import * as path from "path";

import { KNOWN_IDS } from "../src/features/game/types/index";

async function generateMarkdown() {
  await Promise.allSettled(
    Object.entries(KNOWN_IDS).map(parseMarkdownFile)
  ).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.log(result.reason);
        return;
      }

      const metadata = result.value;
      const jsonPath = path.join(
        __dirname,
        `../public/erc1155/${metadata.id}.json`
      );
      const id = metadata.id;
      delete metadata.id;

      fs.writeFile(jsonPath, JSON.stringify(metadata), () =>
        console.log(`Metadata file for ${metadata.name}(${id}) updated!`)
      );
    });
  });
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
        image: `https://sunflower-land.com/play/erc1155/${id}.png`,
        decimals: getDecimals(sections.decimals),
        external_url: "https://docs.sunflower-land.com/getting-started/about",
      };

      const bgColor = sections.background_color.trim();
      if (bgColor) {
        result.background_color = bgColor;
      }

      const attributes = sections.attributes.trim();
      if (attributes) {
        result.attributes = getAttributes(attributes);
      }

      resolve(result);
    });
  });
}

function getFullDescription(name: string, description: string): string {
  const nameHeader = `## ${name}\r\n\r\n`;

  return nameHeader + description.trim();
}

function getAttributes(attrString: string): Attribute[] {
  const attributes: Attribute[] = [];
  for (let attr of attrString.split("\r\n")) {
    attr = attr.trim();
    if (attr) {
      attributes.push(JSON.parse(attr));
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

  for (const line of fileData.split("\r\n")) {
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

generateMarkdown();

type MetadataObject = {
  name: string;
  [ResultKeys.Description]: string;
  image: string;
  [ResultKeys.Decimals]: number;
  external_url: string;
  id?: number;
  [ResultKeys.BackgroundColor]?: string;
  [ResultKeys.Attributes]?: Attribute[];
};

type MarkdownSections = {
  [key in ResultKeys]: string;
};

interface Attribute {
  trait_type: string;
  value: string;
  display_type?: string;
}

enum ResultKeys {
  Description = "description",
  Decimals = "decimals",
  BackgroundColor = "background_color",
  Attributes = "attributes",
}
