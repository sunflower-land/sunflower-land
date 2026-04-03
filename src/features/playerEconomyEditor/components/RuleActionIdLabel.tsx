import React, { useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { sanitizeActionId, uniquifyActionId } from "../lib/actionIdHelpers";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

function PencilGlyph() {
  return (
    <svg
      width={PIXEL_SCALE * 6}
      height={PIXEL_SCALE * 6}
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0 opacity-85"
      fill="currentColor"
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

type Props = {
  actionId: string;
  /** Other rules’ ids (current rule’s id should be excluded). */
  peerIds: string[];
  onCommit: (next: string) => void;
};

export const RuleActionIdLabel: React.FC<Props> = ({
  actionId,
  peerIds,
  onCommit,
}) => {
  const { t } = useAppTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(actionId);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const finishEdit = () => {
    const cleaned = sanitizeActionId(draft);
    const peerSet = new Set(
      peerIds.map((s) => s.trim()).filter((s) => s.length > 0),
    );
    const next = cleaned ? uniquifyActionId(cleaned, peerSet) : actionId;
    if (next !== actionId) onCommit(next);
    setEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setDraft(actionId);
      setEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-1 min-w-0 flex-1 mr-2">
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={finishEdit}
          onKeyDown={onKeyDown}
          className="text-xs font-mono flex-1 min-w-0 px-1.5 py-0.5 rounded-sm bg-black/25 border border-[#286c4e]/60 text-white outline-none focus:border-[#3d9e72]"
          aria-label={t("playerEconomyEditor.actions.actionIdInputAria")}
        />
      ) : (
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <Label type="default" className="truncate font-mono text-xs">
            {actionId}
          </Label>
          <button
            type="button"
            aria-label={t("playerEconomyEditor.actions.editActionIdAria")}
            className="p-0.5 rounded-sm hover:bg-white/10 shrink-0 cursor-pointer leading-none"
            onClick={(e) => {
              e.stopPropagation();
              setDraft(actionId);
              setEditing(true);
            }}
          >
            <PencilGlyph />
          </button>
        </div>
      )}
    </div>
  );
};
