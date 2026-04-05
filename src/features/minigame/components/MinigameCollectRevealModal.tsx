import React from "react";
import { createPortal } from "react-dom";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components/Loading";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type {
  PlayerEconomyCollectGrant,
  PlayerEconomyConfig,
} from "../lib/types";
import { capTokenDisplayName } from "../lib/extractProductionSlots";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Phase = "loading" | "result" | "error";

type Props = {
  show: boolean;
  phase: Phase;
  grants: PlayerEconomyCollectGrant[] | null;
  errorMessage: string | null;
  config: PlayerEconomyConfig;
  tokenImages: Record<string, string>;
  onDismiss: () => void;
};

export const MinigameCollectRevealModal: React.FC<Props> = ({
  show,
  phase,
  grants,
  errorMessage,
  config,
  tokenImages,
  onDismiss,
}) => {
  const { t } = useAppTranslation();

  if (!show) return null;

  const canDismiss = phase !== "loading";

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[75] flex items-center justify-center p-3"
      style={{ background: "rgb(0 0 0 / 56%)" }}
      onClick={canDismiss ? onDismiss : undefined}
      role="presentation"
    >
      <div
        className="max-h-full max-w-full"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <CloseButtonPanel
          className="w-[min(92vw,380px)]"
          onClose={canDismiss ? onDismiss : undefined}
        >
          <div className="flex flex-col gap-3 p-1">
            {phase === "loading" && (
              <>
                <Label type="default">
                  {t("minigame.dashboard.production.collectResolving")}
                </Label>
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loading className="text-sm text-[#3e2731]" />
                </div>
              </>
            )}

            {phase === "error" && errorMessage && (
              <>
                <Label type="danger">{errorMessage}</Label>
                <Button onClick={onDismiss}>{t("close")}</Button>
              </>
            )}

            {phase === "result" && grants && (
              <>
                <Label type="default">
                  {t("minigame.dashboard.production.collectYouWon")}
                </Label>
                <ul className="flex flex-col gap-2">
                  {grants.map((g) => (
                    <li
                      key={g.token}
                      className="flex items-center gap-2 rounded-sm bg-black/5 p-2"
                    >
                      <img
                        src={getMinigameTokenImage(g.token, tokenImages)}
                        alt=""
                        style={{
                          width: PIXEL_SCALE * 6,
                          height: PIXEL_SCALE * 6,
                          imageRendering: "pixelated",
                        }}
                      />
                      <span className="text-sm font-medium text-[#181425]">
                        {g.amount > 0
                          ? t(
                              "minigame.dashboard.production.collectGrantLine",
                              {
                                amount: g.amount,
                                name: capTokenDisplayName(g.token, config),
                              },
                            )
                          : t(
                              "minigame.dashboard.production.collectReceivedNothing",
                              {
                                name: capTokenDisplayName(g.token, config),
                              },
                            )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button onClick={onDismiss}>
                  {t("minigame.dashboard.production.collectDone")}
                </Button>
              </>
            )}
          </div>
        </CloseButtonPanel>
      </div>
    </div>,
    document.body,
  );
};
