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
