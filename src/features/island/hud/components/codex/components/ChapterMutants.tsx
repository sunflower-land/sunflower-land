import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { ChapterName } from "features/game/types/chapters";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

type ChapterMutants = {
  banner: string;
  chicken: InventoryItemName;
  flower: InventoryItemName;
  fish: InventoryItemName;
  cow: InventoryItemName;
  sheep: InventoryItemName;
};

export const CHAPTER_MUTANTS: Partial<Record<ChapterName, ChapterMutants>> = {
  "Pharaoh's Treasure": {
    chicken: "Pharaoh Chicken",
    flower: "Desert Rose",
    fish: "Lemon Shark",
    cow: "Cow",
    sheep: "Sheep",
    banner: SUNNYSIDE.announcement.pharaohSeasonRares,
  },
  "Bull Run": {
    chicken: "Alien Chicken",
    flower: "Chicory",
    fish: "Longhorn Cowfish",
    cow: "Mootant",
    sheep: "Toxic Tuft",
    banner: SUNNYSIDE.announcement.bullRunSeasonRares,
  },
  "Winds of Change": {
    chicken: "Summer Chicken",
    flower: "Chamomile",
    fish: "Jellyfish",
    cow: "Frozen Cow",
    sheep: "Frozen Sheep",
    banner: SUNNYSIDE.announcement.windsOfChangeSeasonRares,
  },
  "Better Together": {
    chicken: "Janitor Chicken",
    flower: "Venus Bumpkin Trap",
    fish: "Poseidon",
    cow: "Baby Cow",
    sheep: "Baby Sheep",
    banner: SUNNYSIDE.announcement.betterTogetherSeasonRares,
  },
  "Paw Prints": {
    chicken: "Sleepy Chicken",
    flower: "Black Hole Flower",
    fish: "Super Star",
    cow: "Astronaut Cow",
    sheep: "Astronaut Sheep",
    banner: SUNNYSIDE.announcement.pawPrintsSeasonRares,
  },
};

interface Props {
  chapter: ChapterName;
}
export const ChapterMutants: React.FC<Props> = ({ chapter }) => {
  const mutants = CHAPTER_MUTANTS[chapter];

  const { t } = useAppTranslation();

  if (!mutants) {
    return null;
  }
  return (
    <InnerPanel className="mb-1">
      <div className="p-1">
        <div className="flex justify-between mb-2">
          <Label className="-ml-1" type="default">
            {t("season.codex.mutants")}
          </Label>
        </div>
        <p className="text-xs">{t("season.codex.mutants.discover")}</p>
        <img className="my-1 w-full rounded-md" src={mutants.banner} />

        <NoticeboardItems
          iconWidth={8}
          items={[
            {
              text: t("season.codex.mutants.one", {
                item: mutants.chicken,
              }),
              icon: ITEM_DETAILS.Chicken.image,
            },
            {
              text: t("season.codex.mutants.two", {
                item: mutants.fish,
              }),

              icon: ITEM_DETAILS.Rod.image,
            },
            {
              text: t("season.codex.mutants.three", {
                item: mutants.flower,
              }),
              icon: ITEM_DETAILS["Red Pansy"].image,
            },
            {
              text: t("season.codex.mutants.four", {
                item: mutants.cow,
              }),
              icon: ITEM_DETAILS["Cow"].image,
            },
            {
              text: t("season.codex.mutants.five", {
                item: mutants.sheep,
              }),
              icon: ITEM_DETAILS["Sheep"].image,
            },
          ]}
        />
      </div>
    </InnerPanel>
  );
};
