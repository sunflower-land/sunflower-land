import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { ChapterName } from "features/game/types/chapters";
import {
  CHAPTER_MUTANTS,
  MutantsChapterName,
} from "features/game/types/chapterMutants";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

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
                item: mutants.Fish.join(", "),
              }),

              icon: ITEM_DETAILS.Rod.image,
            },
            ...(mutants.Flower
              ? [
                  {
                    text: t("season.codex.mutants.three", {
                      item: mutants.Flower,
                    }),
                    icon: ITEM_DETAILS[mutants.Flower].image,
                  },
                ]
              : []),
            ...(mutants.Cow
              ? [
                  {
                    text: t("season.codex.mutants.four", {
                      item: mutants.Cow,
                    }),
                    icon: ITEM_DETAILS[mutants.Cow].image,
                  },
                ]
              : []),
            ...(mutants.Sheep
              ? [
                  {
                    text: t("season.codex.mutants.five", {
                      item: mutants.Sheep,
                    }),
                    icon: ITEM_DETAILS[mutants.Sheep].image,
                  },
                ]
              : []),
          ]}
        />
      </div>
    </InnerPanel>
  );
};
