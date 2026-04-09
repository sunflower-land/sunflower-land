import React from "react";
import { createPortal } from "react-dom";

import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SquareIcon } from "components/ui/SquareIcon";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { PlayerEconomyConfig } from "../lib/types";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";

type Props = {
  token: string;
  config: PlayerEconomyConfig;
  tokenImages: Record<string, string>;
  onClose: () => void;
};

export const MinigameTrophyDetailModal: React.FC<Props> = ({
  token,
  config,
  tokenImages,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const meta = config.items?.[token];
  const title = meta?.name?.trim() || token;
  const description = meta?.description?.trim() ?? "";
  const imageUrl = getMinigameTokenImage(token, tokenImages);

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[70] flex items-center justify-center p-2"
      style={{ background: "rgb(0 0 0 / 56%)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-full max-w-full"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <CloseButtonPanel
          className="w-[min(88vw,320px)]"
          title={title}
          onClose={onClose}
        >
          <div className="p-1">
            <div className="flex gap-2 items-start mb-3">
              <SquareIcon icon={imageUrl} width={10} className="shrink-0" />
              <p className="text-xs leading-relaxed whitespace-pre-line text-[#3e2731] flex-1 min-w-0">
                {description.length > 0
                  ? description
                  : t("minigame.dashboard.trophyDetailEmpty")}
              </p>
            </div>
          </div>
          <Button onClick={onClose}>{t("ok")}</Button>
        </CloseButtonPanel>
      </div>
    </div>,
    document.body,
  );
};
