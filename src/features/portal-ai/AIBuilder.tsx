import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import * as Phaser from "phaser";

const _farmId = (state: MachineState) => state.context.farmId;
const _playing = (state: MachineState) => state.matches("playing");

interface WebSocketMessage {
  action: string;
  data?: any;
}

interface SceneGeneratedMessage extends WebSocketMessage {
  action: "sceneGenerated";
  data: {
    sessionId: string;
    phaserScene: string;
    sunflowerAssets: string;
    sunflowerSDK: string;
    previewUrl?: string;
  };
}

interface ErrorMessage extends WebSocketMessage {
  action: "error";
  data: {
    error: string;
    sessionId?: string;
  };
}

interface GenerationProgressMessage extends WebSocketMessage {
  action: "generationProgress";
  data: {
    sessionId: string;
    tokensGenerated: number;
    status: "streaming" | "compiling";
  };
}

interface VersionsListMessage extends WebSocketMessage {
  action: "versionsList";
  data: {
    farmId: string;
    versions: { versionId: string; lastModified: string; prompt?: string }[];
    sessionId: string;
  };
}

interface AssetEntry {
  category: string;
  name: string;
  path: string;
  /** Copy-pasteable reference, e.g. SUNNYSIDE.icons.close */
  ref: string;
}

/** Simple fuzzy match: checks if all characters of the query appear in order. */
function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

/**
 * Flatten the global SUNNYSIDE object (set by the asset template) into a
 * searchable list of entries.
 */
function flattenSunnysideAssets(): AssetEntry[] {
  const sunnyside = (window as any).SUNNYSIDE;
  if (!sunnyside) return [];

  const entries: AssetEntry[] = [];
  for (const category of Object.keys(sunnyside)) {
    const group = sunnyside[category];
    if (typeof group !== "object" || group === null) continue;
    for (const name of Object.keys(group)) {
      const path = group[name];
      if (typeof path !== "string") continue;
      entries.push({
        category,
        name,
        path,
        ref: `SUNNYSIDE.${category}.${name}`,
      });
    }
  }
  return entries;
}

const WS_URL = import.meta.env.VITE_AI_PORTAL_WS_URL || "ws://localhost:3001";
const API_URL = WS_URL.replace(/^ws(s?):/, "http$1:");

const EXAMPLE_PROMPTS = [
  {
    label: "Maze Collector",
    prompt: "Create a simple maze game where the farmer collects sunflowers",
  },
  {
    label: "Fishing Game",
    prompt:
      "Make a fishing game where players catch fish by clicking at the right time",
  },
  {
    label: "Farm Defense",
    prompt: "Create a tower defense game using farm animals to protect crops",
  },
  {
    label: "Crop Memory",
    prompt: "Build a memory matching game with different crop types",
  },
  {
    label: "Farm Platformer",
    prompt: "Design a platformer where the farmer jumps across farm buildings",
  },
];

export const AIBuilder: React.FC = () => {
  const { gameService, fromRoute } = useContext(GameContext);
  const farmId = useSelector(gameService, _farmId);
  const isPlaying = useSelector(gameService, _playing);
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<{
    message: string;
    type: "connecting" | "generating" | "success" | "error" | "hidden";
  }>({ message: "", type: "hidden" });
  const [hasSavedFarm, setHasSavedFarm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [versions, setVersions] = useState<
    { versionId: string; lastModified: string; prompt?: string }[]
  >([]);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"builder" | "assets" | "sdk">(
    "builder",
  );
  const [assetSearch, setAssetSearch] = useState("");
  const [assetCategory, setAssetCategory] = useState<string>("all");
  const [assetEntries, setAssetEntries] = useState<AssetEntry[]>([]);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mobileDrawerTab, setMobileDrawerTab] = useState<
    "tools" | "assets" | "sdk"
  >("tools");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [showHitboxes, setShowHitboxes] = useState(false);
  const showHitboxesRef = useRef(false);

  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef("");
  const currentVersionIdRef = useRef<string | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const currentGameRef = useRef<any>(null);
  const hasLoadedFarmRef = useRef(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reconnectAttemptsRef = useRef(0);
  const lastSceneRef = useRef<{
    phaserScene: string;
    sunflowerAssets: string;
    sunflowerSDK: string;
  } | null>(null);
  const maxReconnectAttempts = 10;
  const isUnmountingRef = useRef(false);

  const handleClose = useCallback(() => {
    fromRoute ? navigate(fromRoute) : navigate("/");
  }, [fromRoute, navigate]);

  const showStatus = useCallback(
    (
      message: string,
      type: "connecting" | "generating" | "success" | "error",
    ) => {
      setStatus({ message, type });
    },
    [],
  );

  const hideStatus = useCallback(() => {
    setStatus({ message: "", type: "hidden" });
  }, []);

  const cleanupGame = useCallback(() => {
    if (currentGameRef.current) {
      try {
        currentGameRef.current.destroy(true);
      } catch {
        // ignore cleanup errors
      }
      currentGameRef.current = null;
    }
    if (gameContainerRef.current) {
      gameContainerRef.current.innerHTML = "";
    }
  }, []);

  const isTemplateCode = useCallback((code: string): boolean => {
    return (
      code.includes("SampleFarmScene") &&
      code.includes("// Phaser scene class definition")
    );
  }, []);

  const toggleHitboxes = useCallback((enabled: boolean) => {
    const game = currentGameRef.current;
    if (!game) return;
    game.scene.scenes.forEach((scene: any) => {
      if (scene.physics?.world) {
        scene.physics.world.drawDebug = enabled;
        if (enabled) {
          scene.physics.world.createDebugGraphic();
        } else {
          scene.physics.world.debugGraphic?.clear();
          scene.physics.world.debugGraphic?.destroy();
          scene.physics.world.debugGraphic = null;
        }
      }
    });
  }, []);

  const enableGameKeyboard = useCallback(() => {
    const game = currentGameRef.current;
    if (game?.input?.keyboard) {
      game.input.keyboard.enabled = true;
    }
  }, []);

  const disableGameKeyboard = useCallback(() => {
    const game = currentGameRef.current;
    if (game?.input?.keyboard) {
      const keyboard = game.input.keyboard;
      keyboard.enabled = false;

      // Release all currently pressed keys
      [87, 65, 83, 68, 69].forEach((keyCode) => {
        if (keyboard.keys?.[keyCode]) {
          keyboard.keys[keyCode].isDown = false;
          keyboard.keys[keyCode].isUp = true;
        }
      });
      if (keyboard.cursors) {
        ["up", "down", "left", "right"].forEach((dir) => {
          if (keyboard.cursors[dir]) {
            keyboard.cursors[dir].isDown = false;
            keyboard.cursors[dir].isUp = true;
          }
        });
      }
    }
  }, []);

  const setupCanvasFocusHandling = useCallback(() => {
    const container = gameContainerRef.current;
    const canvas = container?.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    canvas.tabIndex = 0;
    canvas.style.outline = "none";

    canvas.addEventListener("click", () => {
      canvas.focus();
      enableGameKeyboard();
    });
    canvas.addEventListener("mouseenter", () => {
      canvas.focus();
      enableGameKeyboard();
    });
    canvas.addEventListener("mouseleave", () => {
      canvas.blur();
      disableGameKeyboard();
    });
    canvas.addEventListener("blur", () => {
      disableGameKeyboard();
    });

    // Start with game keyboard disabled so form typing works
    disableGameKeyboard();
  }, [enableGameKeyboard, disableGameKeyboard]);

  const loadSceneDirectly = useCallback(
    (phaserScene: string, sunflowerAssets: string, sunflowerSDK: string) => {
      try {
        lastSceneRef.current = { phaserScene, sunflowerAssets, sunflowerSDK };
        cleanupGame();

        // Load asset definitions into global scope
        const assetsFunction = new Function(sunflowerAssets);
        assetsFunction();

        // Refresh the asset directory after loading
        setAssetEntries(flattenSunnysideAssets());

        // Load SDK into global scope
        const sdkFunction = new Function(sunflowerSDK);
        sdkFunction();

        // Execute the scene code, capturing the game instance.
        // The generated code already creates a Phaser.Game with parent "game-container".
        let modifiedCode = phaserScene;

        // Capture the game instance on window so we can track it
        modifiedCode = modifiedCode.replace(
          /const game = new Phaser\.Game\(gameConfig\);/,
          "const game = new Phaser.Game(gameConfig); window.currentPhaserGame = game;",
        );
        if (!modifiedCode.includes("window.currentPhaserGame")) {
          modifiedCode = modifiedCode.replace(
            /new Phaser\.Game\(gameConfig\)/,
            "(function(){ const game = new Phaser.Game(gameConfig); window.currentPhaserGame = game; return game; })()",
          );
        }

        const gameFunction = new Function(
          "Phaser",
          "window",
          "document",
          `
          ${modifiedCode}
          return window.currentPhaserGame;
        `,
        );

        const game = gameFunction(Phaser, window, document);
        currentGameRef.current = game || (window as any).currentPhaserGame;

        // Setup focus handling after canvas is ready
        setTimeout(() => setupCanvasFocusHandling(), 100);

        // Re-apply hitbox state once scenes have started and physics is ready
        const gameInstance = currentGameRef.current;
        if (showHitboxesRef.current && gameInstance) {
          gameInstance.events.once("step", () => {
            toggleHitboxes(true);
          });
        }
      } catch (error: any) {
        showStatus(`Failed to load game: ${error.message}`, "error");
      }
    },
    [cleanupGame, showStatus, setupCanvasFocusHandling],
  );

  // Reload the scene when switching between desktop/mobile preview
  useEffect(() => {
    if (lastSceneRef.current) {
      const { phaserScene, sunflowerAssets, sunflowerSDK } =
        lastSceneRef.current;
      loadSceneDirectly(phaserScene, sunflowerAssets, sunflowerSDK);
    }
  }, [previewMode, loadSceneDirectly]);

  const listVersions = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showStatus("Not connected to server. Please wait...", "error");
      return;
    }

    const sid = `versions-${farmId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionIdRef.current = sid;

    wsRef.current.send(
      JSON.stringify({
        action: "listVersions",
        data: { farmId: String(farmId), sessionId: sid },
      }),
    );
  }, [farmId, showStatus]);

  const handleSceneGenerated = useCallback(
    (message: SceneGeneratedMessage) => {
      const { phaserScene, sunflowerAssets, sunflowerSDK, previewUrl } =
        message.data;

      setPreviewUrl(previewUrl ?? null);

      const isLoadedFarm = message.data.sessionId.includes("farm-");
      const isDeleteOperation =
        message.data.sessionId.includes("delete-version-");
      const isVersionLoad = message.data.sessionId.includes("version-");
      const isTemplateDemo = message.data.sessionId.includes("template-demo-");

      if (isDeleteOperation) {
        setHasSavedFarm(false);
        currentVersionIdRef.current = null;
        showStatus("All versions deleted — showing template", "success");
      } else if (isVersionLoad) {
        setHasSavedFarm(true);
        showStatus("Previous version loaded!", "success");
      } else if (isTemplateDemo) {
        setHasSavedFarm(true);
        currentVersionIdRef.current = "template";
        showStatus("Template loaded!", "success");
      } else if (isLoadedFarm) {
        const saved = !isTemplateCode(phaserScene);
        setHasSavedFarm(saved);
        if (saved) {
          showStatus(`Loaded saved farm ${farmId}`, "success");
        } else {
          currentVersionIdRef.current = "template";
          showStatus(
            `No saved game for farm ${farmId} - showing template`,
            "success",
          );
        }
      } else {
        showStatus("Game generated successfully!", "success");
        setHasSavedFarm(true);
        // Clear so the upcoming versionsList response auto-selects the new latest
        currentVersionIdRef.current = null;
      }

      loadSceneDirectly(phaserScene, sunflowerAssets, sunflowerSDK);
      setIsGenerating(false);
      setTimeout(() => hideStatus(), 3000);

      // Refresh versions list after generating/loading
      if (!isDeleteOperation && !isLoadedFarm) {
        listVersions();
      }
    },
    [
      farmId,
      isTemplateCode,
      loadSceneDirectly,
      showStatus,
      hideStatus,
      listVersions,
    ],
  );

  const handleError = useCallback(
    (message: ErrorMessage) => {
      showStatus(`Error: ${message.data.error}`, "error");
      setIsGenerating(false);
    },
    [showStatus],
  );

  const handleGenerationProgress = useCallback(
    (message: GenerationProgressMessage) => {
      const { sessionId, tokensGenerated, status } = message.data;

      // Ignore progress for stale sessions
      if (sessionId !== sessionIdRef.current) return;

      if (status === "compiling") {
        showStatus("Compiling your scene...", "generating");
        return;
      }

      if (tokensGenerated < 500) {
        showStatus("Thinking about your game...", "generating");
      } else if (tokensGenerated < 1500) {
        showStatus("Building the scene...", "generating");
      } else if (tokensGenerated < 3000) {
        showStatus("Adding the details...", "generating");
      } else {
        showStatus("Almost there...", "generating");
      }
    },
    [showStatus],
  );

  // Connect WebSocket once in playing state, with automatic reconnection
  useEffect(() => {
    if (!isPlaying) return;

    // Ensure Phaser is available on window for dynamically generated scenes
    (window as any).Phaser = Phaser;
    isUnmountingRef.current = false;

    const connectWebSocket = () => {
      if (isUnmountingRef.current) return;

      showStatus("Connecting to game server...", "connecting");

      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          reconnectAttemptsRef.current = 0;
          showStatus("Connected! Ready to generate games.", "success");
          setTimeout(() => hideStatus(), 3000);

          // Auto-load saved farm on connect
          if (farmId && !hasLoadedFarmRef.current) {
            hasLoadedFarmRef.current = true;
            const sid = `farm-${farmId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
            sessionIdRef.current = sid;
            showStatus(
              `Loading saved game for farm ${farmId}...`,
              "generating",
            );
            ws.send(
              JSON.stringify({
                action: "loadSavedFarm",
                data: { farmId: String(farmId), sessionId: sid },
              }),
            );

            // Also fetch version history
            const versionsSid = `versions-${farmId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
            ws.send(
              JSON.stringify({
                action: "listVersions",
                data: { farmId: String(farmId), sessionId: versionsSid },
              }),
            );
          }
        };

        ws.onmessage = (event) => {
          const message: WebSocketMessage = JSON.parse(event.data);
          switch (message.action) {
            case "sceneGenerated":
              handleSceneGenerated(message as SceneGeneratedMessage);
              break;
            case "versionsList": {
              const versionsList = (message as VersionsListMessage).data
                .versions;
              setVersions(versionsList);
              if (!currentVersionIdRef.current && versionsList.length > 0) {
                currentVersionIdRef.current = versionsList[0].versionId;
              }
              break;
            }
            case "error":
              handleError(message as ErrorMessage);
              break;
            case "generationProgress":
              handleGenerationProgress(message as GenerationProgressMessage);
              break;
          }
        };

        ws.onclose = () => {
          if (isUnmountingRef.current) return;
          scheduleReconnect();
        };

        ws.onerror = () => {
          // onclose will fire after onerror, so reconnection is handled there
        };
      } catch {
        if (!isUnmountingRef.current) {
          scheduleReconnect();
        }
      }
    };

    const scheduleReconnect = () => {
      if (isUnmountingRef.current) return;

      const attempts = reconnectAttemptsRef.current;
      if (attempts >= maxReconnectAttempts) {
        showStatus(
          "Unable to connect to server. Please refresh the page.",
          "error",
        );
        return;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, ... capped at 30s
      const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
      reconnectAttemptsRef.current = attempts + 1;

      showStatus(
        `Disconnected. Reconnecting in ${Math.round(delay / 1000)}s... (attempt ${attempts + 1}/${maxReconnectAttempts})`,
        "connecting",
      );

      reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
    };

    connectWebSocket();

    return () => {
      isUnmountingRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      wsRef.current?.close();
      cleanupGame();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const generateGame = useCallback(() => {
    if (!prompt.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showStatus("Not connected to server. Please wait...", "error");
      return;
    }

    const sid = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionIdRef.current = sid;
    setIsGenerating(true);

    showStatus(
      hasSavedFarm
        ? `Modifying your existing farm...`
        : "Generating your game...",
      "generating",
    );

    wsRef.current.send(
      JSON.stringify({
        action: "prompt",
        data: {
          farmId: String(farmId),
          prompt: prompt.trim(),
          versionId: currentVersionIdRef.current || undefined,
          sessionId: sid,
        },
      }),
    );
  }, [prompt, farmId, hasSavedFarm, showStatus]);

  const deleteVersion = useCallback(
    (versionId: string, lastModified: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        showStatus("Not connected to server. Please wait...", "error");
        return;
      }
      if (
        !window.confirm(
          `Delete version from ${new Date(lastModified).toLocaleString()}?`,
        )
      ) {
        return;
      }

      const sid = `delete-version-${farmId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      sessionIdRef.current = sid;

      wsRef.current.send(
        JSON.stringify({
          action: "deleteVersion",
          data: {
            farmId: String(farmId),
            versionId,
            sessionId: sid,
          },
        }),
      );
    },
    [farmId, showStatus],
  );

  const loadTemplateDemo = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showStatus("Not connected to server. Please wait...", "error");
      return;
    }

    const sid = `template-demo-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionIdRef.current = sid;
    setIsGenerating(true);
    showStatus("Loading template demo...", "generating");

    wsRef.current.send(
      JSON.stringify({
        action: "templateDemo",
        data: { sessionId: sid },
      }),
    );
  }, [showStatus]);

  const loadVersion = useCallback(
    (versionId: string, lastModified: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        showStatus("Not connected to server. Please wait...", "error");
        return;
      }

      const sid = `version-${farmId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      sessionIdRef.current = sid;
      currentVersionIdRef.current = versionId;
      setIsGenerating(true);
      showStatus(
        `Loading version from ${new Date(lastModified).toLocaleString()}...`,
        "generating",
      );

      wsRef.current.send(
        JSON.stringify({
          action: "loadVersion",
          data: {
            farmId: String(farmId),
            versionId,
            sessionId: sid,
          },
        }),
      );
    },
    [farmId, showStatus],
  );

  // When versions change, check if the currently loaded version was deleted
  useEffect(() => {
    if (
      currentVersionIdRef.current &&
      currentVersionIdRef.current !== "template" &&
      versions.length > 0 &&
      !versions.some((v) => v.versionId === currentVersionIdRef.current)
    ) {
      const latest = versions[0];
      loadVersion(latest.versionId, latest.lastModified);
    }
  }, [versions, loadVersion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateGame();
    }
  };

  // Derive categories and filtered assets from current state
  const assetCategories = useMemo(
    () => Array.from(new Set(assetEntries.map((e) => e.category))).sort(),
    [assetEntries],
  );

  const filteredAssets = useMemo(() => {
    let list = assetEntries;
    if (assetCategory !== "all") {
      list = list.filter((e) => e.category === assetCategory);
    }
    if (assetSearch.trim()) {
      const q = assetSearch.trim();
      list = list.filter(
        (e) =>
          fuzzyMatch(q, e.name) ||
          fuzzyMatch(q, e.category) ||
          fuzzyMatch(q, e.ref),
      );
    }
    return list;
  }, [assetEntries, assetCategory, assetSearch]);

  const copyAssetRef = useCallback((ref: string) => {
    navigator.clipboard.writeText(ref).then(() => {
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 1500);
    });
  }, []);

  // Shared asset directory content (used in desktop tab and mobile drawer)
  const assetDirectoryContent = (
    <div className="flex flex-col gap-2">
      {/* Search */}
      <input
        type="text"
        value={assetSearch}
        onChange={(e) => setAssetSearch(e.target.value)}
        placeholder="Search assets (e.g. chicken, axe, tree)..."
        className="w-full p-2 rounded text-sm"
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-1">
        <span
          className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
            assetCategory === "all"
              ? "bg-blue-200 text-blue-900 font-semibold"
              : "bg-brown-100 hover:bg-brown-200"
          }`}
          onClick={() => setAssetCategory("all")}
        >
          {"All"}
        </span>
        {assetCategories.map((cat) => (
          <span
            key={cat}
            className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
              assetCategory === cat
                ? "bg-blue-200 text-blue-900 font-semibold"
                : "bg-brown-100 hover:bg-brown-200"
            }`}
            onClick={() => setAssetCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Results */}
      {assetEntries.length === 0 ? (
        <p className="text-xs text-gray-500">
          {"Assets load after a game is generated or loaded."}
        </p>
      ) : filteredAssets.length === 0 ? (
        <p className="text-xs text-gray-500">{"No matching assets found."}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-[400px] md:max-h-[calc(100vh-320px)] overflow-y-auto">
          {filteredAssets.map((asset) => (
            <div
              key={asset.ref}
              className="flex flex-col items-center p-1 rounded bg-brown-100 hover:bg-brown-200 cursor-pointer text-center"
              onClick={() => copyAssetRef(asset.ref)}
              title={`Click to copy: ${asset.ref}`}
            >
              <img
                src={asset.path}
                alt={asset.name}
                className="w-10 h-10 object-contain"
                style={{ imageRendering: "pixelated" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[10px] leading-tight mt-1 break-all">
                {asset.name}
              </span>
              <span className="text-[9px] text-gray-500 leading-tight">
                {asset.category}
              </span>
              {copiedRef === asset.ref && (
                <span className="text-[9px] text-green-700 font-semibold">
                  {"Copied!"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /*
   * TWO LAYOUTS: This component has a desktop and mobile layout.
   *
   * - Desktop (md+): Side-by-side with form/tools on the left and game preview
   *   on the right. All panels are always visible.
   *
   * - Mobile (<md): Game preview fills the screen with the prompt input
   *   overlaid at the bottom. A slide-up drawer (toggled via a handle) reveals
   *   additional tools: example prompts, previous versions, and the delete
   *   button. When modifying either layout, ensure the other still works.
   */

  // Shared prompt input + action buttons (used in both layouts)
  const promptSection = (
    <>
      <textarea
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={handleKeyDown}
        placeholder={
          hasSavedFarm
            ? 'Describe modifications (e.g., "add more enemies")'
            : "Describe a new minigame to generate..."
        }
        className="w-full p-2 rounded text-sm border border-gray-300 resize-none overflow-hidden"
        maxLength={500}
        disabled={isGenerating}
        rows={2}
      />
      <div className="flex gap-1">
        <Button
          onClick={generateGame}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating
            ? "Working..."
            : hasSavedFarm
              ? "Modify Farm"
              : "Generate Game"}
        </Button>
      </div>
    </>
  );

  // Shared status bar
  const statusBar = status.type !== "hidden" && (
    <div
      className={`text-xs p-2 rounded ${
        status.type === "error"
          ? "bg-red-100 text-red-800"
          : status.type === "generating"
            ? "bg-orange-100 text-orange-800"
            : status.type === "connecting"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
      }`}
    >
      {status.message}
    </div>
  );

  // SDK methods reference
  const sdkMethods = [
    {
      name: "startAttempt()",
      description:
        "Starts a minigame attempt. Call when the player begins playing.",
    },
    {
      name: "submitScore(score)",
      description:
        "Submits a score for the minigame attempt. Pass a number as the score.",
    },
    {
      name: "goHome()",
      description:
        "Closes the portal and returns the player to Sunflower Land. Call when the player is done playing or exits the minigame.",
    },
  ];

  const sdkContent = (
    <div className="flex flex-col gap-2 mt-1">
      <p className="text-xs" style={{ color: "#555" }}>
        {"Use "}
        <code className="bg-brown-100 px-1 rounded">
          {"createSunflowerSDK()"}
        </code>
        {" to create an SDK instance."}
      </p>
      {sdkMethods.map((method) => {
        const code = `sdk.${method.name}`;
        return (
          <div
            key={method.name}
            className="text-xs bg-brown-100 px-2 py-1.5 rounded cursor-pointer hover:bg-brown-200"
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                setCopiedRef(code);
                setTimeout(() => setCopiedRef(null), 1500);
              });
            }}
          >
            <div className="flex justify-between items-center">
              <code className="font-semibold">{code}</code>
              <span className="text-[10px] flex-shrink-0 ml-2">
                {copiedRef === code ? "Copied!" : "Copy"}
              </span>
            </div>
            <p className="mt-0.5" style={{ color: "#555" }}>
              {method.description}
            </p>
          </div>
        );
      })}
    </div>
  );

  // Shared example prompts panel content
  const examplePromptsContent = (
    <div className="flex flex-wrap gap-1 mt-1">
      <span
        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full cursor-pointer hover:bg-green-200 font-semibold border border-green-500"
        onClick={loadTemplateDemo}
      >
        {"Template Demo (No AI)"}
      </span>
      {EXAMPLE_PROMPTS.map((example) => (
        <span
          key={example.label}
          className="text-xs bg-brown-100 px-2 py-1 rounded-full cursor-pointer hover:bg-brown-200"
          onClick={() => setPrompt(example.prompt)}
        >
          {example.label}
        </span>
      ))}
    </div>
  );

  // Shared previous versions panel content
  const versionsContent =
    versions.length === 0 ? (
      <p className="text-xs text-gray-500 mt-1">
        {"No previous versions found."}
      </p>
    ) : (
      <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto mt-1">
        {versions.map((version) => {
          const isExpanded = expandedVersionId === version.versionId;
          const title =
            version.prompt || new Date(version.lastModified).toLocaleString();
          return (
            <div
              key={version.versionId}
              className="text-xs bg-brown-100 px-2 py-1 rounded"
            >
              <div className="flex justify-between items-center">
                <span
                  className="cursor-pointer hover:underline flex-1 min-w-0"
                  onClick={() =>
                    setExpandedVersionId(isExpanded ? null : version.versionId)
                  }
                >
                  {isExpanded ? (
                    <span>{title}</span>
                  ) : (
                    <span className="block truncate">{title}</span>
                  )}
                </span>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <span
                    className="underline cursor-pointer"
                    onClick={() =>
                      loadVersion(version.versionId, version.lastModified)
                    }
                  >
                    {"Load"}
                  </span>
                  <span
                    className="cursor-pointer hover:text-red-600 px-1"
                    onClick={() =>
                      deleteVersion(version.versionId, version.lastModified)
                    }
                  >
                    {"\u00d7"}
                  </span>
                </div>
              </div>
              {isExpanded && (
                <div className="text-[10px] mt-1" style={{ color: "#666" }}>
                  {new Date(version.lastModified).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

  return (
    <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
      <OuterPanel className="h-full flex flex-col">
        {/* Header */}
        <div className="relative flex w-full justify-between pr-10 items-center mr-auto h-[70px] mb-0.5 flex-shrink-0">
          <div
            className="absolute inset-0 w-full h-full -z-0 rounded-sm"
            style={{
              backgroundImage: `url(${SUNNYSIDE.announcement.marketplace})`,
              imageRendering: "pixelated",
              backgroundSize: "320px",
              backgroundPosition: "center",
            }}
          />
          <div className="z-10 pl-4">
            <p className="text-lg text-white z-10 text-shadow">
              {"AI Builder"}
            </p>
            <p className="text-xs text-white z-10 text-shadow">
              {`Farm #${farmId} - Create AI Portals`}
            </p>
          </div>

          <img
            src={SUNNYSIDE.icons.close}
            className="flex-none cursor-pointer absolute right-2 z-10"
            onClick={handleClose}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>

        {/*
         * Single content area with responsive behavior.
         * The game container (ref + id) is rendered ONCE to avoid duplicate
         * ref/id issues with Phaser mounting.
         *
         * - Desktop (md+): flex-row with left form panel and right game panel.
         * - Mobile (<md): flex-col with game filling available space and
         *   prompt overlaid at the bottom.
         */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-1 p-1 relative">
          {/* ===== DESKTOP: Left Side - Tabbed panel (hidden on mobile) ===== */}
          <div className="hidden md:flex md:w-1/2 flex-col gap-2">
            {/* Tab bar */}
            <div className="flex gap-1">
              <span
                className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                  activeTab === "builder"
                    ? "bg-brown-200 font-semibold"
                    : "bg-brown-100 hover:bg-brown-200"
                }`}
                onClick={() => setActiveTab("builder")}
              >
                {"Builder"}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                  activeTab === "assets"
                    ? "bg-brown-200 font-semibold"
                    : "bg-brown-100 hover:bg-brown-200"
                }`}
                onClick={() => setActiveTab("assets")}
              >
                {"Assets"}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                  activeTab === "sdk"
                    ? "bg-brown-200 font-semibold"
                    : "bg-brown-100 hover:bg-brown-200"
                }`}
                onClick={() => setActiveTab("sdk")}
              >
                {"SDK"}
              </span>
            </div>

            {/* Tab content */}
            {activeTab === "builder" ? (
              <>
                <InnerPanel className="flex flex-col gap-2 p-2">
                  <Label type="default">{"Describe Your Minigame"}</Label>
                  {promptSection}
                  {statusBar}
                </InnerPanel>

                <InnerPanel className="p-2">
                  <Label type="default">{"Example Prompts"}</Label>
                  {examplePromptsContent}
                </InnerPanel>

                <InnerPanel className="p-2">
                  <Label type="default">{"Previous Versions"}</Label>
                  {versionsContent}
                </InnerPanel>
              </>
            ) : activeTab === "assets" ? (
              <InnerPanel className="flex flex-col gap-2 p-2">
                <Label type="default">{"Asset Directory"}</Label>
                {assetDirectoryContent}
              </InnerPanel>
            ) : (
              <InnerPanel className="flex flex-col gap-2 p-2">
                <Label type="default">{"SDK Methods"}</Label>
                {sdkContent}
              </InnerPanel>
            )}
          </div>

          {/* ===== Game Preview - single instance, responsive sizing ===== */}
          <div className="flex-1 md:w-1/2 flex flex-col gap-1 min-h-0">
            {/* Aspect ratio tabs + hitbox toggle - desktop only */}
            <div className="hidden md:flex gap-1 items-center">
              <span
                className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                  previewMode === "desktop"
                    ? "bg-brown-200 font-semibold"
                    : "bg-brown-100 hover:bg-brown-200"
                }`}
                onClick={() => setPreviewMode("desktop")}
              >
                {"Desktop"}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                  previewMode === "mobile"
                    ? "bg-brown-200 font-semibold"
                    : "bg-brown-100 hover:bg-brown-200"
                }`}
                onClick={() => setPreviewMode("mobile")}
              >
                {"Mobile"}
              </span>
              <span className="flex-1" />
              <span
                className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                  showHitboxes
                    ? "bg-orange-200 font-semibold"
                    : "bg-brown-100 hover:bg-brown-200"
                }`}
                onClick={() => {
                  const next = !showHitboxes;
                  setShowHitboxes(next);
                  showHitboxesRef.current = next;
                  toggleHitboxes(next);
                }}
              >
                {"Hitboxes"}
              </span>
              {lastSceneRef.current?.phaserScene && hasSavedFarm && (
                <span
                  className="text-xs px-3 py-1 rounded-t cursor-pointer bg-brown-100 hover:bg-brown-200"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (
                      currentVersionIdRef.current &&
                      currentVersionIdRef.current !== "template"
                    ) {
                      params.set("versionId", currentVersionIdRef.current);
                    }
                    const qs = params.toString();
                    const url = `${API_URL}/api/farm/${farmId}/download${qs ? `?${qs}` : ""}`;
                    window.open(url, "_blank");
                  }}
                >
                  {"Download"}
                </span>
              )}
            </div>
            <InnerPanel className="flex-1 flex flex-col p-2 min-h-0 overflow-hidden">
              <div className="flex-1 flex items-center justify-center min-h-0">
                <div
                  className="bg-black rounded overflow-hidden"
                  style={{
                    aspectRatio: previewMode === "mobile" ? "9 / 16" : "16 / 9",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    width: previewMode === "mobile" ? "auto" : "100%",
                    height: previewMode === "mobile" ? "100%" : "auto",
                  }}
                >
                  <div
                    id="game-container"
                    ref={gameContainerRef}
                    className="w-full h-full flex items-center justify-center"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>
              {previewUrl ? (
                <p className="text-xs text-center mt-1 truncate">
                  {"Preview: "}
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    {previewUrl}
                  </a>
                </p>
              ) : (
                <p
                  className="hidden md:block text-xs text-center mt-1"
                  style={{ color: "#000" }}
                >
                  {"Your generated minigame will appear here"}
                </p>
              )}
            </InnerPanel>
          </div>

          {/* ===== MOBILE: Bottom bar - prompt + drawer toggle (hidden on desktop) ===== */}
          <div className="flex-shrink-0 md:hidden">
            <InnerPanel className="flex flex-col gap-2 p-2">
              {statusBar}
              {promptSection}
              {/* Drawer toggle */}
              <button
                className="w-full flex items-center justify-center gap-1 text-xs py-1 rounded cursor-pointer"
                style={{ color: "#000" }}
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <span
                  className="inline-block transition-transform"
                  style={{
                    transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  {"▲"}
                </span>
                {drawerOpen ? "Hide Tools" : "More Tools"}
              </button>
            </InnerPanel>
          </div>

          {/* ===== MOBILE: Slide-up drawer overlay (hidden on desktop) ===== */}
          {drawerOpen && (
            <>
              <div
                className="absolute inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-1 pb-2 max-h-[70%] overflow-y-auto md:hidden">
                <InnerPanel className="flex flex-col gap-2 p-2">
                  {/* Drawer header: tabs + close */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      <span
                        className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                          mobileDrawerTab === "tools"
                            ? "bg-brown-200 font-semibold"
                            : "bg-brown-100"
                        }`}
                        onClick={() => setMobileDrawerTab("tools")}
                      >
                        {"Tools"}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                          mobileDrawerTab === "assets"
                            ? "bg-brown-200 font-semibold"
                            : "bg-brown-100"
                        }`}
                        onClick={() => setMobileDrawerTab("assets")}
                      >
                        {"Assets"}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-t cursor-pointer ${
                          mobileDrawerTab === "sdk"
                            ? "bg-brown-200 font-semibold"
                            : "bg-brown-100"
                        }`}
                        onClick={() => setMobileDrawerTab("sdk")}
                      >
                        {"SDK"}
                      </span>
                    </div>
                    <button
                      className="text-xs px-2 py-1 rounded"
                      style={{ color: "#000" }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {"Close ✕"}
                    </button>
                  </div>

                  {/* Tab content */}
                  {mobileDrawerTab === "tools" ? (
                    <>
                      <div>
                        <Label type="default">{"Example Prompts"}</Label>
                        {examplePromptsContent}
                      </div>

                      <div>
                        <Label type="default">{"Previous Versions"}</Label>
                        {versionsContent}
                      </div>
                    </>
                  ) : mobileDrawerTab === "assets" ? (
                    <div>
                      <Label type="default">{"Asset Directory"}</Label>
                      {assetDirectoryContent}
                    </div>
                  ) : (
                    <div>
                      <Label type="default">{"SDK Methods"}</Label>
                      {sdkContent}
                    </div>
                  )}
                </InnerPanel>
              </div>
            </>
          )}
        </div>
      </OuterPanel>
    </div>
  );
};
