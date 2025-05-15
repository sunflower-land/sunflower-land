import React, { useContext, useEffect, useState } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ListViewCard } from "features/marketplace/components/ListViewCard";

export const DashboardAuction: React.FC = () => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<
    BumpkinItem | InventoryItemName | undefined
  >(undefined);

  const { authState } = useAuth();

  const auctionService = useInterpret(
    createAuctioneerMachine({
      onUpdate: () => {
        // No op
      },
    }),
    {
      context: {
        farmId: 1,
        token: authState.context.user.rawToken as string,
        bid: undefined,
        deviceTrackerId: "0x",
        canAccess: true,
        linkedAddress: "0x",
      },
    },
  ) as unknown as MachineInterpreter;

  const [auctioneerState] = useActor(auctionService);

  useEffect(() => {
    auctionService.send("OPEN", { gameState: INITIAL_FARM });
  }, []);

  if (auctioneerState.matches("idle")) {
    return null;
  }

  if (auctioneerState.matches("loading")) {
    return <Loading />;
  }

  const { details: auctionItems, filteredTotalSupply: totalItems } =
    getSeasonalAuctions({
      auctions: auctioneerState.context.auctions,
      totalSupply: auctioneerState.context.totalSupply,
      season: getCurrentSeason(),
    });

  return (
    <>
      <ModalOverlay
        show={!!selected}
        onBackdropClick={() => setSelected(undefined)}
      >
        <CloseButtonPanel
          container={OuterPanel}
          onClose={() => setSelected(undefined)}
        >
          {selected && (
            <Drops
              name={selected}
              detail={auctionItems[selected]}
              maxSupply={totalItems[selected]}
              game={INITIAL_FARM}
            />
          )}
        </CloseButtonPanel>
      </ModalOverlay>

      <div className="flex flex-wrap">
        {getKeys(auctionItems).map((name) => {
          const details = auctionItems[name];
          const isCollectible = details.type === "collectible";

          const image = isCollectible
            ? ITEM_DETAILS[name as CollectibleName].image
            : getImageUrl(ITEM_IDS[name as BumpkinItem]);

          const buffLabel = isCollectible
            ? COLLECTIBLE_BUFF_LABELS(INITIAL_FARM)[name as CollectibleName]
            : BUMPKIN_ITEM_BUFF_LABELS[name as BumpkinItem];

          return (
            <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[16.66%] pr-1 pb-1">
              <AuctionCard
                name={name}
                image={image}
                buffs={buffLabel ?? []}
                auctionAt={Date.now()}
                onClick={() => {
                  setSelected(name);
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

import { ButtonPanel, OuterPanel } from "components/ui/Panel";
import lightning from "assets/icons/lightning.png";
import { InventoryItemName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useActor, useInterpret } from "@xstate/react";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/types/images";
import { MarketplaceTradeableName } from "features/game/types/marketplace";
import { BuffLabel } from "features/game/types";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  Drops,
  getSeasonalAuctions,
} from "features/island/hud/components/codex/components/SeasonalAuctions";
import {
  createAuctioneerMachine,
  MachineInterpreter,
} from "features/game/lib/auctionMachine";
import { Loading } from "features/auth/components";
import { getCurrentSeason } from "features/game/types/seasons";
import { INITIAL_FARM } from "features/game/lib/constants";

import { getKeys } from "features/game/types/decorations";
import { CollectibleName } from "features/game/types/craftables";
import { getImageUrl } from "lib/utils/getImageURLS";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { useAuth } from "features/auth/lib/Provider";

type Props = {
  name: MarketplaceTradeableName;
  image: string;
  buffs: BuffLabel[];
  auctionAt: number;
  onClick: () => void;
};

export const AuctionCard: React.FC<Props> = ({
  onClick,
  auctionAt,
  name,
  image,
  buffs,
}) => {
  const { gameService } = useContext(Context);
  return (
    <div
      className="relative cursor-pointer h-full"
      style={{ paddingTop: "1px" }}
    >
      <ButtonPanel
        onClick={onClick}
        variant="card"
        className="h-full flex flex-col"
      >
        <div
          className={classNames(
            "flex flex-col items-center relative h-20 p-2 pt-4",
          )}
        >
          <img src={image} className="w-1/2" />{" "}
        </div>

        <div
          className="bg-white px-2 py-2 flex-1 z-10"
          style={{
            background: "#fff0d4",
            borderTop: "1px solid #e4a672",
            margin: "0 -8px",
            marginBottom: "-2.6px",
            height: "100px",
          }}
        >
          <p className="text-xs mb-1 py-0.5 truncate text-[#181425]">{name}</p>

          {buffs.slice(0, 1).map((buff) => (
            <div key={buff.shortDescription} className="flex items-center">
              <img
                src={buff.boostedItemIcon ?? lightning}
                className="h-4 mr-1"
              />
              <p className="text-xs truncate pb-0.5">{buff.shortDescription}</p>
            </div>
          ))}
          {buffs.length === 0 && (
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.heart} className="h-4 mr-1" />
              <p className="text-xs truncate pb-0.5">Cosmetic</p>
            </div>
          )}
        </div>
      </ButtonPanel>
    </div>
  );
};
