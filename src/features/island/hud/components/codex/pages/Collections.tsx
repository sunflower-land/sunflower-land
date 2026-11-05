import React, { useState } from "react";
import type { GameState } from "features/game/types/game";
import { Chip } from "components/ui/Chip";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChapterCollections } from "./ChapterCollections";
import { EventCollections } from "./EventCollections";

type CollectionType = "chapters" | "events";

type Props = {
  state: GameState;
  onClose: () => void;
};

export const Collections: React.FC<Props> = ({ state, onClose }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<CollectionType>("chapters");

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-1 mt-1 mb-1">
        <Chip
          selected={selected === "chapters"}
          onClick={() => setSelected("chapters")}
        >
          {t("season.codex.chapterCollections")}
        </Chip>
        <Chip
          selected={selected === "events"}
          onClick={() => setSelected("events")}
        >
          {t("season.codex.eventCollections")}
        </Chip>
      </div>
      <div className="flex-1 min-h-0">
        {selected === "chapters" ? (
          <ChapterCollections state={state} onClose={onClose} />
        ) : (
          <EventCollections state={state} onClose={onClose} />
        )}
      </div>
    </div>
  );
};
