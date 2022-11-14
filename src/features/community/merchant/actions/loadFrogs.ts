import { communityContracts } from "features/community/lib/communityContracts";
import {
  Frog,
  FROG_RARITIES,
} from "features/community/project-dignity/models/frog";

interface Props {
  owner?: string;
  loadIncubatedFrogs?: boolean;
}

export async function loadFrogs({ owner, loadIncubatedFrogs }: Props = {}) {
  try {
    const frogIds = await communityContracts.getFrog().getFrogIds(owner);

    let frogIdsInIncubator: string[] = [];
    if (loadIncubatedFrogs) {
      const incubatorIds = await communityContracts
        .getIncubator()
        .incubatorIds();
      frogIdsInIncubator = await Promise.all(
        incubatorIds.map(async (incubatorId) => {
          const frogId = await communityContracts
            .getIncubator()
            .getFrogIdIncubator(incubatorId);
          return frogId;
        })
      );
    }

    const result = frogIds
      .concat(frogIdsInIncubator)
      .map(async (id) => await getFrogMetadata({ frogId: id }));
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

export async function getFrogMetadata(request: { frogId: string }) {
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
