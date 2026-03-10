import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { getKeys } from "lib/object";
import { translate } from "lib/i18n/translate";
import { getPetImage } from "features/island/pets/lib/petShared";
import { getBudImage } from "lib/buds/types";
import { RafflePrize } from "features/retreat/components/auctioneer/types";

export const getPrizeDisplay = ({ prize }: { prize: RafflePrize }) => {
  const fallbackPrizeDisplay = () => {
    return {
      name: translate("auction.raffle.prizeFallback"),
      image: SUNNYSIDE.icons.expression_confused,
      type: "item" as const,
    };
  };
  switch (prize.type) {
    case "Bud":
      return {
        type: "Bud",
        name: prize.nft,
        image: getBudImage(Number(prize.nft.split("#")[1])),
      };
    case "Pet":
      return {
        type: "Pet",
        name: prize.nft,
        image: getPetImage("happy", Number(prize.nft.split("#")[1])),
      };
    case "collectible": {
      const key = getKeys(prize.items)[0];
      if (!key) return fallbackPrizeDisplay();
      return {
        type: "collectible",
        name: key,
        image: ITEM_DETAILS[key].image,
      };
    }
    case "wearable": {
      const key = getKeys(prize.wearables)[0];
      if (!key) return fallbackPrizeDisplay();
      return {
        type: "wearable",
        name: key,
        image: getImageUrl(ITEM_IDS[key]),
      };
    }
    default:
      return fallbackPrizeDisplay();
  }
};
