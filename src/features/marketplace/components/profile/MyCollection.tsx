import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { useLocation, useNavigate } from "react-router";

import { Context } from "features/game/GameProvider";
import { CollectionName } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS } from "features/game/types";
import { getKeys } from "features/game/types/craftables";
import { BUMPKIN_WITHDRAWABLES } from "features/game/types/withdrawables";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";
import { ListViewCard } from "../ListViewCard";

import chest from "assets/icons/chest.png";
import { isNode } from "features/game/expansion/lib/expansionNodes";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

type CollectionItem = {
  id: number;
  collection: CollectionName;
  count: number;
};

export const MyCollection: React.FC = () => {
  const gridRef = useRef<any>(null);
  const { t } = useAppTranslation();
  const location = useLocation();
  const isWorldRoute = location.pathname.includes("/world");

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [search, setSearch] = useState("");
  const { buds } = gameState.context.state;

  const navigate = useNavigate();
  let items: CollectionItem[] = [];

  const inventory = getChestItems(gameState.context.state);
  getKeys(inventory)
    .filter((name) => !isNode(name))
    .forEach((name) => {
      items.push({
        id: KNOWN_IDS[name],
        collection: "collectibles",
        count: inventory[name]?.toNumber() ?? 0,
      });
    });

  const wardrobe = availableWardrobe(gameState.context.state);
  getKeys(wardrobe).forEach((name) => {
    if (BUMPKIN_WITHDRAWABLES[name]()) {
      items.push({
        id: ITEM_IDS[name],
        collection: "wearables",
        count: wardrobe[name] ?? 0,
      });
    }
  });

  getKeys(buds ?? {}).forEach((id) => {
    if (!buds?.[id].coordinates) {
      items.push({
        id,
        collection: "buds",
        count: 1,
      });
    }
  });

  items = items.filter((item) => {
    const details = getTradeableDisplay({
      id: item.id,
      type: item.collection,
    });

    return details.name.toLowerCase().includes(search.toLowerCase());
  });

  const calculatePanelHeight = (width: number) => {
    const getColumnCount = (width: number) => {
      if (width >= 1280) return 7; // xl
      if (width >= 1024) return 5; // lg
      if (width >= 768) return 4; // md
      if (width >= 640) return 3; // sm
      return 2; // default
    };

    const columnCount = getColumnCount(width);
    const rowCount = Math.ceil(items.length / columnCount);
    // 160 is row height, 100 accounts for header + search + padding
    return rowCount * 160 + 100;
  };

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
    data,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    data: { width: number; items: CollectionItem[]; columnCount: number };
  }) => {
    const itemIndex = rowIndex * data.columnCount + columnIndex;
    const item = data.items[itemIndex];

    if (!item) return null;

    const details = getTradeableDisplay({
      id: item.id,
      type: item.collection,
    });

    return (
      <div style={style} className="pr-1 pb-1">
        <ListViewCard
          details={details}
          onClick={() => {
            const scrollPosition = gridRef.current?._outerRef.scrollTop;
            navigate(
              `${isWorldRoute ? "/world" : ""}/marketplace/${item.collection}/${item.id}`,
              {
                state: {
                  scrollPosition,
                  route: `${location.pathname}${location.search}`,
                },
              },
            );
          }}
        />
      </div>
    );
  };

  const savedScrollPosition = useLocation().state?.scrollPosition;

  return (
    <>
      <InnerPanel
        className="w-full mb-1"
        style={{
          height: "auto",
          minHeight: "200px",
        }}
      >
        <Label className="mb-2 ml-2" type="default" icon={chest}>
          {t("marketplace.myCollection")}
        </Label>
        <div className="flex items-center">
          <TextInput
            icon={SUNNYSIDE.icons.search}
            value={search}
            onValueChange={setSearch}
          />
        </div>
        <div className="p-2 h-full w-full">
          {items.length === 0 ? (
            <p className="text-sm">{t("marketplace.noCollection")}</p>
          ) : (
            <div style={{ height: calculatePanelHeight(window.innerWidth) }}>
              <AutoSizer>
                {({ height, width }) => {
                  const getColumnCount = (width: number) => {
                    if (width >= 1280) return 7; // xl
                    if (width >= 1024) return 5; // lg
                    if (width >= 768) return 4; // md
                    if (width >= 640) return 3; // sm
                    return 2; // default
                  };

                  const columnCount = getColumnCount(width);
                  const rowCount = Math.ceil(items.length / columnCount);
                  const columnWidth = width / columnCount;

                  return (
                    <Grid
                      ref={gridRef}
                      columnCount={columnCount}
                      columnWidth={columnWidth}
                      height={height}
                      rowCount={rowCount}
                      rowHeight={160}
                      width={width}
                      className="scrollable"
                      initialScrollTop={savedScrollPosition}
                      itemData={{ width, items, columnCount }}
                    >
                      {Cell}
                    </Grid>
                  );
                }}
              </AutoSizer>
            </div>
          )}
        </div>
      </InnerPanel>
    </>
  );
};
