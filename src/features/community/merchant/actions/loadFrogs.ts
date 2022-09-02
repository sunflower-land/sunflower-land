import { communityContracts } from "features/community/lib/communityContracts";
import frog_unrevealed from "assets/nfts/frogs/frog_unrevealed.gif";

type Request = {
  frogId: number[];
};

export type Frog = {
  pixel_image: string;
  attributes?: any;
  [key: string]: any;
};

export async function loadFrogs() {
  try {
    let frogIds = await communityContracts.getFrog().getFrogIds();

    if (await isFrogPreview()) {
      if (frogIds.length > 6) {
        frogIds = frogIds.slice(0, 6);
      }

      const result = frogIds.map(() => ({
        pixel_image: frog_unrevealed,
        name: "Unrevealed",
      }));

      return result;
    } else {
      const result = frogIds.map(
        async (id) => await getFrogMetadata({ frogId: id })
      );
      const res: Frog[] = await Promise.all(result);

      let filteredFrogs = res;

      // only run filter if there is more than 1 frog in wallet
      if (frogIds.length > 1) {
        filteredFrogs = filterFrogs(res);
      }

      console.log("filtered frogs:", filteredFrogs);
      return filteredFrogs;
    }
  } catch {
    return null;
  }
}

export async function getFrogMetadata(request: Request) {
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

export async function isFrogPreview() {
  const frogBaseUri = await communityContracts.getFrog().getBaseUri();

  return frogBaseUri.includes("preview");
}

function filterFrogs(frogs: Frog[]) {
  console.log("being filtered", frogs);

  frogs.sort(compare);

  // After sorting, the first object in the array is the highest rarity
  const highestRarity = frogs[0].attributes[5].value;

  console.log("highest rarity", highestRarity);

  /** Limit frogs based on highest rarity of frog in farm
   * Legendary = 6 frogs
   * Epic = 5 frogs
   * Rare = 4 frogs
   * Uncommon = 3 frogs
   * Common = 2 frogs
   */
  switch (highestRarity) {
    case "Legendary":
      frogs.splice(6, frogs.length);
      break;
    case "Epic":
      frogs.slice(5, frogs.length);
      break;
    case "Rare":
      frogs.slice(4, frogs.length);
      break;
    case "Uncommon":
      frogs.slice(3, frogs.length);
      break;
    case "Common":
      frogs.splice(2, frogs.length);
      break;
    default:
      frogs.slice(0, 2);
  }

  return frogs;
}

function compare(a: Frog, b: Frog) {
  const rarityLadder = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  let comparison = 0;
  const a_position = rarityLadder.indexOf(a.attributes[5].value);
  const b_position = rarityLadder.indexOf(b.attributes[5].value);

  if (a_position < b_position) {
    comparison = 1;
  } else if (a_position > b_position) {
    comparison = -1;
  }

  return comparison;
}
