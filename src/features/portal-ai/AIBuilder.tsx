import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
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
  };
}

interface ErrorMessage extends WebSocketMessage {
  action: "error";
  data: {
    error: string;
    sessionId?: string;
  };
}

interface VersionsListMessage extends WebSocketMessage {
  action: "versionsList";
  data: {
    farmId: string;
    versions: { versionId: string; lastModified: string }[];
    sessionId: string;
  };
}

const WS_URL = import.meta.env.VITE_AI_PORTAL_WS_URL || "ws://localhost:3001";

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
    { versionId: string; lastModified: string }[]
  >([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef("");
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const currentGameRef = useRef<any>(null);
  const hasLoadedFarmRef = useRef(false);

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
        cleanupGame();

        // Load asset definitions into global scope
        const assetsFunction = new Function(sunflowerAssets);
        assetsFunction();

        // Load SDK into global scope
        const sdkFunction = new Function(sunflowerSDK);
        sdkFunction();

        // Execute the scene code
        const gameFunction = new Function(
          "Phaser",
          "window",
          "document",
          `
          let modifiedCode = ${JSON.stringify(phaserScene)}
            .replace(/parent: ['"]game-container['"]/, 'parent: "aiBuilderGame"')
            .replace(/scale:\\s*\\{[^}]*\\}/g,
              'scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 600 }');

          if (modifiedCode.includes('const game = new Phaser.Game(gameConfig);')) {
            modifiedCode = modifiedCode.replace(
              /const game = new Phaser\\.Game\\(gameConfig\\);/,
              'const game = new Phaser.Game(gameConfig); window.__aiBuilderGame = game;'
            );
          } else if (modifiedCode.includes('new Phaser.Game(gameConfig)')) {
            modifiedCode = modifiedCode.replace(
              /new Phaser\\.Game\\(gameConfig\\)/,
              '(function(){ const game = new Phaser.Game(gameConfig); window.__aiBuilderGame = game; return game; })()'
            );
          }

          const result = eval(modifiedCode);
          return window.__aiBuilderGame;
          `,
        );

        const gameResult = gameFunction(
          (window as any).Phaser,
          window,
          document,
        );
        currentGameRef.current = gameResult || (window as any).__aiBuilderGame;

        // Setup focus handling after canvas is ready
        setTimeout(() => setupCanvasFocusHandling(), 100);
      } catch (error: any) {
        showStatus(`Failed to load game: ${error.message}`, "error");
      }
    },
    [cleanupGame, showStatus, setupCanvasFocusHandling],
  );

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
      const { phaserScene, sunflowerAssets, sunflowerSDK } = message.data;

      const isLoadedFarm = message.data.sessionId.includes("farm-");
      const isDeleteOperation = message.data.sessionId.includes("delete-");
      const isVersionLoad = message.data.sessionId.includes("version-");

      if (isVersionLoad) {
        setHasSavedFarm(true);
        showStatus("Previous version loaded!", "success");
      } else if (isDeleteOperation) {
        setHasSavedFarm(false);
        showStatus("Successfully deleted saved farm", "success");
      } else if (isLoadedFarm) {
        const saved = !isTemplateCode(phaserScene);
        setHasSavedFarm(saved);
        if (saved) {
          showStatus(`Loaded saved farm ${farmId}`, "success");
        } else {
          showStatus(
            `No saved game for farm ${farmId} - showing template`,
            "success",
          );
        }
      } else {
        showStatus("Game generated successfully!", "success");
        setHasSavedFarm(true);
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

  // Connect WebSocket once in playing state
  useEffect(() => {
    if (!isPlaying) return;

    // Ensure Phaser is available on window for dynamically generated scenes
    (window as any).Phaser = Phaser;

    showStatus("Connecting to game server...", "connecting");

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        showStatus("Connected! Ready to generate games.", "success");
        setTimeout(() => hideStatus(), 3000);

        // Auto-load saved farm on connect
        if (farmId && !hasLoadedFarmRef.current) {
          hasLoadedFarmRef.current = true;
          const sid = `farm-${farmId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
          sessionIdRef.current = sid;
          showStatus(`Loading saved game for farm ${farmId}...`, "generating");
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
          case "versionsList":
            setVersions((message as VersionsListMessage).data.versions);
            break;
          case "error":
            handleError(message as ErrorMessage);
            break;
        }
      };

      ws.onclose = () => {
        showStatus("Disconnected from server.", "error");
      };

      ws.onerror = () => {
        showStatus("Connection error. Please refresh the page.", "error");
      };
    } catch {
      showStatus("Failed to connect to server.", "error");
    }

    return () => {
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
          sessionId: sid,
        },
      }),
    );
  }, [prompt, farmId, hasSavedFarm, showStatus]);

  const deleteSavedFarm = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showStatus("Not connected to server. Please wait...", "error");
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to delete the saved farm? This action cannot be undone.",
      )
    ) {
      return;
    }

    const sid = `delete-${farmId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionIdRef.current = sid;
    setIsGenerating(true);
    showStatus("Deleting saved farm...", "generating");

    wsRef.current.send(
      JSON.stringify({
        action: "deleteSavedFarm",
        data: { farmId: String(farmId), sessionId: sid },
      }),
    );
  }, [farmId, showStatus]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generateGame();
    }
  };

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
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          hasSavedFarm
            ? 'Describe modifications (e.g., "add more enemies")'
            : "Describe a new minigame to generate..."
        }
        className="w-full p-2 rounded text-sm border border-gray-300"
        maxLength={500}
        disabled={isGenerating}
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
        {/* Delete button only in desktop; mobile puts it in the drawer */}
        {hasSavedFarm && (
          <Button
            className="hidden md:block"
            onClick={deleteSavedFarm}
            disabled={isGenerating}
          >
            {"Delete Saved Farm"}
          </Button>
        )}
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
        {versions.map((version) => (
          <div
            key={version.versionId}
            className="flex justify-between items-center text-xs bg-brown-100 px-2 py-1 rounded cursor-pointer hover:bg-brown-200"
            onClick={() => loadVersion(version.versionId, version.lastModified)}
          >
            <span>{new Date(version.lastModified).toLocaleString()}</span>
            <span className="underline ml-2 flex-shrink-0">{"Load"}</span>
          </div>
        ))}
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
          {/* ===== DESKTOP: Left Side - Form (hidden on mobile) ===== */}
          <div className="hidden md:flex md:w-1/2 flex-col gap-2">
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
          </div>

          {/* ===== Game Preview - single instance, responsive sizing ===== */}
          <div className="flex-1 md:w-1/2 flex flex-col gap-1 min-h-0">
            <InnerPanel className="flex-1 flex flex-col p-2 min-h-0">
              {/* Label + helper text only visible on desktop */}
              <Label type="default" className="hidden md:flex">
                {"Game Preview"}
              </Label>
              <div className="flex-1 bg-black rounded overflow-hidden md:mt-1 flex items-center justify-center min-h-[200px] md:min-h-[300px]">
                <div
                  id="aiBuilderGame"
                  ref={gameContainerRef}
                  className="w-full h-full flex items-center justify-center"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <p
                className="hidden md:block text-xs text-center mt-1"
                style={{ color: "#000" }}
              >
                {"Your generated minigame will appear here"}
              </p>
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
                  <div className="flex justify-between items-center">
                    <Label type="default">{"Tools"}</Label>
                    <button
                      className="text-xs px-2 py-1 rounded"
                      style={{ color: "#000" }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {"Close ✕"}
                    </button>
                  </div>

                  <div>
                    <Label type="default">{"Example Prompts"}</Label>
                    {examplePromptsContent}
                  </div>

                  <div>
                    <Label type="default">{"Previous Versions"}</Label>
                    {versionsContent}
                  </div>

                  {hasSavedFarm && (
                    <Button onClick={deleteSavedFarm} disabled={isGenerating}>
                      {"Delete Saved Farm"}
                    </Button>
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
