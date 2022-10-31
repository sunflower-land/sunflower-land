import { communityContracts } from "features/community/lib/communityContracts";
import {
  Frog,
  FROG_RARITIES,
} from "features/community/project-dignity/models/frog";

export async function loadFrogs(owner?: string) {
  try {
    const frogIds = await communityContracts.getFrog().getFrogIds(owner);
    const result = frogIds.map(
      async (id) => await getFrogMetadata({ frogId: id })
    );
    const res: Frog[] = await Promise.all(result);

    const frogs: Frog[] = res.map((frog) => {
      const attrRarity = frog.attributes.find(
        (attr) => attr.trait_type === "Rarity"
      )?.value;

      const rarity = Object.values(FROG_RARITIES).find(
        (rarity) => rarity.name === attrRarity
      );

      return {
        ...frog,
        rarity: rarity ?? FROG_RARITIES.common,
      };
    });

    frogs.sort((a, b) => b.rarity.weight - a.rarity.weight);
    frogs.splice(frogs[0].rarity.visibleFrogs, frogs.length);

    // frogs.push(
    //   {
    //     name: "Patches #122",
    //     description:
    //       "Unique NFT Frogs for your Sunflower Land Farm. Made by Toad_Sage.",
    //     image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/images/122.gif",
    //     pixel_image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/pixel_images/122.gif",
    //     dna: "68349373e51033964426564de9b16b7e7da88551",
    //     edition: 122,
    //     date: 1663609838715,
    //     attributes: [
    //       { trait_type: "Float", value: "Rock", rarity: "Common" },
    //       { trait_type: "Base", value: "Red", rarity: "Epic" },
    //       { trait_type: "Hat", value: "Pirate", rarity: "Uncommon" },
    //       { trait_type: "Background", value: "Water" },
    //       { trait_type: "Name", value: "Patches" },
    //       { trait_type: "Rarity", value: "Epic" },
    //     ],
    //     compiler: "HashLips Art Engine",
    //     founders: "Project Dignity: Tiffanydys, DonatasDee, VadimasVP, Paluras",
    //   } as unknown as Frog,
    //   {
    //     name: "Star #69",
    //     description:
    //       "Unique NFT Frogs for your Sunflower Land Farm. Made by Toad_Sage.",
    //     image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/images/69.gif",
    //     pixel_image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/pixel_images/69.gif",
    //     dna: "fb1660ee858521d0d428ff9024f26522b41298d8",
    //     edition: 69,
    //     date: 1663609838518,
    //     attributes: [
    //       { trait_type: "Float", value: "Rock", rarity: "Common" },
    //       { trait_type: "Base", value: "Green", rarity: "Common" },
    //       { trait_type: "Hat", value: "Pirate", rarity: "Uncommon" },
    //       { trait_type: "Background", value: "Water" },
    //       { trait_type: "Name", value: "Star" },
    //       { trait_type: "Rarity", value: "Uncommon" },
    //     ],
    //     compiler: "HashLips Art Engine",
    //     founders: "Project Dignity: Tiffanydys, DonatasDee, VadimasVP, Paluras",
    //   } as unknown as Frog,
    //   {
    //     name: "Patches #122",
    //     description:
    //       "Unique NFT Frogs for your Sunflower Land Farm. Made by Toad_Sage.",
    //     image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/images/122.gif",
    //     pixel_image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/pixel_images/122.gif",
    //     dna: "68349373e51033964426564de9b16b7e7da88551",
    //     edition: 122,
    //     date: 1663609838715,
    //     attributes: [
    //       { trait_type: "Float", value: "Rock", rarity: "Common" },
    //       { trait_type: "Base", value: "Red", rarity: "Epic" },
    //       { trait_type: "Hat", value: "Pirate", rarity: "Uncommon" },
    //       { trait_type: "Background", value: "Water" },
    //       { trait_type: "Name", value: "Patches" },
    //       { trait_type: "Rarity", value: "Epic" },
    //     ],
    //     compiler: "HashLips Art Engine",
    //     founders: "Project Dignity: Tiffanydys, DonatasDee, VadimasVP, Paluras",
    //   } as unknown as Frog,
    //   {
    //     name: "Star #69",
    //     description:
    //       "Unique NFT Frogs for your Sunflower Land Farm. Made by Toad_Sage.",
    //     image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/images/69.gif",
    //     pixel_image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/pixel_images/69.gif",
    //     dna: "fb1660ee858521d0d428ff9024f26522b41298d8",
    //     edition: 69,
    //     date: 1663609838518,
    //     attributes: [
    //       { trait_type: "Float", value: "Rock", rarity: "Common" },
    //       { trait_type: "Base", value: "Green", rarity: "Common" },
    //       { trait_type: "Hat", value: "Pirate", rarity: "Uncommon" },
    //       { trait_type: "Background", value: "Water" },
    //       { trait_type: "Name", value: "Star" },
    //       { trait_type: "Rarity", value: "Uncommon" },
    //     ],
    //     compiler: "HashLips Art Engine",
    //     founders: "Project Dignity: Tiffanydys, DonatasDee, VadimasVP, Paluras",
    //   } as unknown as Frog,
    //   {
    //     name: "Patches #122",
    //     description:
    //       "Unique NFT Frogs for your Sunflower Land Farm. Made by Toad_Sage.",
    //     image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/images/122.gif",
    //     pixel_image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/pixel_images/122.gif",
    //     dna: "68349373e51033964426564de9b16b7e7da88551",
    //     edition: 122,
    //     date: 1663609838715,
    //     attributes: [
    //       { trait_type: "Float", value: "Rock", rarity: "Common" },
    //       { trait_type: "Base", value: "Red", rarity: "Epic" },
    //       { trait_type: "Hat", value: "Pirate", rarity: "Uncommon" },
    //       { trait_type: "Background", value: "Water" },
    //       { trait_type: "Name", value: "Patches" },
    //       { trait_type: "Rarity", value: "Epic" },
    //     ],
    //     compiler: "HashLips Art Engine",
    //     founders: "Project Dignity: Tiffanydys, DonatasDee, VadimasVP, Paluras",
    //   } as unknown as Frog,
    //   {
    //     name: "Star #69",
    //     description:
    //       "Unique NFT Frogs for your Sunflower Land Farm. Made by Toad_Sage.",
    //     image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/images/69.gif",
    //     pixel_image:
    //       "https://raw.githubusercontent.com/tiffanydys/frogs/main/pixel_images/69.gif",
    //     dna: "fb1660ee858521d0d428ff9024f26522b41298d8",
    //     edition: 69,
    //     date: 1663609838518,
    //     attributes: [
    //       { trait_type: "Float", value: "Rock", rarity: "Common" },
    //       { trait_type: "Base", value: "Green", rarity: "Common" },
    //       { trait_type: "Hat", value: "Pirate", rarity: "Uncommon" },
    //       { trait_type: "Background", value: "Water" },
    //       { trait_type: "Name", value: "Star" },
    //       { trait_type: "Rarity", value: "Uncommon" },
    //     ],
    //     compiler: "HashLips Art Engine",
    //     founders: "Project Dignity: Tiffanydys, DonatasDee, VadimasVP, Paluras",
    //   } as unknown as Frog
    // );

    return frogs;
  } catch {
    return <Frog[]>[];
  }
}

export async function getFrogMetadata(request: { frogId: number[] }) {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  const frogBaseUri = await communityContracts
    .getFrog()
    .getTokenUri(request.frogId);

  const response = await window.fetch(frogBaseUri, {
    mode: "cors",
    method: "GET",
    headers: headers,
  });

  const data = await response.json();

  return data;
}
