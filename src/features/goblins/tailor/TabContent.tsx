import React, { useEffect, useState } from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";

import { Tab } from "./ItemsModal";

import token from "assets/icons/sfl.webp";
import {
  BumpkinShopItem,
  loadCollection,
  loadCurrentAndUpcomingDrops,
} from "./actions/items";
import classNames from "classnames";

import { CONFIG } from "lib/config";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const TAB_CONTENT_HEIGHT = 364;

interface Props {
  tab: Tab;
}

export type Release = {
  releaseDate: number;
  endDate?: number;
  supply: number;
  price: string;
};

export function getImageUrl(wearableId: number) {
  if (CONFIG.NETWORK === "mainnet") {
    return `https://bumpkins.io/erc1155/images/${wearableId}.png`;
  }

  return `https://testnet.bumpkins.io/erc1155/images/${wearableId}.png`;
}

// async function getDetails() {
//   const url = `${API_URL}/bans/${id}`;
//   const response = await window.fetch(url, {
//     method: "GET",
//     headers: {
//       "content-type": "application/json;charset=UTF-8",
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }
export const TabContent: React.FC<Props> = ({ tab }) => {
  const { t } = useAppTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<BumpkinShopItem[]>([]);
  const [collection, setCollection] = useState<BumpkinShopItem[]>([]);
  const [selected, setSelected] = useState<BumpkinShopItem | undefined>(
    undefined
  );

  useEffect(() => {
    const loadItems = async () => {
      const upcoming = await loadCurrentAndUpcomingDrops();
      const collection = await loadCollection();

      setUpcoming(upcoming);
      setCollection(collection);

      const items = tab === "collection" ? collection : upcoming;

      setSelected(items[0]);

      setIsLoading(false);
    };

    loadItems();
  }, []);

  useEffect(() => {
    const items = tab === "collection" ? collection : upcoming;

    setSelected(items[0]);
  }, [tab, collection, upcoming]);

  const items = tab === "collection" ? collection : upcoming;

  const goToUpcomingDrops = () => {
    window.open(
      CONFIG.NETWORK === "amoy"
        ? "https://testnet.bumpkins.io/#/upcoming-drops"
        : "https://bumpkins.io/#/upcoming-drops",
      "_blank"
    );
  };

  const goToCollectionItem = () => {
    window.open(
      CONFIG.NETWORK === "amoy"
        ? `https://testnet.bumpkins.io/#/collection/${selected?.tokenId}`
        : `https://bumpkins.io/#/collection/${selected?.tokenId}`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div className="h-60">
        <span className="loading">{t("loading")}</span>
      </div>
    );
  }

  if (selected === undefined) {
    return (
      <div className="flex flex-col">
        <span>{t("currently.Unavailable")}</span>
        <span>
          {t("please.try.again")}
          {"."}
        </span>
      </div>
    );
  }

  const PanelDetail = () => {
    if (tab === "collection") {
      return (
        <>
          <span className="text-center text-xs leading-5">
            {/* TODO - load from metadata url? */}
          </span>
          <div className="border-t border-white w-full mt-2 py-2 text-center">
            <span className="text-xxs text-center mt-2">
              {t("visit")} {"Bumpkins.io"} {t("for.info.wearable")}
            </span>
          </div>
          <Button className="text-xs mt-1" onClick={goToCollectionItem}>
            {t("goto")} {"Bumpkins.io"}
          </Button>
        </>
      );
    }
    const now = Date.now();
    const releaseDate = selected.currentRelease?.releaseDate as number;
    const releaseEndDate = selected.currentRelease?.endDate as number;
    const mintIsLive = releaseDate < now && releaseEndDate > now;

    return (
      <>
        <Label type="info" className="my-1">
          {mintIsLive
            ? "Available now on Bumpkins.io"
            : `Available at: ${new Date(releaseDate).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "long",
                hour12: true,
              })}`}
        </Label>
        <span className="text-center text-xs leading-5">
          {/* TODO - load from metadata url? */}
        </span>
        <div className="border-t border-white w-full mt-2 pt-2 text-center">
          <div className="flex justify-center items-end my-1">
            <img src={token} className="h-4 mr-1" />
            <span className="text-xs sm:text-sm text-shadow text-center">
              {`${selected.currentRelease?.price}`}
            </span>
          </div>
        </div>
        <Button className="text-xs mt-1" onClick={goToUpcomingDrops}>
          {t("goto")} {"Bumpkins.io"}
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <OuterPanel className="flex-1 w-full flex flex-col justify-between items-center">
        <div
          className={classNames(
            "flex flex-col justify-center items-center p-2 pt-3 relative w-full",
            {
              "mt-2": tab === "upcoming-drops",
            }
          )}
        >
          <span className="text-center text-sm">{selected.name}</span>
          <img
            src={getImageUrl(selected.tokenId)}
            className="h-24 rounded-md my-2"
            alt={selected.name}
          />
          {PanelDetail()}
        </div>
      </OuterPanel>
      <div
        style={{
          maxHeight: TAB_CONTENT_HEIGHT,
        }}
        className="overflow-y-auto w-full pt-1 mr-1 scrollable mt-1"
      >
        <div className="flex flex-wrap h-fit justify-center">
          {items.map((item) => (
            <Box
              isSelected={selected === item}
              key={item.name}
              onClick={() => setSelected(item)}
              image={getImageUrl(item.tokenId)}
              count={new Decimal(0)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
