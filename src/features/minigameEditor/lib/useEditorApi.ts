import { useContext, useMemo } from "react";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { CONFIG } from "lib/config";
import { randomID } from "lib/utils/random";
import type { MinigameConfig } from "features/minigame/lib/types";
import type { MinigameConfigRow } from "./types";

/* ─── Mock data (used when API_URL is not configured) ─────────── */

const MOCK_ROWS: MinigameConfigRow[] = [
  {
    slug: "chicken-rescue",
    farmId: 0,
    createdAt: new Date("2026-03-18").toISOString(),
    updatedAt: new Date("2026-03-20").toISOString(),
    config: {
      descriptions: {
        name: "Chicken Rescue",
        description: "Save the chickens from the evil goblins!",
      },
      items: {
        rescue_badge: {
          description: "Awarded for rescuing chickens",
          tradeable: false,
        },
        goblin_feather: {
          description: "Dropped by defeated goblins",
          tradeable: true,
        },
      },
      actions: {
        defeat_goblin: {
          mint: [{ token: "goblin_feather", amount: 1 }],
        },
        craft_badge: {
          mint: [{ token: "rescue_badge", amount: 1 }],
          burn: [{ token: "goblin_feather", amount: 5 }],
        },
      },
    },
  },
  {
    slug: "sunflower-dash",
    farmId: 0,
    createdAt: new Date("2026-03-25").toISOString(),
    updatedAt: new Date("2026-03-28").toISOString(),
    config: {
      descriptions: {
        name: "Sunflower Dash",
        description: "Race through the sunflower fields and collect seeds!",
      },
      items: {
        speed_seed: {
          description: "A turbo-charged sunflower seed",
          tradeable: true,
        },
        golden_petal: {
          description: "Rare petal found in the fastest runs",
          tradeable: true,
        },
        dash_trophy: {
          description: "Proof of a record-breaking dash",
          tradeable: false,
        },
      },
      actions: {
        run_field: {
          mint: [{ token: "speed_seed", min: 1, max: 3 }],
        },
        find_petal: {
          mint: [{ token: "golden_petal", amount: 1, dailyCap: 5 }],
          require: [{ token: "speed_seed", amount: 3 }],
        },
        craft_trophy: {
          mint: [{ token: "dash_trophy", amount: 1 }],
          burn: [{ token: "golden_petal", amount: 10 }],
        },
      },
    },
  },
];

let mockStore = [...MOCK_ROWS];

/* ─── Hook ────────────────────────────────────────────────────── */

export function useEditorApi() {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);
  const farmId = gameState.context.farmId;
  const token = authState.context.user.rawToken as string;

  const isMock = !CONFIG.API_URL;

  const listUrl = useMemo(
    () => `${CONFIG.API_URL}/data?type=mingame-editor&farmId=${farmId}`,
    [farmId],
  );

  const loadRows = async (): Promise<MinigameConfigRow[]> => {
    if (isMock) {
      await new Promise((r) => setTimeout(r, 400));
      return [...mockStore];
    }

    const response = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const body = (await response.json().catch(() => ({}))) as {
      data?: MinigameConfigRow[];
    };
    if (!response.ok) throw new Error(`Load failed (${response.status})`);
    return Array.isArray(body.data) ? body.data : [];
  };

  const submitEvent = async (event: Record<string, unknown>) => {
    if (isMock) {
      await new Promise((r) => setTimeout(r, 300));
      const ev = event as {
        type: string;
        slug?: string;
        config?: MinigameConfig;
      };

      if (ev.type === "minigame.created" && ev.slug) {
        const now = new Date().toISOString();
        mockStore.push({
          slug: ev.slug,
          farmId: 0,
          createdAt: now,
          updatedAt: now,
          config: ev.config ?? {
            descriptions: { name: ev.slug, description: "" },
            items: {},
            actions: {},
          },
        });
      } else if (ev.type === "minigame.edited" && ev.slug) {
        const idx = mockStore.findIndex((r) => r.slug === ev.slug);
        if (idx >= 0 && ev.config) {
          mockStore[idx] = {
            ...mockStore[idx],
            config: ev.config,
            updatedAt: new Date().toISOString(),
          };
        }
      }
      // eslint-disable-next-line no-console
      console.log("[MinigameEditor mock]", ev.type, ev.slug, ev.config);
      return;
    }

    const response = await fetch(`${CONFIG.API_URL}/event/${farmId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "X-Transaction-ID": randomID(),
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      body: JSON.stringify({
        event,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        errorCode?: string;
      };
      throw new Error(
        body.errorCode ?? `Request failed (${response.status})`,
      );
    }
  };

  return { loadRows, submitEvent };
}
