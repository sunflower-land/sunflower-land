import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import {
  MutantChicken,
  MutantCow,
  MutantSheep,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { ChapterName } from "features/game/types/chapters";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { ChapterFish } from "features/game/types/fishing";
import { MutantFlowerName } from "features/game/types/flowers";
import { SUNNYSIDE } from "assets/sunnyside";

type ChapterMutants = {
  banner: string;
  Chicken: MutantChicken;
  Flower: MutantFlowerName;
  Fish: ChapterFish;
  Cow: MutantCow | undefined;
  Sheep: MutantSheep | undefined;
};

export type MutantsChapterName = Exclude<
  ChapterName,
  | "Solar Flare"
  | "Dawn Breaker"
  | "Witches' Eve"
  | "Catch the Kraken"
  | "Spring Blossom"
  | "Clash of Factions"
>;

export const CHAPTER_MUTANTS: Record<MutantsChapterName, ChapterMutants> = {
  "Pharaoh's Treasure": {
    Chicken: "Pharaoh Chicken",
    Flower: "Desert Rose",
    Fish: "Lemon Shark",
    // Animals haven't been added yet
    Cow: undefined,
    Sheep: undefined,
    banner: SUNNYSIDE.announcement.pharaohSeasonRares,
  },
  "Bull Run": {
    Chicken: "Alien Chicken",
    Flower: "Chicory",
    Fish: "Longhorn Cowfish",
    Cow: "Mootant",
    Sheep: "Toxic Tuft",
    banner: SUNNYSIDE.announcement.bullRunSeasonRares,
  },
  "Winds of Change": {
    Chicken: "Summer Chicken",
    Flower: "Chamomile",
    Fish: "Jellyfish",
    Cow: "Frozen Cow",
    Sheep: "Frozen Sheep",
    banner: SUNNYSIDE.announcement.windsOfChangeSeasonRares,
  },
  "Better Together": {
    Chicken: "Janitor Chicken",
    Flower: "Venus Bumpkin Trap",
    Fish: "Poseidon",
    Cow: "Baby Cow",
    Sheep: "Baby Sheep",
    banner: SUNNYSIDE.announcement.betterTogetherSeasonRares,
  },
  "Paw Prints": {
    Chicken: "Sleepy Chicken",
    Flower: "Black Hole Flower",
    Fish: "Super Star",
    Cow: "Astronaut Cow",
    Sheep: "Astronaut Sheep",
    banner: SUNNYSIDE.announcement.pawPrintsSeasonRares,
  },
  "Crabs and Traps": {
    Chicken: "Squid Chicken",
    Flower: "Anemone Flower",
    Fish: "Giant Isopod",
    Cow: "Mermaid Cow",
    Sheep: "Mermaid Sheep",
    banner: "?",
  },
  "Great Bloom": {
    Chicken: "Love Chicken",
    Cow: "Dr Cow",
    Sheep: "Nurse Sheep",
    Flower: "Lunalist",
    Fish: "Pink Dolphin",
    banner: "?",
  },
};

interface Props {
  chapter: ChapterName;
}
export const ChapterMutants: React.FC<Props> = ({ chapter }) => {
  const mutants = CHAPTER_MUTANTS[chapter as MutantsChapterName];

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
                item: mutants.Chicken,
              }),
              icon: ITEM_DETAILS.Chicken.image,
            },
            {
              text: t("season.codex.mutants.two", {
                item: mutants.Fish,
              }),

              icon: ITEM_DETAILS.Rod.image,
            },
            {
              text: t("season.codex.mutants.three", {
                item: mutants.Flower,
              }),
              icon: ITEM_DETAILS["Red Pansy"].image,
            },
            ...(mutants.Cow
              ? [
                  {
                    text: t("season.codex.mutants.four", {
                      item: mutants.Cow,
                    }),
                    icon: ITEM_DETAILS["Cow"].image,
                  },
                ]
              : []),
            ...(mutants.Sheep
              ? [
                  {
                    text: t("season.codex.mutants.five", {
                      item: mutants.Sheep,
                    }),
                    icon: ITEM_DETAILS["Sheep"].image,
                  },
                ]
              : []),
            ...(mutants.Flower
              ? [
                  {
                    text: t("season.codex.mutants.five", {
                      item: mutants.Flower,
                    }),
                    icon: ITEM_DETAILS[mutants.Flower].image,
                  },
                ]
              : []),
          ]}
        />
      </div>
    </InnerPanel>
  );
};
