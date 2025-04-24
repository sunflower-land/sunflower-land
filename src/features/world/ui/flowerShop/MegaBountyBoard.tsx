import React, { useContext, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { millisecondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { weekResetsAt } from "features/game/lib/factions";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import {
  ExoticBounty,
  FishBounty,
  FlowerBounty,
  InventoryItemName,
  MarkBounty,
} from "features/game/types/game";
import { BountyRequest } from "features/game/types/game";
import { ObsidianBounty } from "features/game/types/game";
import { FISH } from "features/game/types/consumables";
import { EXOTIC_CROPS, ExoticCropName } from "features/game/types/beans";
import { FULL_MOON_FRUITS, FullMoonFruit } from "features/game/types/fruits";
import { RECIPE_CRAFTABLES } from "features/game/lib/crafting";
import {
  BeachBountyTreasure,
  SELLABLE_TREASURE,
} from "features/game/types/treasure";
import { FLOWERS } from "features/game/types/flowers";
import { getKeys } from "features/game/types/craftables";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { FishName } from "features/game/types/fishing";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import token from "assets/icons/flower_token.webp";
import {
  getSeasonalArtefact,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const MegaBountyBoard: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.poppy}
      onClose={onClose}
      tabs={[{ icon: SUNNYSIDE.icons.stopwatch, name: "Mega Bounty Board" }]}
    >
      <MegaBountyBoardContent />
    </CloseButtonPanel>
  );
};

export const isMarkBounty = (bounty: BountyRequest): bounty is MarkBounty =>
  bounty.name === "Mark";

export const isObsidianBounty = (
  bounty: BountyRequest,
): bounty is ObsidianBounty => bounty.name === "Obsidian";

export const isFishBounty = (bounty: BountyRequest): bounty is FishBounty =>
  getKeys(FISH).includes(bounty.name as FishName);

export const isExoticBounty = (bounty: BountyRequest): bounty is ExoticBounty =>
  getKeys(EXOTIC_CROPS).includes(bounty.name as ExoticCropName) ||
  getKeys(SELLABLE_TREASURE).includes(bounty.name as BeachBountyTreasure) ||
  FULL_MOON_FRUITS.includes(bounty.name as FullMoonFruit) ||
  bounty.name in RECIPE_CRAFTABLES;

export const isFlowerBounty = (bounty: BountyRequest): bounty is FlowerBounty =>
  bounty.name in FLOWERS;

export const MegaBountyBoardContent: React.FC<{ readonly?: boolean }> = ({
  readonly,
}) => {
  const { t } = useAppTranslation();
  const endTime = weekResetsAt();
  const timeRemaining = endTime - Date.now();
  const showDanger = timeRemaining < 1000 * 60 * 60 * 24;

  const { gameService } = useContext(Context);
  const bounties = useSelector(
    gameService,
    (state) => state.context.state.bounties,
  );
  const markBounties = bounties.requests.filter(isMarkBounty);
  const fishBounties = bounties.requests.filter(isFishBounty);
  const exoticBounties = bounties.requests.filter(isExoticBounty);
  // console.log(exoticBounties);
  const flowerBounties = bounties.requests.filter(isFlowerBounty);
  const obsidianBounties = bounties.requests.filter(isObsidianBounty);
  const [selectedBounty, setSelectedBounty] = useState<BountyRequest>();

  const BOUNTIES_BY_CATEGORY: Record<
    string,
    { categoryName: string; bounties: BountyRequest[] }
  > = {
    "Mark Bounties": {
      categoryName: "Mark Bounties",
      bounties: markBounties,
    },
    "Fish Bounties": {
      categoryName: "Fish Bounties",
      bounties: fishBounties,
    },
    "Exotic Bounties": {
      categoryName: "Exotic Bounties",
      bounties: exoticBounties,
    },
    "Flower Bounties": {
      categoryName: "Flower Bounties",
      bounties: flowerBounties,
    },
    "Obsidian Bounties": {
      categoryName: "Obsidian Bounties",
      bounties: obsidianBounties,
    },
  };
  const getCurrency = (bounty: BountyRequest) => {
    if (isObsidianBounty(bounty)) {
      if (bounty.sfl !== 0) {
        return bounty.sfl;
      } else {
        const currency =
          bounty.sfl === 0 && (bounty.items?.[getSeasonalTicket()] ?? 0 > 0)
            ? getSeasonalTicket()
            : getSeasonalArtefact();
        const currencyItem =
          bounty.sfl === 0 && (bounty.items?.[currency] ?? 0 > 0)
            ? bounty.items?.[currency]
            : bounty.items?.[
                Object.keys(bounty.items ?? {})[0] as InventoryItemName
              ];
        return currencyItem;
      }
    }

    const currency =
      bounty.items?.[getSeasonalTicket()] ?? 0 > 0
        ? getSeasonalTicket()
        : getSeasonalArtefact();
    const currencyItem =
      bounty.items?.[currency] ?? 0 > 0
        ? bounty.items?.[currency]
        : bounty.items?.[
            Object.keys(bounty.items ?? {})[0] as InventoryItemName
          ];

    return currencyItem;
  };
  const getCurrencyIcon = (item: BountyRequest) => {
    if (isObsidianBounty(item) && item.sfl !== 0) return token;

    const currencyItem =
      item.items?.[getSeasonalTicket()] ?? 0 > 0
        ? getSeasonalTicket()
        : item.items?.[getSeasonalArtefact()] ?? 0 > 0
          ? getSeasonalArtefact()
          : Object.keys(item.items ?? {})[0];

    return ITEM_DETAILS[currencyItem as InventoryItemName].image;
  };
  return (
    <>
      <div className="flex justify-between px-2 flex-wrap pb-1">
        <Label type="default" className="mb-1">
          {"Poppy"}
        </Label>
        <Label
          icon={SUNNYSIDE.icons.stopwatch}
          type={showDanger ? "danger" : "info"}
          className="mb-1"
        >
          {t("megaStore.timeRemaining", {
            timeRemaining: millisecondsToString(timeRemaining, {
              length: "medium",
              removeTrailingZeros: true,
            }),
          })}
        </Label>
      </div>

      <div
        className={classNames("flex flex-col p-2 pt-1", {
          ["max-h-[300px] overflow-y-auto scrollable "]: !readonly,
        })}
      >
        <span className="text-xs pb-1">
          {readonly ? t("megaBountyBoard.message") : t("megaBountyBoard.msg1")}
        </span>

        {getObjectEntries(BOUNTIES_BY_CATEGORY).map(
          ([category, { categoryName, bounties }]) => (
            <div key={category}>
              <Label type="default" className="mb-1">
                {categoryName}
              </Label>
              <div className="flex gap-2 flex-wrap">
                {bounties.map((bounty) => {
                  return (
                    <div key={bounty.name} className="flex flex-col space-y-1">
                      <div
                        className="bg-brown-600 cursor-pointer relative"
                        style={{
                          ...pixelDarkBorderStyle,
                        }}
                        onClick={() => setSelectedBounty(bounty)}
                      >
                        <div className="flex justify-center items-center w-full h-full z-20">
                          <SquareIcon
                            icon={ITEM_DETAILS[bounty.name].image}
                            width={20}
                          />

                          {/* Price */}
                          <div className="absolute px-4 bottom-3 -left-4 object-contain">
                            <Label
                              icon={getCurrencyIcon(bounty)}
                              type="warning"
                              className={
                                "text-xxs absolute center text-center p-1 "
                              }
                              style={{
                                width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                                height: "24px",
                              }}
                            >
                              {getCurrency(bounty)}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
};
