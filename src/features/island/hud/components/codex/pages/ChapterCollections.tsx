import React from "react";
import type { GameState } from "features/game/types/game";
import {
  type ChapterBanner,
  type ChapterName,
  CHAPTERS,
  hasChapterStarted,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { getKeys } from "lib/object";
import { CHAPTER_BANNER_IMAGES } from "features/game/types/chapters";
import {
  CHAPTER_COLLECTIONS,
  getChapterCollectionForDisplay,
} from "features/game/types/collections";
import { CollectionPanel } from "../components/CollectionPanel";

type Props = {
  state: GameState;
  onClose: () => void;
  selected?: ChapterName;
};

export const ChapterCollections: React.FC<Props> = ({
  state,
  selected,
  onClose,
}) => {
  const now = useNow({ live: true });

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollable">
      <div className="space-y-2 mt-1 px-1">
        {getKeys(CHAPTER_COLLECTIONS)
          .filter((chapter) => hasChapterStarted(chapter, now))
          .filter((chapter) => !selected || chapter === selected)
          .sort((chapterA, chapterB) => {
            const chapterBStartDate = CHAPTERS[chapterB].startDate;
            const chapterAStartDate = CHAPTERS[chapterA].startDate;
            return chapterBStartDate.getTime() - chapterAStartDate.getTime();
          })
          .map((chapter) => {
            const { collectibles, wearables } =
              getChapterCollectionForDisplay(chapter);
            const banner: ChapterBanner = `${chapter} Banner`;

            return (
              <CollectionPanel
                key={chapter}
                title={chapter}
                icon={CHAPTER_BANNER_IMAGES[banner]}
                collection={{ chapter }}
                collectibles={collectibles}
                wearables={wearables}
                state={state}
                onClose={onClose}
              />
            );
          })}
      </div>
    </div>
  );
};
