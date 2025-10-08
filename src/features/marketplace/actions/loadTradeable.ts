import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import {
  CollectionName,
  TradeableDetails,
} from "features/game/types/marketplace";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export async function loadTradeable({
  type,
  id,
  token,
}: {
  type: CollectionName;
  id: number;
  token: string;
}): Promise<TradeableDetails> {
  if (!CONFIG.API_URL)
    return {
      id,
      floor: 0,
      supply: 0,
      collection: type,
      isActive: false,
      isVip: false,
      lastSalePrice: 0,
      offers: [],
      listings: [
        {
          id: "123",
          sfl: 200,
          quantity: 200,
          listedById: 202,
          listedAt: 0,
          type: "instant",
          listedBy: {
            id: 2,
            username: "Old mate",
            bumpkinUri: INITIAL_BUMPKIN.tokenUri,
          },
        },
        {
          id: "1234",
          sfl: 200,
          quantity: 200,
          listedById: 202,
          listedAt: 0,
          type: "instant",
          listedBy: {
            id: 2,
            username: "Old mate",
            bumpkinUri: INITIAL_BUMPKIN.tokenUri,
          },
        },
        {
          id: "1235",
          sfl: 200,
          quantity: 200,
          listedById: 202,
          listedAt: 0,
          type: "instant",
          listedBy: {
            id: 2,
            username: "Bobby",
            bumpkinUri: INITIAL_BUMPKIN.tokenUri,
          },
        },
      ],
      history: {
        sales: [],
        history: {
          totalSales: 0,
          totalVolume: 0,
          dates: {},
        },
      },
    };

  const url = new URL(`${API_URL}/collection/${type}/${id}`);
  url.searchParams.append("type", type);

  const response = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return await response.json();
}
