import { createPortal } from "react-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { MinigameName, V2_MINIGAMES } from "features/game/types/minigames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";

import { portal } from "../community/actions/portal";
import { Loading } from "features/auth/components";
import { InventoryItemName } from "features/game/types/game";
import { Box } from "components/ui/Box";
import { getKeys } from "lib/object";
import { ITEM_DETAILS } from "features/game/types/images";

import sflIcon from "assets/icons/flower_token.webp";
import { IPortalDonation, PortalDonation } from "./PortalDonation";
import { getCachedFont } from "lib/utils/fonts";

type PortalPurchase = {
  sfl: number;
  items?: Partial<Record<InventoryItemName, number>>;
};

/**
 * For legacy minigames where the slug is different to the hosted subdomain.
 * V2 minigames live at `{portalName}.minigames.sunflower-land.com` and are
 * handled via the V2_MINIGAMES list instead.
 */
const DOMAIN_MAP: Partial<Record<MinigameName, string>> = {
  "festival-of-colors-2025": "festival-of-colors",
  "april-fools": "halloween",
};

/**
 * Iframe base URL resolution:
 * 1. `iframeBaseUrl` when set (e.g. player economy dashboard → `*.economies.sunflower-land.com`).
 * 2. `VITE_PORTAL_GAME_URL` when set (local / override).
 * 3. `apiPlayUrl` from the minigame session API when provided.
 * 4. V2 minigames → `https://{portalName}.minigames.sunflower-land.com`.
 * 5. `DOMAIN_MAP` / default `https://{portalName}.sunflower-land.com`.
 */
function resolveMinigameIframeBaseUrl(
  portalName: MinigameName,
  apiPlayUrl?: string,
  iframeBaseUrl?: string,
): string {
  const locked = iframeBaseUrl?.trim();
  if (locked) {
    return locked.replace(/\/$/, "");
  }

  const fromEnv = CONFIG.PORTAL_GAME_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const fromApi = apiPlayUrl?.trim();
  if (fromApi) {
    return fromApi.replace(/\/$/, "");
  }

  if (V2_MINIGAMES.includes(portalName)) {
    return `https://${portalName}.minigames.sunflower-land.com`;
  }

  const slug = DOMAIN_MAP[portalName] ?? portalName;
  return `https://${slug}.sunflower-land.com`;
}

interface Props {
  portalName: MinigameName;
  onClose: () => void;
  /** Canonical play URL from `GET /portal/:id/minigame` when API provides `playUrl`. */
  playUrl?: string;
  /**
   * When set, used as the iframe origin and wins over `VITE_PORTAL_GAME_URL` and `playUrl`.
   * Player economy dashboard uses `https://{slug}.economies.sunflower-land.com`.
   */
  iframeBaseUrl?: string;
}

export const Portal: React.FC<Props> = ({
  portalName,
  onClose,
  playUrl,
  iframeBaseUrl,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [url, setUrl] = useState<string>();

  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [purchase, setPurchase] = useState<PortalPurchase | undefined>(
    undefined,
  );
  const [donation, setDonation] = useState<IPortalDonation | undefined>();

  const { t } = useAppTranslation();

  /**
   * Parent auth/farm context updates often (token refresh, SAVE, etc.). Those must not
   * re-run iframe URL construction or the `src` change reloads the embedded minigame.
   * The minigame persists JWT in sessionStorage after first load (`chicken-rescue-v2` url.ts).
   */
  const rawTokenRef = useRef(authState.context.user.rawToken);
  const farmIdRef = useRef(gameState.context.farmId);

  const rawToken = authState.context.user.rawToken;
  const farmId = gameState.context.farmId;

  useEffect(() => {
    rawTokenRef.current = rawToken;
    farmIdRef.current = farmId;
  }, [rawToken, farmId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      let token = "";
      if (CONFIG.API_URL) {
        const { token: portalToken } = await portal({
          portalId: portalName,
          token: rawTokenRef.current as string,
          farmId: farmIdRef.current,
        });
        token = portalToken;
      }

      const baseUrl = resolveMinigameIframeBaseUrl(
        portalName,
        playUrl,
        iframeBaseUrl,
      );

      const language = localStorage.getItem("language") || "en";
      const font = getCachedFont();

      const params = new URLSearchParams();
      params.set("jwt", token);
      params.set("network", CONFIG.NETWORK);
      params.set("language", language);
      params.set("font", font);
      if (CONFIG.API_URL) {
        params.set("apiUrl", CONFIG.API_URL);
      }

      const nextUrl = `${baseUrl}?${params.toString()}`;

      setUrl(nextUrl);

      setLoading(false);
    };

    load();
  }, [portalName, playUrl, iframeBaseUrl]);

  // Function to handle messages from the iframe
  const handleMessage = (event: any) => {
    if (event.data?.event === "closePortal") {
      // Close the modal when the message is received
      setLoading(false);
      setUrl("");
      onClose();
    }

    if (event.data?.event === "claimPrize") {
      // Close the modal when the message is received
      setLoading(false);
      setIsComplete(true);
      return;
    }

    if (event.data.event === "purchase") {
      // Purchase the item
      setPurchase(event.data);
      return;
    }

    if (event.data.event === "donated") {
      setDonation(event.data);
      return;
    }

    if (event.data.event === "attemptStarted") {
      // Start the minigame attempt
      gameService.send("minigame.attemptStarted", {
        id: portalName,
      });
      gameService.send("SAVE");
      return;
    }

    if (event.data.event === "scoreSubmitted") {
      // Submit the minigame score
      gameService.send("minigame.scoreSubmitted", {
        score: event.data.score,
        id: portalName,
      });
      gameService.send("SAVE");
      return;
    }
  };

  useEffect(() => {
    // Add event listener to listen for messages from any origin
    window.addEventListener("message", handleMessage);

    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const confirmPurchase = () => {
    gameService.send("minigame.itemPurchased", {
      id: portalName,
      sfl: purchase?.sfl,
      items: purchase?.items,
    });
    gameService.send("SAVE");

    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          event: "purchased",
          sfl: purchase?.sfl,
          items: purchase?.items,
        },
        "*",
      );
    }

    setPurchase(undefined);
  };

  const onClaim = () => {
    gameService.send("minigame.prizeClaimed", {
      id: portalName,
    });

    onClose();
  };

  if (loading) {
    return <Loading />;
  }

  if (isComplete) {
    const prize = gameState.context.state.minigames.prizes[portalName];

    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: "Congratulations, you completed the mission!",
          factionPoints: 0,
          id: "discord-bonus",
          items: prize?.items ?? {},
          wearables: prize?.wearables ?? {},
          sfl: 0,
          coins: prize?.coins ?? 0,
        }}
      />
    );
  }

  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="fixed inset-0 z-50"
        >
          <iframe
            src={url}
            className="w-full h-full absolute z-10"
            ref={iframeRef} // Set ref to the iframe
          />
        </div>,
        document.body,
      )}
      {purchase &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area z-[60] flex items-center justify-center"
            style={{
              background: "rgb(0 0 0 / 56%)",
            }}
          >
            <CloseButtonPanel
              className="w-[500px]"
              onClose={() => setPurchase(undefined)}
            >
              <div className="p-1">
                <Label type="default" className="mb-2">
                  {t("minigame.purchase")}
                </Label>
                <p className="text-sm">{`${t("minigame.confirm")}`}</p>
                {!!purchase.sfl && (
                  <div className="flex mb-1 items-center">
                    <Box image={sflIcon} />
                    <span className="ml-1">{`${purchase.sfl} x FLOWER`}</span>
                  </div>
                )}
                {getKeys(purchase.items ?? {}).map((key) => {
                  const item = purchase.items?.[key] ?? 0;
                  return (
                    <div className="flex mb-1 items-center" key={key}>
                      <Box image={ITEM_DETAILS[key].image} />
                      <span className="ml-1">{`${item} x ${key}`}</span>
                    </div>
                  );
                })}
              </div>
              <Button onClick={confirmPurchase}> {t("confirm")}</Button>
            </CloseButtonPanel>
          </div>,
          document.body,
        )}

      {!!donation &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area z-[60] flex items-center justify-center"
            style={{
              background: "rgb(0 0 0 / 56%)",
            }}
          >
            <CloseButtonPanel
              className="w-[500px]"
              onClose={() => setDonation(undefined)}
            >
              <PortalDonation
                donation={donation}
                portalName={portalName}
                onClose={() => setDonation(undefined)}
              />
            </CloseButtonPanel>
          </div>,
          document.body,
        )}
    </>
  );
};
