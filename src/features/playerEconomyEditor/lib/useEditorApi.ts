import { useCallback, useContext, useMemo, useRef } from "react";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { randomID } from "lib/utils/random";
import type { PlayerEconomyConfigRow } from "./types";
import {
  ECONOMY_INVALIDATE_COOLDOWN_ERROR_CODE,
  ensurePlayerEconomyConfig,
  extractSavedEditorFromEventData,
  getPlayerEconomyEditorDataType,
  getPlayerEconomyEditorUploadDataType,
  parsePlayerEconomyEditorListBody,
  type PlayerEconomyEditorClientEvent,
  type PlayerEconomyEditorEventResult,
} from "./editorApi";

/* ─── Mock data (when VITE_API_URL is unset) ──────────────────── */

const MOCK_ROWS: PlayerEconomyConfigRow[] = [
  {
    slug: "demo-economy",
    farmId: 1,
    createdAt: new Date("2026-03-18").toISOString(),
    updatedAt: new Date("2026-03-20").toISOString(),
    config: {
      descriptions: {
        title: "Demo economy",
        subtitle: "Try the editor",
        welcome: "Welcome!",
        rules: "Have fun.",
      },
      playUrl: "https://example.com",
      items: {
        "0": {
          name: "Coin",
          description: "A demo currency",
          id: 0,
          tradeable: true,
        },
      },
      actions: {
        "1": {
          mint: { "0": { amount: 1 } },
        },
      },
    },
  },
];

let mockStore = [...MOCK_ROWS];

export type EconomySitePresignedUpload = {
  path: string;
  key: string;
  presignedPutUrl: string;
  publicUrl: string;
  /** Use this header on PUT (matches the presigned Content-Type). */
  contentType: string;
};

function eventHeaders(token: string): Record<string, string> {
  const h: Record<string, string> = {
    "content-type": "application/json;charset=UTF-8",
    "X-Transaction-ID": randomID(),
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
  const ttl = (window as { "x-amz-ttl"?: string })["x-amz-ttl"];
  if (ttl) h["X-Amz-TTL"] = String(ttl);
  return h;
}

/* ─── Hook ────────────────────────────────────────────────────── */

export function useEditorApi() {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);
  const farmId = gameState.context.farmId;
  const token = authState.context.user.rawToken as string | undefined;

  const isMock = !CONFIG.API_URL;

  const listUrl = useMemo(() => {
    const base = CONFIG.API_URL;
    if (!base) return "";
    const type = getPlayerEconomyEditorDataType();
    return `${base}/data?type=${encodeURIComponent(type)}&farmId=${farmId}`;
  }, [farmId]);

  /** Coalesce concurrent list fetches (same URL + token) — Strict Mode / rapid remounts. */
  const listInflightRef = useRef<{
    key: string;
    promise: Promise<PlayerEconomyConfigRow[]>;
  } | null>(null);

  const loadRows = useCallback(async (): Promise<PlayerEconomyConfigRow[]> => {
    if (isMock) {
      await new Promise((r) => setTimeout(r, 400));
      return [...mockStore];
    }

    if (!token) {
      throw new Error(ERRORS.SESSION_EXPIRED);
    }

    const dedupeKey = `${listUrl}\0${token}`;
    const existing = listInflightRef.current;
    if (existing?.key === dedupeKey) {
      return existing.promise;
    }

    const promise = (async (): Promise<PlayerEconomyConfigRow[]> => {
      const response = await fetch(listUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error(ERRORS.SESSION_EXPIRED);
      }

      const body: unknown = await response.json().catch(() => ({}));
      if (!response.ok) {
        const err = body as { errorCode?: string; error?: string };
        throw new Error(
          err.errorCode ??
            (typeof err.error === "string" ? err.error : undefined) ??
            `Load failed (${response.status})`,
        );
      }

      return parsePlayerEconomyEditorListBody(body);
    })();

    listInflightRef.current = { key: dedupeKey, promise };
    try {
      return await promise;
    } finally {
      if (listInflightRef.current?.promise === promise) {
        listInflightRef.current = null;
      }
    }
  }, [isMock, listUrl, token]);

  const submitEvent = async (
    event: PlayerEconomyEditorClientEvent,
  ): Promise<PlayerEconomyEditorEventResult> => {
    if (isMock) {
      await new Promise((r) => setTimeout(r, 300));
      const ev = event;

      if (ev.type === "playerEconomy.created" && ev.slug) {
        const now = new Date().toISOString();
        const config =
          ev.config ??
          ensurePlayerEconomyConfig({
            actions: {},
            descriptions: {
              title: ev.slug,
              subtitle: "",
              welcome: "",
              rules: "",
            },
          });
        mockStore.push({
          slug: ev.slug.trim(),
          farmId: 0,
          createdAt: now,
          updatedAt: now,
          config,
        });
        return {
          savedConfig: config,
          savedRow: mockStore[mockStore.length - 1],
        };
      }

      if (ev.type === "playerEconomy.edited" && ev.slug) {
        const idx = mockStore.findIndex((r) => r.slug === ev.slug);
        if (idx >= 0) {
          mockStore[idx] = {
            ...mockStore[idx],
            config: ev.config,
            updatedAt: new Date().toISOString(),
          };
          return { savedConfig: ev.config, savedRow: mockStore[idx] };
        }
      }

      if (ev.type === "playerEconomy.removed" && ev.slug) {
        mockStore = mockStore.filter((r) => r.slug !== ev.slug);
        return {};
      }

      if (ev.type === "economy.reset" && ev.slug) {
        // Mock branch: server-side runtime state isn't tracked here, so a
        // successful no-op response is enough for local development.
        return {};
      }

      if (ev.type === "economy.invalidated" && ev.slug) {
        const idx = mockStore.findIndex((r) => r.slug === ev.slug.trim());
        if (idx < 0) {
          return {};
        }
        const row = mockStore[idx];
        if (row.invalidatedAt) {
          const prev = new Date(row.invalidatedAt).getTime();
          if (!Number.isNaN(prev) && Date.now() - prev < 60_000) {
            throw new Error(ECONOMY_INVALIDATE_COOLDOWN_ERROR_CODE);
          }
        }
        const now = new Date().toISOString();
        mockStore[idx] = { ...row, invalidatedAt: now, updatedAt: now };
        return {
          savedRow: mockStore[idx],
          savedConfig: mockStore[idx].config,
        };
      }

      return {};
    }

    if (!token) {
      throw new Error(ERRORS.SESSION_EXPIRED);
    }

    const response = await fetch(`${CONFIG.API_URL}/event/${farmId}`, {
      method: "POST",
      headers: eventHeaders(token),
      body: JSON.stringify({
        event,
        createdAt: new Date().toISOString(),
      }),
    });

    if (response.status === 429) {
      throw new Error(ERRORS.EFFECT_TOO_MANY_REQUESTS);
    }

    if (response.status === 401) {
      throw new Error(ERRORS.SESSION_EXPIRED);
    }

    const body = (await response.json().catch(() => ({}))) as {
      gameState?: unknown;
      data?: unknown;
      errorCode?: string;
    };

    if (response.status === 400) {
      throw new Error(body.errorCode ?? ERRORS.EFFECT_BAD_REQUEST);
    }

    if (!response.ok) {
      throw new Error(body.errorCode ?? ERRORS.EFFECT_SERVER_ERROR);
    }

    const extracted = extractSavedEditorFromEventData(body.data);
    return {
      gameState: body.gameState,
      data: body.data,
      ...extracted,
    };
  };

  type PresignParams = {
    slug: string;
    itemId: number;
    contentType: string;
    extension?: string;
  };

  type PresignResult = { presignedPutUrl: string; publicUrl?: string };

  const requestItemImageUploadUrl = async (
    params: PresignParams,
  ): Promise<PresignResult> => {
    if (isMock) {
      throw new Error(
        "Image upload needs VITE_API_URL and an economyEditorUpload data handler, or paste a pre-signed PUT URL on the item.",
      );
    }

    if (!token) {
      throw new Error(ERRORS.SESSION_EXPIRED);
    }

    const type = getPlayerEconomyEditorUploadDataType();
    const url = new URL(`${CONFIG.API_URL}/data`);
    url.searchParams.set("type", type);
    url.searchParams.set("farmId", String(farmId));
    url.searchParams.set("slug", params.slug.trim());
    url.searchParams.set("itemId", String(params.itemId));
    url.searchParams.set(
      "contentType",
      params.contentType.trim() || "image/png",
    );
    if (params.extension?.trim()) {
      url.searchParams.set("extension", params.extension.trim());
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error(ERRORS.SESSION_EXPIRED);
    }

    const raw: unknown = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = raw as { error?: string; errorCode?: string };
      throw new Error(
        err.errorCode ??
          (typeof err.error === "string" ? err.error : undefined) ??
          `Upload URL request failed (${response.status})`,
      );
    }

    const root = raw as Record<string, unknown>;
    const o =
      root.data !== undefined &&
      typeof root.data === "object" &&
      root.data !== null
        ? (root.data as Record<string, unknown>)
        : root;
    const presignedPutUrl =
      (typeof o.presignedPutUrl === "string" && o.presignedPutUrl) ||
      (typeof o.putUrl === "string" && o.putUrl) ||
      (typeof o.url === "string" && o.url) ||
      "";

    if (!presignedPutUrl) {
      throw new Error(
        "Upload URL response missing presignedPutUrl (or url / putUrl).",
      );
    }

    const publicUrl =
      (typeof o.image === "string" && o.image) ||
      (typeof o.publicUrl === "string" && o.publicUrl) ||
      (typeof o.imageUrl === "string" && o.imageUrl) ||
      undefined;

    return { presignedPutUrl, publicUrl };
  };

  const prepareEconomySiteUploads = useCallback(
    async (
      slug: string,
      files: { path: string; contentType: string; file: File }[],
    ): Promise<EconomySitePresignedUpload[]> => {
      if (isMock) {
        throw new Error(
          "Site file upload requires VITE_API_URL and the economy.prepare-upload event on the API.",
        );
      }

      if (!token) {
        throw new Error(ERRORS.SESSION_EXPIRED);
      }

      if (!files.length) {
        return [];
      }

      const response = await fetch(`${CONFIG.API_URL}/event/${farmId}`, {
        method: "POST",
        headers: eventHeaders(token),
        body: JSON.stringify({
          event: {
            type: "economy.prepare-upload",
            slug: slug.trim(),
            files: files.map(({ path, contentType }) => ({
              path,
              contentType,
            })),
          },
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.status === 429) {
        throw new Error(ERRORS.EFFECT_TOO_MANY_REQUESTS);
      }

      if (response.status === 401) {
        throw new Error(ERRORS.SESSION_EXPIRED);
      }

      const body = (await response.json().catch(() => ({}))) as {
        data?: { uploads?: unknown };
        errorCode?: string;
        error?: string;
      };

      if (response.status === 400) {
        throw new Error(
          typeof body.error === "string" && body.error
            ? body.error
            : (body.errorCode ?? ERRORS.EFFECT_BAD_REQUEST),
        );
      }

      if (!response.ok) {
        throw new Error(body.errorCode ?? ERRORS.EFFECT_SERVER_ERROR);
      }

      const rawUploads = body.data?.uploads;
      if (!Array.isArray(rawUploads)) {
        throw new Error("Prepare-upload response missing uploads array.");
      }

      return rawUploads.map((u, i) => {
        const o = u as Record<string, unknown>;
        const path =
          typeof o.path === "string" ? o.path : (files[i]?.path ?? "");
        const key = typeof o.key === "string" ? o.key : path;
        const presignedPutUrl =
          typeof o.presignedPutUrl === "string" ? o.presignedPutUrl : "";
        const publicUrl = typeof o.publicUrl === "string" ? o.publicUrl : "";
        if (!presignedPutUrl) {
          throw new Error(`Missing presigned URL for "${path}"`);
        }
        const contentType =
          typeof o.contentType === "string" && o.contentType
            ? o.contentType
            : "application/octet-stream";
        return { path, key, presignedPutUrl, publicUrl, contentType };
      });
    },
    [isMock, token, farmId],
  );

  return {
    loadRows,
    submitEvent,
    requestItemImageUploadUrl,
    prepareEconomySiteUploads,
  };
}

export type { PlayerEconomyEditorClientEvent, PlayerEconomyEditorEventResult };
