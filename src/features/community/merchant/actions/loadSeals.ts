import { communityContracts } from "features/community/lib/communityContracts";
import {
  Seal,
  SEAL_RARITIES,
} from "features/community/project-dignity/models/seal";

interface Props {
  owner?: string;
}

export async function loadSeals({ owner }: Props = {}) {
  try {
    const sealIds = await communityContracts.getSeal().getSealIds(owner);

    const result = sealIds.map(
      async (id) => await getSealMetadata({ sealId: id })
    );
    const res: Seal[] = await Promise.all(result);

    const seals: Seal[] = res.map((seal) => {
      const attrRarity = seal.attributes.find(
        (attr) => attr.trait_type === "Computed Rarity"
      )?.value;

      const rarity = Object.values(SEAL_RARITIES).find(
        (rarity) => rarity.name === attrRarity
      );

      return {
        ...seal,
        rarity: rarity ?? SEAL_RARITIES.common,
      };
    });

    seals.sort((a, b) => b.rarity.weight - a.rarity.weight);
    seals.splice(seals[0].rarity.visibleSeals, seals.length);

    return seals;
  } catch {
    return <Seal[]>[];
  }
}

export async function getSealMetadata(request: { sealId: string }) {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  const sealBaseUri = await communityContracts
    .getSeal()
    .getTokenUri(request.sealId);

  const response = await window.fetch(sealBaseUri, {
    mode: "cors",
    method: "GET",
    headers: headers,
  });

  const data = await response.json();

  return data;
}
