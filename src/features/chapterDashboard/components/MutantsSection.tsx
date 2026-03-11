import React, { useMemo, useState } from "react";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { ChapterName } from "features/game/types/chapters";
import {
  CHAPTER_MUTANTS,
  MutantsChapterName,
} from "features/game/types/chapterMutants";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import {
  MAP_PIECE_CHAPTERS,
  MAP_PIECE_MARVELS,
} from "features/game/types/fishing";
import { ChapterMutants } from "features/island/hud/components/codex/components/ChapterMutants";

type Props = {
  chapter: ChapterName;
};

export const MutantsSection: React.FC<Props> = ({ chapter }) => {
  const { t } = useAppTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const mutants = CHAPTER_MUTANTS[chapter as MutantsChapterName];
  const preview = useMemo(() => {
    const chapterMutants = CHAPTER_MUTANTS[chapter as MutantsChapterName];
    if (!chapterMutants) return [];

    const marvels = MAP_PIECE_MARVELS.filter(
      (marvel) => MAP_PIECE_CHAPTERS[marvel] === chapter,
    );

    let items = [
      chapterMutants.Chicken,
      chapterMutants.Flower,
      ...(chapterMutants.Cow ? [chapterMutants.Cow] : []),
      ...(chapterMutants.Sheep ? [chapterMutants.Sheep] : []),
      ...marvels,
    ];

    // Remove duplicates
    items = items.filter((item, index, self) => self.indexOf(item) === index);

    return items.map((name) => ({
      name,
      image: ITEM_DETAILS[name as keyof typeof ITEM_DETAILS]?.image,
    }));
  }, [chapter]);

  if (!mutants) {
    return null;
  }

  return (
    <>
      <InnerPanel
        className=" cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="p-1 space-y-2">
          <div className="flex ">
            <div className="relative w-24 h-24">
              <img
                src={SUNNYSIDE.ui.grey_background}
                className="absolute inset-0 w-full h-full rounded-md"
              />

              <div className="flex flex-wrap items-center justify-center absolute inset-0 w-full pl-2">
                {preview.slice(0, 6).map((p) => (
                  <img
                    key={p.name}
                    src={p.image}
                    className="w-10 max-h-8 object-contain relative -ml-3"
                  />
                ))}
              </div>
            </div>

            <div className="ml-2 flex-1 h-full">
              <Label type="vibrant" className="mb-1">
                {t("season.codex.mutants")}
              </Label>

              <p className="text-xs mb-2">
                {t("chapterDashboard.mutantsFound", {
                  count: preview.length,
                })}
              </p>

              <p className="text-xxs underline cursor-pointer">
                {t("read.more")}
              </p>
            </div>
          </div>
        </div>
      </InnerPanel>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <CloseButtonPanel
          container={OuterPanel}
          onClose={() => setShowDetails(false)}
        >
          <ChapterMutants chapter={chapter} />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
